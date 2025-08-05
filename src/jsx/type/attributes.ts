import type { HTMLElAttrEvMap } from "./eventmap";

type AttributesBase<T extends object> = HTMLAttributes & T & {    
    [key in keyof HTMLElAttrEvMap]:
        (this: HTMLElement, ev: HTMLElAttrEvMap[key]) => unknown;
} & {
    $beforeMount: () => unknown;
    $mount: (this: HTMLElement, ev: Event) => unknown;
    $beforeUpdate: (this: HTMLElement, ev: Event) => unknown;
    $update: (this: HTMLElement, ev: Event) => unknown;
    $beforeUnmount: (this: HTMLElement, ev: Event) => unknown;
    $unmount: () => unknown;
}

export type Attributes<T extends object = {}> = Partial<
    AttributesBase<T> | {
        [key in Exclude<string, keyof AttributesBase<T>>]: string;
    }
>;

type HTMLAttributes = {
    accesskey: string;
    autocapitalize: "off" | "none" | "on" | "sentences" | "words" | "characters";
    class: string;
    contenteditable: boolean | "" | "plaintext-only";
    dir: "ltr" | "rtl";
    draggable: boolean;
    hidden: "" | "hidden" | "until-found";
    id: string;
    itemprop: string;
    lang: string;
    role: string;
    slot: string;
    spellcheck: boolean;
    style: string;
    tabindex: number;
    title: string;
    translate: "yes" | "no";
}
