import type { HTMLElAttrEvMap } from "./eventmap";

export type Attributes<T extends object = {}> = Partial<
    HTMLAttributes & T & {
        [key in keyof HTMLElAttrEvMap]:
            (this: HTMLElement, ev: HTMLElAttrEvMap[key]) => unknown;
    } | {
        [key: string]: string;
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
