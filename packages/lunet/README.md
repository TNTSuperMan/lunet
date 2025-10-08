# lunet
より柔軟なWebフロントエンドライブラリ。

## インストール
```bash
$ npm install lunet
# or
$ bun add lunet

# こちらもお勧め
$ npm install alien-signals
$ npm install --save-dev lunet-transpiler
# or
$ bun add alien-signals
$ bun add -D lunet-transpiler
```

## 使い方のサンプル
```jsx
import { createComponent, render, setBatch } from "lunet";
import { signal, effect, startBatch, endBatch } from "alien-signals";

setBatch(cb => {
    startBatch();
    cb();
    endBatch();
});

const App = createComponent((render, init) => {
    const msg = signal(init.msg);
    const count = signal(0);

    effect(() => {
        render(<div class="app">
            <button $click={()=>count(count()+1)}>{msg()} {count().toString()}</button>
        </div>)
    });

    return {
        set msg(value){ msg(value) }
    }
})

render(document.getElementById("root"), <App msg="Count:" />);

```
