import type { News, ResponseBuilder, ListApiOptions, ListApiResult } from "@/types";
import API from "./axiosInstance";

/**
 * 뉴스(News) 관련 API 함수 모음
 * ----------------------------------------------------------------------------
 * [임시저장(드래프트) 관련]
 * - createOrFetchDraftNews(): 임시저장 draft 생성 또는 불러오기
 * - updateDraftNews(id, payload): 임시저장 draft 수정
 * - deleteDraftNews(id): 임시저장 draft 삭제
 * - completeDraftNews(id): 임시저장 draft를 정식 뉴스로 등록
 *
 * [정식 뉴스 관련]
 * - fetchNewsList(opts): 뉴스 목록 조회(페이지네이션)
 * - fetchNews(id): 뉴스 상세 조회
 * - updateNews(id, payload): 뉴스 수정
 * - deleteNews(id): 뉴스 삭제
 * - updateNewsOrder(ids, options): 뉴스 순서 일괄 변경
 * - updateNewsOrderDirect(id, newOrder, options): 뉴스 직접 순서 변경
 *
 * @remarks
 * 각 함수는 서버 응답의 code가 "SUCCESS"가 아니거나 데이터가 없는 경우 에러를 throw합니다.
 * 인증 실패(401 등)는 axiosInstance의 인터셉터(onRefreshFail)에 의해 로그인 페이지로 이동 처리됩니다.
 */

/**
 * 임시저장 draft 생성 or 조회
 * @returns {Promise<News>}
 */
export async function createOrFetchDraftNews(): Promise<News> {
  const res = await API.post<ResponseBuilder<{ draft: News }, null>>(
    "/news/draft-or-create", {}
  );
  if (res.data.code !== "SUCCESS" || !res.data.data?.draft) {
    throw new Error(res.data.message || "임시저장 생성/불러오기 실패");
  }
  return res.data.data.draft;
}

/**
 * 임시저장 draft 수정
 * @param {number} id - draft id
 * @param {Object} payload - 수정 값 (title, content, hashtags, fileId)
 * @returns {Promise<News>}
 */
export async function updateDraftNews(
  id: number,
  payload: { title?: string; content?: string; hashtags?: string[]; fileId?: number }
): Promise<News> {
  const res = await API.patch<ResponseBuilder<{ draft: News }, null>>(
    `/news/draft/${id}`,
    payload
  );
  if (res.data.code !== "SUCCESS" || !res.data.data?.draft) {
    throw new Error(res.data.message || "임시저장 수정 실패");
  }
  return res.data.data.draft;
}

/**
 * 임시저장 draft 삭제
 * @param {number} id - draft id
 * @returns {Promise<void>}
 */
export async function deleteDraftNews(id: number): Promise<void> {
  const res = await API.delete<ResponseBuilder<null, null>>(`/news/draft/${id}`);
  if (res.data.code !== "SUCCESS") {
    throw new Error(res.data.message || "임시저장 삭제 실패");
  }
}

/**
 * 임시저장 draft → 정식 등록
 * @param {number} id - draft id
 * @returns {Promise<News>}
 */
export async function completeDraftNews(id: number): Promise<News> {
  const res = await API.post<ResponseBuilder<{ news: News }, null>>(
    `/news/draft/${id}/complete`
  );
  if (res.data.code !== "SUCCESS" || !res.data.data?.news) {
    throw new Error(res.data.message || "임시저장 완료 실패");
  }
  return res.data.data.news;
}

// === 정식 뉴스 목록/상세/수정/삭제 ===

/**
 * 뉴스 목록 조회 (페이지네이션)
 * @param {ListApiOptions} [opts] - 옵션(page, pageSize)
 * @returns {Promise<ListApiResult<News>>}
 */
export async function fetchNewsList(
  opts: ListApiOptions = {}
): Promise<ListApiResult<News>> {
  const { page = 1, pageSize = 10 } = opts;
  const res = await API.get<ResponseBuilder<any, null>>(
    "/news",
    { params: { page, pageSize } }
  );
  if (res.data.code !== "SUCCESS") {
    throw new Error(res.data.message || "뉴스 목록 조회 실패");
  }
  const d = res.data.data!;
  return {
    items: d.newsList ?? [],
    totalCount: d.totalCount,
    totalPages: d.totalPages,
    pageSize: d.pageSize,
  };
}

/**
 * 뉴스 상세 조회
 * @param {number} id - 뉴스 id
 * @returns {Promise<News>}
 */
export async function fetchNews(id: number): Promise<News> {
  const res = await API.get<ResponseBuilder<{ news: News }, null>>(
    `/news/${id}`
  );
  if (res.data.code !== "SUCCESS") {
    throw new Error(res.data.message || "뉴스 상세 조회 실패");
  }
  return res.data.data?.news!;
}

/**
 * 뉴스 수정
 * @param {number} id - 뉴스 id
 * @param {Object} payload - 수정 값 (title, content, hashtags, fileId)
 * @returns {Promise<News>}
 */
export async function updateNews(
  id: number,
  payload: { title?: string; content?: string; hashtags?: string[]; fileId?: number }
): Promise<News> {
  const res = await API.patch<ResponseBuilder<{ news: News }, null>>(
    `/news/${id}`,
    payload
  );
  if (res.data.code !== "SUCCESS" || !res.data.data?.news) {
    throw new Error(res.data.message || "뉴스 수정 실패");
  }
  return res.data.data.news;
}

/**
 * 뉴스 삭제
 * @param {number} id - 뉴스 id
 * @returns {Promise<void>}
 */
export async function deleteNews(id: number): Promise<void> {
  const res = await API.delete<ResponseBuilder<null, null>>(`/news/${id}`);
  if (res.data.code !== "SUCCESS") {
    throw new Error(res.data.message || "뉴스 삭제 실패");
  }
}

/**
 * 뉴스 순서(order) 일괄 변경 (페이지/페이지사이즈 쿼리 반영)
 * @param {number[]} ids - 뉴스 id 배열
 * @param {Object} [options] - 옵션(page, pageSize)
 * @returns {Promise<void>}
 */
export async function updateNewsOrder(
  ids: number[],
  options?: { page?: number; pageSize?: number }
): Promise<void> {
  const res = await API.patch<ResponseBuilder<null, null>>(
    "/news/order",
    { ids },
    { params: { page: options?.page, pageSize: options?.pageSize } }
  );
  if (res.data.code !== "SUCCESS") {
    throw new Error(res.data.message || "뉴스 순서 저장 실패");
  }
}

/**
 * 뉴스 직접 순서 변경 (페이지/페이지사이즈 쿼리 반영)
 * @param {number} id - 뉴스 id
 * @param {number} newOrder - 새 순서(0부터 시작)
 * @param {Object} [options] - 옵션(page, pageSize)
 * @returns {Promise<void>}
 */
export async function updateNewsOrderDirect(
  id: number,
  newOrder: number,
  options?: { page?: number; pageSize?: number }
): Promise<void> {
  const res = await API.patch<ResponseBuilder<null, null>>(
    "/news/order/direct",
    { id, newOrder },
    { params: { page: options?.page, pageSize: options?.pageSize } }
  );
  if (res.data.code !== "SUCCESS") {
    throw new Error(res.data.message || "뉴스 순서 직접 변경 실패");
  }
}