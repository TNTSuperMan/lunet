import type { Key } from "../index";
import type { HTMLElAttrEvMap } from "./eventmap";

export type Attributes<N extends keyof HTMLElementTagNameMap, T extends object = {}> = Partial<
    HTMLAttributes & T & Key & {    
        [key in keyof HTMLElAttrEvMap]:
            (this: HTMLElement, ev: HTMLElAttrEvMap[key]) => unknown;
    } & {
        $beforeMount: () => unknown;
        $mount:         (this: HTMLElementTagNameMap[N], ev: CustomEvent<HTMLElementTagNameMap[N]>) => unknown;
        $beforeUpdate:  (this: HTMLElementTagNameMap[N], ev: CustomEvent<HTMLElementTagNameMap[N]>) => unknown;
        $update:        (this: HTMLElementTagNameMap[N], ev: CustomEvent<HTMLElementTagNameMap[N]>) => unknown;
        $beforeUnmount: (this: HTMLElementTagNameMap[N], ev: CustomEvent<HTMLElementTagNameMap[N]>) => unknown;
        $unmount: () => unknown;
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
