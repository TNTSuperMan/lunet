import type { JSXNode } from ".";

export type JSXElement<T extends keyof HTMLElementTagNameMap> = [T, {[key: string]: unknown}, ...JSXNode[]];

export type Factory<T extends keyof HTMLElementTagNameMap> =
    (props: { [key: string]: unknown }, ...children: JSXNode[]) => JSXElement<T>;
const factoryMap = new Map<string, Factory<any>>();

export const jsx = new Proxy({}, {
    get: (_, tag: string): Factory<any> =>
        factoryMap.get(tag) ??
            (factoryMap.set(tag, (props, ...children) => [tag, props, ...children]),
            factoryMap.get(tag)!),
}
) as { [key in keyof HTMLElementTagNameMap]: Factory<key>; };
