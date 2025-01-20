import { defineProxyService } from "@webext-core/proxy-service";
import type { PageView } from "./types";
import type { ExtensionDatabase } from "./database";

export interface PageViewService {
    get(id: string): Promise<PageView | undefined>;
    create(info: PageView): Promise<void>;
}

function createPageViewService(_db: Promise<ExtensionDatabase>): PageViewService {
    return {
        async create(info: PageView) {
            const db = await _db;
            
            await db.add("pageviews", info)
        },
        async get(id: string) {
            const db = await _db;

            return await db.get("pageviews", id)
        },
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