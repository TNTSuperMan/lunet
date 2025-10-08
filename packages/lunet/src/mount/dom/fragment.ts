import { renderNode, type RenderedDOM, type UnknownRenderedDOM } from ".";
import type { JSXFragment } from "../../jsx";
import { diff } from "../diff";

export const renderFragment = (jsx: JSXFragment): RenderedDOM<JSXFragment> => {
    let currentJSX = jsx;

    let rendered_children: UnknownRenderedDOM[] = [];
    let mark: Comment | void;

    return {
        type: 2,
        flat: () => rendered_children.flatMap(e=>e.flat()),
        update(jsx){
            const [,, ...old_children] = currentJSX;
            const [,, ...new_children] = jsx;

            for (const [type, idx, jsx] of diff(old_children, new_children)) {
                switch(type){
                    case 0:
                        rendered_children[idx].update(jsx as any);
                        break;
                    case 1:
                        const rendered = renderNode(jsx);
                        rendered_children.splice(idx, 0, rendered);
                        const dom = rendered.render();
                        let refNode: ChildNode | null = null; // TODO: ここら辺を最適化する
                        if (mark && mark.parentNode) {
                            let node: ChildNode | null = mark;
                            let count = 0;
                            while (node) {
                                node = node.nextSibling;
                                if (node?.nodeType === 8) continue;
                                if (count === idx) {
                                    refNode = node;
                                    break;
                                }
                                count++;
                            }
                            if (refNode) {
                                mark.parentNode.insertBefore(dom, refNode);
                            } else {
                                mark.parentNode.appendChild(dom);
                            }
                        }
                        break;
                    case 2:
                        const [removed] = rendered_children.splice(idx, 1);
                        removed.revoke();
                        break;
                }
            }
            
            currentJSX = jsx;
        },
        render(){
            const [,, ...children] = currentJSX;

            const el = document.createDocumentFragment();
            mark = document.createComment("");

            rendered_children = children.map(renderNode);
            el.append(mark, ...rendered_children.map(e=>e.render()));

            return el;
        },
        revoke(){
            for (const child of rendered_children)
                child.revoke();
        },
    }
}
