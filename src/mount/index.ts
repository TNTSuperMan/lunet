import type { JSXNode } from "../jsx";
import { renderNode, renderRealDOM, renderedDOMMap } from "./dom";
import { Fragment } from "./dom/fragment";

export const render = (el: HTMLElement, jsx: JSXNode) => {
    el.childNodes.forEach(e=>{
        renderedDOMMap.get(e)?.revoke();
        e.remove();
    });

    const node = renderNode(jsx);

    if(node instanceof Fragment){
        el.append(...node.nodes.flatMap(renderRealDOM));
    }else{
        el.append(node.node);
    }
}
