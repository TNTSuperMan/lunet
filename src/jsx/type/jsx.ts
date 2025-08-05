import type { Attributes } from "./attributes";
import type { JSX } from "..";

type Target = "_self" | "_blank" | "_parent" | "_top";

declare global {
    namespace JSX {
        type Element = JSX;
        type IntrinsicElements = {
            [key: string]: Attributes;
        } & {
            div: Attributes;
            ul: Attributes;
            ol: Attributes;
            li: Attributes;
            br: Attributes;
            button: Attributes;
            a: Attributes<{
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
            input: Attributes<{
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
            form: Attributes<{
                "accept-charset": "UTF-8";
                autocomplete: "off" | "on";
                name: string;
                enctype: "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain";
                method: "post" | "get" | "dalog";
                target: Target | "_unfencedTop";
            }>;
            iframe: Attributes<{
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
