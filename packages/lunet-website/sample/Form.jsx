export const Form = createComponent((render, init) => {
    
    render(<form $submit={init.$submit}>
        <input type="text" name="name"  />
        <input type="hidden" name="csrf" $mount={ev =>
            fetch("/csrf_token")
                .then(res => res.text())
                .then(token => ev.detail.value = token)
        } />
    </form>);

    return {};
});