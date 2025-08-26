# llex
より柔軟なWebフロントエンドフレームワーク。

## 使い方のサンプル
```jsx
import { createComponent, render } from "llex";
import { signal, effect } from "alien-signals";

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

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/index.ts
```

This project was created using `bun init` in bun v1.2.19. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
