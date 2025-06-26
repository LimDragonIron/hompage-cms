import API from "./axiosInstance";
import type { Hero, ResponseBuilder, ListApiOptions, ListApiResult } from "@/types";

/**
 * 히어로(Hero) 관련 API 함수 모음
 * ----------------------------------------------------------------------------
 * - fetchHeroes(opts): 히어로 목록 조회(페이지네이션)
 * - fetchHero(id): 히어로 상세 조회
 * - createOrFetchDraftHero(): 임시저장(드래프트) 히어로 생성 또는 불러오기
 * - updateDraftHero(id, payload): 임시저장(드래프트) 히어로 수정
 * - deleteDraftHero(id): 임시저장(드래프트) 히어로 삭제
 * - completeDraftHero(id): 임시저장(드래프트) 완료 → 정식 등록
 * - updateHero(id, payload): 정식 히어로 수정
 * - deleteHero(id): 정식 히어로 삭제
 * - activateHero(id): 히어로 활성화
 * - deactivateHero(id): 히어로 비활성화
 * - updateHeroOrder(ids, page, pageSize): 히어로 순서 저장(페이지 단위)
 * - updateHeroOrderDirect(id, newOrder, page, pageSize): 히어로 직접 순서 변경
 *
 * @remarks
 * 각 함수는 서버 응답의 code가 "SUCCESS"가 아니면 에러를 throw합니다.
 * 인증 실패(401 등)는 axiosInstance의 인터셉터(onRefreshFail)에 의해 로그인 페이지로 이동 처리됩니다.
 */

/**
 * 히어로 리스트 조회 (페이지네이션)
 * @param {ListApiOptions} [opts] - 옵션(status, page, pageSize)
 * @returns {Promise<ListApiResult<Hero>>}
 */
export async function fetchHeroes(
  opts: ListApiOptions = {}
): Promise<ListApiResult<Hero>> {
  const { status, page = 1, pageSize = 10 } = opts;
  const res = await API.get<ResponseBuilder<any, null>>(
    "/heroes",
    { params: { status, page, pageSize } }
  );
  if (res.data.code !== "SUCCESS") throw new Error(res.data.message || "히어로 목록 조회 실패");
  const d = res.data.data!;
  return {
    items: d.heroes,
    totalCount: d.totalCount,
    totalPages: d.totalPages,
    pageSize: d.pageSize,
  };
}

/**
 * 히어로 상세 조회
 * @param {number} id - 히어로 id
 * @returns {Promise<Hero>}
 */
export async function fetchHero(id: number): Promise<Hero> {
  const res = await API.get<ResponseBuilder<{ hero: Hero }, null>>(
    `/heroes/${id}`
  );
  if (res.data.code !== "SUCCESS") {
    throw new Error(res.data.message || "히어로 상세 조회 실패");
  }
  return res.data.data?.hero!;
}

/**
 * 임시저장(드래프트) 히어로 단일 조회 또는 생성
 * @returns {Promise<Hero>}
 */
export async function createOrFetchDraftHero(): Promise<Hero> {
  const res = await API.post<ResponseBuilder<{ draft: Hero }, null>>(
    "/heroes/draft-or-create",
    {}
  );
  if (res.data.code !== "SUCCESS" || !res.data.data?.draft) {
    throw new Error(res.data.message || "임시저장 생성/불러오기 실패");
  }
  return res.data.data.draft;
}

/**
 * 임시저장(드래프트) 히어로 수정
 * @param {number} id - 히어로 id
 * @param {Object} payload - 수정 값 (title, content, fileId)
 * @returns {Promise<Hero>}
 */
export async function updateDraftHero(
  id: number,
  payload: { title?: string; content?: string; fileId?: number }
): Promise<Hero> {
  const res = await API.patch<ResponseBuilder<{ draft: Hero }, null>>(
    `/heroes/draft/${id}`,
    payload
  );
  if (res.data.code !== "SUCCESS" || !res.data.data?.draft) throw new Error(res.data.message || "임시저장 수정 실패");
  return res.data.data.draft;
}

/**
 * 임시저장(드래프트) 히어로 삭제
 * @param {number} id - 히어로 id
 * @returns {Promise<void>}
 */
export async function deleteDraftHero(id: number): Promise<void> {
  const res = await API.delete<ResponseBuilder<null, null>>(`/heroes/draft/${id}`);
  if (res.data.code !== "SUCCESS") {
    throw new Error(res.data.message || "임시저장 삭제 실패");
  }
}

/**
 * 임시저장(드래프트) 완료 → 정식 등록
 * @param {number} id - 히어로 id
 * @returns {Promise<Hero>}
 */
export async function completeDraftHero(id: number): Promise<Hero> {
  const res = await API.post<ResponseBuilder<{ hero: Hero }, null>>(
    `/heroes/draft/${id}/complete`
  );
  if (res.data.code !== "SUCCESS" || !res.data.data?.hero) throw new Error(res.data.message || "임시저장 완료 실패");
  return res.data.data.hero;
}

/**
 * 정식 히어로 수정 (isDraft: false 경우에만)
 * @param {number} id - 히어로 id
 * @param {Object} payload - 수정 값 (title, content, fileId)
 * @returns {Promise<Hero>}
 */
export async function updateHero(
  id: number,
  payload: { title?: string, content?: string, fileId?: number }
): Promise<Hero> {
  const res = await API.patch<ResponseBuilder<{ updatedHero: Hero }, null>>(
    `/heroes/${id}`,
    payload
  );
  if (res.data.code !== "SUCCESS" || !res.data.data?.updatedHero) throw new Error(res.data.message || "히어로 수정 실패");
  return res.data.data.updatedHero;
}

/**
 * 정식 히어로 삭제 (isDraft: false 경우에만)
 * @param {number} id - 히어로 id
 * @returns {Promise<void>}
 */
export async function deleteHero(id: number): Promise<void> {
  const res = await API.delete<ResponseBuilder<null, null>>(`/heroes/${id}`);
  if (res.data.code !== "SUCCESS") {
    throw new Error(res.data.message || "히어로 삭제 실패");
  }
}

/**
 * 히어로 활성화
 * @param {number} id - 히어로 id
 * @returns {Promise<void>}
 */
export async function activateHero(id: number): Promise<void> {
  const res = await API.patch<ResponseBuilder<null, null>>(
    `/heroes/${id}/activate`
  );
  if (res.data.code !== "SUCCESS") {
    throw new Error(res.data.message || "히어로 활성화 실패");
  }
}

/**
 * 히어로 비활성화
 * @param {number} id - 히어로 id
 * @returns {Promise<void>}
 */
export async function deactivateHero(id: number): Promise<void> {
  const res = await API.patch<ResponseBuilder<null, null>>(
    `/heroes/${id}/deactivate`
  );
  if (res.data.code !== "SUCCESS") {
    throw new Error(res.data.message || "히어로 비활성화 실패");
  }
}

/**
 * 히어로 순서 저장 (페이지 단위)
 * @param {number[]} ids - 히어로 id 배열
 * @param {number} [page=1] - 페이지
 * @param {number} [pageSize=10] - 페이지당 개수
 * @returns {Promise<void>}
 */
export async function updateHeroOrder(
  ids: number[],
  page: number = 1,
  pageSize: number = 10
): Promise<void> {
  const res = await API.patch<ResponseBuilder<null, null>>(
    "/heroes/order",
    { ids },
    { params: { page, pageSize } }
  );
  if (res.data.code !== "SUCCESS") {
    throw new Error(res.data.message || "히어로 순서 저장 실패");
  }
}

/**
 * 히어로 직접 순서 입력 API (PATCH /heroes/order/direct)
 * @param {number} id - 히어로 id
 * @param {number} newOrder - 새 순서(0부터 시작)
 * @param {number} [page=1] - 페이지
 * @param {number} [pageSize=10] - 페이지당 개수
 * @returns {Promise<void>}
 */
export async function updateHeroOrderDirect(
  id: number,
  newOrder: number,
  page: number = 1,
  pageSize: number = 10,
): Promise<void> {
  const res = await API.patch<ResponseBuilder<null, null>>(
    "/heroes/order/direct",
    { id, newOrder },
    { params: { page, pageSize } }
  );
  if (res.data.code !== "SUCCESS") {
    throw new Error(res.data.message || "히어로 직접 순서 변경 실패");
  }
}