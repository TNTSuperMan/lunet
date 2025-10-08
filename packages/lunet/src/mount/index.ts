import type { JSXNode } from "../jsx";
import { renderNode, type UnknownRenderedDOM } from "./dom";

type RenderFunction = (el: HTMLElement, jsx: JSXNode) => void;

const rootMap = new WeakMap<HTMLElement, UnknownRenderedDOM>();

export const render: RenderFunction = (el, jsx) => {
    rootMap.get(el)?.revoke();

    const root = renderNode(jsx);

    rootMap.set(el, root);

    el.append(root.render());
}
