import { renderNode, type RenderedDOM, type UnknownRenderedDOM } from ".";
import type { JSXElement, JSXNode } from "../../jsx";
import { revokerMap } from "../revokerMap";
import { diff } from "../diff";

const elementEvents: WeakMap<HTMLElement, Record<string, Function>> = new WeakMap;

function handleEvent(this: HTMLElement, ev: Event){
    return elementEvents.get(this)?.[ev.type]?.();
}

const setAttribute = (el: HTMLElement, name: string, value: unknown) => {
    if(el instanceof HTMLInputElement) {
        switch(name){
            case "checked":
                if(typeof value === "boolean"){
                    el.checked = value;
                    return;
                }
                break;
            case "value":
                if(typeof value === "string"){
                    el.value = value;
                    return;
                }
                break;
        }
    }
    switch(typeof value){
        case "string":
            el.setAttribute(name, value);
            break;
        case "function":
            if(name.startsWith("$")){
                if(!["$beforeMount", "$mount", "$beforeUnmount", "$unmount"].includes(name)){
                    const ev_name = name.substring(1);
                    const events = elementEvents.get(el)!;
                    if(!(ev_name in events))
                        el.addEventListener(ev_name, handleEvent);
                    events[ev_name] = value;
                }
            }else
                console.error("function values cannot mount on attributes.");
            break;
        case "object":
            if(value === null)
                el.removeAttribute(name);
            else
                console.error(`${typeof value} values cannot mount on attributes.`);
            break;
        default:
            if(value === undefined)
                el.removeAttribute(name);
            else
                el.setAttribute(name, String(value));
            break;
    }
}

export const renderElement = (jsx: JSXElement): RenderedDOM<JSXElement> => {
    let currentJSX = jsx;

    let rendered_children: UnknownRenderedDOM[] = [];
    let element: HTMLElement | void;

    const render = () => {
        const [tag, props, ...children] = currentJSX;

        props.$beforeMount?.();
        const el = document.createElement(tag);
        elementEvents.set(el, {});
        props.$mount?.call<any, any, any>(el, new CustomEvent("mount", { detail: el }));

        for (const [name, value] of Object.entries(props))
            setAttribute(el, name, value);

        rendered_children = children.map(renderNode);
        el.append(...rendered_children.map(e=>e.render()));

        revokerMap.set(el, () => {
            props.$beforeUnmount?.call<any, any, any>(el, new CustomEvent("beforeunmount", { detail: el }));

            for (const child of rendered_children)
                child.revoke();
            revokerMap.delete(el);
            elementEvents.delete(el);
            el.remove();
            
            props.$unmount?.();
        });

        return element = el;
    }

    return {
        type: 1,
        flat: () => [currentJSX],
        update(jsx){
            currentJSX[1].$beforeUpdate?.call<any, any, any>(element!, new CustomEvent("beforeupdate", { detail: element! }));
            
            const [,, ...old_children] = currentJSX;
            const [, props, ...new_children] = jsx;

            for (const [name, value] of Object.entries(props))
                if((currentJSX[1] as any)[name] !== value)
                    setAttribute(element!, name, value);

            const patches = diff(old_children, new_children);
            let removes = 0;
            for (const [type, idx_, jsx] of patches) {
                const idx = idx_ - removes;
                switch(type){
                    case 0:
                        rendered_children[idx].update(jsx as any);
                        break;
                    case 1:
                        const rendered = renderNode(jsx);
                        rendered_children.splice(idx, 0, rendered);

                        const dom_index = rendered_children.reduce((p,c)=>p+c.flat().length, 0);
                        const el = rendered.render();

                        if(dom_index >= element!.childNodes.length)
                            element!.append(el);
                        else
                            element!.childNodes[dom_index]!.before(el);

                        break;
                    case 2:
                        removes++;
                        rendered_children.splice(idx, 1)[0].revoke();
                        break;
                }
            }

            currentJSX = jsx;
            
            props.$update?.call<any, any, any>(element!, new CustomEvent("update", { detail: element! }));
        },
        render(){
            element && revokerMap.get(element)?.();
            return render();
        },
        revoke(){ element && revokerMap.get(element)?.() },
    }
}
