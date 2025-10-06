import { expect, test } from "bun:test";
import { type JSXNode } from "../src";
import { withRender } from "./utils/withRender";
import { env, write } from "bun";

const TEST_CASE_SEED = parseInt(env.VIOLENCE_OF_NUMBERS_SEED ?? "") || 14;
const TEST_CASE_COUNT = 128;

const SAMPLE_ELEMENT_TAGS: (keyof HTMLElementTagNameMap)[] = ["a", "button", "div", "code"];
const SAMPLE_ATTRIBUTE_NAMES: string[] = ["name", "class", "id", "title"];
const SAMPLE_TEXTS: string[] = ["Hey!", "Hello!", "Sample!", "TNTSuperMan"];

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
const rand_pick = <T extends string>(strs: T[]): T => strs[rand(strs.length)];
const rand_str = (strs: string, len: number): string => Array(len).fill(0).map(() => strs[rand(strs.length)]).join("");

const doTest = env.VIOLENCE_OF_NUMBERS === "GO";

const GenerateRandomJSX = (layer?: number): JSXNode => {
    if((layer??0) > 4)
        return rand_pick(SAMPLE_TEXTS);
    switch(rand(3)) {
        case 0:
            return [
                rand_pick(SAMPLE_ELEMENT_TAGS),
                Object.fromEntries(
                    Array(rand(8)).fill([]).map(e=>[
                        rand_pick(SAMPLE_ATTRIBUTE_NAMES),
                        rand_str("abcdefghijklmnopqrstuvwxyz", rand(15)+1),
                    ])
                ),
                ...Array(rand(32 - (layer??0)*7)).fill(0).map(()=>GenerateRandomJSX((layer??0)+1))
            ];
        case 1:
            return [
                null,
                rand(2) === 0 ? {} : { key: `key${rand(16)}` },
                ...Array(rand(32 - (layer??0)*7)).fill(0).map(()=>GenerateRandomJSX((layer??0)+1))
            ];
        default:
            return rand_pick(SAMPLE_TEXTS);
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

test.skipIf(!doTest)("Test JSX Diff Updates Exhaustive by VIOLENCE OF NUMBERS", async () => {
    const render = withRender();

    let before: JSXNode | null = null;

    for (let i = 0; i < TEST_CASE_COUNT; i++ ) {
        console.log(i);
        const jsx = GenerateRandomJSX();
        try {
            render(jsx);
        } catch (cause) {
            throw new Error("Rendering failed", { cause });
        }
        const dom_jsx = analyzeTree([...document.body.childNodes].filter(e => !(e instanceof Comment))[0]);

        expect(dom_jsx).toEqual(jsx);

        before = jsx;
    }
});
