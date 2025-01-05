import { defineProxyService } from "@webext-core/proxy-service";
import type { Watch } from "./types";
import type { ExtensionDatabase } from "./database";

export interface WatchService {
    getAll(): Promise<Watch[]>;
    get(hostname: string): Promise<Watch | undefined>;
    create(info: Watch): Promise<void>;
    update(info: Watch): Promise<void>;
}

function createWatchService(_db: Promise<ExtensionDatabase>): WatchService {
    return {
        async getAll() {
            const db = await _db;
            return await db.getAll("watches");
        },
        async get(hostname: string) {
            const db = await _db;
            return await db.get("watches", hostname);
        },
        async create(info) {
            const db = await _db;
            await db.add("watches", info);
        },
        async update(info) {
            const db = await _db;
            await db.put("watches", info);
        },
    };
}

export const [registerWatchService, getWatchService] = defineProxyService(
    "watch-service",
    createWatchService,
);