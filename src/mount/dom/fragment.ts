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

            const patches = diff(old_children, new_children);
            let removes = 0;

            patches.forEach(([type, idx_, jsx])=>{
                const idx = idx_ - removes;
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
                            let node: ChildNode | null = mark.nextSibling;
                            let count = 0;
                            while (node) {
                                if (count === idx) {
                                    refNode = node;
                                    break;
                                }
                                node = node.nextSibling;
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
                        removes++;
                        const [removed] = rendered_children.splice(idx, 1);
                        removed.revoke();
                        break;
                }
            })
            
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
        revoke(){ rendered_children.forEach(e=>e.revoke()) },
    }
}
