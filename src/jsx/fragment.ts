import type { JSXFragment, JSXNode } from ".";

export const fragment = (props?: null | { key?: unknown }, ...children: JSXNode[]): JSXFragment =>
    [null, props ?? {}, ...children];
