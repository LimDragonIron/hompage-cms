import API from "./axiosInstance";
import type { ResponseBuilder, ListApiOptions, ListApiResult, Contact } from "@/types";

/**
 * 문의(Contact) 관련 API 함수 모음 (관리자용)
 * ----------------------------------------------------------------------------
 * - fetchContacts(opts): 문의 목록 조회 (페이징 지원)
 * - fetchContact(id): 문의 상세 조회
 *
 * @remarks
 * 각 함수는 서버 응답의 code가 "SUCCESS"가 아니면 에러를 throw합니다.
 * 인증 실패(401 등)는 axiosInstance의 인터셉터(onRefreshFail)에 의해 로그인 페이지로 이동 처리됩니다.
 */

/**
 * 문의 목록 조회 (페이지네이션)
 * @param {ListApiOptions} [opts] - 옵션(page, pageSize)
 * @returns {Promise<ListApiResult<Contact>>}
 */
export async function fetchContacts(
  opts: ListApiOptions = {}
): Promise<ListApiResult<Contact>> {
  const { page = 1, pageSize = 10 } = opts;
  const res = await API.get<ResponseBuilder<any, null>>(
    "/contact",
    { params: { page, pageSize } }
  );
  if (res.data.code !== "SUCCESS") throw new Error(res.data.message || "문의 목록 조회 실패");
  const d = res.data.data!;
  return {
    items: d.contactList,
    totalCount: d.totalCount ?? d.contactList?.length ?? 0,
    totalPages: d.totalPages ?? 1,
    pageSize: d.pageSize ?? 10,
  };
}

/**
 * 문의 상세 조회
 * @param {number} id - 문의 id
 * @returns {Promise<Contact>}
 */
export async function fetchContact(id: number): Promise<Contact> {
  const res = await API.get<ResponseBuilder<{ contact: Contact }, null>>(
    `/contact/${id}`
  );
  if (res.data.code !== "SUCCESS") {
    throw new Error(res.data.message || "문의 상세 조회 실패");
  }
  return res.data.data?.contact!;
}