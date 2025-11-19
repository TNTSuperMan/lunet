import { type JSXNode, render } from "../../src";
import { benchmark } from "./bench";

const comp = (render: (jsx: JSXNode) => void) => {
    render([null,{}, [
        "メモ: lunetのベンチマークのフロントエンドにlunetを使うのは草",
        ["br",{},[]],
        ["button",{
            async $click(){
                let i = 0;
                const res = await benchmark(document.querySelector("#root")!);
                render([null,{},[
                    "結果",
                    ["br",{},[]],
                    ["code",{style:"white-space:pre-wrap"},
                        Object.entries(res).map(([k,v])=>[`${k}:${v}`,["br",{},[]]]).flat() as any
                    ]
                ]])
            }
        }, ["ベンチマーク開始"]]
    ]]);
    return{}
}

render(document.querySelector("#control")!, [comp, {}, []]);
