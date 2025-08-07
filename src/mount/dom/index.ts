import type { JSXElement, JSXFragment, JSXNode } from "../../jsx";
import { renderElement } from "./element";
import { renderFragment } from "./fragment";
import { notImplementException } from "./notimplement";
import { renderText } from "./text";

export type RenderedDOM<T extends JSXNode> = [
    T extends string ? 0 : T extends JSXElement ? 1 : T extends JSXFragment ? 2 : never,
    () => (JSXElement | string)[], // 0 差分比較用のフラットJSX出力関数
    (jsx: T) => void,              // 1 差分更新関数
    () => Node,                    // 2 初回・トラブル時にフル描画をする関数
    () => void,                    // 3 破棄関数
]

export type UnknownRenderedDOM = RenderedDOM<string> | RenderedDOM<JSXElement> | RenderedDOM<JSXFragment>;

export const renderNode = (jsx: JSXNode): UnknownRenderedDOM => {
    if(typeof jsx === "string"){
        return renderText(jsx);
    }else if(typeof jsx[0] === "string"){
        return renderElement(jsx);
    }else if(jsx[0] === null){
        return renderFragment(jsx);
    }else{
        return notImplementException();
    }
}
