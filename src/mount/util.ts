import type { JSXNode } from "../jsx";

export const isCompatibleNode = (before: JSXNode, after: JSXNode): boolean => {
    if(typeof before === "string" || typeof after === "string"){
        return typeof before === typeof after;
    }else{
        if(before[0] !== after[0]) return false;
        if("key" in before[1] && "key" in after[1])
            return before[1].key === after[1].key;
        return true;
    }
}
