import type { JSXNode } from "../jsx";
import { renderDOM, renderedDOMMap } from "./dom";

export const render = (el: HTMLElement, jsx: JSXNode) => {
    el.childNodes.forEach(e=>{
        renderedDOMMap.get(e)?.revoke();
        e.remove();
    });

    el.append(renderDOM(jsx).node);
}
