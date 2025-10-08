import { renderNode, type RenderedDOM, type UnknownRenderedDOM } from ".";
import type { JSXFragment } from "../../jsx";
import { diff } from "../diff";

export const renderFragment = (jsx: JSXFragment): RenderedDOM<JSXFragment> => {
    let currentJSX = jsx;

    let rendered_children: UnknownRenderedDOM[] = [];
    let mark: Comment | void;

    return {
        // type: 2,
        // flat: () => rendered_children.flatMap(e=>e.flat()),
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
                        const dom = rendered.render();
                        rendered_children.splice(idx, 0, rendered);
                        if (idx === 0) {
                            mark!.after(dom);
                        } else {
                            rendered_children[idx - 1].after(dom);
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
        after(node) {
            (rendered_children.at(-1) ?? mark)?.after(node);
        },
    }
}
