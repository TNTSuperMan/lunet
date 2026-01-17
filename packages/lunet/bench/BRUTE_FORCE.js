import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { bench, run } from "mitata";
import { createRoot } from "../dist/index.js";

GlobalRegistrator.register();

const root = createRoot(document.body);

const TEST_CASE_SEED = parseInt(process.env.BRUTE_FORCE_SEED ?? "") || 14;

const SAMPLE_ELEMENT_TAGS = ["a", "button", "div", "code"];
const SAMPLE_ATTRIBUTE_NAMES = ["name", "class", "id", "title"];
const SAMPLE_TEXTS = ["Hey!", "Hello!", "Sample!", "TNTSuperMan"];

const float_rand = (() => {
    let x = TEST_CASE_SEED;
    return () => {
        x ^= x << 13;
        x ^= x >> 17;
        x ^= x << 5;
        return (x >>> 0) / (2**32)
    }
})();

const rand = (num) => Math.floor(float_rand() * num);
const rand_pick = (strs) => strs[rand(strs.length)];
const rand_str = (strs, len) => Array(len).fill(0).map(() => strs[rand(strs.length)]).join("");

const GenerateRandomJSX = (layer) => {
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

bench("render", () => {
    for (const jsx of jsxnodes) {
        root.render(jsx);
    }
});

await run();
