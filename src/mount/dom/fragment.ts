import { renderNode, type RenderedDOM, type UnknownRenderedDOM } from ".";
import type { JSXFragment } from "../../jsx";
import { notImplementException } from "./notimplement";

export const renderFragment = (jsx: JSXFragment): RenderedDOM<JSXFragment> => {
    let currentJSX = jsx;

    let rendered_children: UnknownRenderedDOM[] = [];
    let mark: Comment | void;

    return [2,
        () => rendered_children.flatMap(e=>e[1]()),
        jsx => {
            /* TODO */
            const [,, ...old_children] = currentJSX;
            const [,, ...new_children] = jsx;

            rendered_children.map(e=>e[4]());

            rendered_children = new_children.map(renderNode);
            mark!.after(...rendered_children.map(e=>e[3]()));
            
            console.warn("Warning: This feature is under active development and may change in future versions.");
            currentJSX = jsx;
        },
        () => {
            const [, props, ...children] = currentJSX;

            const el = document.createDocumentFragment();
            mark = document.createComment("");

            rendered_children = children.map(renderNode);
            el.append(mark, ...rendered_children.map(e=>e[3]()));

            return el;
        },
        () => rendered_children.forEach(e=>e[3]()),
    ]
}
