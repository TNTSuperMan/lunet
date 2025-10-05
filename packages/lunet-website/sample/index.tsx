import { render, h, fragment, createComponent } from "lunet";
import { signal, effect } from "alien-signals";

const Counter = createComponent<{ name: string }>((render, init) => {
    const name = signal(init.name);
    const count = signal(0);

    effect(() => {
        render(<div class="counter">
            <button $click={() => count(count() + 1)}>{name()}: {count().toString()}</button>
        </div>);
    });

    return {
        set name(value: string) { name(value) }
    };
})

render(document.body, <>
    <h1>Hello!</h1>
    <Counter name="Count" />
</>);
