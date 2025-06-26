import { useAuthStore } from '@/store/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FaSignOutAlt, FaBars } from "react-icons/fa";
import { logOut } from "@/api";

/**
 * Header 컴포넌트
 * ----------------------------------------------------------------------------
 * 관리자 대시보드 상단에 고정되어 표시되는 헤더(네비게이션 바) 컴포넌트입니다.
 * 좌측: 모바일 햄버거(사이드바 열기) 버튼, 중앙: 서비스명, 우측: 로그아웃 버튼.
 * 로그아웃은 비동기 처리, 진행 중 메시지/에러 처리 등 지원.
 *
 * @param {Object} props - 컴포넌트 props
 * @param {() => void} [props.onMenuClick] - 모바일 환경에서 햄버거(사이드바) 버튼 클릭 시 실행
 *
 * @returns {JSX.Element} - Header UI
 */
export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: logOut,
    onSuccess: () => {
      setLoggedIn(false);
      navigate('/login', { replace: true });
    },
    onError: (error: any) => {
      alert(error.message ?? '로그아웃 실패');
    },
  });

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur border-b border-blue-100 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-8 py-3 max-w-screen-2xl mx-auto">
        {/* 모바일 햄버거 메뉴 버튼 */}
        <button
          className="md:hidden mr-2 text-blue-600 hover:text-blue-800"
          onClick={onMenuClick}
          aria-label="사이드바 열기"
        >
          <FaBars size={22} />
        </button>
        <h1 className="text-xl tracking-tight font-bold text-blue-800 flex-1">
          Admin Dashboard
        </h1>
        <Button
          variant="outline"
          className="flex items-center gap-2 ml-2 border-blue-100 hover:border-blue-300"
          onClick={() => { if (!isPending) mutate(); }}
          disabled={isPending}
        >
          <FaSignOutAlt />
          {isPending ? '로그아웃 중...' : '로그아웃'}
        </Button>
      </div>
    </header>
  );
}