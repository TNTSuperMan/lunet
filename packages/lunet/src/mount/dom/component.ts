import { type RenderedDOM } from ".";
import { batch } from "../../batch";
import type { JSXComponent, JSXFragment, JSXNode } from "../../jsx";
import { renderFragment } from "./fragment";

export const renderComponent = (jsx: JSXComponent): RenderedDOM<JSXComponent> => {
    let currentJSX = jsx;

    let rendered_dom = null as RenderedDOM<JSXFragment> | null;

    let props: { [key: string]: unknown } | null;

    const render = (jsx: JSXNode) => {
        if(rendered_dom) rendered_dom.update([null, {}, jsx]);
        else rendered_dom = renderFragment([null, {}, jsx]);
    }

    return {
        type: 3,
        flat: () => rendered_dom?.flat() ?? [],
        update(jsx){
            const [, afterProps/*, ...children*/] = currentJSX = jsx;

            batch(() => {
                for (const [key, value] of Object.entries(afterProps))
                    if (props![key] !== value)
                        props![key] = value;
            });
        },
        render(){
            rendered_dom?.revoke();
            rendered_dom = null;

            const [component, init_props/*, ...children*/] = currentJSX;

            props = component(render, { ...init_props });

            if(!rendered_dom) {
                console.error("never rendered Initial render.");
                rendered_dom = renderFragment([null, {}]);
            }

            return rendered_dom.render();
        },
        revoke(){ rendered_dom?.revoke() },
        after(node) { rendered_dom!.after(node) },
    }
}
