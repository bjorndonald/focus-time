import './../../assets/output.css'
import ReactDOM from "react-dom/client";
import App from "./App";

async function checkTimeLimitExceeded() {
    const url = new URL(window.location.href).hostname
    const { timeData, timeLimits } = await browser.storage.local.get(['timeData', 'timeLimits']) as { timeData: Record<string, number>, timeLimits: Record<string, number> }

    if (timeLimits && timeLimits[url] && timeData && timeData[url] > timeLimits[url]) {
        document.body.innerHTML = `
      <div style="text-align: center; padding: 50px;">
        <h1>Time Limit Exceeded</h1>
        <p>You've reached your time limit for ${url}.</p>
        <p>Take a break and come back later!</p>
      </div>
    `
    }
}

interface TimeData {
    [key: string]: number
}

var timeData: TimeData
var timeLimits: TimeData

export default defineContentScript({
    matches: ["*://*/*"],
    cssInjectionMode: "ui",

    async main(ctx) {
        const timer = document.createElement("div");
        timer.id = "focus-timer-root";
        timer.style.position = "fixed";
        timer.style.top = "16px";
        timer.style.right = "16px";
        timer.style.zIndex = "999999999";
        timer.style.maxWidth = "400px";
        document.body.appendChild(timer);
        const root = ReactDOM.createRoot(timer);
        root.render(<App />);

        browser.runtime.onMessage.addListener(async (message) => {
            console.log("message", message)
            const time = message.timeData
            
            const timeInfo = convertMillisecondsToHHMMSS(time)
            const hours = document.getElementById("hours") as HTMLHeadingElement
            const minutes = document.getElementById("minutes") as HTMLHeadingElement
            const seconds = document.getElementById("seconds") as HTMLHeadingElement
            if (!hours && !minutes && !seconds) return
            hours.innerText = timeInfo.hours
            minutes.innerText = timeInfo.minutes
            seconds.innerText = timeInfo.seconds

            return Math.random(); 
        });

        let isDragging = false; // Flag to check if dragging
        let offsetX: number, offsetY: number;

        // Mouse down: Start dragging
        timer.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - timer.offsetLeft;
            offsetY = e.clientY - timer.offsetTop;
            timer.style.cursor = 'grabbing';
        });

        // Mouse move: Drag element
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;
                timer.style.left = `${x}px`;
                timer.style.top = `${y}px`;
            }
        });

        // Mouse up: Stop dragging
        document.addEventListener('mouseup', () => {
            isDragging = false;
            timer.style.cursor = 'grab';
        });

        // Optional: Add touch support for mobile devices
        timer.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            isDragging = true;
            offsetX = touch.clientX - timer.offsetLeft;
            offsetY = touch.clientY - timer.offsetTop;
        });

        document.addEventListener('touchmove', (e) => {
            if (isDragging) {
                const touch = e.touches[0];
                const x = touch.clientX - offsetX;
                const y = touch.clientY - offsetY;
                timer.style.left = `${x}px`;
                timer.style.top = `${y}px`;
            }
        });

        document.addEventListener('touchend', () => {
            isDragging = false;
        });
        setInterval(() => {
            checkTimeLimitExceeded()
        }, 200);


        const ui = await createShadowRootUi(ctx, {
            name: "focus-timer",
            position: "modal",

            anchor: "body",
            append: "first",
            onMount: (container) => {
                const wrapper = document.createElement("div");
                container.append(wrapper);

                const root = ReactDOM.createRoot(wrapper);
                root.render(<App />);
                return { root, wrapper };
            },
            onRemove: (elements) => {
                elements?.root.unmount();
                elements?.wrapper.remove();
            },
        });

        ui.mount();
    },
});

function convertMillisecondsToHHMMSS(milliseconds: number): { hours: string, minutes: string, seconds: string } {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return ({
        hours: formattedHours,
        minutes: formattedMinutes,
        seconds: formattedSeconds
    });
}