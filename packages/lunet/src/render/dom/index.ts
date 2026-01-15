import type { JSXComponent, JSXElement, JSXFragment, JSXNode } from "../../jsx";
import { createText,      updateText,      revokeText,      afterText } from "./text";
import { createElement,   updateElement,   revokeElement,   afterElement } from "./element";
import { createFragment,  updateFragment,  revokeFragment,  afterFragment } from "./fragment";
import { createComponent, updateComponent, revokeComponent, afterComponent } from "./component";

export type RenderedDOM<T extends JSXNode> =
    T extends string       ? [0, string,       Text] :
    T extends JSXElement   ? [1, JSXElement,   HTMLElement, RenderedDOM<any>[]] :
    T extends JSXFragment  ? [2, JSXFragment,  Comment,     RenderedDOM<any>[]] :
    T extends JSXComponent ? [3, JSXComponent, RenderedDOM<JSXFragment>] :
    never;

const funcMap = [
    [updateText,      revokeText,      afterText     ],
    [updateElement,   revokeElement,   afterElement  ],
    [updateFragment,  revokeFragment,  afterFragment ],
    [updateComponent, revokeComponent, afterComponent],
] as const;

export const createNode = (jsx: JSXNode): [RenderedDOM<any>, Node] => {
    if (typeof jsx === "string") return createText(jsx);
    if (Array.isArray(jsx)) {
        const [tag] = jsx;
        if (typeof tag === "string") return createElement(jsx);
        if (typeof tag === "function") return createComponent(jsx);
        if (tag === null) return createFragment(jsx);
    }
    throw new Error(`Unrecognized JSX node`, { cause: jsx });
}

export const updateNode = (dom: RenderedDOM<any>, jsx: any): void => funcMap[dom[0]][0](dom as any, jsx);

export const revokeNode = (dom: RenderedDOM<any>): void => funcMap[dom[0]][1](dom as any);

export const afterNode = (dom: RenderedDOM<any>, node: Node): void => funcMap[dom[0]][2](dom as any, node);
