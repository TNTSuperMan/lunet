import { plugin } from "bun";
import index from "./index.html";
import { bun_lunet } from "lunet-transpiler";

plugin(bun_lunet());

export default {
    routes: {
        "/": index
    },
    fetch() {
        return new Response("404 Not Found", {
            status: 404,
            statusText: "Not Found"
        });
    }
}
