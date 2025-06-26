import API from "./axiosInstance";
import type { Games, ResponseBuilder, ListApiOptions, ListApiResult, PlatformLink } from "@/types";

/**
 * 게임 뉴스(Games) 관련 API 함수 모음
 * ----------------------------------------------------------------------------
 * - fetchGamesList(opts): 게임 뉴스 목록 조회 (페이지네이션)
 * - fetchGames(id): 게임 뉴스 상세 조회
 * - createOrFetchDraftGames(): 임시저장 draft 생성 또는 불러오기
 * - updateDraftGames(id, payload): 임시저장 draft 수정
 * - deleteDraftGames(id): 임시저장 draft 삭제
 * - completeDraftGames(id): 임시저장 draft를 정식 뉴스로 등록
 * - updateGames(id, payload): 게임 뉴스 수정
 * - deleteGames(id): 게임 뉴스 삭제
 * - updateGamesOrder(ids, options): 뉴스 순서 저장(일괄)
 * - updateGamesOrderDirect(id, newOrder, options): 뉴스 직접 순서 변경
 *
 * @remarks
 * 각 함수는 서버 응답의 code가 "SUCCESS"가 아니면 에러를 throw합니다.
 * 인증 실패(401 등)는 axiosInstance의 인터셉터(onRefreshFail)에 의해 로그인 페이지로 이동 처리됩니다.
 */

/**
 * 게임 뉴스 목록 조회 (페이지네이션)
 * @param {ListApiOptions} [opts] - 옵션(page, pageSize)
 * @returns {Promise<ListApiResult<Games>>}
 */
export async function fetchGamesList(
  opts: ListApiOptions = {}
): Promise<ListApiResult<Games>> {
  const { page = 1, pageSize = 10 } = opts;
  const res = await API.get<ResponseBuilder<any, null>>(
    "/games",
    { params: { page, pageSize } }
  );
  if (res.data.code !== "SUCCESS") throw new Error(res.data.message || "게임 뉴스 목록 조회 실패");
  const d = res.data.data!;
  return {
    items: d.newsList ?? [],
    totalCount: d.totalCount,
    totalPages: d.totalPages,
    pageSize: d.pageSize,
  };
}

/**
 * 게임 뉴스 상세 조회
 * @param {number} id - 게임 뉴스 id
 * @returns {Promise<Games>}
 */
export async function fetchGames(id: number): Promise<Games> {
  const res = await API.get<ResponseBuilder<{ news: Games }, null>>(
    `/games/${id}`
  );
  if (res.data.code !== "SUCCESS") {
    throw new Error(res.data.message || "게임 뉴스 상세 조회 실패");
  }
  return res.data.data?.news!;
}

/**
 * 임시저장 draft 생성 or 조회
 * @returns {Promise<Games>}
 */
export async function createOrFetchDraftGames(): Promise<Games> {
  const res = await API.post<ResponseBuilder<{ draft: Games }, null>>(
    "/games/draft-or-create", {}
  );
  if (res.data.code !== "SUCCESS" || !res.data.data?.draft) {
    throw new Error(res.data.message || "임시저장 생성/불러오기 실패");
  }
  return res.data.data.draft;
}

/**
 * 임시저장 draft 수정
 * @param {number} id - draft id
 * @param {Object} payload - 수정 값 (title, content, fileId, platformLinks)
 * @returns {Promise<Games>}
 */
export async function updateDraftGames(
  id: number,
  payload: { title?: string; content?: string; fileId?: number; platformLinks?: PlatformLink[] }
): Promise<Games> {
  const res = await API.patch<ResponseBuilder<{ draft: Games }, null>>(
    `/games/draft/${id}`,
    payload
  );
  if (res.data.code !== "SUCCESS" || !res.data.data?.draft) throw new Error(res.data.message || "임시저장 수정 실패");
  return res.data.data.draft;
}

/**
 * 임시저장 draft 삭제
 * @param {number} id - draft id
 * @returns {Promise<void>}
 */
export async function deleteDraftGames(id: number): Promise<void> {
  const res = await API.delete<ResponseBuilder<null, null>>(`/games/draft/${id}`);
  if (res.data.code !== "SUCCESS") {
    throw new Error(res.data.message || "임시저장 삭제 실패");
  }
}

/**
 * 임시저장 draft → 정식 등록
 * @param {number} id - draft id
 * @returns {Promise<Games>}
 */
export async function completeDraftGames(id: number): Promise<Games> {
  const res = await API.post<ResponseBuilder<{ news: Games }, null>>(
    `/games/draft/${id}/complete`
  );
  if (res.data.code !== "SUCCESS" || !res.data.data?.news) throw new Error(res.data.message || "임시저장 완료 실패");
  return res.data.data.news;
}

/**
 * 게임 뉴스 수정
 * @param {number} id - 게임 뉴스 id
 * @param {Object} payload - 수정 값 (title, content, fileId, platformLinks)
 * @returns {Promise<Games>}
 */
export async function updateGames(
  id: number,
  payload: { title?: string; content?: string; fileId?: number; platformLinks?: PlatformLink[] }
): Promise<Games> {
  const res = await API.patch<ResponseBuilder<{ news: Games }, null>>(
    `/games/${id}`,
    payload
  );
  if (res.data.code !== "SUCCESS" || !res.data.data?.news) throw new Error(res.data.message || "게임 뉴스 수정 실패");
  return res.data.data.news;
}

/**
 * 게임 뉴스 삭제
 * @param {number} id - 게임 뉴스 id
 * @returns {Promise<void>}
 */
export async function deleteGames(id: number): Promise<void> {
  const res = await API.delete<ResponseBuilder<null, null>>(`/games/${id}`);
  if (res.data.code !== "SUCCESS") {
    throw new Error(res.data.message || "게임 뉴스 삭제 실패");
  }
}

/**
 * 게임 뉴스 순서 저장 (페이지/페이지사이즈 쿼리 반영)
 * @param {number[]} ids - 게임 뉴스 id 배열
 * @param {Object} [options] - 옵션(page, pageSize)
 * @returns {Promise<void>}
 */
export async function updateGamesOrder(
  ids: number[],
  options?: { page?: number; pageSize?: number }
): Promise<void> {
  const res = await API.patch<ResponseBuilder<null, null>>(
    "/games/order",
    { ids },
    { params: { page: options?.page, pageSize: options?.pageSize } }
  );
  if (res.data.code !== "SUCCESS") {
    throw new Error(res.data.message || "뉴스 순서 저장 실패");
  }
}

/**
 * 게임 뉴스 직접 순서 변경 (페이지/페이지사이즈 쿼리 반영)
 * @param {number} id - 게임 뉴스 id
 * @param {number} newOrder - 새 순서(0부터 시작)
 * @param {Object} [options] - 옵션(page, pageSize)
 * @returns {Promise<void>}
 */
export async function updateGamesOrderDirect(
  id: number,
  newOrder: number,
  options?: { page?: number; pageSize?: number }
): Promise<void> {
  const res = await API.patch<ResponseBuilder<null, null>>(
    "/games/order/direct",
    { id, newOrder },
    { params: { page: options?.page, pageSize: options?.pageSize } }
  );
  if (res.data.code !== "SUCCESS") {
    throw new Error(res.data.message || "뉴스 순서 직접 변경 실패");
  }
}