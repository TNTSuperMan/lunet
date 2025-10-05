import { render, h, fragment } from "lunet";
import "../style/main.css";

import f from "./files" with { type: "macro" };
const files = await f();
// TODO: Bunで[tj]sx?・HTML + with { type: "text" }の安定性が向上したらそれに変える
/*
import index_html from "../sample/index.html" with { type: "text" }; //@ts-ignore
import index_tsx from "../sample/index.tsx" with { type: "text" }; // @ts-ignore
import serve_ts from "../sample/serve.ts" with { type: "text" }; // @ts-ignore
import Canvas_jsx from "../sample/Canvas.jsx" with { type: "text" }; // @ts-ignore
import ColorBox_jsx from "../sample/ColorBox.jsx" with { type: "text" }; // @ts-ignore
import Form_jsx from "../sample/Form.jsx" with { type: "text" };
*/

render(document.body, <>
    <nav>
        <a target="_blank" href="/">ホーム</a>
        <a target="_blank" href="https://example.com/wiki">Wiki</a>
        <a target="_blank" href="https://github.com/TNTSuperMan/lunet">GitHub</a>
    </nav>
    <main>
        <h1>lunet</h1>
        <p>より柔軟なWebフロントエンドライブラリ。</p>
        <div class="start">
            <h2>始める</h2>
            <kbd>
                $ bun init <br/>
                $ bun add lunet alien-signals <br/>
                $ bun add -D lunet-transpiler <br/>
            </kbd>

            <code title="index.html">{ files["index.html"] }</code>
            <code title="index.tsx">{ files["index.tsx"] }</code>
            <code title="serve.ts">{ files["serve.ts"] }</code>

            <kbd>
                $ bun serve
            </kbd>
        </div>
        <div class="points">
            <h2>イベントからDOMを</h2>
            lunetでは、$mountイベントからDOMを受け取れます。<br/>
            DOMを受けっ取った直後に何をするかは自由自在。<br/>
            refに縛られる必要などない。
            <code title="Form.jsx">{ files["Form.jsx"] }</code>

            <h2>明示的な描画</h2>
            render関数により、明示的に描画が可能です。<br/>
            これによりリアクティブシステムも自由。<br/>
            更新するかはあなた次第。
            <code title="Canvas.jsx">{ files["Canvas.jsx"] }</code>

            <h2>明示的な属性変更</h2>
            セッターオブジェクトを返せば、属性の反映も自由自在。<br/>
            リアクティブシステムの代入でもいいし、直接操作するのも自由。<br/>
            <code title="ColorBox.jsx">{ files["ColorBox.jsx"] }</code>
        </div>
    </main>
</>);
