import { expect, test } from "bun:test";
import { type JSXNode } from "../src";
import { withRender } from "./utils/withRender";
import { env, write } from "bun";

const TEST_CASE_SEED = parseInt(env.VIOLENCE_OF_NUMBERS_SEED ?? "") || 14;
const TEST_CASE_COUNT = 128;

const float_rand = (() => {
    let x = TEST_CASE_SEED;
    return () => {
        x ^= x << 13;
        x ^= x >> 17;
        x ^= x << 5;
        return (x >>> 0) / (2**32)
    }
})();

const rand = (num: number): number => Math.floor(float_rand() * num);
const rand_str = (strs: string, len: number): string => Array(len).fill(0).map(() => strs[rand(strs.length)]).join("");

const doTest = env.VIOLENCE_OF_NUMBERS === "GO";

const GenerateRandomJSX = (layer?: number): JSXNode => {
    if((layer??0) > 3)
        return rand_str("abcdefghijklmnopqrstuvwxyz", rand(15)+1);
    switch(rand(3)) {
        case 0:
            return [
                rand_str("abcdefghijklmnopqrstuvwxyz", rand(15)+1) as any,
                Object.fromEntries(
                    Array(rand(8)).fill([]).map(e=>[
                        rand_str("abcdefghijklmnopqrstuvwxyz", rand(15)+1),
                        rand_str("abcdefghijklmnopqrstuvwxyz", rand(15)+1),
                    ])
                ),
                ...Array(rand(32)).fill(0).map(()=>GenerateRandomJSX((layer??0)+1))
            ];
        case 1:
            return [
                null,
                rand(2) === 0 ? {} : { key: rand(16) },
                ...Array(rand(32)).fill(0).map(()=>GenerateRandomJSX((layer??0)+1))
            ];
        default:
            return rand_str("abcdefghijklmnopqrstuvwxyz", rand(15)+1);
    }
}

const analyzeTree = (dom: Node): JSXNode | null => {
    if (dom instanceof Text) {
        return dom.nodeValue;
    }
    if (dom instanceof Comment) {
        return null;
    }
    if (dom instanceof HTMLElement) {
        return [
            dom.tagName.toLowerCase() as keyof HTMLElementTagNameMap,
            Object.fromEntries([...dom.attributes].map(({ name, value }) => [name, value])),
            ...[...dom.childNodes].map(analyzeTree).filter(e => e !== null)
        ];
    }
    throw new Error(`Unhandled type DOM`, { cause: dom });
}

test.skipIf(!doTest)("Test JSX Diff Updates Exhaustive by VIOLENCE OF NUMBERS", () => {
    const render = withRender();

    let before: JSXNode | null = null;

    for (let i = 0; i < TEST_CASE_COUNT; i++ ) {
        const jsx = GenerateRandomJSX();
        try {
            render(jsx);
        } catch (cause) {
            write("coverage/failed.json", JSON.stringify([before, jsx]));
            throw new Error("Rendering failed", { cause });
        }
        const dom_jsx = analyzeTree(Array.from(document.body.childNodes).filter(e => !(e instanceof Comment))[0]);

        expect(dom_jsx).toEqual(jsx);

        before = jsx;
    }
});
