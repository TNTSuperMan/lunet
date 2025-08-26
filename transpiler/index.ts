import type { BunPlugin } from "bun";
import { readFile as NodeReadFile } from "fs/promises";
import { transpile } from "./transpile";

const readFile: (path: string) => Promise<string> =
    process.isBun ?
        path => Bun.file(path).text() :
        path => NodeReadFile(path).then(e=>e.toString());

export const bun_llex: BunPlugin = {
    name: "bun-llex",
    setup(build) {
        build.onLoad({ filter: /\.jsx$/ }, async args => {
            const code = await readFile(args.path);
            return ({
                contents: transpile(code, { sourceType: "unambiguous", plugins: ["jsx"] }),
                loader: "jsx"
            });
        });
        build.onLoad({ filter: /\.tsx$/ }, async args => {
            const code = await readFile(args.path);
            return ({
                contents: transpile(code, { sourceType: "unambiguous", plugins: ["typescript", "jsx"] }),
                loader: "tsx"
            });
        });
    },
}
