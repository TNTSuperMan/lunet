import type { RenderedDOM } from ".";
import { queueDOMUpdate } from "../queue";

export const createText = (jsx: string): [RenderedDOM<string>, Text] => {
    const node = new Text(jsx);
    return [[0, jsx, node], node];
}

export const updateText = (dom: RenderedDOM<string>, jsx: string) => {
    if (dom[1] !== jsx)
        dom[2].textContent = dom[1] = jsx;
}

export const revokeText = (dom: RenderedDOM<string>): void => (
    queueDOMUpdate(dom[2].remove.bind(dom[2]))
)

export const afterText = (dom: RenderedDOM<string>, node: Node): void => (
    queueDOMUpdate(() => dom[2].parentNode!.insertBefore(node, dom[2].nextSibling))
)
