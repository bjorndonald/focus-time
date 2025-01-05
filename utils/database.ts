import { DBSchema, IDBPDatabase, openDB } from "idb";
import { FaviconInfo, TimeData, TimeLimits, Watch } from "./types";

interface ExtensionDatabaseSchema extends DBSchema {
   timedata: {
        key: string;
        value: TimeData;
        indexes: {
            'by-day': string;
        };
    };
    timelimits: {
        key: string;
        value: TimeLimits;
        indexes: {
            'by-hostname': string;
        };
    };
    watches: {
        key: string;
        value: Watch;
    }
}

export type ExtensionDatabase = IDBPDatabase<ExtensionDatabaseSchema>;

export function openExtensionDatabase(): Promise<ExtensionDatabase> {
    return openDB<ExtensionDatabaseSchema>("time-database", 1, {
        upgrade(database) {
            const objectStore = database.createObjectStore("timedata", { keyPath: "hostname" });
    
            objectStore.createIndex("by-day", "day", { unique: false });

            database.createObjectStore("timelimits", { keyPath: "hostname" });
            database.createObjectStore("watches", { keyPath: "created_at" });
        },
    });
}