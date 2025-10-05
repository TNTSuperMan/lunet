import { file, Glob } from "bun";

export default async (): Promise<Record<string, string>> => Object.fromEntries(
    await Promise.all(
        (
            await Array.fromAsync(
                new Glob("../sample/*").scan(import.meta.dir)
            )
        ).map(async path => [
            path.split("/").at(-1)!, await file(import.meta.dir + "/" + path).text()
        ])
    )
);
