import type { JSXComponent } from "./component";
import type { JSXElement } from "./element";

export type JSXNode = JSXElement<keyof HTMLElementTagNameMap> | JSXComponent<any> | string;

export { jsx } from "./element";
export { h } from "./likereact";
