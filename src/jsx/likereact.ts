import type { AnyElType, Component, JSXNode } from ".";

type JSXLikeReactFn<T extends AnyElType> = (type: T, props: T extends Component<infer P> ? P : (null | { [key: string]: unknown }), ...children: JSXNode[]) => JSXNode;

export const h: JSXLikeReactFn<AnyElType> = (...args) => args;
