import type { JSXFragment, JSXNode } from ".";

export const Fragment = (...children: JSXNode[]): JSXFragment =>
    [null, {}, children];
