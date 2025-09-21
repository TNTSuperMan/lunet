import type { ComponentFunction } from "./component";

export type Key = { key?: unknown };

export type JSXNode = JSXElement | JSXComponent | JSXFragment | string;
export type JSXElement<T extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> = [T, JSX.IntrinsicElements[T], ...JSXNode[]];
export type JSXComponent = [ComponentFunction<any>, object & Key, ...JSXNode[]];
export type JSXFragment = [null, Key, ...JSXNode[]];

export { type Component, createComponent } from "./component";
export { fragment } from "./fragment";
export { h } from "./likereact";
