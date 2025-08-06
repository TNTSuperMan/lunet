import { renderNode, type RenderedNode } from ".";
import type { JSXFragment } from "../../jsx";

export class Fragment{
    key: unknown;
    nodes: RenderedNode[];
    constructor([, { key }, ...children]: JSXFragment){
        this.key = key;
        this.nodes = children.map(renderNode);
    }
    revoke(){
        this.nodes.forEach(e=>e.revoke());
    }
}
