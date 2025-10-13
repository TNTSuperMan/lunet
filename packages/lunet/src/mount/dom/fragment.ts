import { afterNode, createNode, revokeNode, updateNode, type RenderedDOM } from ".";
import type { JSXFragment } from "../../jsx";
import { diff } from "../diff";
import { queueDOMUpdate } from "../queue";

export const createFragment = (jsx: JSXFragment): [RenderedDOM<JSXFragment>, Comment] => {
    const [,, ...children] = jsx;
    const mark = new Comment;

    const rendered_children = children.map(createNode);
    if (rendered_children.length)
        queueDOMUpdate(mark.after.bind(mark, ...rendered_children.map(e=>e[1])));

    return [[2, jsx, mark, rendered_children.map(e=>e[0])], mark];
}

export const updateFragment = (dom: RenderedDOM<JSXFragment>, jsx: JSXFragment) => {
    const [, [,, ...old_children], mark, rendered_children] = dom;
    const [,, ...new_children] = jsx;

    for (const [type, idx, jsx] of diff(old_children, new_children)) {
        switch(type){
            case 0:
                updateNode(rendered_children[idx], jsx);
                break;
            case 1:
                const [rendered, el] = createNode(jsx);
                rendered_children.splice(idx, 0, rendered);
                if (idx === 0) {
                    queueDOMUpdate(mark.after.bind(mark, el));
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

export const revokeFragment = (dom: RenderedDOM<JSXFragment>) => {
    for (const child of dom[3])
        revokeNode(child);
    queueDOMUpdate(dom[2].remove.bind(dom[2]));
}

export const afterFragment = (dom: RenderedDOM<JSXFragment>, node: Node) => {
    const last_rendered_dom = dom[3].at(-1);
    if (last_rendered_dom)
        afterNode(last_rendered_dom, node);
    else
        queueDOMUpdate(dom[2].after.bind(dom[2], node));
}
