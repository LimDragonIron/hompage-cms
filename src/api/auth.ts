import API from "./axiosInstance";
import type {
    SignInDto,
    ResponseBuilder,
    SignInResult,
    User,
} from "@/types";

/**
 * 인증/사용자 관련 API 함수 모음
 * ----------------------------------------------------------------------------
 * - signIn(data: SignInDto): 로그인 요청. 성공 시 사용자 인증정보 반환. 실패 시 에러 throw.
 * - fetchProfile(): 로그인한 사용자의 프로필 정보 조회. 실패(401 등)는 에러로 throw.
 * - logOut(): 로그아웃 요청. 성공 시 true 반환, 실패 시 에러 throw.
 *
 * @remarks
 * 각 API 함수는 공통적으로 서버 응답의 code가 "SUCCESS"가 아닌 경우 에러를 throw합니다.
 * 401(Unauthorized) 등 인증 실패는 axiosInstance의 인터셉터(onRefreshFail) 정책에 따라 로그인 페이지로 이동 처리됩니다.
 */

/**
 * 로그인
 * @param {SignInDto} data - 로그인 요청 데이터
 * @returns {Promise<SignInResult>}
 * @throws {Error} 로그인 실패 시
 */
export async function signIn(
  data: SignInDto
): Promise<SignInResult> {
  try {
    const response = await API.post<ResponseBuilder<SignInResult>>("/auth/signin", data);
    const resData = response.data;
    if (resData.code !== "SUCCESS") {
      throw new Error(resData.message || "로그인 실패");
    }
    return resData.data;
  } catch (error: any) {
    const msg =
      error.response?.data?.message ||
      error.message ||
      "로그인 실패";
    throw new Error(msg);
  }
}

/**
 * 프로필 조회 (로그인한 사용자 정보)
 * @returns {Promise<User | null>} - 사용자 정보. 실패시 null 또는 에러 throw
 */
export async function fetchProfile(): Promise<User | null> {
  try {
    const response = await API.get<ResponseBuilder<User>>("/auth/profile");
    // 서버에서 SUCCESS 아닌 경우 null 반환
    if (response.data.code !== "SUCCESS") return null;
    return response.data.data;
  } catch (error: any) {
    // 401 등 인증 실패는 throw로 넘겨서 onRefreshFail 로직에 연결
    throw error;
  }
}

/**
 * 로그아웃
 * @returns {Promise<boolean>} - 성공시 true 반환
 * @throws {Error} 로그아웃 실패시
 */
export async function logOut(): Promise<boolean> {
  try {
    const response = await API.post<ResponseBuilder<null>>("/auth/signout");
    if (response.data.code !== "SUCCESS") {
      throw new Error(response.data.message || "로그아웃 실패");
    }
    return true;
  } catch (error: any) {
    let errorMsg = "로그아웃 실패";
    if (error.response?.data?.message) errorMsg = error.response.data.message;
    throw new Error(errorMsg);
  }
}