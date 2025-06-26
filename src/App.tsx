import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { fetchProfile } from "./api/auth";
import { useNavigate, Routes, Route, Outlet } from "react-router-dom";
import { setOnRefreshFail } from "./api/axiosInstance";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { PrivateRoute } from "@/auth/PrivateRoute";
import { PromotionBannerPage } from "./pages/PromotionBannerPage";
import { PromotionBannerEditPage } from "./pages/PromotionBannerEditPage";
import { GamesPage } from "./pages/GamesPage";
import { NewsPage } from "./pages/NewsPage";
import { PromotionBannerCreatePage } from "./pages/PromotionBannerCreatePage";
import { Layout } from "@/components/Layout";
import { GamesCreatePage } from "./pages/GamesCreatePage";
import { GamesEditPage } from "./pages/GamesEditPage";
import { NewsCreatePage } from "./pages/NewsCreatePage";
import { NewsEditPage } from "./pages/NewsEditPage";
import { CompanyPage } from "./pages/CompanyPage";
import { CompanyEditPage } from "./pages/CompanyEditPage";
import { HeroCreatePage } from "./pages/HeroCreatePage";
import { HeroPage } from "./pages/HeroPage";
import { HeroEditPage } from "./pages/HeroEditPage";
import { ContactPage } from "./pages/ContactPage";
import { ContactDetailPage } from "./pages/ContactDetailPage";

// PrivateRoute + Layout 조합
function PrivateLayoutWithUI() {
  return (
    <PrivateRoute>
      <Layout>
        <Outlet />
      </Layout>
    </PrivateRoute>
  );
}

function App() {
  const setLoggedIn = useAuthStore((s) => s.setLoggedIn);
  const setAuthLoading = useAuthStore((s) => s.setAuthLoading);
  const navigate = useNavigate();

  useEffect(() => {
    setOnRefreshFail(() => {
      setLoggedIn(false);
      setAuthLoading(false);
      navigate("/login", { replace: true });
    });

    setAuthLoading(true);
    fetchProfile()
      .then((user) => setLoggedIn(!!user))
      .catch(() => {
        setLoggedIn(false);
        setAuthLoading(false);
        navigate("/login", { replace: true });
      })
      .finally(() => setAuthLoading(false));
  }, [setLoggedIn, setAuthLoading, navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* 로그인 외 모든 라우트에 Layout + PrivateRoute 적용 */}
      <Route element={<PrivateLayoutWithUI />}>
        <Route path="/" element={<Home />} />
        <Route path="/promotion-banners" element={<PromotionBannerPage />} />
        <Route path="/promotion-banners/:id" element={<PromotionBannerEditPage />} />
        <Route path="/promotion-banners/new" element={<PromotionBannerCreatePage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/games/new" element={<GamesCreatePage />} />
        <Route path="/games/:id" element={<GamesEditPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/new" element={<NewsCreatePage />} />
        <Route path="/news/:id" element={<NewsEditPage />} />
        <Route path="/company" element={<CompanyPage />} />
        <Route path="/company/edit" element={<CompanyEditPage />} />
        <Route path="/heroes" element={<HeroPage />} />
        <Route path="/heroes/new" element={<HeroCreatePage />} />
        <Route path="/heroes/:id" element={<HeroEditPage />} />
        <Route path="/contacts" element={<ContactPage />} />
        <Route path="/contacts/:id" element={<ContactDetailPage />} />
      </Route>
      {/* 404 등 추가 필요시 여기에 */}
    </Routes>
  );
}

export default App;