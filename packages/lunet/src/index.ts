import "./jsx/type/jsx";
import type { Options } from "./render/config";

export * from "./jsx";

export const createRoot = (el: HTMLElement, options?: Options): {
    render(jsx: JSX.Element): void;
    unmount(): void;
} => {

    //@INJECT

    //@ts-ignore
    const [node, dom] = createFragment([null, {}, []]);
    el.append(dom);

    return {
        render(jsx) {
            //@ts-ignore
            updateFragment(node, [null, {}, [jsx]]);
        },
        unmount() {
            //@ts-ignore
            revokeFragment(node);
        },
    }
}
