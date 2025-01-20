import { defineProxyService } from "@webext-core/proxy-service";
import type { FaviconInfo } from "./types";
import type { ExtensionDatabase } from "./database";

export interface FaviconInfoService {
    get(id: string): Promise<FaviconInfo | undefined>;
    create(info: FaviconInfo): Promise<void>;
}

function createFavIconService(_db: Promise<ExtensionDatabase>): FaviconInfoService {
    return {
        async create(info: FaviconInfo) {
            const db = await _db;

            await db.add("favicons", info)
        },
        async get(hostname: string) {
            const db = await _db;

            return await db.get("favicons", hostname)
        },
    }
}

export const [registerFavIconService, getFavIconService] = defineProxyService(
    "favicon-service",
    createFavIconService,
);