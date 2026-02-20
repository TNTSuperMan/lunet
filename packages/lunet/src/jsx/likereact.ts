import type { JSXNode } from ".";
import type { Component } from "./component";
import { Fragment } from "./fragment";

type JSXFactoryFunction = <T extends keyof HTMLElementTagNameMap | Component<any> | typeof Fragment>(
    type: T,
    props: null | ( T extends Component<infer P> ? P : { [key: string]: unknown } ),
    ...children: JSXNode[]
) => JSXNode;

export const h: JSXFactoryFunction = (type, props, ...children) =>
    typeof type === "string"
        ? [type, props ?? {}, children]
        : type === Fragment
            ? [null, props ?? {}, children]
            : type(props);
