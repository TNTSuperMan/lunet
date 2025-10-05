import { describe, expect, mock, test } from "bun:test";
import { h } from "../src";
import { withRender } from "./utils/withRender";

describe("Event", () => {
    const render = withRender();

    test("Single", () => {
        const cb = mock(() => {});

        render(<button $click={cb}></button>);
        document.querySelector("button")?.click();

        expect(cb).toBeCalledTimes(1);
    });

    test("Changing", () => {
        const CB1_CLICK_COUNT = 3;
        const CB2_CLICK_COUNT = 4;

        const cb1 = mock(() => {});
        const cb2 = mock(() => {});

        render(<button $click={cb1}></button>);
        for(let i = 0; i < CB1_CLICK_COUNT; i++)
            document.querySelector("button")?.click();

        render(<button $click={cb2}></button>);
        for(let i = 0; i < CB2_CLICK_COUNT; i++)
            document.querySelector("button")?.click();

        expect(cb1).toBeCalledTimes(CB1_CLICK_COUNT);
        expect(cb2).toBeCalledTimes(CB2_CLICK_COUNT);
    });

    test("Delete", () => {
        const cb = mock(() => {});
        render(<button $click={cb}></button>);
        render(<button></button>);

        document.querySelector("button")?.click();

        expect(cb).not.toBeCalled();
    });

    test("Unhandled event", () => {
        const dispatchUnhandledEvent = () =>
            document.querySelector("button")?.dispatchEvent(new KeyboardEvent("keydown"));

        expect(dispatchUnhandledEvent).not.toThrow();
    });
});
