import { afterNode, createNode, revokeNode, updateNode, type RenderedAnyNode } from ".";
import type { JSXFragment } from "../../jsx";
import { diff } from "../diff";

export type RenderedFragment = [2, JSXFragment, Comment, RenderedAnyNode[]];

export const createFragment = (jsx: JSXFragment): [RenderedFragment, DocumentFragment] => {
    const [,, children] = jsx;
    const mark = new Comment;
    const el = new DocumentFragment;

    const rendered_children = children.map(createNode);
    el.append(mark, ...rendered_children.map(e=>e[1]));

    return [[2, jsx, mark, rendered_children.map(e=>e[0])], el];
}

export const updateFragment = (dom: RenderedFragment, jsx: JSXFragment) => {
    const [, [,, old_children], mark, rendered_children] = dom;
    const [,, new_children] = jsx;

    for (const [type, idx, jsx] of diff(old_children, new_children)) {
        switch(type){
            case 0:
                updateNode(rendered_children[idx], jsx);
                break;
            case 1:
                const [rendered, el] = createNode(jsx);
                rendered_children.splice(idx, 0, rendered);
                if (idx === 0) {
                    mark.after(el);
                } else {
                    afterNode(rendered_children[idx - 1], el);
                }
                break;
            case 2:
                const [removed] = rendered_children.splice(idx, 1);
                revokeNode(removed);
                break;
        }
    }
    
    dom[1] = jsx;
}

export const revokeFragment = (dom: RenderedFragment) => {
    for (const child of dom[3])
        revokeNode(child);
    dom[2].remove();
}

export const afterFragment = (dom: RenderedFragment, node: Node) => {
    const last_rendered_dom = dom[3].at(-1);
    if (last_rendered_dom)
        afterNode(last_rendered_dom, node);
    else
        dom[2].after(node);
}
