export type PureNode = [
    string,
    { [key: string]: string },
    ...PureNode[]
] | string;

const nodesMap = new WeakMap<Node, PureNode>();

export const pureNode = (node: Node): PureNode => {
    if (node instanceof Element) {
        const pure_node: PureNode = [
            node.tagName.toLowerCase(),
            Object.fromEntries(
                Array
                    .from(node.attributes)
                    .map(attr => [
                        attr.name,
                        attr.value
                    ])
            ),
            ...pureNodes(node.childNodes)
        ];
        if (nodesMap.has(node)) {
            const origin = nodesMap.get(node)!;
            if (Array.isArray(origin)) {
                origin.splice(0);
                origin.push(...pure_node);
                return origin;
            }
        }
        nodesMap.set(node, pure_node);
        return pure_node;
        
    } else if (node instanceof Text) {
        nodesMap.set(node, node.textContent);
    } else {
        nodesMap.set(node, null!);
    }
    return nodesMap.get(node)!;
}

export const pureNodes = (nodes: HTMLCollection | NodeListOf<Node>): PureNode[] =>
    Array.from(nodes).map(pureNode).filter(pure => pure !== null);
