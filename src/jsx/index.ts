import type { ComponentFunction } from "./component";

export type JSXNode = JSXElement<keyof HTMLElementTagNameMap> | JSXComponent<any> | string;
export type JSXElement<T extends keyof HTMLElementTagNameMap> = [T, {[key: string]: unknown}, ...JSXNode[]];
export type JSXComponent<T extends object> = [ComponentFunction<T>, T, ...JSXNode[]];

export { jsx } from "./element";
export { h } from "./likereact";
