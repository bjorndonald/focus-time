import { defineProxyService } from "@webext-core/proxy-service";
import type { PageView } from "./types";
import type { ExtensionDatabase } from "./database";

export interface PageViewService {
    get(id: string): Promise<PageView | undefined>;
    create(info: PageView): Promise<void>;
    getByAppId(appId: string): Promise<PageView | undefined>;
    getCountByAppId(appId: string): Promise<number>;
    getAllToday(day: number): Promise<PageView[] | undefined>;
    getAllApps(): Promise<PageView[] | undefined>;
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
        },
        async getAllApps() {
            const db = await _db;
            const transaction = db.transaction("pageviews", "readonly");
            const objectStore = transaction.objectStore("pageviews");
            const index = objectStore.index("idx_page_views_app_id");
            const all = await index.getAll();
            const set = new Set<string>()
            const result: PageView[] = []
            all.map((x, i) => {
                if (!set.has(x.appId)){
                    result.push(x)
                }
                set.add(x.appId);
                
            })

            return result;
        }
    };
}

export const [registerPageViewService, getPageViewService] = defineProxyService(
    "pageview-service",
    createPageViewService,
);