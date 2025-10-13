export const domQueue: (() => unknown)[] = [];
export const siblingDomQueue: (() => unknown)[] = [];

export const queueDOMUpdate = (fn: () => unknown) => {
    domQueue.push(fn);
}

export const queueSibilingDOMUpdate = (fn: () => unknown) => {
    siblingDomQueue.push(fn);
}

export const flushDOMUpdates = () => {
    domQueue.splice(0).forEach(fn => fn());
    siblingDomQueue.splice(0).forEach(fn => fn());
}
