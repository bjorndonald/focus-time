import { openExtensionDatabase } from '@/utils/database';
import { registerPageViewService } from '@/utils/pageview-service';
import { registerWatchService } from '@/utils/watch-service';
import { registerSessionService } from '@/utils/session-service';
import { Tabs } from 'wxt/browser';
import { storage } from 'wxt/storage'

export default defineBackground(() => {
    const db = openExtensionDatabase();
    var sessionId = ""
    const pageViewService = registerPageViewService(db)
    const sessionService = registerSessionService(db)
    const watchService = registerWatchService(db)

    browser.tabs.onActivated.addListener(async (activeInfo) => {
        const tab = await browser.tabs.get(activeInfo.tabId)
        createPageView(tab)
        createSession(tab)
    })

    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.status === 'complete') {
            createPageView(tab)
            createSession(tab)
        }
    })

    async function createPageView(tab: Tabs.Tab) {
        const url = tab.url ?? tab.pendingUrl;
        const faviconUrl = tab.favIconUrl;
        if (!url || !faviconUrl) return;

        const hostname = new URL(url).hostname;

        await pageViewService.create({
            id: crypto.randomUUID(),
            appId: hostname,
            createdBy: "bjorn",
            startedAt: Date.now(),
            endedAt: Date.now(),
            faviconUrl,
            path: new URL(url).pathname,
            query: new URL(url).search,
            referrer: new URL(url).origin
        })
        sessionId = crypto.randomUUID()
        await sessionService.create({
            id: sessionId,
            appId: hostname,
            createdBy: "bjorn",
            startedAt: Date.now(),
            endedAt: Date.now(),
        }) 
    }

    async function createSession(tab: Tabs.Tab) {
        const url = tab.url ?? tab.pendingUrl;
        if (!url) return;

        const hostname = new URL(url).hostname;
        sessionId = crypto.randomUUID()
        await sessionService.create({
            id: sessionId,
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
        sessionId = crypto.randomUUID()
        await sessionService.create({
            id: sessionId,
            appId: hostname,
            createdBy: "bjorn",
            startedAt: Date.now(),
            endedAt: Date.now(),
        })
    }

    browser.alarms.create('checkTimeLimits', { periodInMinutes: 1 / 60 })

    browser.alarms.onAlarm.addListener(async (alarm) => {
        if (alarm.name === 'checkTimeLimits') {
            const allTabs = await browser.tabs.query({});
            for (const tab of allTabs) {
                if (tab.active) {
                    
                    
                }
            }
        }
    })

    // async function updateTimeData(tab: Tabs.Tab) {
    //     const endTime = Date.now()
    //     const url = tab.url ?? tab.pendingUrl;
    //     const faviconUrl = tab.favIconUrl;
    //     if (!url || !faviconUrl) return;

    //     const hostname = new URL(url).hostname;

    //     const timeData = await timedataService.getLast(hostname);
    //     if (!timeData) return
    //     const lastData = await timedataService.getFirstOfDay(formatDate(new Date()), hostname);
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
    //         day: formatDate(new Date()),
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
    //         const timeDataList = await timedataService.getAllByDay(formatDate(new Date()))
            
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