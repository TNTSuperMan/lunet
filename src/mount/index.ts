import type { JSXNode } from "../jsx";
import { renderNode } from "./dom";
import { revokerMap } from "./revokerMap";

export const render = (el: HTMLElement, jsx: JSXNode) => {
    el.childNodes.forEach(e=>{
        revokerMap.get(e)?.();
        e.remove();
    });

    el.append(renderNode(jsx)[3]());
}
