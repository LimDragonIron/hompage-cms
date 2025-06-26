import type { PromotionFile } from "./file";

export interface News {
    id: number;
    title?: string;
    content?: string;
    authorId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string | null;
    hashtags: string[];
    order?: number | null;
    files: PromotionFile[];
}