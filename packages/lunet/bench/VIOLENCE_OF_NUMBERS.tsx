import type { JSXNode } from "../src";
import "../test/utils/preload";
import { withRender } from "../test/utils/withRender";
import { bench, run } from "mitata";

const TEST_CASE_SEED = parseInt(process.env.VIOLENCE_OF_NUMBERS_SEED ?? "") || 14;

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

const GenerateRandomJSX = (layer?: number): JSXNode => {
    if((layer??0) > 3)
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
                ...Array(rand(32 - (layer??0)*10)).fill(0).map(()=>GenerateRandomJSX((layer??0)+1))
            ];
        case 1:
            return [
                null,
                rand(2) === 0 ? {} : { key: `key${rand(16)}` },
                ...Array(rand(32 - (layer??0)*10)).fill(0).map(()=>GenerateRandomJSX((layer??0)+1))
            ];
        default:
            return rand_pick(SAMPLE_TEXTS);
    }
}

const jsxnodes = Array(100).fill(0).map(() => GenerateRandomJSX());

const render = withRender();

bench("render", () => {
    for (const jsx of jsxnodes) {
        render(jsx);
    }
});

await run();
