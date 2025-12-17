import { exec, execSync } from "child_process";
import { readdir } from "fs/promises";
import { cp } from "fs/promises";
import { dirname, resolve } from "path";
import { createInterface } from "readline/promises";
import { fileURLToPath } from "url";

const path = resolve(process.cwd(), process.argv[2] ?? ".");
const _dirname = dirname(fileURLToPath(import.meta.url));

const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "",
});

console.log(`Template destination: ${path}`);

if ((await readdir(path)).length) {
    const do_continue = await rl.question(`Destination directory is not empty.
Do you continue? (y/N)
> `);
    if (do_continue !== "Y" && do_continue !== "y") {
        process.exit();
    }
}

const template = await rl.question(`Select template:
bun ) Install packages with Bun, Language is TSX, Build page with Bun  
node) Install packages with npm, Language is JSX, Build page with Vite
> `);

rl.close();

switch (template) {
    case "bun":
        await cp(
            resolve(_dirname, "..", "bun"),
            path,
            {
                recursive: true,
            },
        );
        execSync("bun install", {
            cwd: path,
            stdio: "inherit",
        });
        console.log(`
To start development server:
    npm run dev

To build page:
    npm run build

Happy bunning! 🐇`);
        break;
    case "node":
        await cp(
            resolve(_dirname, "..", "node"),
            path,
            {
                recursive: true,
            },
        );
        execSync("npm install", {
            cwd: path,
            stdio: "inherit",
        });
        console.log(`
To start development server:
    npm run dev

To build page:
    npm run build

Happy development life!`);
        break;
    case "deno":
        console.log("Deno not implemented.");
        break;
    default:
        console.log("Invalid template.");
        break;
}
