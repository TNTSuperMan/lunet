import { render, h, fragment } from "lunet";
import "../style/main.css";

import index_html from "../sample/index.html" with { type: "text" }; //@ts-ignore
import index_tsx from "../sample/index.tsx" with { type: "text" }; // @ts-ignore
import serve_ts from "../sample/serve.ts" with { type: "text" };

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
                $ bun add lunet <br/>
                $ bun add -D lunet-transpiler <br/>
            </kbd>

            <code title="index.html">{ index_html }</code>
            <code title="index.tsx">{ index_tsx }</code>
            <code title="serve.ts">{ serve_ts }</code>

            <kbd>
                $ bun serve
            </kbd>
        </div>
    </main>
</>);
