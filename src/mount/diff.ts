import type { JSXNode } from "../jsx";

export const isCompatibleNode = (before: JSXNode, after: JSXNode): boolean =>
    typeof before === "string" || typeof after === "string" ?
        typeof before === typeof after :
        before[0] === after[0] && before[1].key === after[1].key;

export type Patch =
    | [0, number, JSXNode] // 更新
    | [1, number, JSXNode] // 挿入
    | [2, number, JSXNode] // 削除

export const diff = (
    before_nodes: JSXNode[],
    after_nodes: JSXNode[],
): Patch[] => {
    const patches: Patch[] = [];
    const max = Math.max(before_nodes.length, after_nodes.length);

    for(let i = 0;i < max;i++){
        const before = before_nodes[i];
        const after = after_nodes[i];
        
        if(!before && after)
            patches.push([1, i, after]);
        else if(before && !after)
            patches.push([2, i, after]);
        else if(before && after)
            if(isCompatibleNode(before, after))
                patches.push([0, i, after]);
            else{
                patches.push([2, i, after]);
                patches.push([1, i, after]);
            }
    }

    return patches;
}
