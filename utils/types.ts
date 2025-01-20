export interface FaviconInfo {
    hostname: string;
    faviconUrl: string;
}

export interface PageView {
    id: string;
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
    appId: string
    createdBy: string;
    startedAt: number;
    endedAt: number;
}

export interface TimeLimits {
    id: string
    maxtime: number;
    hostname: string;
    faviconUrl: string;
    created_at: number;
    updated_at: number;
}

export interface Watch {
    id: string
    appId: string
    timeSpent: number;
    startedAt: number;
    endedAt: number;
    faviconUrl: string;
}