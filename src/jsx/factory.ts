import type { AnyComponent, Component, JSX, JSXElement } from ".";

export type Factory<T extends AnyComponent> =
    (props: T extends Component<infer P> ? P : { [key: string]: unknown }, ...children: JSX[]) => JSXElement<T>;

const insideCreateFactory = <T extends AnyComponent>(component: T): Factory<T> =>
    (props, ...children) => [component, props, ...children];

const factoryMap = new Map<AnyComponent, Factory<any>>();

export const createFactory = <T extends AnyComponent>(component: T): Factory<T> =>
    factoryMap.get(component) ??
        (factoryMap.set(component, insideCreateFactory(component)),
        factoryMap.get(component)!);
