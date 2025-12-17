import { createComponent, h } from "lunet";
import { effect, signal } from "alien-signals";

export const App = createComponent<{}>((render, init) => {
    const counter = signal(0);

    effect(() => {
        render(<div class="app">
            <h1>Hello, lunet!</h1>
            <button $click={() => counter(counter() + 1)}>Count: {counter().toString()}</button>
        </div>);
    });

    return init;
});
