export let batch: ((cb: () => void) => void) = cb => cb();

export const setBatch = (fn: typeof batch) => batch = fn;
