import type { PlatformLink } from "./common";
import type { PromotionFile } from "./file";

export interface Games {
    id: number;
    title?: string;
    content?: string;
    authorId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string | null;
    order?: number | null;
    files: PromotionFile[];
    platformLinks: PlatformLink[];
}