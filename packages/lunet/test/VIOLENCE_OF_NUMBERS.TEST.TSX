import { setRandomSeed } from "bun:jsc";
import { describe, test } from "bun:test";
import { type JSXNode } from "../src";
import { withRender } from "./utils/withRender";
import { env } from "bun";

const TEST_CASE_OFFSET = parseInt(env.VIOLENCE_OF_NUMBERS_OFFSET ?? "") || 0;
const TEST_CASE_COUNT = 128;

const rand = (num: number): number => Math.floor(Math.random() * num);
const rand_str = (strs: string, len: number): string => Array(len).fill(0).map(() => strs[rand(strs.length)]).join("");

const doTest = env.VIOLENCE_OF_NUMBERS === "GO";

describe.skipIf(!doTest)("Test JSX Diff Updates Exhaustive by VIOLENCE OF NUMBERS", () => {
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

    const render = withRender();

    test.each(!doTest ? [] : Array(TEST_CASE_COUNT).fill(0).map((_,i)=>i + TEST_CASE_OFFSET))("Seed: %i", seed => {
        setRandomSeed(seed);
        const jsx = GenerateRandomJSX();
        render(jsx);
    });
});
