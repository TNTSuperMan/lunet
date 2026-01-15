//@ts-nocheck

export interface Options {
    batch?: (cb: () => void) => void;
}

export const batch: Exclude<Options["batch"], undefined> = options?.batch ?? (cb => cb());
