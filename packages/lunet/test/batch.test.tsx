import { expect, test } from "bun:test";
import { createComponent, setBatch } from "../src";
import { withRender } from "./utils/withRender";

test("Batch", () => {
    const RENDER_COUNT = 2;

    let batching_flag = false;
    const batch_info: number[] = [];
    setBatch(cb => {
        batch_info.unshift(0);
        batching_flag = true;
        cb();
        batching_flag = false;
    });

    const Child = createComponent<{ a: string, b: string }>(() => ({
        set a(_: string) { expect(batching_flag).toBeTrue(); batch_info[0]++; },
        set b(_: string) { expect(batching_flag).toBeTrue(); batch_info[0]++; }
    }));

    const render = withRender(Child({ a: "a", b: "b" }));

    for(let i = 0; i < RENDER_COUNT; i++)
        render(Child({ a: "a", b: "b" }));

    expect(batch_info).toEqual(Array(RENDER_COUNT).fill(2));

    setBatch(cb => cb());
});
