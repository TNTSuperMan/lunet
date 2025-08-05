import type { JSXNode } from "../../jsx";
import { renderElement } from "./element";
import { renderText } from "./text";

export const renderedDOMMap = new WeakMap<Node, RenderedDOM>();

export interface RenderedDOM<T extends Node = Node, U extends JSXNode = JSXNode> {
    node: T;
    update(jsx: U): void;
    revoke(): void;
}

export const createRenderedDOM = <T extends Node, U extends JSXNode>(node: T, update: (jsx: U) => void, additionalRevoke?: () => void) => {
    const renderedDOM: RenderedDOM<T, U> = {
        node,
        update,
        revoke(){
            additionalRevoke?.();
            renderedDOMMap.delete(node);
        }
    }
    renderedDOMMap.set(node, renderedDOM);
    return renderedDOM;
}

export const renderDOM = (jsx: JSXNode): RenderedDOM => {
    if(typeof jsx === "string"){
        return renderText(jsx);
    }else if(typeof jsx[0] === "string"){
        return renderElement(jsx);
    }else{
        throw new Error("Component rendering is not implemented");
    }
}
