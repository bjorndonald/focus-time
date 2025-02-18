import { createRoot } from "react-dom/client";
import App from "./App";
import { convertMsToHHMMSSObj, convertMillisecondsToHHMMSS } from './utils/func'

const app = document.getElementById("app") as HTMLElement
const root = createRoot(app)

root.render(
    <App />
)

