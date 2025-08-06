import type { JSXNode } from ".";
import type { Component } from "./component";
import { fragment } from "./fragment";

export const h = <T extends keyof HTMLElementTagNameMap | Component<any> | typeof fragment>(
    type: T,
    props: null | T extends Component<infer P> ? P : { [key: string]: unknown },
    ...children: JSXNode[]
) => typeof type === "string" ?
    [type, props ?? {}, ...children] :
    type === fragment ?
        fragment(props, ...children) :
        type(props);
