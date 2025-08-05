import { createFactory, type Factory } from "./factory";

export type AnyComponent = Component<object> | string;

export type JSX = JSXElement<any> | string;
export type JSXElement<T extends AnyComponent> = [T, T extends Component<infer P> ? P : {[key: string]: unknown}, ...JSX[]];

export type Component<T extends object> =
    (render: (jsx: JSX) => void, init: T) => T;

// 関数で呼び出すとコンポーネントから、、オブジェクトとしてアクセスするとDOMタグから、JSXファクトリーチェーンが返される
export const jsx = new Proxy(
    (component: Component<object>) => createFactory(component), {
        get: (_, p: string) => createFactory(p),
    }
) as ((component: Component<object>) => Factory<Component<object>>) & {
    [key: string]: Factory<string>,
};
