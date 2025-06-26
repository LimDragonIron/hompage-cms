import type { PromotionFile } from "./file";

export interface Hero {
  id: number;
  title?: string;
  content?: string;
  isDraft: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  files: PromotionFile[];
  order?: number | null;
}