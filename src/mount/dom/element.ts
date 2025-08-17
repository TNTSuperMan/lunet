import { renderNode, type RenderedDOM, type UnknownRenderedDOM } from ".";
import type { JSXElement, JSXNode } from "../../jsx";
import { revokerMap } from "../revokerMap";
import { notImplementException } from "./notimplement";

const setAttribute = (el: HTMLElement, name: string, value: unknown) => {
    switch(name){
        case "checked":
            if(el instanceof HTMLInputElement && typeof value === "boolean"){
                el.checked = value;
                return;
            }
            break;
        case "value":
            if(el instanceof HTMLInputElement && typeof value === "string"){
                el.value = value;
                return;
            }
            break;
    }
    switch(typeof value){
        case "string":
            el.setAttribute(name, value);
            break;
        case "function":
            if(name.startsWith("$")){
                if(!["$beforeMount", "$mount", "$beforeUnmount", "$unmount"].includes(name))
                    el.addEventListener(name.substring(1), value as any);
            }else
                console.error("function values cannot mount on attributes.");
            break;
        case "object":
            if(value !== null)
                console.error(`${typeof value} values cannot mount on attributes.`);
            break;
        default:
            if(value !== undefined)
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
        props.$mount?.call(el, new CustomEvent("mount", { detail: el as any }));

        Object.entries(props).forEach(([name, value])=>setAttribute(el, name, value))

        rendered_children = children.map(renderNode);
        el.append(...rendered_children.map(e=>e[3]()));

        revokerMap.set(el, () => {
            props.$beforeUnmount?.call(el, new CustomEvent("beforeunmount", { detail: el as any }));

            rendered_children.forEach(e=>e[3]());
            revokerMap.delete(el);
            el.remove();
            
            props.$unmount?.();
        });

        return element = el;
    }

    return [1,
        () => [currentJSX],
        jsx => {
            Object.entries(jsx[1]).forEach(([name, value])=>{
                if(element && (currentJSX[1] as any)[name] !== value)
                    setAttribute(element, name, value);
            });
            console.warn("Warning: This feature is under active development and may change in future versions.");
            currentJSX = jsx;
        },
        () => {
            element && revokerMap.get(element)?.();
            return render();
        },
        () => element && revokerMap.get(element)?.(),
    ]
}
