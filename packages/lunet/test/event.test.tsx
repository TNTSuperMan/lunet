import { describe, expect, mock, test } from "bun:test";
import { h } from "../dist";
import { useRoot } from "./utils/useRoot";

describe("Event", () => {

    test("Should call once when once clicked", () => {
        using root = useRoot();

        const cb = mock(() => {});

        root.render(<button $click={cb}></button>);
        document.querySelector("button")?.click();

        expect(cb).toHaveBeenCalledTimes(1);
    });

    test("Should modify callback", () => {
        using root = useRoot();

        const CB1_CLICK_COUNT = 3;
        const CB2_CLICK_COUNT = 4;

        const cb1 = mock(() => {});
        const cb2 = mock(() => {});

        root.render(<button $click={cb1}></button>);
        for(let i = 0; i < CB1_CLICK_COUNT; i++)
            document.querySelector("button")?.click();

        root.render(<button $click={cb2}></button>);
        for(let i = 0; i < CB2_CLICK_COUNT; i++)
            document.querySelector("button")?.click();

        expect(cb1).toHaveBeenCalledTimes(CB1_CLICK_COUNT);
        expect(cb2).toHaveBeenCalledTimes(CB2_CLICK_COUNT);
    });

    test("Should not call removed callback", () => {
        using root = useRoot();

        const cb = mock(() => {});
        root.render(<button $click={cb}></button>);
        root.render(<button></button>);

        document.querySelector("button")?.click();

        expect(cb).not.toHaveBeenCalled();
    });

    test("`event` should instanceof Event, and `this` should be event.target", () => {
        using root = useRoot();

        const cb = mock(function(this: HTMLElement, event: Event) {
            expect(event).toBeInstanceOf(Event);
            expect(this as unknown).toBe(event.target);
        });

        root.render(<button $click={cb}></button>);

        document.querySelector("button")?.click();

        expect(cb).toHaveBeenCalledTimes(1);
    });

    test("Should not throw error when dispatched unhandled event", () => {
        using _root = useRoot(<button></button>);

        const dispatchUnhandledEvent = () =>
            document.querySelector("button")?.dispatchEvent(new KeyboardEvent("keydown"));

        expect(dispatchUnhandledEvent).not.toThrow();
    });
});
