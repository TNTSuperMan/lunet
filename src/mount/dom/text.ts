import { createRenderedDOM } from ".";

export const renderText = (jsx: string) => {
    let currentText = jsx;
    const node = new Text(currentText);

    return createRenderedDOM<Text, string>(node, t => t !== currentText && (node.textContent = currentText = t))
}
