type TimeData = {
    appId: string
    favIconUrl: string
    timeSpent: number
    sessions: number
    percentage: number
}

type TimeLimitInput = {
    id: string
    active: boolean
    apps: string[]
    type: string
    startTime: string;
    endTime: string;
    days: string[];
    name: string;
    coolDownPeriod: number
    limitPeriod: number
}

type Watch = {
    appId: string;
    faviconUrl: string;
    id: string;
    startedAt: number;
    endedAt: number;
}

type ServiceResponse<T> = {
    data: T,
    status: "success" | "error",
    message: string
}

// const url = browser.runtime.getURL('./../background/index.html');
// console.log(url)

document.addEventListener('DOMContentLoaded', async () => {
    const dashboardLink = document.getElementById("dashboard-link")
    dashboardLink?.addEventListener("click", async () => {
        const response = await browser.runtime.sendMessage({ type: "openDashboard", timestamp: Date.now() })
    })

    browser.alarms.onAlarm.addListener(async (alarm) => {
        if (alarm.name === 'checkTimeLimits') {
            const timeList = document.getElementById('time-list') as HTMLElement
            timeList.innerHTML = ""
            
            const response = await browser.runtime.sendMessage({ type: "getTimeData", timestamp: Date.now() }) as ServiceResponse<TimeData[]>
           
            if(response.status !== "success") return
            if(!!response)
            response.data.map(async (timeData) => {
                timeList.innerHTML += `
                    <div class="px-4 rounded-md ring-base-300 group">
                        <div class="flex flex-row py-2 items-center relative">
                            <div class="mr-4 flex-shrink-0 w-10 h-10">
                                <div class="bg-base-content bg-opacity-15 rounded-full p-2 relative">
                                    ${!!timeData.favIconUrl ? `<img src="${timeData.favIconUrl}" alt="Google"
                                        class="w-6 h-6">`: ""}
                                    
                                </div>
                            </div>
                            <div class="flex-1 flex flex-col min-w-0">
                                <div class="flex flex-row space-x-4 justify-between items-end">
                                    <span class="font-medium text-lg text-base-content text-opacity-80 truncate">
                                        ${timeData.appId}
                                    </span>
                                    <p class="font-mono text-opacity-80 text-base-content pb-0.5 text-sm flex-shrink-0">${convertMillisecondsToHHMMSS(timeData.timeSpent)}</p>
                                </div>

                                <div class="flex flex-row space-x-2 items-center">
                                    <div class="relative h-1 flex-1 bg-black bg-opacity-15 dark:bg-opacity-30 rounded-sm flex">
                                        <div class="flex-shrink-0 flex-grow-0 rounded-sm transition-all ease-linear bg-secondary mr-0.5 h-full" style="background-color: rgb(197, 166, 253); width: ${timeData.percentage}%;"></div>
                                    </div>
                                    <p class="text-opacity-[0.7] transition-opacity font-mono w-9 text-right text-sm">
                                        ${timeData.percentage}%
                                    </p>
                                </div>

                                <p class="flex items-center gap-2 text-base-content text-opacity-[0.7] text-xs">
                                    <span>${timeData.sessions} sessions</span>
                                </p>
                            </div>
                        </div>
                    </div>
                `
            })

        }
    })

    const tabs = document.querySelectorAll('.tab')
    const tabPanes = document.querySelectorAll('.tab-pane')
    tabs.forEach((tab) => {
        tab.addEventListener('click', (e) => {
            tabPanes.forEach((tabPane, i) => {
                tabPane.classList.remove('active')
                tabs[i].classList.remove('tab-active')
            })
            const tabPane = document.querySelector(`#${tab.id}.tab-pane`) as HTMLElement
            tabPane.classList.add('active')
            tab.classList.add('tab-active')
        })
    })

    const startBtn = document.getElementById("start-btn")
    if (!startBtn) return

    var timing: NodeJS.Timeout

    startBtn.addEventListener("click", async () => {
        if(startBtn.innerText === "Start"){
            await browser.runtime.sendMessage({ type: "startStopWatch", timestamp: Date.now() })
        }
        if (startBtn.innerText === "Play" || startBtn.innerText === "Start") {
            startBtn.innerText = "Pause"
            
            timing = setInterval(async() => {
                const response = await browser.runtime.sendMessage({ type: "checkStopWatch", timestamp: Date.now() }) as ServiceResponse<Watch>
                const duration = convertMsToHHMMSSObj(response.data.endedAt - response.data.startedAt)
                const hours = document.getElementById("hours") as HTMLHeadingElement
                const minutes = document.getElementById("minutes") as HTMLHeadingElement
                const seconds = document.getElementById("seconds") as HTMLHeadingElement
                if (!hours && !minutes && !seconds) return
                hours.innerText = duration.hours
                minutes.innerText = duration.minutes
                seconds.innerText = duration.seconds
                
            }, 1000)
        } else if (startBtn.innerText === "Pause") {
            startBtn.innerText = "Play"
            clearInterval(timing)
            await browser.runtime.sendMessage({ type: "pauseStopWatch", timestamp: Date.now() })
        }
    })

    const stopBtn = document.getElementById("stop-btn")
    if (!stopBtn) return

    stopBtn.addEventListener("click", async () => {
        if (stopBtn.innerText === "Stop") {
            stopBtn.innerText = "Reset"
            startBtn.innerText = "Resume"
            clearInterval(timing)
            browser.runtime.sendMessage({ type: "startStopWatch", timestamp: Date.now() })
        } else if (stopBtn.innerText === "Reset") {
            stopBtn.innerText = "Stop"
            startBtn.innerText = "Start"
            
            const hours = document.getElementById("hours") as HTMLHeadingElement
            const minutes = document.getElementById("minutes") as HTMLHeadingElement
            const seconds = document.getElementById("seconds") as HTMLHeadingElement
            if (!hours && !minutes && !seconds) return
            hours.innerText = "00"
            minutes.innerText = "00"
            seconds.innerText = "00"
        }
    })
})

function convertMillisecondsToHHMMSS(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

function convertMsToHHMMSSObj(milliseconds: number): {
    hours: string,
    minutes: string
    seconds: string
} {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return {
        hours: formattedHours,
        minutes: formattedMinutes,
        seconds: formattedSeconds
    }
}

const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
};