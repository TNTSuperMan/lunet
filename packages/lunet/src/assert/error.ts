import type { JSXNode } from "../jsx";

export class LunetJSXAssertionError extends Error {
    constructor(message: string, jsx: JSXNode) {
        super(message, { cause: jsx });
        this.name = "LunetAssertionError";
    }
}
