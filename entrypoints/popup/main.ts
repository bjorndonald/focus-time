import moment from 'moment'
document.addEventListener('DOMContentLoaded', async () => {
    const timedataService = getTimedataService();
    browser.alarms.onAlarm.addListener(async (alarm) => {
        if (alarm.name === 'checkTimeLimits') {
            const timeList = document.getElementById('time-list') as HTMLElement
            timeList.innerHTML = ""
            const timeDatas = await timedataService.getAllByDay(formatDate(new Date()))
            timeDatas.map(async (timeData) => {

                timeList.innerHTML += `
                    <div class="px-4 rounded-md ring-base-300 group">
                        <div class="flex flex-row py-2 items-center relative">
                            <div class="mr-4 flex-shrink-0 w-10 h-10">
                                <div class="bg-base-content bg-opacity-15 rounded-full p-2 relative">
                                    <img src="${timeData.faviconUrl}" alt="Google"
                                        class="w-6 h-6">
                                </div>
                            </div>
                            <div class="flex-1 flex flex-col min-w-0">
                                <div class="flex flex-row space-x-4 justify-between items-end">
                                    <span class="font-medium text-lg text-base-content text-opacity-80 truncate">
                                        ${timeData.hostname}
                                    </span>
                                    <p class="font-mono text-opacity-80 text-base-content pb-0.5 text-sm flex-shrink-0">${convertMillisecondsToHHMMSS(timeData.timeSpent)}</p>
                                </div>

                                <div class="flex flex-row space-x-2 items-center">
                                    <div class="relative h-1 flex-1 bg-black bg-opacity-15 dark:bg-opacity-30 rounded-sm flex">
                                        <div class="flex-shrink-0 flex-grow-0 rounded-sm transition-all ease-linear bg-secondary mr-0.5 h-full" style="background-color: rgb(197, 166, 253); width: 22.9258%;"></div>
                                    </div>
                                    <p class="text-opacity-[0.7] transition-opacity font-mono w-9 text-right text-sm">
                                        ${((timeData.timeSpent / timeDatas.reduce((a, b) => a + b.timeSpent, 0)) * 100).toFixed(1)}%
                                    </p>
                                </div>

                                <p class="flex items-center gap-2 text-base-content text-opacity-[0.7] text-xs">
                                    <span>${timeData.session} sessions</span>
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

    const limitForm = document.getElementById('limit-form') as HTMLFormElement
    limitForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        const urlInput = document.getElementById('url-input') as HTMLInputElement
        const timeInput = document.getElementById('time-input') as HTMLInputElement
        const url = urlInput.value
        const time = parseInt(timeInput.value) * 60000

        urlInput.value = ''
        timeInput.value = ''
        alert('Time limit set successfully!')
    })

    const startBtn = document.getElementById("start-btn")
    if (!startBtn) return

    var startTime: number
    var timing: NodeJS.Timeout

    startBtn.addEventListener("click", async () => {
        console.log("dksndkjn")
        console.log(startBtn.innerText)
        if(startBtn.innerText === "Start")
            startTime = Date.now()
        if (startBtn.innerText === "Play" || startBtn.innerText === "Start") {
            startBtn.innerText = "Pause"
            
            browser.runtime.sendMessage({ type: "startStopWatch", time: Date.now() - startTime, startTime })
            timing = setInterval(() => {
                const duration = convertMsToHHMMSSObj(Date.now() - startTime)
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
            browser.runtime.sendMessage({ type: "pauseStopWatch", time: Date.now() - startTime, startTime })
        }
    })

    const stopBtn = document.getElementById("stop-btn")
    if (!stopBtn) return

    stopBtn.addEventListener("click", async () => {
        if (stopBtn.innerText === "Stop") {
            stopBtn.innerText = "Reset"
            startBtn.innerText = "Resume"
            clearInterval(timing)
            browser.runtime.sendMessage({ type: "stopStopWatch", time: Date.now() - startTime, startTime })
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