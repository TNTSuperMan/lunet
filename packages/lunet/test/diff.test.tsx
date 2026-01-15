import { describe, expect, test } from "bun:test";
import type { JSXNode } from "../src";
import { diff, isCompatibleNode, type Patch } from "../src/render/diff";

const TEST_CASES: [JSXNode[], JSXNode[]][] = [
    [
        [
            [null,{}],
            "Text1",
            ["a",{}],
        ],[
            ["b",{}],
            "Text2"
        ]

    ],
    // TODO: ケースを増やす
];

describe("diff", () => {
    function update(nodes: JSXNode[], patches: Patch[]) {
        for (const [type, idx, jsx] of patches) {
            switch (type) {
                case 0:
                    if (isCompatibleNode(nodes[0], jsx)) {
                        throw new Error(`Assertion failed: not compatible`, { cause: [nodes[0], jsx] });
                    }
                    nodes[idx] = jsx;
                    break;
                case 1:
                    nodes.splice(idx, 0, jsx);
                    break;
                case 2:
                    nodes.splice(idx, 1);
                    break;
            }
        }
    }
    test.each(TEST_CASES)(`check update, case %#`, (before, after) => {
        const patches = diff(before, after);
        const jsx = structuredClone(before);

        update(jsx, patches);

        expect(jsx).toEqual(after);
    });
});
