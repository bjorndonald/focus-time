import { openExtensionDatabase } from '@/utils/database';
import { registerPageViewService } from '@/utils/pageview-service';
import { registerWatchService } from '@/utils/watch-service';
import { registerSessionService } from '@/utils/session-service';
import { Tabs } from 'wxt/browser';
import { storage } from 'wxt/storage'
import { registerFavIconService } from '@/utils/favicon-service';

type TimeData = {
    appId: string
    favIconUrl: string
    timeSpent: number
    sessions: number
    percentage: number
}

type TimeLimitInput = {
    id?: string
    url: string
    time: number
}

export default defineBackground(() => {
    const db = openExtensionDatabase();
    var sessionId = ""
    var watchId = ""
    const pageViewService = registerPageViewService(db)
    const sessionService = registerSessionService(db)
    const watchService = registerWatchService(db)
    const faviconService = registerFavIconService(db)
    const timeLimitService = registerTimeLimitsService(db)

    browser.alarms.create('checkTimeLimits', { periodInMinutes: 1 / 60 })

    browser.tabs.onActivated.addListener(async (activeInfo) => {
        browser.alarms.onAlarm.removeListener(() => { })
        const tab = await browser.tabs.get(activeInfo.tabId)
        createPageView(tab)
        createSession(tab)
        console.log("activated")
        browser.alarms.onAlarm.addListener(async (alarm) => {
            if (alarm.name === 'checkTimeLimits') {
                if (tab.active) {
                    console.log("activated", tab.url)
                    updateSession(tab)
                }
            }
        })
    })

    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.status === 'complete') {
            browser.alarms.onAlarm.removeListener(() => { })
            createPageView(tab)
            createSession(tab)
            browser.alarms.onAlarm.addListener(async (alarm) => {
                if (alarm.name === 'checkTimeLimits') {
                    if (tab.active) {
                       updateSession(tab)
                    }
                }
            })
        }
    })

    async function createPageView(tab: Tabs.Tab) {
        const url = tab.url ?? tab.pendingUrl;
        console.log(url)
        const faviconUrl = tab.favIconUrl;
        console.log(faviconUrl)
        if (!url) return;

        const hostname = new URL(url).hostname;
        if(!!faviconUrl)
        await faviconService.create({
            faviconUrl,
            hostname
        })
        
        await pageViewService.create({
            id: crypto.randomUUID(),
            appId: hostname,
            day: new Date().setHours(0, 0, 0, 0),
            createdBy: "bjorn",
            startedAt: Date.now(),
            endedAt: Date.now(),
            faviconUrl: faviconUrl!,
            path: new URL(url).pathname,
            query: new URL(url).search,
            referrer: new URL(url).origin
        })
    }

    async function createSession(tab: Tabs.Tab) {
        const url = tab.url ?? tab.pendingUrl;
        console.log(url)
        const faviconUrl = tab.favIconUrl;
        console.log(faviconUrl)
        if (!url) return;
       
        const hostname = new URL(url).hostname;
        if (!!faviconUrl)
        await faviconService.create({
            faviconUrl,
            hostname
        })

        await sessionService.create({
            id: crypto.randomUUID(),
            faviconUrl: faviconUrl!,
            day: new Date().setHours(0, 0, 0, 0),
            appId: hostname,
            createdBy: "bjorn",
            startedAt: Date.now(),
            endedAt: Date.now(),
        })
    }

    async function updateSession(tab: Tabs.Tab) {
        const url = tab.url ?? tab.pendingUrl;
        if (!url) return;
        const hostname = new URL(url).hostname;
        const currentSession = await sessionService.getLast(new Date().setHours(0, 0, 0, 0))
        if (!currentSession) return

        await sessionService.update({
            id: currentSession.id,
            faviconUrl: currentSession.faviconUrl,
            day: new Date().setHours(0, 0, 0, 0),
            appId: hostname,
            createdBy: currentSession.createdBy,
            startedAt: currentSession.startedAt,
            endedAt: Date.now(),
        })
    }

    

    // browser.alarms.onAlarm.addListener(async (alarm) => {
    //     if (alarm.name === 'checkTimeLimits') {
    //         const allTabs = await browser.tabs.query({});
    //         for (const tab of allTabs) {
    //             if (tab.active) {
    //                 updateSession(tab)
    //                 break
    //             }
    //         }
    //     }
    // })

    const getTimeData = async () => {
        const allSessions = await sessionService.getAllToday(new Date().setHours(0, 0, 0, 0))
        if (!allSessions) return
        var timeDataList: TimeData[] = [] as TimeData[]
        allSessions.map((x) => {
            const timeData = timeDataList.find((y) => y.appId === x.appId)
            if (timeData) {
                timeData.timeSpent += x.endedAt - x.startedAt
                timeData.sessions++
            } else {
                timeDataList.push({
                    appId: x.appId,
                    favIconUrl: x.faviconUrl,
                    timeSpent: x.endedAt - x.startedAt,
                    sessions: 1,
                    percentage: 0
                })
            }
        })

        const total = timeDataList.reduce((a, b) => a + b.timeSpent, 0)

        timeDataList = timeDataList.map((x) => {
            return {
                ...x,
                percentage: (x.timeSpent / total) * 100
            }
        })

        return timeDataList
    }

    async function createStopWatch() {
        var currentTab: Tabs.Tab | undefined = undefined
        const allTabs = await browser.tabs.query({});
        for (const tab of allTabs) {
            if (tab.active) {
                currentTab = tab
                break
            }
        }
        if (!currentTab) return
        const url = currentTab.url ?? currentTab.pendingUrl;
        const faviconUrl = currentTab.favIconUrl;
        if (!url || !faviconUrl) return;

        const hostname = new URL(url).hostname;
        watchId = crypto.randomUUID()
        await watchService.create({
            appId: hostname,
            startedAt: Date.now(),
            endedAt: Date.now(),
            faviconUrl,
            id: watchId,
        })
    }

    browser.runtime.onMessage.addListener(async (message: {
        type: string,
        data: TimeLimitInput
    }) => {
        if (message.type == "startStopWatch") {
            await createStopWatch()
            return {
                status: "success", message: "Stopwatch started"
            }
        }

        if (message.type == "checkStopWatch") {
            if (!watchId.length) return {
                status: "error",
                message: "Stopwatch not started",
            }
            const stopwatch = await watchService.get(watchId)
            if (!stopwatch) return
            const newWatch = {
                appId: stopwatch.appId,
                faviconUrl: stopwatch.faviconUrl,
                id: watchId,
                startedAt: stopwatch.startedAt,
                endedAt: Date.now()
            }
            await watchService.update(newWatch)
            return {
                status: "success",
                message: "Stopwatch updated",
                data: newWatch
            }
        }

        if (message.type == "stopStopWatch") {
            watchId = ''
            return {
                status: "success", message: "Stopwatch started"
            }
        }

        if (message.type == "addTimeLimit") {
            const favicon = await faviconService.get(message.data.url)
            await timeLimitService.create({
                faviconUrl: favicon?.faviconUrl,
                hostname: message.data.url,
                id: crypto.randomUUID(),
                maxtime: message.data.time,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            })
            return {
                status: "success", message: "Time limit added"
            }
        }
        if (message.type == "editTimeLimit") {
            const timeLimit = await timeLimitService.get(message.data.url)
            if (!timeLimit) return {
                status: "error",
                message: "Time limit doesn't exist",
            }
            if (!timeLimit) return

            const favicon = await faviconService.get(message.data.url)
            await timeLimitService.update({
                faviconUrl: favicon?.faviconUrl,
                hostname: timeLimit.hostname,
                id: timeLimit.id,
                maxtime: message.data.time,
                createdAt: timeLimit.createdAt,
                updatedAt: Date.now(),
            })
            return {
                status: "success", message: "Time limit updated"
            }
        }
        if (message.type == "deleteTimeLimit") {
            await timeLimitService.delete(message.data.url)
            return {
                status: "success", message: "Time limit deleted"
            }
        }
        if (message.type == "getTimeData") {
            return {
                status: "success",
                message: "Time data retrieved",
                data: await getTimeData()
            }
        }

        return { status: "error", message: "Invalid message type" }
    })

    // async function updateTimeData(tab: Tabs.Tab) {
    //     const endTime = Date.now()
    //     const url = tab.url ?? tab.pendingUrl;
    //     const faviconUrl = tab.favIconUrl;
    //     if (!url || !faviconUrl) return;

    //     const hostname = new URL(url).hostname;

    //     const timeData = await timedataService.getLast(hostname);
    //     if (!timeData) return
    //     const lastData = await timedataService.getFirstOfDay(new Date().setHours(0,0,0,0), hostname);
    //     if (!lastData) return

    //     const timeSpent = endTime - (startTime || Date.now())

    //     await timedataService.update({ 
    //         ...timeData,
    //         updated_at: Date.now(),
    //         timeSpent: timeSpent,
    //         // session: timeData.session
    //     })
    //     browser.tabs.sendMessage(tab.id!,
    //         {
    //             timeData: timeSpent,
    //             timeLimits: 0
    //         });
    // }

    // async function createTimeData(tab: Tabs.Tab) {
    //     const url = tab.url ?? tab.pendingUrl;
    //     const faviconUrl = tab.favIconUrl;
    //     if (!url || !faviconUrl) return;

    //     const hostname = new URL(url).hostname;
    //     const timeSpent = Date.now() - (startTime || Date.now())
    //     await timedataService.create({
    //         created_at: Date.now(),
    //         updated_at: Date.now(),
    //         hostname,
    //         day: new Date().setHours(0,0,0,0),
    //         faviconUrl,
    //         timeSpent: timeSpent,
    //     })
    //     startTime = Date.now()
    // }



    // async function updateTimeTracking(url: string, tabId: number) {
    //     if (currentUrl) {
    //         const endTime = Date.now()

    //         const timeSpent = endTime - (startTime || endTime)

    //         await updateStoredTime(currentUrl, timeSpent, tabId)
    //     }
    //     if (!url.startsWith('http')) return
    //     currentUrl = new URL(url).hostname
    //     startTime = Date.now()
    // }

    // async function updateStoredTime(url: string, timeSpent: number, tabId: number) {
    //     const storedData = await storage.getItem('local:timeData') as { timeData: TimeData }
    //     const timeData = storedData?.timeData || {}
    //     timeData[url] = (timeData[url] || 0) + timeSpent
    //     await storage.setItem("local:timeData", { timeData })

    //     const storedLimits = await storage.getItem('local:timeLimits') as { timeLimits: TimeData }
    //     const timeLimits = storedLimits?.timeLimits || {}
    //     timeLimits[url] = timeLimits[url] ? timeLimits[url] - timeSpent > 0 ? timeLimits[url] - timeSpent : 0 : 0
    //     await storage.setItem("local:timeLimits", { timeLimits })

    //     browser.tabs.sendMessage(tabId, { timeData: timeData[url], timeLimits: timeLimits[url] },);
    // }

    // // Check time limits every minute
    // browser.alarms.create('checkTimeLimits', { periodInMinutes: 1 / 60 })

    // browser.alarms.onAlarm.addListener(async (alarm) => {
    //     if (alarm.name === 'checkTimeLimits') {
    //         const timeData = await storage.getItem('local:timeData') as TimeData
    //         const timeLimits = await storage.getItem('local:timeLimits') as TimeData
    //         const allTabs = await browser.tabs.query({});
    //         allTabs.map(async (tab) => {

    //             if (tab.active)
    //                 updateTimeData(tab)

    //         })

    //         if (!timeData || !timeLimits) return
    //         for (const [url, timeSpent] of Object.entries(timeData)) {

    //             if (timeLimits && timeLimits[url] && timeSpent > timeLimits[url]) {
    //                 // Send notification or take action when time limit is exceeded

    //                 browser.notifications.create({
    //                     type: 'basic',
    //                     iconUrl: 'icon.png',
    //                     title: 'Time Limit Exceeded',
    //                     message: `You've exceeded your time limit for ${url}`
    //                 })
    //             }
    //         }
    //     }
    // })

    // browser.runtime.onMessage.addListener(async (message: {
    //     type: string,
    //     timestamp: number
    // }) => {
    //     if (message.type == "startStopWatch"){
    //         stopWatchTime = message.timestamp
    //         timeSpent = 0
    //         return { timeSpent }
    //     }

    //     if (message.type == "pauseStopWatch") {
    //         timeSpent = new Date().getTime() - stopWatchTime
    //         return { timeSpent }
    //     }

    //     if (message.type == "checkStopWatch") {
    //         timeSpent = new Date().getTime() - stopWatchTime
    //         return { timeSpent }
    //     }

    //     if (message.type == "getTimeDataList") {
    //         const timeDataList = await timedataService.getAllByDay(new Date().setHours(0,0,0,0))

    //         return timeDataList
    //     }

    //     return { timeSpent }
    // })
});

const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
};