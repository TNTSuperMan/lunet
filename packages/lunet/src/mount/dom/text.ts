import type { RenderedDOM } from ".";

export const renderText = (text: string): RenderedDOM<string> => {
    let node: Text | null;

    return {
        // type: 0,
        // flat: () => [currentText],
        update(t){ text !== t && (node!.textContent = text = t) },
        render: () => node = new Text(text),
        revoke(){ node!.remove() },
        after(n) { node!.parentNode!.insertBefore(n, node!.nextSibling) },
    }
}
