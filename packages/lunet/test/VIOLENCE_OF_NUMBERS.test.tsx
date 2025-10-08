import { expect, test } from "bun:test";
import { type JSXNode } from "../src";
import { withRender } from "./utils/withRender";
import { env } from "bun";
import { LunetJSXAssertionError } from "../src/assert/error";

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

const flatFragment = (jsx: JSXNode): JSXNode[] => {
    if (Array.isArray(jsx)) {
        if (jsx[0] === null) {
            const [,, ...children] = jsx;
            return children.flatMap(flatFragment);
        } else if(typeof jsx[0] === "string") {
            const [tag, attrs, ...children] = jsx;
            return [[tag, attrs, ...children.flatMap(flatFragment)]];
        }
    }
    return [jsx];
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
            Object.fromEntries(Array.from(dom.attributes).map(({ name, value }) => [name, value])),
            ...Array.from(dom.childNodes).map(analyzeTree).filter(e => e !== null)
        ];
    }
    throw new Error(`Unhandled type DOM`, { cause: dom });
}

const attr = (attr: object) => Object.entries(attr).toSorted(([ak],[bk])=>ak>bk?1:-1).map(([k,v])=>`${k}=${JSON.stringify(v)}`).join(" ");
const prettyJSX = (jsx: JSXNode): unknown => {
    if (Array.isArray(jsx)) {
        const [tag, props, ...children] = jsx;
        return [`${tag??"Fragment"}(${attr(props)})`, ...children.map(prettyJSX)]
    }
    return jsx
}

const find = (parent: JSXNode, jsx: JSXNode): string | null => {
    if (Array.isArray(parent)) {
        if (parent === jsx) {
            return `Found`;
        }
        const [tag, props, ...children] = parent;
        const details = children.map(j => find(j, jsx))
        const detailIndex = details.findIndex(e => e !== null);

        if (detailIndex !== -1) {
            return `${details[detailIndex]!}
@AT ${tag??"Fragment"}(${attr(props)}) [${detailIndex}]
${children.map((child, i) => (i === detailIndex ? "HERE:" : "     ") + Bun.inspect(child, { depth: 1, compact: true })).join("\n")}
`;
        }
    }
    return null;
}

test.skipIf(!doTest)("Test JSX Diff Updates Exhaustive by VIOLENCE OF NUMBERS", async () => {
    const render = withRender();

    let before: JSXNode | null = null;

    for (let i = 0; i < TEST_CASE_COUNT; i++ ) {
        console.log(i);
        const jsx = GenerateRandomJSX();
        try {
            render(jsx);
        } catch (err) {
            if (err instanceof LunetJSXAssertionError) {
                console.log(find(before!, err.cause as any));
                const [,,...children] = jsx;
                console.log(children.map(child => Bun.inspect(child, { depth: 1, compact: true })).join("\n"));
                throw new Error(err.message);
            } else {
                throw new Error("Rendering failed", { cause: err });
            }
        }
        const dom_jsx = analyzeTree(document.body);

        expect(prettyJSX(dom_jsx!)).toEqual(prettyJSX(["body",{},...flatFragment(jsx)]));

        before = jsx;
    }
});
