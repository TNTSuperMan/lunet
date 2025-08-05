import type { JSXComponent, JSXNode } from ".";

export type ComponentFunction<T extends object> = (render: (jsx: JSXNode) => void, initProps: T) => T;
export type Component<T extends object> = (props: T) => JSXComponent<T>;

export const createComponent = <T extends object>(component: ComponentFunction<T>): Component<T> =>
    (props: T): JSXComponent<T> => [component, props];
