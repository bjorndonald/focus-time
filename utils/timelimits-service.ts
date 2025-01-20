import { defineProxyService } from "@webext-core/proxy-service";
import type { TimeLimits } from "./types";
import type { ExtensionDatabase } from "./database";

export interface TimeLimitsService {
    getAll(): Promise<TimeLimits[]>;
    get(hostname: string): Promise<TimeLimits | undefined>;
    create(info: TimeLimits): Promise<void>;
    update(info: TimeLimits): Promise<void>;
    delete(hostname: string): Promise<void>
}

function createTimeLimitsService(_db: Promise<ExtensionDatabase>): TimeLimitsService {
    return {
        async getAll() {
            const db = await _db;
            return await db.getAll("timelimits");
        },
        async get(hostname: string) {
            const db = await _db;
            return await db.get("timelimits", hostname);
        },
        async create(info) {
            const db = await _db;
            await db.add("timelimits", info);
        },
        async update(info) {
            const db = await _db;
            await db.put("timelimits", info);
        },
        async delete(hostname: string) {
            const db = await _db;
            await db.delete("timelimits", hostname);
        },
    };
}

export const [registerTimeLimitsService, getTimeLimitsService] = defineProxyService(
    "timelimits-service",
    createTimeLimitsService,
);