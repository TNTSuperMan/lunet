import { render as renderDOM, type JSXNode } from "../../src";

const SAMPLE_ELEMENT_TAGS: (keyof HTMLElementTagNameMap)[] = ["a", "button", "div", "code"];
const SAMPLE_ATTRIBUTE_NAMES: string[] = ["name", "class", "id", "title"];
const SAMPLE_TEXTS: string[] = ["Hey!", "Hello!", "Sample!", "TNTSuperMan"];

const float_rand = (() => {
    let x = 14;
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

const GenerateRandomJSX = (layer = 0): JSXNode => {
    if(layer > 6)
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
                Array(rand(32 - layer*5)).fill(0).map(()=>GenerateRandomJSX(layer+1))
            ];
        case 1:
            return [
                null,
                rand(2) === 0 ? {} : { key: `key${rand(16)}` },
                Array(rand(32 - layer*5)).fill(0).map(()=>GenerateRandomJSX(layer+1))
            ];
        default:
            return rand_pick(SAMPLE_TEXTS);
    }
}

export async function benchmark(el: HTMLElement): Promise<Record<string, any>> {
    let render = null! as (jsx: JSXNode) => void;
    renderDOM(el,[(r:typeof render)=>{(render=r)([null,{},[]]);return{}},{},[]]);

    const jsxs_start = performance.now();
    const jsxs = Array(32).fill(0).map(() => GenerateRandomJSX());
    const jsxs_time = performance.now() - jsxs_start;

    const times: number[] = [];
    for (const jsx of jsxs) {
        const start = performance.now();
        render(jsx);
        times.push(performance.now() - start);
        await new Promise(res => requestAnimationFrame(res));
    }

    return { jsxs_time, avg: times.reduce((sum,e)=>sum+e,0)/times.length, times: times.map(e=>parseInt(e.toString())).join("ms\n")+"ms" };
}
