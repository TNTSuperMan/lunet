import type { ComponentFunction } from "./component";

export type JSXNode = JSXElement<keyof HTMLElementTagNameMap> | JSXComponent<any> | JSXFragment | string;
export type JSXElement<T extends keyof HTMLElementTagNameMap> = [T, JSX.IntrinsicElements[T], ...JSXNode[]];
export type JSXComponent<T extends object> = [ComponentFunction<T>, T, ...JSXNode[]];
export type JSXFragment = [null, { key?: unknown }, ...JSXNode[]];

export type { Component } from "./component";
export { jsx } from "./element";
export { fragment } from "./fragment";
export { h } from "./likereact";
