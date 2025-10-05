import { describe, expect, mock, test } from "bun:test";
import { h } from "../src";
import { withRender } from "./utils/withRender";

describe("Event", () => {
    const render = withRender();

    test("Should call once when once clicked", () => {
        const cb = mock(() => {});

        render(<button $click={cb}></button>);
        document.querySelector("button")?.click();

        expect(cb).toBeCalledTimes(1);
    });

    test("Should modify callback", () => {
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

    test("Should not call removed callback", () => {
        const cb = mock(() => {});
        render(<button $click={cb}></button>);
        render(<button></button>);

        document.querySelector("button")?.click();

        expect(cb).not.toBeCalled();
    });

    test("`event` should instanceof Event, and `this` should be event.target", () => {
        const cb = mock(function(this: HTMLElement, event: Event) {
            expect(event).toBeInstanceOf(Event);
            expect(this as unknown).toBe(event.target);
        });

        render(<button $click={cb}></button>);

        document.querySelector("button")?.click();

        expect(cb).toBeCalledTimes(1);
    });

    test("Should not throw error when dispatched unhandled event", () => {
        const dispatchUnhandledEvent = () =>
            document.querySelector("button")?.dispatchEvent(new KeyboardEvent("keydown"));

        expect(dispatchUnhandledEvent).not.toThrow();
    });
});
