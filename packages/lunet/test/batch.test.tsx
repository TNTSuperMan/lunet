import { expect, test } from "bun:test";
import { createComponent, createRoot } from "../dist";

test("Test batch behavior", () => {
    const RENDER_COUNT = 2;

    let batching_flag = false;
    const batch_info: number[] = [];
    const root = createRoot(document.body, {
        batch(cb) {
            batch_info.unshift(0);
            batching_flag = true;
            cb();
            batching_flag = false;
        }
    });

    const Child = createComponent<{ a: string, b: string }>((render) => {
        render([null, {}]);
        return {
            set a(_: string) { expect(batching_flag).toBeTrue(); batch_info[0]++; },
            set b(_: string) { expect(batching_flag).toBeTrue(); batch_info[0]++; }
        }
    });

    root.render(Child({ a: "a", b: "b" }));

    for(let i = 0; i < RENDER_COUNT; i++)
        root.render(Child({ a: "a", b: "b" }));

    expect(batch_info).toEqual(Array(RENDER_COUNT).fill(2));

    root.unmount();
});
