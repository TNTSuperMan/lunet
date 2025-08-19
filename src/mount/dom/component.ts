import { type RenderedDOM } from ".";
import type { JSXComponent, JSXFragment, JSXNode } from "../../jsx";
import { renderFragment } from "./fragment";

export const renderComponent = (jsx: JSXComponent): RenderedDOM<JSXComponent> => {
    let currentJSX = jsx;

    let rendered_dom = null as RenderedDOM<JSXFragment> | null;

    let props: object | null;

    const render = (jsx: JSXNode) => {
        if(rendered_dom) rendered_dom.update([null, {}, jsx]);
        else rendered_dom = renderFragment([null, {}, jsx]);
    }

    return {
        type: 3,
        flat: () => rendered_dom?.flat() ?? [],
        update(jsx){
            const [, afterProps/*, ...children*/] = currentJSX = jsx;

            Object.entries(afterProps).forEach(([k, v]) => //@ts-ignore
                props[k] !== v && (props[k] = v));
        },
        render(){
            rendered_dom?.revoke();
            rendered_dom = null;

            const [component, init_props/*, ...children*/] = currentJSX;

            props = component(render, init_props);

            if(!rendered_dom) {
                console.error("never rendered Initial render.");
                rendered_dom = renderFragment([null, {}, jsx]);
            }

            return rendered_dom.render();
        },
        revoke(){ rendered_dom?.revoke() },
    }
}
