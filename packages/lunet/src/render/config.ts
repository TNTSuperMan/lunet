export interface Config {
    batch?: (cb: () => void) => void;
}

//@ts-ignore
export const config: Config = __CONFIG;

export const batch: Exclude<Config["batch"], undefined> = config.batch ?? (cb => cb());
