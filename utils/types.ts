export interface FaviconInfo {
    hostname: string;
    faviconUrl: string;
}

export interface PageView {
    id: string;
    day: number
    appId: string;
    createdBy: string;
    startedAt: number;
    endedAt: number
    query: string;
    referrer: string
    path: string
    faviconUrl: string
}

export interface SessionData {
    id: string;
    day: number
    appId: string
    faviconUrl: string
    createdBy: string;
    startedAt: number;
    endedAt: number;
}

export interface TimeLimits {
    id: string
    maxtime: number;
    hostname: string;
    faviconUrl: string | undefined;
    createdAt: number;
    updatedAt: number;
}

export interface Watch {
    id: string
    appId: string
    startedAt: number;
    endedAt: number;
    faviconUrl: string;
}