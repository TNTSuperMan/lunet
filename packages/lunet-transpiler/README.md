# lunet-transpiler
より柔軟なWebフロントエンドライブラリ lunetのトランスパイラー。

## インストール
```bash
$ npm install lunet-transpiler
# or
$ bun i lunet-transpiler
```

## 対応状況
RollupとBunのみ対応しています。
その他は、エクスポートされている`transpile`関数を用いて行ってください。

## 使い方
### 1. Bun
```js
import { bun_lunet } from "lunet-transpiler";
Bun.plugin(bun_lunet());

...
```

### 2. Rollup
```js
import { defineConfig } from "rollup";
import { rollup_lunet } from "lunet-transpiler";

export default defineConfig({
    plugins: [rollup_lunet(), ...],
    ...
});
```
