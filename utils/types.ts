export interface FaviconInfo {
    hostname: string;
    faviconUrl: string;
}

export interface TimeData {
    timeSpent: number;
    session: number;
    day: string
    hostname: string;
    faviconUrl: string;
    created_at: number;
    updated_at: number;
}

export interface TimeLimits {
    timeSpent: number;
    maxtime: number;
    hostname: string;
    faviconUrl: string;
    created_at: number;
    updated_at: number;
}

export interface Watch {
    timeSpent: number;
    created_at: number;
    hostname: string;
    faviconUrl: string;
}