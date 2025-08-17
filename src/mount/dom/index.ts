import type { JSXComponent, JSXElement, JSXFragment, JSXNode } from "../../jsx";
import { renderComponent } from "./component";
import { renderElement } from "./element";
import { renderFragment } from "./fragment";
import { renderText } from "./text";

export type RenderedDOM<T extends JSXNode> = [
    T extends string ? 0 : T extends JSXElement ? 1 : T extends JSXFragment ? 2 : T extends JSXComponent<object> ? 3 : never, // 0 種類
    () => (JSXElement | string)[], // 1 差分比較用のフラットJSX出力関数
    (jsx: T) => void,              // 2 差分更新関数
    () => Node,                    // 3 初回・トラブル時にフル描画をする関数
    () => void,                    // 4 破棄関数
]

export type UnknownRenderedDOM = RenderedDOM<string> | RenderedDOM<JSXElement> | RenderedDOM<JSXFragment> | RenderedDOM<JSXComponent<object>>;

export const renderNode = (jsx: JSXNode): UnknownRenderedDOM => {
    if(typeof jsx === "string"){
        return renderText(jsx);
    }else if(typeof jsx[0] === "string"){
        return renderElement(jsx);
    }else if(jsx[0] === null){
        return renderFragment(jsx);
    }else{
        return renderComponent(jsx);
    }
}
