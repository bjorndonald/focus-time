import { defineProxyService } from "@webext-core/proxy-service";
import type { SessionData } from "./types";
import type { ExtensionDatabase } from "./database";

export interface SessionDataService {
    get(id: string): Promise<SessionData | undefined>;
        create(info: SessionData): Promise<void>;
        update(info: SessionData): Promise<void>;
}

function createSessionService(_db: Promise<ExtensionDatabase>): SessionDataService {
    return {
        async create(info: SessionData) {
            const db = await _db;

            await db.add("sessiondata", info)
        },
        async update(info: SessionData) {
            const db = await _db;
            

            await db.put("sessiondata", info)
        },
        async get(id: string) {
            const db = await _db;

            return await db.get("sessiondata", id)
        },
    }
}

export const [registerSessionService, getSessionService] = defineProxyService(
    "session-service",
    createSessionService,
);