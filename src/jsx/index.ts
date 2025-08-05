import { createFactory, type Factory } from "./factory";

export type AnyElType = Component<any> | keyof HTMLElementTagNameMap;

export type JSXNode = JSXElement<any> | string;
export type JSXElement<T extends AnyElType> = [T, T extends Component<infer P> ? P : {[key: string]: unknown}, ...JSXNode[]];

export type Component<T extends object> =
    (render: (jsx: JSXNode) => void, init: T) => T;

// 関数で呼び出すとコンポーネントから、、オブジェクトとしてアクセスするとDOMタグから、JSXファクトリーチェーンが返される
export const jsx = new Proxy(
    (component: Component<object>) => createFactory(component), {
        get: (_, p: keyof HTMLElementTagNameMap) => createFactory(p),
    }
) as (<T extends object>(component: Component<T>) => Factory<Component<T>>) & {
    [key in keyof HTMLElementTagNameMap]: Factory<key>;
};

export { createFactory };
export { h } from "./likereact";
