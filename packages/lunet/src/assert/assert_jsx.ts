import type { JSXNode } from "../jsx";
import { LunetJSXAssertionError } from "./error";

export const assert_jsx = (condition: boolean, message: string, jsx: JSXNode) => {
    if (!condition && import.meta.env.NODE_ENV !== "production") {
        throw new LunetJSXAssertionError(message, jsx);
    }
}
