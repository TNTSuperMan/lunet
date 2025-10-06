import type { JSXNode } from "../jsx";
import { renderNode } from "./dom";
import { revokerMap } from "./revokerMap";

type RenderFunction = (el: HTMLElement, jsx: JSXNode) => void;

export const render: RenderFunction = (el, jsx) => {
    Array.from(el.childNodes).forEach(e=>{
        revokerMap.get(e)?.();
        e.remove();
    });

    el.append(renderNode(jsx).render());
}
