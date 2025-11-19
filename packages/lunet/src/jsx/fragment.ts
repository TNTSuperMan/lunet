import type { JSXFragment, JSXNode } from ".";

export const fragment = (...children: JSXNode[]): JSXFragment =>
    [null, {}, children];
