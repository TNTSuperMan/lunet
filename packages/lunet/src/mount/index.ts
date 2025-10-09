import type { JSXNode } from "../jsx";
import { createNode, revokeNode, type RenderedDOM } from "./dom";

type RenderFunction = (el: HTMLElement, jsx: JSXNode) => void;

const rootMap = new WeakMap<HTMLElement, RenderedDOM<any>>();

export const render: RenderFunction = (el, jsx) => {
    if (rootMap.has(el))
        revokeNode(rootMap.get(el)!);

    const [root, node] = createNode(jsx);

    rootMap.set(el, root);

    el.append(node);
}
