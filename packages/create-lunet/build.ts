import { build } from "bun";

build({
    entrypoints: ["./src/index.ts"],
    outdir: "dist",
    naming: "index.mjs",
    target: "node",
    format: "esm",
    banner: `#!/usr/bin/env node`
});
