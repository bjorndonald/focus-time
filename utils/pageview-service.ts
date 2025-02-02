import { defineProxyService } from "@webext-core/proxy-service";
import type { PageView } from "./types";
import type { ExtensionDatabase } from "./database";

export interface PageViewService {
    get(id: string): Promise<PageView | undefined>;
    create(info: PageView): Promise<void>;
    getByAppId(appId: string): Promise<PageView | undefined>;
    getCountByAppId(appId: string): Promise<number>;
    getAllToday(day: number): Promise<PageView[] | undefined>;
}

function createPageViewService(_db: Promise<ExtensionDatabase>): PageViewService {
    return {
        async create(info: PageView) {
            const db = await _db;
            const o = await db.put("pageviews", info)
        },
        async getByAppId(appId: string) {
            const db = await _db;
            const transaction = db.transaction("pageviews", "readonly");
            const objectStore = transaction.objectStore("pageviews");
            var results = await objectStore.get(IDBKeyRange.only(appId))
            var result: PageView | undefined = undefined
            
            var index = objectStore.index("idx_page_views_app_id")
            var cursor = await index.openKeyCursor(appId, "prev")
            if(!!cursor?.key){
                result = await index.get(cursor?.key)
            }
            return result
        },
        async get(id: string) {
            const db = await _db;

            return await db.get("pageviews", id)
        },
        async getAllToday(day: number) {
            const db = await _db;
            const transaction = db.transaction("pageviews", "readonly");
            const objectStore = transaction.objectStore("pageviews");
            const index = objectStore.index("idx_page_views_startedAt")
            return await index.getAll(IDBKeyRange.bound(day - 1, Date.now(), true, true))
        },
        async getCountByAppId(appId: string) {
            const db = await _db;
            const transaction = db.transaction("pageviews", "readonly");
            const objectStore = transaction.objectStore("pageviews");
            const index = objectStore.index("idx_page_views_app_id");
            const count = await index.count(appId);

            return count;
        }
        // async getAllByDay(day: string) {
        //     const db = await _db;
        //     const timeDataArr = await db.getAll("timedata")
        //     const dayData = timeDataArr.filter((timeData) => timeData.day === day)

        //     return dayData; 
        // },
        // async getFirstOfDay(day: string, hostname: string) {
        //     const db = await _db;
        //     const timeDataArr = await db.getAll("timedata")
        //     timeDataArr.filter((timeData) => timeData.day === day && timeData.hostname === hostname)
        //     return await timeDataArr[0];
        // },
        // async getLast(hostname) {
        //     const db = await _db;
        //     const timeDataArr = await db.getAll("timedata");
        //     const data = timeDataArr.filter((timeData) => timeData.hostname === hostname)
        //     return data[data.length - 1];
        // },
        // async get(hostname: string, day: string) { 
        //     const db = await _db;
        //     const list = await db.getAll("timedata")
        //     const filtered = list.filter((timeData) => timeData.day === day && timeData.hostname === hostname)
        //     return filtered[0];
        // },
        // async create(info) {
        //     const db = await _db;

        //     if(await db.get("timedata", info.hostname)) {
        //         const response = await db.put("timedata", info);
        //         console.log(response)
        //     } else {
        //         const response = await db.add("timedata", info);
        //         console.log(response)
        //     }
        // },

        // async update(info) {
        //     const db = await _db;
        //     await db.put("timedata", info);
        // },
    };
}

export const [registerPageViewService, getPageViewService] = defineProxyService(
    "pageview-service",
    createPageViewService,
);