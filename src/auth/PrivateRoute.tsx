import { Spinner } from "@/components/Spinner";
import { useAuthStore } from "@/store/useAuthStore";
import { Navigate } from "react-router-dom";

/**
 * PrivateRoute 컴포넌트
 * ----------------------------------------------------------------------------
 * 인증이 필요한 라우트에서 사용되는 보호(Private) 라우트 컴포넌트입니다.
 * 인증 상태에 따라 자식(children) 컴포넌트를 렌더링하거나 로그인 페이지로 리다이렉트합니다.
 *
 * @param {Object} props - 컴포넌트 props
 * @param {React.ReactNode} props.children - 보호할 컴포넌트(페이지)
 *
 * @returns {JSX.Element} - 인증 상태에 따라 Spinner, Navigate, 또는 자식 컴포넌트
 */
export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const isAuthLoading = useAuthStore((s) => s.isAuthLoading);

  if (isAuthLoading) {
    return <Spinner />
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}