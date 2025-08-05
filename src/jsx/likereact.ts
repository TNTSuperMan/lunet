import type { AnyElType, Component, JSX } from ".";

type JSXLikeReactFn<T extends AnyElType> = (type: T, props: T extends Component<infer P> ? P : (null | { [key: string]: unknown }), ...children: JSX[]) => JSX;

export const h: JSXLikeReactFn<AnyElType> = (...args) => args;
