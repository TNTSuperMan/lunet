export type RenderedText = [0, string, Text];

export const createText = (jsx: string): [RenderedText, Text] => {
    const node = new Text(jsx);
    return [[0, jsx, node], node];
}

export const updateText = (dom: RenderedText, jsx: string) => {
    if (dom[1] !== jsx)
        dom[2].textContent = dom[1] = jsx;
}

export const revokeText = (dom: RenderedText): void => (
    dom[2].remove()
)

export const afterText = (dom: RenderedText, node: Node): void => {
    dom[2].parentNode?.insertBefore(node, dom[2].nextSibling)
}
