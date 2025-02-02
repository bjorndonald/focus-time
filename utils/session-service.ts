import { defineProxyService } from "@webext-core/proxy-service";
import type { SessionData } from "./types";
import type { ExtensionDatabase } from "./database";

export interface SessionDataService {
    get(id: string): Promise<SessionData | undefined>;
    getLast(): Promise<SessionData | undefined>;
    getLastForAppId(appId: string): Promise<SessionData | undefined>;
    create(info: SessionData): Promise<void>;
    update(info: SessionData): Promise<void>;
    getAllToday(day: number): Promise<SessionData[] | undefined>;
}

export function createSessionService(_db: Promise<ExtensionDatabase>): SessionDataService {
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
        async getLast() {
            const db = await _db;
            
            const transaction = db.transaction("sessiondata", "readonly");
            const objectStore = transaction.objectStore("sessiondata");
            
            try {
                const cursorKeyRequest = await objectStore.openKeyCursor(null, "prev");
               
                if (!!cursorKeyRequest?.key){
                    // @ts-ignore
                    return await db.getFromIndex("sessiondata", "idx_session_startedAt", cursorKeyRequest?.key)
                }
                
            } catch (error) {
                console.error("Error while opening cursor:", error);
            }

            return undefined
        },
        async getLastForAppId(appId: string) {
            const db = await _db;
            const transaction = db.transaction("sessiondata", "readonly");
            const objectStore = transaction.objectStore("sessiondata");
            var result: SessionData | undefined = undefined
    
            while (true) {
                try {
                    const cursorKeyRequest = await objectStore.index("idx_session_app_id").openKeyCursor(null, "prev");
                    
                    if (!!cursorKeyRequest?.key) {
                        // @ts-ignore
                        if(cursorKeyRequest.key === appId){
                           
                            result = await db.getFromIndex("sessiondata", "idx_session_app_id", cursorKeyRequest?.key)
                            // @ts-ignore
                            break;  
                        } else {
                            cursorKeyRequest?.continue()
                        }
                    } else {
                        console.log("test")
                        break;
                    }
                } catch (error) {
                    
                    break;
                }
            }
            return result
        },
        async getAllToday(day: number) {
            const db = await _db;
            const transaction = db.transaction("sessiondata", "readonly");
            const objectStore = transaction.objectStore("sessiondata");

            return await objectStore.getAll(IDBKeyRange.bound(day, Date.now(), true, true))
        },
    }
}

export const [registerSessionService, getSessionService] = defineProxyService(
    "session-service",
    createSessionService,
);