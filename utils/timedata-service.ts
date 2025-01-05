import { defineProxyService } from "@webext-core/proxy-service";
import type { TimeData } from "./types";
import type { ExtensionDatabase } from "./database";

export interface TimeDataService {
    getAll(): Promise<TimeData[]>;
    getLast(hostname: string): Promise<TimeData | undefined>;
    getAllByDay(day: string): Promise<TimeData[]>;
    getFirstOfDay(day: string, hostname: string): Promise<TimeData | undefined>;
    get(hostname: string): Promise<TimeData | undefined>;
    create(info: TimeData): Promise<void>;
    update(info: TimeData): Promise<void>;
}

function createTimedataService(_db: Promise<ExtensionDatabase>): TimeDataService {
    return {
        async getAll() {
            const db = await _db;
            return await db.getAll("timedata");
        },
        async getAllByDay(day: string) {
            const db = await _db;
            return await db.getAllFromIndex("timedata", "by-day", day);
        },
        async getFirstOfDay(day: string, hostname: string) {
            const db = await _db;
            const timeDataArr = await db.getAllFromIndex("timedata", "by-day", day)
            timeDataArr.filter((timeData) => timeData.hostname === hostname)
            return await timeDataArr[0];
        },
        async getLast(hostname) {
            const db = await _db;
            const timeDataArr = await db.getAll("timedata", hostname);
            return timeDataArr[timeDataArr.length - 1];
        },
        async get(hostname: string) {
            const db = await _db;
            return await db.get("timedata", hostname);
        },
        async create(info) {
            const db = await _db;
            console.log(info)
            if(await db.get("timedata", info.hostname)) {
                const response = await db.put("timedata", info);
                console.log(response)
            } else{
                const response = await db.add("timedata", info);
                console.log(response)
            }
            
        },
        async update(info) {
            const db = await _db;
            await db.put("timedata", info);
        },
    };
}

export const [registerTimedataService, getTimedataService] = defineProxyService(
    "timedata-service",
    createTimedataService,
);