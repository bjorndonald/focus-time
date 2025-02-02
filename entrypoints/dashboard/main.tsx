import { createRoot } from "react-dom/client";
import App from "./App";

declare const closeBtn: HTMLButtonElement;

closeBtn.onclick = () => {
    window.close();
};

const app = document.getElementById("app") as HTMLElement
const root = createRoot(app)

root.render(
    <App />
)