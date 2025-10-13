const domQueue: (() => unknown)[] = [];

export const queueDOMUpdate = (fn: () => unknown) => {
    domQueue.push(fn);
}

export const flushDOMUpdates = () => {
    domQueue.splice(0).forEach(fn => fn());
}
