import type { PromotionFile } from "./file";

export interface PromotionBanner {
  id: number;
  title?: string;
  content?: string;
  isDraft: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  activatedAt?: string | null;
  authorId: string;
  files: PromotionFile[]; // 공통 PromotionFile 타입 사용
  order?: number | null;
}