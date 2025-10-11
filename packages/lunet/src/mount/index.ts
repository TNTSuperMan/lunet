import type { JSXNode } from "../jsx";
import { createNode, revokeNode, type RenderedDOM } from "./dom";
import { domQueue, flushDOMUpdates, siblingDomQueue } from "./queue";

type RenderFunction = (el: HTMLElement, jsx: JSXNode) => void;

const rootMap = new WeakMap<HTMLElement, RenderedDOM<any>>();

export const render: RenderFunction = (el, jsx) => {
    if (rootMap.has(el))
        revokeNode(rootMap.get(el)!);

    const [root, node] = createNode(jsx);

    rootMap.set(el, root);

    domQueue.splice(0).forEach(fn => fn());
    if (node.nodeType !== 8) {
        siblingDomQueue.splice(0).forEach(fn => fn());
    }

    el.append(node);

    if (node.nodeType === 8) {
        siblingDomQueue.splice(0).forEach(fn => fn());
    }
}
