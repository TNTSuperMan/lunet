import type { Attributes } from "./attributes";
import type { JSXNode } from "../index";

type Target = "_self" | "_blank" | "_parent" | "_top";

declare global {
    namespace JSX {
        type Element = JSXNode;
        type IntrinsicElements = {
            [key in keyof HTMLElementTagNameMap]: Attributes<key>;
        } & {
            div: Attributes<"div">;
            ul: Attributes<"ul">;
            ol: Attributes<"ol">;
            li: Attributes<"li">;
            br: Attributes<"br">;
            button: Attributes<"button">;
            a: Attributes<"a", {
                href: string;
                download: string;
                target: Target;
                hreflang: string;
                media: string;
                ping: string;
                referrerpolicy: string;
                rel: string;
                shape: string;
            }>;
            input: Attributes<"input", {
                accept: string;
                alt: string;
                autocomplete: "off" | "on" | string;
                checked: boolean;
                disabled: boolean;
                formonvalidate: boolean;
                formtarget: Target;
                type: "button" | "checkbox" | "color" | "date" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "search" | "submit" | "tel" | "text" | "time" | "url" | "week";
                value: string;
            }>;
            form: Attributes<"form", {
                "accept-charset": "UTF-8";
                autocomplete: "off" | "on";
                name: string;
                enctype: "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain";
                method: "post" | "get" | "dalog";
                target: Target | "_unfencedTop";
            }>;
            iframe: Attributes<"iframe", {
                allow: string;
                allowfullscreen: boolean;
                width: number;
                height: number;
                loading: "eager" | "lazy";
                name: string;
                referrerpolicy: "no-referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-orgin" | "usafe-url";
                sandbox: string;
                src: string;
                srcdoc: string;
            }>;
        }
    }    
}
