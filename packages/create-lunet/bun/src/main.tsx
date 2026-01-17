import { createRoot, h } from "lunet";
import { App } from "./App";

const root = createRoot(document.getElementById("root")!);

root.render(<App />);
