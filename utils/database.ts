import { DBSchema, IDBPDatabase, openDB } from "idb";
import { SessionData, PageView, TimeLimits, Watch } from "./types";

interface ExtensionDatabaseSchema extends DBSchema {
   pageviews: {
        key: string;
       value: PageView;
        indexes: {
            'idx_page_views_startedAt': number;
            'idx_page_views_endedAt': number;
        }
    },
    sessiondata: {
        key: string;
        value: SessionData;
        indexes: {
            'idx_session_startedAt': number;
            'idx_session_endedAt': number;
        };
    },
    timelimits: {
        key: string;
        value: TimeLimits;
        
    };
    watches: {
        key: string;
        value: Watch;
        indexes: {
            'idx_watches_startedAt': number;
            'idx_watches_endedAt': number;
        };
    }
}

export type ExtensionDatabase = IDBPDatabase<ExtensionDatabaseSchema>;

export function openExtensionDatabase(): Promise<ExtensionDatabase> {
    return openDB<ExtensionDatabaseSchema>("time-database", 1, {
        upgrade(database) {
            const pageviews = database.createObjectStore("pageviews", { keyPath: "id" });
            pageviews.createIndex("idx_page_views_endedAt", "endedAt")
            pageviews.createIndex("idx_page_views_startedAt", "startedAt")

            const sessiondata = database.createObjectStore("sessiondata", { keyPath: "id" });
            sessiondata.createIndex("idx_session_endedAt", "endedAt")
            sessiondata.createIndex("idx_session_startedAt", "startedAt")
    
            database.createObjectStore("timelimits", { keyPath: "id" });
            const watches = database.createObjectStore("watches", { keyPath: "id" });
            watches.createIndex("idx_watches_endedAt", "endedAt")
            watches.createIndex("idx_watches_startedAt", "startedAt")
        },
    });
}