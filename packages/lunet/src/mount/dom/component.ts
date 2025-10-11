import { type RenderedDOM } from ".";
import { batch } from "../../batch";
import type { JSXComponent, JSXFragment, JSXNode } from "../../jsx";
import { flushDOMUpdates } from "../queue";
import { afterFragment, createFragment, revokeFragment, updateFragment } from "./fragment";

//let l = 0;

export const createComponent = (jsx: JSXComponent): [RenderedDOM<JSXComponent>, Comment] => {
    const [component, init_props/* , ...children */] = jsx;

    let rendered_dom: RenderedDOM<JSXFragment> | void;
    let doc_mark: Comment | void;

    const props = component((jsx: JSXNode) => {
        if (rendered_dom) {
            //l++;
            updateFragment(rendered_dom, [null, {}, jsx]);
            //if (!--l) flushDOMUpdates();
        }
        else [rendered_dom, doc_mark] = createFragment([null, {}, jsx]);
    }, { ...init_props });

    //@ts-ignore
    if (!doc_mark) {
        console.error("never rendered Initial render.");
        [rendered_dom, doc_mark] = createFragment([null, {}]);
    }

    return [
        [
            3,
            [
                component,
                props,
                /* ...children */
            ] as JSXComponent,
            rendered_dom!
        ],
        doc_mark
    ];
}

export const updateComponent = (dom: RenderedDOM<JSXComponent>, jsx: JSXComponent) => {
    const old_props = dom[1][1];
    const new_props = jsx[1];

    batch(() => {
        for (const [key, value] of Object.entries(new_props)) //@ts-ignore
            if (old_props[key] !== value) old_props[key] = value;
    });
}

export const revokeComponent = (dom: RenderedDOM<JSXComponent>) => (
    revokeFragment(dom[2])
)

export const afterComponent = (dom: RenderedDOM<JSXComponent>, node: Node) => (
    afterFragment(dom[2], node)
)
