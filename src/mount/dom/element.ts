import { createRenderedDOM, renderNode, renderRealDOM } from ".";
import type { JSXElement } from "../../jsx";

export const renderElement = ([tag, props, ...children]: JSXElement<any>) => {
    props.$beforeMount?.();
    const el = document.createElement(tag);
    props.$mount?.call(el, new CustomEvent("mount", { detail: el as any }));

    Object.entries(props).forEach(([k, v])=>{
        switch(k){
            case "checked":
                if(el instanceof HTMLInputElement && typeof v === "boolean")
                    return el.checked = v;
                break;
            case "value":
                if(el instanceof HTMLInputElement && typeof v === "string")
                    return el.value = v;
                break;
        }
        switch(typeof v){
            case "string":
                el.setAttribute(k, v);
                break;
            case "function": case "object":
                if(v !== null)
                    console.error(`${typeof v} values cannot mount on attributes.`);
                break;
            default:
                if(v !== undefined)
                    el.setAttribute(k, String(v));
                break;
        }
    })

    const rendered_children = children.map(e=>renderNode(e));
    el.append(...rendered_children.flatMap(renderRealDOM));

    return createRenderedDOM<HTMLElement, JSXElement<any>>(el, ([tag, props, ...children]) => {

    }, () => rendered_children.forEach(e=>e.revoke()))
}
