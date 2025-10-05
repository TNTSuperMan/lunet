type BatchFn = (cb: () => void) => void;

export let batch: BatchFn = cb => cb();

export const setBatch = (fn: BatchFn) => batch = fn;
