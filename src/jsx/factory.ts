import type { AnyElType, Component, JSXNode, JSXElement } from ".";

export type Factory<T extends AnyElType> =
    (props: T extends Component<infer P> ? P : { [key: string]: unknown }, ...children: JSXNode[]) => JSXElement<T>;

const insideCreateFactory = <T extends AnyElType>(component: T): Factory<T> =>
    (props, ...children) => [component, props, ...children];

const factoryMap = new Map<AnyElType, Factory<any>>();

export const createFactory = <T extends AnyElType>(component: T): Factory<T> =>
    factoryMap.get(component) ??
        (factoryMap.set(component, insideCreateFactory(component)),
        factoryMap.get(component)!);
