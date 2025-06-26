import { FaBuilding, FaBullhorn, FaGamepad, FaNewspaper, FaEnvelope, FaImage } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { HomeCard } from "@/components/HomeCard";

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-white">
      <main className="flex flex-col items-center px-4 pt-12 pb-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-5 text-gray-900">Admin Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-4xl mt-4">
          {/* 1. 메인 타이틀 관리 */}
          <HomeCard
            icon={<FaImage className="text-gray-700" />}
            title="메인 타이틀 관리"
            description="메인 화면의 이미지와 영상을 등록, 수정, 삭제할 수 있습니다."
            accentColor="from-gray-200 to-gray-300"
            textColor="text-gray-900"
            onClick={() => navigate("/main-title")}
          />
          {/* 2. 프로모션 배너 관리 */}
          <HomeCard
            icon={<FaBullhorn className="text-gray-700" />}
            title="프로모션 배너 관리"
            description="홈페이지에 노출되는 프로모션 배너를 생성, 수정, 삭제할 수 있습니다."
            accentColor="from-gray-200 to-gray-300"
            textColor="text-gray-900"
            onClick={() => navigate("/promotion-banners")}
          />
          {/* 3. 게임 관리 */}
          <HomeCard
            icon={<FaGamepad className="text-gray-700" />}
            title="게임 관리"
            description="각종 플랫폼들과 이미지 등 게임 관련 정보를 관리합니다."
            accentColor="from-gray-200 to-gray-300"
            textColor="text-gray-900"
            onClick={() => navigate("/games")}
          />
          {/* 4. 뉴스 관리 */}
          <HomeCard
            icon={<FaNewspaper className="text-gray-700" />}
            title="뉴스 관리"
            description="공지사항 및 일반 뉴스를 생성, 수정, 삭제할 수 있습니다."
            accentColor="from-gray-200 to-gray-300"
            textColor="text-gray-900"
            onClick={() => navigate("/news")}
          />
          {/* 5. 문의 내역 */}
          <HomeCard
            icon={<FaEnvelope className="text-gray-700" />}
            title="문의 내역"
            description="사용자 문의 내역을 확인할 수 있습니다."
            accentColor="from-gray-200 to-gray-300"
            textColor="text-gray-900"
            onClick={() => navigate("/contacts")}
          />
          {/* 6. 회사 정보 관리 */}
          <HomeCard
            icon={<FaBuilding className="text-gray-700" />}
            title="회사 정보 관리"
            description="회사 정보를 등록 및 수정할 수 있습니다."
            accentColor="from-gray-200 to-gray-300"
            textColor="text-gray-900"
            onClick={() => navigate("/company")}
          />
        </div>
      </main>
      <footer className="py-5 text-center text-gray-400 text-xs">
        &copy; {new Date().getFullYear()} Admin Dashboard
      </footer>
    </div>
  );
}