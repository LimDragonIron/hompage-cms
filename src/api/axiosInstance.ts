import axios from "axios";

/**
 * Axios API Instance with 401/Refresh Handling
 * ----------------------------------------------------------------------------
 * - API: 메인 axios 인스턴스. 모든 API 요청에 사용.
 * - RefreshAPI: 토큰 갱신(refresh)만 담당하는 별도 인스턴스 (인터셉터 없음)
 *
 * 401(Unauthorized) 응답 처리 흐름:
 *   1. API 요청에서 401이 발생하면, 자동으로 /auth/refresh로 토큰 갱신을 시도합니다.
 *   2. 갱신이 성공하면 대기 중이던 요청을 재시도합니다.
 *   3. 갱신이 실패하면 onRefreshFail()을 실행하며, 기본 동작은 로그인 페이지(/login)로 이동합니다.
 *   4. refresh 이후에도 다시 401이 응답되면 무조건 로그인 페이지로 이동합니다.
 *
 * setOnRefreshFail(cb): onRefreshFail 콜백을 커스터마이즈 할 수 있습니다. (예: 모달 표시 등)
 *
 * @see 인터셉터 코드 및 구체 흐름 참고
 */

let onRefreshFail = () => {
  window.location.href = "/login";
};
export function setOnRefreshFail(cb: () => void) {
  onRefreshFail = cb;
}

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ★ refresh 요청만 담당할 별도 인스턴스 (인터셉터 없음!)
const RefreshAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

API.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config || {};
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await RefreshAPI.post("/auth/refresh");
          isRefreshing = false;
          refreshSubscribers.forEach(cb => cb());
          refreshSubscribers = [];
        } catch (refreshError) {
          isRefreshing = false;
          onRefreshFail();
          return Promise.reject(refreshError);
        }
      }
      // 'reject' 파라미터 제거!
      return new Promise((resolve) => {
        refreshSubscribers.push(() => {
          resolve(API(originalRequest));
        });
      });
    }
    // refresh 이후에도 401이면 무조건 로그인 이동
    if (error.response && error.response.status === 401) {
      onRefreshFail();
    }
    return Promise.reject(error);
  }
);

export default API;