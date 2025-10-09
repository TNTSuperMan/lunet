import type { JSXComponent, JSXElement, JSXFragment, JSXNode } from "../../jsx";
import { createText,      updateText,      revokeText,      afterText } from "./text";
import { createElement,   updateElement,   revokeElement,   afterElement } from "./element";
import { createFragment,  updateFragment,  revokeFragment,  afterFragment } from "./fragment";
import { createComponent, updateComponent, revokeComponent, afterComponent } from "./component";

export type RenderedDOM<T extends JSXNode> =
    T extends string       ? [0, string,       Text] :
    T extends JSXElement   ? [1, JSXElement,   HTMLElement, RenderedDOM<any>[]] :
    T extends JSXFragment  ? [2, JSXFragment,  Comment,     RenderedDOM<any>[]] :
    T extends JSXComponent ? [3, JSXComponent, RenderedDOM<JSXFragment>] :
    never;

export const createNode = (jsx: JSXNode): [RenderedDOM<any>, Node] => {
    if(typeof jsx === "string"){
        return createText(jsx);
    }else if(typeof jsx[0] === "string"){
        return createElement(jsx);
    }else if(jsx[0] === null){
        return createFragment(jsx);
    }else{
        return createComponent(jsx);
    }
}

export const updateNode = (dom: RenderedDOM<any>, jsx: any) => {
    switch (dom[0]) {
        case 0: return updateText(dom, jsx);
        case 1: return updateElement(dom, jsx);
        case 2: return updateFragment(dom, jsx);
        case 3: return updateComponent(dom, jsx);
    }
}

export const revokeNode = (dom: RenderedDOM<any>) => {
    switch (dom[0]) {
        case 0: return revokeText(dom);
        case 1: return revokeElement(dom);
        case 2: return revokeFragment(dom);
        case 3: return revokeComponent(dom);
    }
}

export const afterNode = (dom: RenderedDOM<any>, node: Node) => {
    switch (dom[0]) {
        case 0: return afterText(dom, node);
        case 1: return afterElement(dom, node);
        case 2: return afterFragment(dom, node);
        case 3: return afterComponent(dom, node);
    }
}
