import type { JSXNode } from "../jsx";

export const isCompatibleNode = (before: JSXNode, after: JSXNode): boolean =>
    typeof before === "string" || typeof after === "string" ?
        typeof before === typeof after :
        before[0] === after[0] && before[1].key === after[1].key;
