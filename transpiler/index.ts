import { readFile as NodeReadFile } from "fs/promises";
import { readFileSync } from "fs";
import { transpile } from "./transpile";

import type { BunPlugin } from "bun";
import type { Plugin as RollupPlugin } from "rollup";

const readFile: (path: string) => Promise<string> =
    process.isBun
        ? path => Bun.file(path).text()
        : path => NodeReadFile(path).then(e=>e.toString());

export const bun_llex = (): BunPlugin => ({
    name: "bun-llex",
    setup(build) {
        build.onLoad({ filter: /\.jsx$/ }, async args => {
            const code = await readFile(args.path);
            return ({
                contents: transpile(code, false),
                loader: "jsx"
            });
        });
        build.onLoad({ filter: /\.tsx$/ }, async args => {
            const code = await readFile(args.path);
            return ({
                contents: transpile(code, true),
                loader: "tsx"
            });
        });
    },
})

export const rollup_llex = (): RollupPlugin => ({
    name: "rollup-llex",
    load(id){
        if(id.endsWith(".jsx")){
            const code = readFileSync(id).toString();
            return {
                code: transpile(code, false)
            };
        }else if(id.endsWith(".tsx")){
            const code = readFileSync(id).toString();
            return {
                code: transpile(code, true)
            };
        }
    }
})

export { transpile };
