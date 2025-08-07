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
            currentJSX = jsx;
            /* TODO */
            notImplementException();
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
