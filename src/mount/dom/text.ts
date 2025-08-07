import type { RenderedDOM } from ".";

export const renderText = (jsx: string): RenderedDOM<string> => {
    let currentText = jsx;
    const node = new Text(currentText);

    return [0,
        () => [currentText],
        jsx => currentText !== jsx && (node.textContent = currentText = jsx),
        () => node,
        () => {},
    ]
}
