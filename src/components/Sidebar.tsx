import { NavLink } from "react-router-dom";
import { FaTimes, FaEnvelope, FaBullhorn, FaGamepad, FaNewspaper, FaBuilding, FaImage } from "react-icons/fa";

/**
 * Sidebar 컴포넌트
 * ----------------------------------------------------------------------------
 * 관리자 대시보드의 좌측 네비게이션 바(사이드바) 컴포넌트입니다.
 * PC/태블릿 환경에선 고정, 모바일에선 Drawer(오버레이)로 동작합니다.
 * 주요 관리 메뉴(메인 타이틀, 게임, 뉴스 등)로 이동할 수 있는 NavLink 목록을 제공합니다.
 *
 * @param {Object} props - 컴포넌트 props
 * @param {boolean} [props.mobileOpen] - 모바일 Drawer 사이드바의 오픈 여부 (true: 열림, false: 닫힘)
 * @param {() => void} [props.onClose] - 모바일 Drawer 닫기 콜백
 * 
 * @returns {JSX.Element} - 반응형 Sidebar UI
 */
export function Sidebar({ mobileOpen, onClose }: { mobileOpen?: boolean; onClose?: () => void }) {
  const navLinks = (
    <nav className="flex flex-col space-y-2 text-base">
      <NavLink
        to="/"
        className={({ isActive }) =>
          "rounded px-3 py-2 font-medium transition flex items-center gap-2 " +
          (isActive
            ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow"
            : "text-gray-600 hover:text-blue-700 hover:bg-gray-100")
        }
      >
        홈
      </NavLink>
      <NavLink
        to="/main-title"
        className={({ isActive }) =>
          "rounded px-3 py-2 font-medium transition flex items-center gap-2 " +
          (isActive
            ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow"
            : "text-gray-600 hover:text-blue-700 hover:bg-gray-100")
        }
      >
        <FaImage className="inline-block" /> 메인 타이틀 관리
      </NavLink>
      <NavLink
        to="/promotion-banners"
        className={({ isActive }) =>
          "rounded px-3 py-2 font-medium transition flex items-center gap-2 " +
          (isActive
            ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow"
            : "text-gray-600 hover:text-blue-700 hover:bg-gray-100")
        }
      >
        <FaBullhorn className="inline-block" /> 프로모션 배너 관리
      </NavLink>
      <NavLink
        to="/games"
        className={({ isActive }) =>
          "rounded px-3 py-2 font-medium transition flex items-center gap-2 " +
          (isActive
            ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow"
            : "text-gray-600 hover:text-blue-700 hover:bg-gray-100")
        }
      >
        <FaGamepad className="inline-block" /> 게임 관리
      </NavLink>
      <NavLink
        to="/news"
        className={({ isActive }) =>
          "rounded px-3 py-2 font-medium transition flex items-center gap-2 " +
          (isActive
            ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow"
            : "text-gray-600 hover:text-blue-700 hover:bg-gray-100")
        }
      >
        <FaNewspaper className="inline-block" /> 뉴스
      </NavLink>
      <NavLink
        to="/contacts"
        className={({ isActive }) =>
          "rounded px-3 py-2 font-medium transition flex items-center gap-2 " +
          (isActive
            ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow"
            : "text-gray-600 hover:text-blue-700 hover:bg-gray-100")
        }
      >
        <FaEnvelope className="inline-block" /> 문의 내역
      </NavLink>
      <NavLink
        to="/company"
        className={({ isActive }) =>
          "rounded px-3 py-2 font-medium transition flex items-center gap-2 " +
          (isActive
            ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow"
            : "text-gray-600 hover:text-blue-700 hover:bg-gray-100")
        }
      >
        <FaBuilding className="inline-block" /> 회사 정보
      </NavLink>
    </nav>
  );

  return (
    <>
      {/* 데스크탑/태블릿용 Sidebar */}
      <aside className="hidden md:flex flex-col w-56 lg:w-64 bg-white/90 border-r border-blue-100 p-4 lg:p-6 shadow-md">
        {navLinks}
      </aside>
      {/* 모바일 Drawer Sidebar */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ${
          mobileOpen ? "block" : "hidden"
        } md:hidden`}
        onClick={onClose}
        aria-label="사이드바 오버레이"
      />
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-blue-100 p-6
          shadow-xl
          transform transition-transform duration-200 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:hidden
        `}
        aria-label="모바일 사이드바"
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-blue-600"
          onClick={onClose}
          aria-label="사이드바 닫기"
        >
          <FaTimes size={22} />
        </button>
        {navLinks}
      </aside>
    </>
  );
}