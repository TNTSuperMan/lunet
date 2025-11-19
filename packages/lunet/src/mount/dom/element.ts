import { afterNode, createNode, revokeNode, updateNode, type RenderedDOM } from ".";
import type { JSXElement } from "../../jsx";
import { diff } from "../diff";

const lifecycle_events = new Set([
    "beforeMount",
    "mount",
    "beforeUpdate",
    "update",
    "beforeUnmount",
    "unmount"
]);

const elementEvents: WeakMap<HTMLElement, Record<string, Function | undefined | null>> = new WeakMap;

function handleEvent(this: HTMLElement, ev: Event){
    return elementEvents.get(this)?.[ev.type]?.call(this, ev);
}

const setAttribute = (el: HTMLElement, name: string, value: unknown) => {
    if (name.startsWith("$")) {
        const ev_name = name.substring(1);
        if (!lifecycle_events.has(ev_name)) {
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

export const createElement = (jsx: JSXElement): [RenderedDOM<JSXElement>, HTMLElement] => {
    const [tag, props, children] = jsx;

    props.$beforeMount?.();
    const element = document.createElement(tag);
    elementEvents.set(element, {});
    props.$mount?.call<any, any, any>(element, new CustomEvent("mount", { detail: element }));

    for (const [name, value] of Object.entries(props))
        setAttribute(element, name, value);

    const rendered_children = children.map(createNode);
    element.append(...rendered_children.map(e=>e[1]));

    return [[1, jsx, element, rendered_children.map(e=>e[0])], element];
}

export const updateElement = (dom: RenderedDOM<JSXElement>, jsx: JSXElement) => {
    const [, [, old_props, old_children], element, rendered_children] = dom;
    const [, new_props, new_children] = jsx;
    old_props.$beforeUpdate?.call<any, any, any>(element, new CustomEvent("beforeupdate", { detail: element }));


    const removed_prop_keys = Object.keys(old_props).filter(key => !(key in new_props));

    for (const [name, value] of Object.entries({
        ...new_props,
        ...Object.fromEntries(
            removed_prop_keys.map(key => [key, undefined])
        )
    }))
        if((old_props as any)[name] !== value)
            setAttribute(element, name, value);

    for (const [type, idx, jsx] of diff(old_children, new_children)) {
        switch(type){
            case 0:
                updateNode(rendered_children[idx], jsx);
                break;
            case 1:
                const [rendered, node] = createNode(jsx);
                rendered_children.splice(idx, 0, rendered);
                if (idx === 0) {
                    if (element.firstChild) {
                        element.firstChild.before(node);
                    } else {
                        element.append(node);
                    }
                } else {
                    afterNode(rendered_children[idx - 1], node);
                }
                break;
            case 2:
                revokeNode(rendered_children.splice(idx, 1)[0]);
                break;
        }
    }

    dom[1] = jsx;
    
    new_props.$update?.call<any, any, any>(element, new CustomEvent("update", { detail: element }));
}

export const revokeElement = (dom: RenderedDOM<JSXElement>) => {
    const [, [, props], element, rendered_children] = dom;
    props.$beforeUnmount?.call<any, any, any>(element, new CustomEvent("beforeunmount", { detail: element }));

    for (const child of rendered_children)
        revokeNode(child);
    elementEvents.delete(element);
    element.remove();
    
    props.$unmount?.();
}

export const afterElement = (dom: RenderedDOM<JSXElement>, node: Node) => {
    dom[2].after(node);
}
