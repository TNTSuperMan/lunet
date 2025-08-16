import { renderNode, type RenderedDOM, type UnknownRenderedDOM } from ".";
import type { JSXElement, JSXNode } from "../../jsx";
import { revokerMap } from "../revokerMap";
import { notImplementException } from "./notimplement";

export const renderElement = (jsx: JSXElement): RenderedDOM<JSXElement> => {
    let currentJSX = jsx;

    let rendered_children: UnknownRenderedDOM[] = [];
    let element: HTMLElement | void;

    const render = () => {
        const [tag, props, ...children] = currentJSX;

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
                case "function":
                    if(k.startsWith("$")){
                        if(!["$beforeMount", "$mount", "$beforeUnmount", "$unmount"].includes(k))
                            el.addEventListener(k.substring(1), v as any);
                    }else
                        console.error("function values cannot mount on attributes.");
                    break;
                case "object":
                    if(v !== null)
                        console.error(`${typeof v} values cannot mount on attributes.`);
                    break;
                default:
                    if(v !== undefined)
                        el.setAttribute(k, String(v));
                    break;
            }
        })

        rendered_children = children.map(renderNode);
        el.append(...rendered_children.map(e=>e[3]()));

        revokerMap.set(el, () => {
            props.$beforeUnmount?.call(el, new CustomEvent("beforeunmount", { detail: el as any }));

            rendered_children.forEach(e=>e[3]());
            revokerMap.delete(el);
            
            props.$unmount?.();
        });

        return element = el;
    }

    return [1,
        () => [currentJSX],
        jsx => {
            currentJSX = jsx;
            /* TODO */
            notImplementException();
        },
        () => {
            element && revokerMap.get(element)?.();
            return render();
        },
        () => element && revokerMap.get(element)?.(),
    ]
}
