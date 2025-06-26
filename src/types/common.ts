// --- 공통 타입 ---
export type ListApiOptions = {
    status?: string;
    page?: number;
    pageSize?: number;
};
  
export type ListApiResult<T> = {
    items: T[];
    totalCount: number;
    totalPages: number;
    pageSize: number;
};

export type PlatformLink = { platform: string; link: string };


export type StatusFilter = "all" | "active" | "inactive" | "draft";