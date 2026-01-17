import type { JSXComponent, JSXElement, JSXFragment, JSXNode } from "../../jsx";
import { createText,      updateText,      revokeText,      afterText,      type RenderedText      } from "./text";
import { createElement,   updateElement,   revokeElement,   afterElement,   type RenderedElement   } from "./element";
import { createFragment,  updateFragment,  revokeFragment,  afterFragment,  type RenderedFragment  } from "./fragment";
import { createComponent, updateComponent, revokeComponent, afterComponent, type RenderedComponent } from "./component";

export type RenderedAnyNode =
    | RenderedText
    | RenderedElement
    | RenderedFragment
    | RenderedComponent;

export type RenderedNode<T extends JSXNode> =
    T extends string       ? RenderedText :
    T extends JSXElement   ? RenderedElement :
    T extends JSXFragment  ? RenderedFragment :
    T extends JSXComponent ? RenderedComponent :
    never;

export const createNode = (jsx: JSXNode): [RenderedAnyNode, Node] => {
    if (typeof jsx === "string") return createText(jsx);
    if (Array.isArray(jsx)) {
        const [tag] = jsx;
        if (typeof tag === "string") return createElement(jsx);
        if (typeof tag === "function") return createComponent(jsx);
        if (tag === null) return createFragment(jsx);
    }
    throw new Error(`Unrecognized JSX node`, { cause: jsx });
}

export const updateNode = (dom: RenderedAnyNode, jsx: any): void => {
    switch (dom[0]) {
        case 0:
            updateText(dom, jsx);
            break;
        case 1:
            updateElement(dom, jsx);
            break;
        case 2:
            updateFragment(dom, jsx);
            break;
        case 3:
            updateComponent(dom, jsx);
            break;
    }
}

export const revokeNode = (dom: RenderedAnyNode): void => {
    switch (dom[0]) {
        case 0:
            revokeText(dom);
            break;
        case 1:
            revokeElement(dom);
            break;
        case 2:
            revokeFragment(dom);
            break;
        case 3:
            revokeComponent(dom);
            break;
    }
}

export const afterNode = (dom: RenderedAnyNode, node: Node): void => {
    switch (dom[0]) {
        case 0:
            afterText(dom, node);
            break;
        case 1:
            afterElement(dom, node);
            break;
        case 2:
            afterFragment(dom, node);
            break;
        case 3:
            afterComponent(dom, node);
            break;
    }
}
