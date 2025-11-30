import { defineWorkspace } from "bunup";

export default defineWorkspace([
    {
        name: "lunet",
        root: "./packages/lunet",
        config: {
            entry: "src/index.ts",
            format: ["esm", "cjs"],
            target: "browser",
        },
    },
    {
        name: "lunet-transpiler",
        root: "./packages/lunet-transpiler",
        config: {
            entry: "src/index.ts",
            format: ["esm", "cjs"],
            target: "node",
        },
    },
]);
