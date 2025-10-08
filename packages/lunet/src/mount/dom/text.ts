import type { RenderedDOM } from ".";

export const renderText = (jsx: string): RenderedDOM<string> => {
    let currentText = jsx;
    let node: Text | null;

    return {
        // type: 0,
        // flat: () => [currentText],
        update(jsx){ currentText !== jsx && (node!.textContent = currentText = jsx) },
        render: () => node = new Text(currentText),
        revoke(){ node!.remove() },
        after(n) { node!.parentNode!.insertBefore(n, node!.nextSibling) },
    }
}
