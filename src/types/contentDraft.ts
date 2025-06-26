import type { PlatformLink } from "./common";

// API 함수 타입 모음
export type DraftApi<T> = {
  createOrFetchDraft: () => Promise<T>;
  updateDraft: (id: number, payload: any) => Promise<T>;
  completeDraft: (id: number) => Promise<T>;
  deleteDraft: (id: number) => Promise<void>;
  uploadImageApi: (file: File, context?: any) => Promise<{ url: string; id: number }>;
};

export type UseContentDraftEditorOptions<T> = {
  queryKey: string;
  createOrFetchDraft: DraftApi<T>["createOrFetchDraft"];
  updateDraft: DraftApi<T>["updateDraft"];
  completeDraft: DraftApi<T>["completeDraft"];
  deleteDraft: DraftApi<T>["deleteDraft"];
  uploadImageApi: DraftApi<T>["uploadImageApi"];
  afterCompleteNavigate: string;
  afterCancelNavigate: string;
  initialState: Partial<T>;
  useTag?: boolean;                  // 해시태그 사용 여부
  usePlatformLinks?: boolean;        // 플랫폼/링크 사용 여부 (추가)
};

export type HashtagsState = string[];

export type ExtraPayload = {
  fileId?: number;
  hashtags?: string[];
  platformLinks?: PlatformLink[];
};