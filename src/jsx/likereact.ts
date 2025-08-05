import type { JSXNode } from ".";
import type { Component } from "./component";

export const h = <T extends keyof HTMLElementTagNameMap | Component<any>>(
    type: T,
    props: T extends Component<infer P> ? P : { [key: string]: unknown },
    ...children: JSXNode[]
) => typeof type === "string" ?
    [type, props, ...children] :
    type(props);
