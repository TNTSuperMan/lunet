import "./jsx/type/jsx";
import type { createFragment as createFragment$T, updateFragment as updateFragment$T, revokeFragment as revokeFragment$T } from "./render";
import type { Config } from "./render/config";

export * from "./jsx";

export const createRoot = (el: HTMLElement, __CONFIG: Config): {
    render(jsx: JSX.Element): void;
    unmount(): void;
} => {
    //@ts-ignore
    var createFragment: typeof createFragment$T = null, updateFragment: typeof updateFragment$T = null, revokeFragment: typeof revokeFragment$T = null;
    
    //@INJECT

    const [node, dom] = createFragment([null, {}]);
    el.append(dom);

    return {
        render(jsx) {
            updateFragment(node, [null, {}, jsx]);
        },
        unmount() {
            revokeFragment(node);
        },
    }
}
