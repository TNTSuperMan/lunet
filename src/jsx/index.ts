import type { ComponentFunction } from "./component";

export type JSXNode = JSXElement<keyof HTMLElementTagNameMap> | JSXComponent<any> | string;
export type JSXElement<T extends keyof HTMLElementTagNameMap> = [T, JSX.IntrinsicElements[T], ...JSXNode[]];
export type JSXComponent<T extends object> = [ComponentFunction<T>, T, ...JSXNode[]];

export type { Component } from "./component";
export { jsx } from "./element";
export { h } from "./likereact";
