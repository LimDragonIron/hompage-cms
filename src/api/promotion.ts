import API from "./axiosInstance";
import type { PromotionBanner, ResponseBuilder, ListApiOptions, ListApiResult } from "@/types";

/**
 * 프로모션 배너(PromotionBanner) 관련 API 함수 모음
 * ----------------------------------------------------------------------------
 * - fetchPromotionBanners(opts): 프로모션 배너 목록 조회(페이지네이션)
 * - fetchPromotionBanner(id): 배너 상세 조회
 * - fetchDraftPromotionBanner(): 임시저장(드래프트) 배너 단일 조회
 * - createDraftPromotionBanner(payload): 임시저장(드래프트) 배너 생성
 * - updateDraftPromotionBanner(id, payload): 임시저장(드래프트) 배너 수정
 * - deleteDraftPromotionBanner(id): 임시저장(드래프트) 배너 삭제
 * - completeDraftPromotionBanner(id): 임시저장(드래프트) 완료 → 정식 등록
 * - updatePromotionBanner(id, payload): 정식 프로모션 배너 수정
 * - deletePromotionBanner(id): 정식 프로모션 배너 삭제
 * - activatePromotionBanner(id): 배너 활성화
 * - deactivatePromotionBanner(id): 배너 비활성화
 * - createOrFetchDraftPromotionBanner(): 임시저장(드래프트) 없으면 생성, 있으면 반환
 * - updatePromotionBannerOrder(ids, page, pageSize): 배너 순서 저장(페이지 단위)
 * - updatePromotionBannerOrderDirect(id, newOrder, page, pageSize): 배너 직접 순서 변경
 *
 * @remarks
 * 각 함수는 서버 응답의 code가 "SUCCESS"가 아니거나 데이터가 없는 경우 에러를 throw합니다.
 * 인증 실패(401 등)는 axiosInstance의 인터셉터(onRefreshFail)에 의해 로그인 페이지로 이동 처리됩니다.
 */

/**
 * 프로모션 배너 리스트 조회 (페이지네이션)
 * @param {ListApiOptions} [opts] - 옵션(status, page, pageSize)
 * @returns {Promise<ListApiResult<PromotionBanner>>}
 */
export async function fetchPromotionBanners(
  opts: ListApiOptions = {}
): Promise<ListApiResult<PromotionBanner>> {
  const { status, page = 1, pageSize = 10 } = opts;
  const res = await API.get<ResponseBuilder<any, null>>(
    "/promotions",
    { params: { status, page, pageSize } }
  );
  if (res.data.code !== "SUCCESS") throw new Error(res.data.message || "배너 목록 조회 실패");
  const d = res.data.data!;
  return {
    items: d.banners,
    totalCount: d.totalCount,
    totalPages: d.totalPages,
    pageSize: d.pageSize,
  };
}

/**
 * 배너 상세 조회
 * @param {number} id - 배너 id
 * @returns {Promise<PromotionBanner>}
 */
export async function fetchPromotionBanner(id: number): Promise<PromotionBanner> {
  const res = await API.get<ResponseBuilder<{ banner: PromotionBanner }, null>>(
    `/promotions/${id}`
  );
  if (res.data.code !== "SUCCESS") {
    throw new Error(res.data.message || "배너 상세 조회 실패");
  }
  return res.data.data?.banner!;
}

/**
 * 임시저장(드래프트) 배너 단일 조회
 * @returns {Promise<PromotionBanner | null>}
 */
export async function fetchDraftPromotionBanner(): Promise<PromotionBanner | null> {
  const res = await API.get<ResponseBuilder<{ draft: PromotionBanner | null }, null>>(
    "/promotions/draft"
  );
  if (res.data.code !== "SUCCESS") throw new Error(res.data.message || "임시저장 조회 실패");
  return res.data.data?.draft ?? null;
}

/**
 * 임시저장(드래프트) 배너 생성
 * @param {Object} payload - 생성 값 (title, fileId)
 * @returns {Promise<PromotionBanner>}
 */
export async function createDraftPromotionBanner(payload: { title?: string; fileId?: number }): Promise<PromotionBanner> {
  const res = await API.post<ResponseBuilder<{ draft: PromotionBanner | null }, null>>(
    "/promotions/draft",
    payload
  );
  if (res.data.code !== "SUCCESS" || !res.data.data?.draft) throw new Error(res.data.message || "임시저장 생성 실패");
  return res.data.data.draft;
}

/**
 * 임시저장(드래프트) 배너 수정
 * @param {number} id - 배너 id
 * @param {Object} payload - 수정 값 (title, content, fileId)
 * @returns {Promise<PromotionBanner>}
 */
export async function updateDraftPromotionBanner(
  id: number,
  payload: { title?: string; content?: string; fileId?: number }
): Promise<PromotionBanner> {
  const res = await API.patch<ResponseBuilder<{ draft: PromotionBanner }, null>>(
    `/promotions/draft/${id}`,
    payload
  );
  if (res.data.code !== "SUCCESS" || !res.data.data?.draft) throw new Error(res.data.message || "임시저장 수정 실패");
  return res.data.data.draft;
}

/**
 * 임시저장(드래프트) 배너 삭제
 * @param {number} id - 배너 id
 * @returns {Promise<void>}
 */
export async function deleteDraftPromotionBanner(id: number): Promise<void> {
  const res = await API.delete<ResponseBuilder<null, null>>(`/promotions/draft/${id}`);
  if (res.data.code !== "SUCCESS") {
    throw new Error(res.data.message || "임시저장 삭제 실패");
  }
}

/**
 * 임시저장(드래프트) 완료 → 정식 등록
 * @param {number} id - 배너 id
 * @returns {Promise<PromotionBanner>}
 */
export async function completeDraftPromotionBanner(id: number): Promise<PromotionBanner> {
  const res = await API.post<ResponseBuilder<{ banner: PromotionBanner }, null>>(
    `/promotions/draft/${id}/complete`
  );
  if (res.data.code !== "SUCCESS" || !res.data.data?.banner) throw new Error(res.data.message || "임시저장 완료 실패");
  return res.data.data.banner;
}

/**
 * 정식 프로모션 배너 수정 (isDraft: false 경우에만)
 * @param {number} id - 배너 id
 * @param {Object} payload - 수정 값 (title, content, fileId)
 * @returns {Promise<PromotionBanner>}
 */
export async function updatePromotionBanner(
  id: number,
  payload: { title?: string, content?: string, fileId?: number }
): Promise<PromotionBanner> {
  const res = await API.patch<ResponseBuilder<{ updatedBanner: PromotionBanner }, null>>(
    `/promotions/${id}`,
    payload
  );
  if (res.data.code !== "SUCCESS" || !res.data.data?.updatedBanner) throw new Error(res.data.message || "배너 수정 실패");
  return res.data.data.updatedBanner;
}

/**
 * 정식 프로모션 배너 삭제 (isDraft: false 경우에만)
 * @param {number} id - 배너 id
 * @returns {Promise<void>}
 */
export async function deletePromotionBanner(id: number): Promise<void> {
  const res = await API.delete<ResponseBuilder<null, null>>(`/promotions/${id}`);
  if (res.data.code !== "SUCCESS") {
    throw new Error(res.data.message || "배너 삭제 실패");
  }
}

/**
 * 배너 활성화
 * @param {number} id - 배너 id
 * @returns {Promise<void>}
 */
export async function activatePromotionBanner(id: number): Promise<void> {
  const res = await API.patch<ResponseBuilder<null, null>>(
    `/promotions/${id}/activate`
  );
  if (res.data.code !== "SUCCESS") {
    throw new Error(res.data.message || "배너 활성화 실패");
  }
}

/**
 * 배너 비활성화
 * @param {number} id - 배너 id
 * @returns {Promise<void>}
 */
export async function deactivatePromotionBanner(id: number): Promise<void> {
  const res = await API.patch<ResponseBuilder<null, null>>(
    `/promotions/${id}/deactivate`
  );
  if (res.data.code !== "SUCCESS") {
    throw new Error(res.data.message || "배너 비활성화 실패");
  }
}

/**
 * 임시저장(드래프트) 없으면 생성, 있으면 반환
 * @returns {Promise<PromotionBanner>}
 */
export async function createOrFetchDraftPromotionBanner(): Promise<PromotionBanner> {
  const res = await API.post<ResponseBuilder<{ draft: PromotionBanner }, null>>(
    "/promotions/draft-or-create",
    {}
  );
  if (res.data.code !== "SUCCESS" || !res.data.data?.draft) {
    throw new Error(res.data.message || "임시저장 생성/불러오기 실패");
  }
  return res.data.data.draft;
}

/**
 * 배너 순서 저장 (페이지 단위)
 * @param {number[]} ids - 배너 id 배열
 * @param {number} [page=1] - 페이지
 * @param {number} [pageSize=10] - 페이지당 개수
 * @returns {Promise<void>}
 */
export async function updatePromotionBannerOrder(
  ids: number[],
  page: number = 1,
  pageSize: number = 10
): Promise<void> {
  const res = await API.patch<ResponseBuilder<null, null>>(
    "/promotions/order",
    { ids },
    { params: { page, pageSize } }
  );
  if (res.data.code !== "SUCCESS") {
    throw new Error(res.data.message || "배너 순서 저장 실패");
  }
}

/**
 * 배너 직접 순서 입력 API (PATCH /promotions/order/direct)
 * @param {number} id - 배너 id
 * @param {number} newOrder - 새 순서(0부터 시작)
 * @param {number} [page=1] - 페이지
 * @param {number} [pageSize=10] - 페이지당 개수
 * @returns {Promise<void>}
 */
export async function updatePromotionBannerOrderDirect(
  id: number,
  newOrder: number,
  page: number = 1,
  pageSize: number = 10,
): Promise<void> {
  const res = await API.patch<ResponseBuilder<null, null>>(
    "/promotions/order/direct",
    { id, newOrder },
    { params: { page, pageSize } }
  );
  if (res.data.code !== "SUCCESS") {
    throw new Error(res.data.message || "배너 직접 순서 변경 실패");
  }
}