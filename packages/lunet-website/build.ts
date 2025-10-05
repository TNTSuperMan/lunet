import { build } from "bun";
import { bun_lunet } from "lunet-transpiler";

build({
    entrypoints: ["./index.html"],
    target: "browser",
    minify: true,
    plugins: [bun_lunet()],
    outdir: "dist",
});
