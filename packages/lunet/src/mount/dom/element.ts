import { renderNode, type RenderedDOM, type UnknownRenderedDOM } from ".";
import type { JSXElement } from "../../jsx";
import { diff } from "../diff";

const elementEvents: WeakMap<HTMLElement, Record<string, Function | undefined | null>> = new WeakMap;

function handleEvent(this: HTMLElement, ev: Event){
    return elementEvents.get(this)?.[ev.type]?.call(this, ev);
}

const setAttribute = (el: HTMLElement, name: string, value: unknown) => {
    if (name.startsWith("$")) {
        const ev_name = name.substring(1);
        if (!["beforeMount", "mount", "beforeUpdate", "update", "beforeUnmount", "unmount"].includes(ev_name)) {
            const events = elementEvents.get(el)!;
            if(!(ev_name in events))
                el.addEventListener(ev_name, handleEvent);
            if (typeof value === "function" || value == null)
                events[ev_name] = value;
            else {
                console.error("Invalid event handler: ", value);
                events[ev_name] = undefined;
            }
        }
    } else switch(typeof value){
        case "string":
            el.setAttribute(name, value);
            break;
        case "function":
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

    return {
        type: 1,
        // flat: () => [currentJSX],
        update(jsx){
            currentJSX[1].$beforeUpdate?.call<any, any, any>(element!, new CustomEvent("beforeupdate", { detail: element! }));
            
            const [, old_props, ...old_children] = currentJSX;
            const [, props, ...new_children] = jsx;

            const removed_prop_keys = Object.keys(old_props).filter(key => !(key in props));

            for (const [name, value] of Object.entries({
                ...props,
                ...Object.fromEntries(
                    removed_prop_keys.map(key => [key, undefined])
                )
            }))
                if((currentJSX[1] as any)[name] !== value)
                    setAttribute(element!, name, value);

            for (const [type, idx, jsx] of diff(old_children, new_children)) {
                switch(type){
                    case 0:
                        rendered_children[idx].update(jsx as any);
                        break;
                    case 1:
                        const rendered = renderNode(jsx);
                        const dom = rendered.render();
                        rendered_children.splice(idx, 0, rendered);
                        if (idx === 0) {
                            if (element!.firstChild) {
                                element!.firstChild.before(dom);
                            } else {
                                element!.append(dom);
                            }
                        } else {
                            rendered_children[idx - 1].after(dom);
                        }
                        break;
                    case 2:
                        rendered_children.splice(idx, 1)[0].revoke();
                        break;
                }
            }

            currentJSX = jsx;
            
            props.$update?.call<any, any, any>(element!, new CustomEvent("update", { detail: element! }));
        },
        render(){
            const [tag, props, ...children] = currentJSX;

            props.$beforeMount?.();
            const el = document.createElement(tag);
            elementEvents.set(el, {});
            props.$mount?.call<any, any, any>(el, new CustomEvent("mount", { detail: el }));

            for (const [name, value] of Object.entries(props))
                setAttribute(el, name, value);

            rendered_children = children.map(renderNode);
            el.append(...rendered_children.map(e=>e.render()));

            return element = el;
        },
        revoke(){
            currentJSX[1].$beforeUnmount?.call<any, any, any>(element!, new CustomEvent("beforeunmount", { detail: element! }));

            for (const child of rendered_children)
                child.revoke();
            elementEvents.delete(element!);
            element!.remove();
            
            currentJSX[1].$unmount?.();
        },
        after(node) { element!.after(node) },
    }
}
