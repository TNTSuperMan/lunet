import { createRoot, type JSXNode } from "../../dist";

export const useRoot = (init?: JSXNode): ReturnType<typeof createRoot> & Disposable => {
    const root = createRoot(document.body);
    if (init) root.render(init);
    
    return {
        ...root,
        [Symbol.dispose]() {
            root.unmount();
        },
    };
}
