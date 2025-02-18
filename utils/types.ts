export interface FaviconInfo {
    hostname: string;
    faviconUrl: string;
}

export interface PageView {
    id: string;
    day: number
    appId: string;
    count: number;
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

// Limit types: permanent, certain time, daily limit, session
export interface TimeLimits {
    id: string
    type: string
    apps: string[];
    startTime: string; 
    endTime: string;
    days: string[];
    name: string;
    action: string;
    active: boolean;
    limitPeriod: number 
    coolDownPeriod: number 
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

export type TimeLimitInput = {
    id: string
    active: boolean
    apps: string[]
    type: string
    startTime: string;
    endTime: string;
    days: string[];
    name: string;
    limitPeriod: number
    coolDownPeriod: number
}