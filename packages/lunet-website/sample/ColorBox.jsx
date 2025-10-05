export const ColorBox = createComponent((render, init) => {
    let box_el;
    
    render(<div
        $mount={ev => box_el = ev.detail}
        class="color-box"
        style={`background-color: ${init.color}`}
    />);

    return {
        set color(value) { box_el?.style.backgroundColor = value; }
    };
});