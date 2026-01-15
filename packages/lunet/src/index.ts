import "./jsx/type/jsx";
import type { Config } from "./render/config";

export * from "./jsx";

export const createRoot = (el: HTMLElement, __CONFIG: Config): {
    render(jsx: JSX.Element): void;
    unmount(): void;
} => {
    
    //@INJECT

    //@ts-ignore
    const [node, dom] = createFragment([null, {}]);
    el.append(dom);

    return {
        render(jsx) {
            //@ts-ignore
            updateFragment(node, [null, {}, jsx]);
        },
        unmount() {
            //@ts-ignore
            revokeFragment(node);
        },
    }
}
