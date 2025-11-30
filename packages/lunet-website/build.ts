import { build } from "bun";
import { bun_lunet } from "lunet-transpiler";

build({
    entrypoints: [`${import.meta.dir}/index.html`],
    target: "browser",
    minify: true,
    plugins: [bun_lunet()],
    outdir: `${import.meta.dir}/dist`,
});
