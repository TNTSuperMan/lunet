import { expect, test } from "bun:test";
import { createComponent, setBatch, h, fragment, render } from "../src";

test("Check batch", () => {
    let batching_flag = false;
    const batch_info: number[] = [];
    setBatch(cb => {
        batch_info.unshift(0);
        batching_flag = true;
        cb();
        batching_flag = false;
    });

    const Child = createComponent<{ a: string, b: string }>(render => {
        render("");
        return {
            set a(_: string) { expect(batching_flag).toBeTrue(); batch_info[0]++; },
            set b(_: string) { expect(batching_flag).toBeTrue(); batch_info[0]++; }
        }
    });

    const Parent = createComponent(render => {
        const render_ = () => render(<>
            <button $click={render_}></button>
            <Child a="a" b="b" />
        </>);
        render_();
        return {};
    });

    render(document.body, <Parent/>);

    document.querySelector("button")?.click();
    document.querySelector("button")?.click();

    expect(batch_info).toEqual([2, 2]);

    setBatch(cb => cb());
});
