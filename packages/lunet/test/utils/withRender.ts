import { expect } from "bun:test";
import { createComponent, type Component, type JSXNode, render as renderDOM } from "../../src";

export const withRender = (init?: JSXNode): (jsx: JSXNode) => void => {
    let render = null as ((jsx: JSXNode) => void) | null;
    const Component = createComponent(r => {
        render = r;
        if (init) r(init);
        return {};
    });
    renderDOM(document.body, Component({}));

    expect(render).toBeFunction();

    return render!;
}
