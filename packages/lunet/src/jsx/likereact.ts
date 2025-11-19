import type { JSXNode } from ".";
import type { Component } from "./component";
import { fragment } from "./fragment";

type JSXFactoryFunction = <T extends keyof HTMLElementTagNameMap | Component<any> | typeof fragment>(
    type: T,
    props: null | ( T extends Component<infer P> ? P : { [key: string]: unknown } ),
    ...children: JSXNode[]
) => JSXNode;

export const h: JSXFactoryFunction = (type, props, ...children) =>
    typeof type === "string"
        ? [type, props ?? {}, children]
        : type === fragment
            ? [null, props ?? {}, children]
            : type(props);
