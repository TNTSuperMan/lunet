import { effect, signal } from "alien-signals";
import { createComponent } from "lunet";

export const App = createComponent((render, init) => {
    const counter = signal(0);

    effect(() => {
        render(<div>
            <h1>Hello, lunet!</h1>
            <button $click={() => counter(counter() + 1)}>Count: {counter()}</button>
        </div>);
    })

    return init;
});
