import { build } from "bun";
import { bun_lunet } from "lunet-transpiler";

await build({
    entrypoints: ["./index.html"],
    minify: true,
    plugins: [bun_lunet()],
    outdir: "./dist",
});
