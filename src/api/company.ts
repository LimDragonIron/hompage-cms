import API from "./axiosInstance";
import type { Company, ResponseBuilder } from "@/types";

/**
 * 회사(Company) 관련 API 함수 모음
 * ----------------------------------------------------------------------------
 * - fetchCompany(): 단일 회사 정보 조회
 * - createCompany(payload): 회사 최초 1회 생성
 * - updateCompany(payload): 회사 정보 수정
 *
 * @remarks
 * 각 함수는 서버 응답의 code가 "SUCCESS"가 아니거나 company 데이터가 없는 경우 에러를 throw합니다.
 * 인증 실패(401 등)는 axiosInstance의 인터셉터(onRefreshFail)에 의해 로그인 페이지로 이동 처리됩니다.
 */

/**
 * 회사 정보 조회
 * @returns {Promise<Company>}
 */
export async function fetchCompany(): Promise<Company> {
  const res = await API.get<ResponseBuilder<{ company: Company }, null>>("/company");
  if (res.data.code !== "SUCCESS" || !res.data.data?.company) {
    throw new Error(res.data.message || "회사 정보 조회 실패");
  }
  return res.data.data.company;
}

/**
 * 회사 최초 1회 생성
 * @param {Partial<Company>} payload - 생성할 회사 정보
 * @returns {Promise<Company>}
 */
export async function createCompany(payload: Partial<Company>): Promise<Company> {
  const res = await API.post<ResponseBuilder<{ company: Company }, null>>("/company", payload);
  if (res.data.code !== "SUCCESS" || !res.data.data?.company) {
    throw new Error(res.data.message || "회사 생성 실패");
  }
  return res.data.data.company;
}

/**
 * 회사 정보 수정
 * @param {Partial<Company>} payload - 수정할 회사 정보
 * @returns {Promise<Company>}
 */
export async function updateCompany(payload: Partial<Company>): Promise<Company> {
  const res = await API.patch<ResponseBuilder<{ company: Company }, null>>("/company", payload);
  if (res.data.code !== "SUCCESS" || !res.data.data?.company) {
    throw new Error(res.data.message || "회사 수정 실패");
  }
  return res.data.data.company;
}