import { type RenderedDOM } from ".";
import { batch } from "../../batch";
import type { JSXComponent, JSXFragment, JSXNode } from "../../jsx";
import { afterFragment, createFragment, revokeFragment, updateFragment } from "./fragment";

export const createComponent = (jsx: JSXComponent): [RenderedDOM<JSXComponent>, DocumentFragment] => {
    const [component, init_props/* , ...children */] = jsx;

    let rendered_dom: RenderedDOM<JSXFragment> | void;
    let doc_frag: DocumentFragment | void;

    const props = component((jsx: JSXNode) => {
        if (rendered_dom) updateFragment(rendered_dom, [null, {}, [jsx]]);
        else [rendered_dom, doc_frag] = createFragment([null, {}, [jsx]]);
    }, { ...init_props });

    //@ts-ignore
    if (!doc_frag) {
        console.error("never rendered Initial render.");
        [rendered_dom, doc_frag] = createFragment([null, {}, []]);
    }

    return [
        [
            3,
            [
                component,
                props,
                []
            ] as JSXComponent,
            rendered_dom!
        ],
        doc_frag
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
