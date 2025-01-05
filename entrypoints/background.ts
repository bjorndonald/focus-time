import { openExtensionDatabase } from '@/utils/database';
import { registerTimedataService } from '@/utils/timedata-service';
import { Tabs } from 'wxt/browser';
import { storage } from 'wxt/storage'

interface TimeData {
    [key: string]: number
}

let currentUrl: string | null = null
let startTime: number | null = null

export default defineBackground(() => {
    const db = openExtensionDatabase();
    const timedataService = registerTimedataService(db)
    browser.tabs.onActivated.addListener(async (activeInfo) => {
        const tab = await browser.tabs.get(activeInfo.tabId)
        console.log("activate", tab.url)
        updateTimeTracking(tab.url || '', activeInfo.tabId)
       
        createTimeData(tab)
        
    })

    async function updateTimeData(tab: Tabs.Tab) {

        const endTime = Date.now()

        

        const url = tab.url ?? tab.pendingUrl;
        const faviconUrl = tab.favIconUrl;
        if (!url || !faviconUrl) return;

        const hostname = new URL(url).hostname;

        const timeData = await timedataService.getLast(hostname);
        if (!timeData) return
        const lastData = await timedataService.getFirstOfDay(formatDate(new Date()), hostname);
        if (!lastData) return

        const timeSpent = endTime - (startTime || endTime)

        await timedataService.update({
            ...timeData,
            updated_at: Date.now(),
            timeSpent: timeData.timeSpent + timeSpent,
            session: timeData.session
        })

    }

    async function createTimeData(tab: Tabs.Tab) {
        const url = tab.url ?? tab.pendingUrl;
        const faviconUrl = tab.favIconUrl;
        if (!url || !faviconUrl) return;

        const hostname = new URL(url).hostname;
        console.log(hostname)

        const timeData = await timedataService.getLast(hostname);
        console.log(timeData)
        const timeSpent = Date.now() - (startTime || Date.now())
        await timedataService.create({
            created_at: Date.now(),
            updated_at: Date.now(),
            hostname,
            day: formatDate(new Date()),
            faviconUrl,
            session: timeData ? timeData.session + 1: 0,
            timeSpent: timeData ? timeData.timeSpent + timeSpent : timeSpent,
        })
        startTime = Date.now()
    }

    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.status === 'complete') {
            console.log("update", tab.url)
            updateTimeTracking(tab.url || '', tabId)
            createTimeData(tab)
        }
    })

    async function updateTimeTracking(url: string, tabId: number) {
        if (currentUrl) {
            const endTime = Date.now()

            const timeSpent = endTime - (startTime || endTime)

            await updateStoredTime(currentUrl, timeSpent, tabId)
        }
        if (!url.startsWith('http')) return
        currentUrl = new URL(url).hostname
        startTime = Date.now()
    }

    async function updateStoredTime(url: string, timeSpent: number, tabId: number) {
        const storedData = await storage.getItem('local:timeData') as { timeData: TimeData }
        const timeData = storedData?.timeData || {}
        timeData[url] = (timeData[url] || 0) + timeSpent
        await storage.setItem("local:timeData", { timeData })

        const storedLimits = await storage.getItem('local:timeLimits') as { timeLimits: TimeData }
        const timeLimits = storedLimits?.timeLimits || {}
        timeLimits[url] = timeLimits[url] ? timeLimits[url] - timeSpent > 0 ? timeLimits[url] - timeSpent : 0 : 0
        await storage.setItem("local:timeLimits", { timeLimits })

        browser.tabs.sendMessage(tabId, { timeData: timeData[url], timeLimits: timeLimits[url] },);
    }

    // Check time limits every minute
    browser.alarms.create('checkTimeLimits', { periodInMinutes: 1 / 60 })

    browser.alarms.onAlarm.addListener(async (alarm) => {
        if (alarm.name === 'checkTimeLimits') {
            const timeData = await storage.getItem('local:timeData') as TimeData
            const timeLimits = await storage.getItem('local:timeLimits') as TimeData
            const allTabs = await browser.tabs.query({});
            allTabs.map(async (tab) => {
                if (tab.active)
                    updateTimeData(tab)
            })

            if (!timeData || !timeLimits) return
            for (const [url, timeSpent] of Object.entries(timeData)) {

                if (timeLimits && timeLimits[url] && timeSpent > timeLimits[url]) {
                    // Send notification or take action when time limit is exceeded

                    browser.notifications.create({
                        type: 'basic',
                        iconUrl: 'icon.png',
                        title: 'Time Limit Exceeded',
                        message: `You've exceeded your time limit for ${url}`
                    })
                }
            }
        }
    })


});

const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
};