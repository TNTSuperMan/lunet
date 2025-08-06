import type { JSXNode } from "../../jsx";
import { renderElement } from "./element";
import { Fragment } from "./fragment";
import { renderText } from "./text";

export const renderedDOMMap = new WeakMap<Node, RenderedDOM>();

export type RenderedNode = RenderedDOM | Fragment;

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

export const renderRealDOM = (node: RenderedNode): Node[] | Node =>
    node instanceof Fragment ? node.nodes.flatMap(renderRealDOM) : node.node;

export const renderNode = (jsx: JSXNode): RenderedNode => {
    if(typeof jsx === "string"){
        return renderText(jsx);
    }else if(typeof jsx[0] === "string"){
        return renderElement(jsx);
    }else if(jsx[0] === null){
        return new Fragment(jsx);
    }else{
        throw new Error("Component rendering is not implemented");
    }
}
