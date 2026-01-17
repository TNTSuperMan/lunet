import { build, file, write } from "bun";
import { parse } from "@babel/parser";
import { generate } from "@babel/generator";
import { generateDts } from "typeroll";

const render1_res = await build({
    entrypoints: [`${import.meta.dir}/src/render/index.ts`],
    throw: true,
});

const render1_code = await render1_res.outputs[0]!.text();

const ast = parse(render1_code, {
    sourceType: "module",
});

const export_statement = ast.program.body.at(-1);
if (!export_statement || export_statement.type !== "ExportNamedDeclaration") {
    throw new Error("Not found export statement on last");
}

const nameset = new Set<string>();

for (const spec of export_statement.specifiers) {
    if (
        spec.type !== "ExportSpecifier" ||
        spec.exported.type !== "Identifier" ||
        spec.exported.name !== spec.local.name
    ) {
        throw new Error("AST assertion failed");
    }
    nameset.add(spec.local.name);
}

if (
    !nameset.has("createFragment") ||
    !nameset.has("updateFragment") ||
    !nameset.has("revokeFragment")
) {
    throw new Error("AST assertion failed");
}

ast.program.body.pop();

const render2_code = generate(ast).code;

const entrypoint = `${import.meta.dir}/src/index.ts`;
const entry_src = await file(entrypoint).text();

const cfg = {
    entrypoints: [entrypoint],
    //@ts-ignore
    files: {
        [entrypoint]: entry_src.replace("//@INJECT", render2_code),
    },
    outdir: `${import.meta.dir}/dist/`
} as {
    entrypoints: [string],
    outdir: string,
};

await build({
    ...cfg,
    format: "esm",
    naming: "index.js",
});

await build({
    ...cfg,
    format: "cjs",
    naming: "index.cjs",
});

const dts_result = await generateDts([
    entrypoint,
]);

if (dts_result.errors.length) {
    throw dts_result.errors;
}

await write(`${import.meta.dir}/dist/index.d.ts`, dts_result.files[0]!.dts);
