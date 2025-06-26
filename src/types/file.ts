export interface PromotionFile {
    id: number;
    name: string;
    type: string;
    url: string;
    size: number;
    createdAt: string;
    updatedAt: string;
    targetType?: string; // 예: "PROMOTION_BANNER"
    targetId?: number;
  }
  
  export interface UploadFileDto {
    contentId?: number;
    contentType: string;
  }
  
  export interface UploadedFileResult {
    id: number;
    name: string;
    type: string;
    url: string;
    size: number;
  }