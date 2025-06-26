import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

/**
 * Layout 컴포넌트
 * ----------------------------------------------------------------------------
 * 관리자 대시보드 어플리케이션 전체의 기본 레이아웃을 담당하는 컴포넌트입니다.
 * 상단(Header), 좌측(Sidebar), 본문(main) 영역을 포함한 화면 레이아웃을 구성합니다.
 * children prop이 있으면 children을, 없으면 react-router-dom의 <Outlet />을 통해 하위 라우트 컴포넌트를 렌더링합니다.
 *
 * @param {Object} props - 컴포넌트 props
 * @param {React.ReactNode} [props.children] - 직접 children이 주어지면 children을, 없으면 <Outlet />을 렌더링
 *
 * @returns {JSX.Element} - 전체 페이지 레이아웃 UI
 */
export function Layout({ children }: { children?: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 to-blue-100">
      <Header onMenuClick={() => setMobileSidebarOpen(true)} />
      <div className="flex flex-1 relative max-w-screen-2xl w-full mx-auto">
        {/* Sidebar: 모바일 Drawer & 데스크탑 고정 */}
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />
        <main
          className={`
            flex-1 min-h-[calc(100vh-56px)]
            p-4 sm:p-6 md:p-8
            bg-white/80
            rounded-xl
            shadow-lg
            mt-4
            mb-6
            ml-0 md:ml-4
            transition-all
            duration-200
            border border-blue-100
            ${mobileSidebarOpen ? "pointer-events-none select-none" : ""}
          `}
          style={{ minHeight: "calc(100vh - 72px)" }}
        >
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}