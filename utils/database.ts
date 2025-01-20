import { DBSchema, IDBPDatabase, openDB } from "idb";
import { SessionData, PageView, TimeLimits, Watch } from "./types";

interface ExtensionDatabaseSchema extends DBSchema {
    favicons: {
key: string;
value: FaviconInfo;
    },
   pageviews: {
        key: string;
       value: PageView;
        indexes: {
            // 'idx_page_views_startedAt': number;
            // 'idx_page_views_endedAt': number;
            'idx_page_views_day': number;
        }
    },
    sessiondata: {
        key: string;
        value: SessionData;
        indexes: {
            // 'idx_session_startedAt': number;
            // 'idx_session_endedAt': number;
            'idx_session_day': number;
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
            'idx_watches_day': number;
        };
    }
}

export type ExtensionDatabase = IDBPDatabase<ExtensionDatabaseSchema>;

export function openExtensionDatabase(): Promise<ExtensionDatabase> {
    return openDB<ExtensionDatabaseSchema>("time-database", 1, {
        upgrade(database) {
            const pageviews = database.createObjectStore("pageviews", { keyPath: "id" });
            // pageviews.createIndex("idx_page_views_endedAt", "endedAt")
            // pageviews.createIndex("idx_page_views_startedAt", "startedAt")
            pageviews.createIndex("idx_page_views_day", "day")

            const sessiondata = database.createObjectStore("sessiondata", { keyPath: "id" });
            // sessiondata.createIndex("idx_session_endedAt", "endedAt")
            // sessiondata.createIndex("idx_session_startedAt", "startedAt")
            sessiondata.createIndex("idx_session_day", "day")
    
            database.createObjectStore("timelimits", { keyPath: "id" });
            database.createObjectStore("favicons", { keyPath: "hostname" });
            const watches = database.createObjectStore("watches", { keyPath: "id" });
            watches.createIndex("idx_watches_endedAt", "endedAt")
            watches.createIndex("idx_watches_startedAt", "startedAt")
            watches.createIndex("idx_watches_day", "day")
        },
    });
}