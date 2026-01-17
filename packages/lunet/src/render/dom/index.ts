import type { JSXComponent, JSXElement, JSXFragment, JSXNode } from "../../jsx";
import { createText,      updateText,      revokeText,      afterText,      type RenderedText } from "./text";
import { createElement,   updateElement,   revokeElement,   afterElement,   type RenderedElement } from "./element";
import { createFragment,  updateFragment,  revokeFragment,  afterFragment,  type RenderedFragment } from "./fragment";
import { createComponent, updateComponent, revokeComponent, afterComponent, type RenderedComponent } from "./component";

export type RenderedAnyNode =
    | RenderedText
    | RenderedElement
    | RenderedFragment
    | RenderedComponent;

export type RenderedNode<T extends JSXNode> =
    T extends string       ? RenderedText :
    T extends JSXElement   ? RenderedElement :
    T extends JSXFragment  ? RenderedFragment :
    T extends JSXComponent ? RenderedComponent :
    never;

const funcMap = [
    [updateText,      revokeText,      afterText     ],
    [updateElement,   revokeElement,   afterElement  ],
    [updateFragment,  revokeFragment,  afterFragment ],
    [updateComponent, revokeComponent, afterComponent],
] as const;

export const createNode = (jsx: JSXNode): [RenderedAnyNode, Node] => {
    if (typeof jsx === "string") return createText(jsx);
    if (Array.isArray(jsx)) {
        const [tag] = jsx;
        if (typeof tag === "string") return createElement(jsx);
        if (typeof tag === "function") return createComponent(jsx);
        if (tag === null) return createFragment(jsx);
    }
    throw new Error(`Unrecognized JSX node`, { cause: jsx });
}

export const updateNode = (dom: RenderedAnyNode, jsx: any): void => funcMap[dom[0]][0](dom as any, jsx);

export const revokeNode = (dom: RenderedAnyNode): void => funcMap[dom[0]][1](dom as any);

export const afterNode = (dom: RenderedAnyNode, node: Node): void => funcMap[dom[0]][2](dom as any, node);
