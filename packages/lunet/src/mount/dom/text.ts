import type { RenderedDOM } from ".";

export const renderText = (jsx: string): RenderedDOM<string> => {
    let currentText = jsx;
    const node = new Text(currentText);

    return {
        type: 0,
        flat: () => [currentText],
        update(jsx){ currentText !== jsx && (node.textContent = currentText = jsx) },
        render: () => node,
        revoke(){ node.remove() },
    }
}
