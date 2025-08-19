import { renderNode, type RenderedDOM, type UnknownRenderedDOM } from ".";
import type { JSXFragment } from "../../jsx";
import { diff } from "../diff";
import { notImplementException } from "../notimplement";

export const renderFragment = (jsx: JSXFragment): RenderedDOM<JSXFragment> => {
    let currentJSX = jsx;

    let rendered_children: UnknownRenderedDOM[] = [];
    let mark: Comment | void;

    return {
        type: 2,
        flat: () => rendered_children.flatMap(e=>e.flat()),
        update(jsx){
            /* TODO */
            const [,, ...old_children] = currentJSX;
            const [,, ...new_children] = jsx;

            const patches = diff(old_children, new_children);

            patches.forEach(e=>{
                switch(e[0]){
                    case 0:
                        rendered_children[e[1]].update(e[2] as any);
                        break;
                    case 1:
                        notImplementException();
                        break;
                    case 2:
                        notImplementException();
                        break;
                }
            })
            
            console.warn("Warning: This feature is under active development and may change in future versions.");
            currentJSX = jsx;
        },
        render(){
            const [, props, ...children] = currentJSX;

            const el = document.createDocumentFragment();
            mark = document.createComment("");

            rendered_children = children.map(renderNode);
            el.append(mark, ...rendered_children.map(e=>e.render()));

            return el;
        },
        revoke(){ rendered_children.forEach(e=>e.revoke()) },
    }
}
