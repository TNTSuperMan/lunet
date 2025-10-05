export const Canvas = createComponent((render, init) => {
    const canvas = signal();
    const width = signal(init.width);
    const height = signal(init.height);

    effect(() => {
        if (!canvas) {
            render(<canvas $mount={ev => canvas(ev.detail)} width={width()} height={height()} />);
        } else {
            const canvas_el = canvas();
            canvas_el.width = width();
            canvas_el.height = height();
        }
    });

    return {
        set width(value) { width(value) },
        set height(value) { height(value) }
    };
});