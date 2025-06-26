import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ContentEditForm } from "@/components/contents/ContentEditForm";
import { useContentEdit } from "@/hooks/useContentEdit";
import type { PromotionBanner } from "@/types";
import {
  fetchPromotionBanner,
  updatePromotionBanner,
  activatePromotionBanner,
  deactivatePromotionBanner,
} from "@/api";
import { Button } from "@/components/ui/button";

export function PromotionBannerEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 활성화 상태 별도 관리
  const [isActive, setIsActive] = useState(false);
  const saveAlertRef = useRef(false);

  // useCallback으로 감싸서 fields 함수 생성
  const fields = useCallback((data: PromotionBanner) => ({
    title: data.title || "",
    content: data.content || "",
    imageUrl: data.files?.[0]?.url || null,
  }), []);

  // 커스텀 훅 사용
  const {
    data: banner,
    loading,
    title,
    setTitle,
    content,
    setContent,
    imageUrl,
    saving,
    hasChanges,
    handleSave: baseHandleSave,
    clearChanges,
  } = useContentEdit<PromotionBanner>({
    id,
    fetchFn: fetchPromotionBanner,
    updateFn: updatePromotionBanner,
    fields,
  });

  // 활성화 상태 동기화 (최초 로딩 시 한 번만 동기화)
  useEffect(() => {
    if (banner) setIsActive(banner.isActive);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [banner?.id]); // banner의 id가 바뀔 때만 동기화

  // 목록으로 돌아가기(+변경 감지)
  const handleGoList = () => {
    if (hasChanges && !saveAlertRef.current) {
      if (
        !window.confirm(
          "변경된 내용이 있습니다. 저장하지 않고 목록으로 돌아가시겠습니까?"
        )
      ) {
        return;
      }
    }
    navigate("/promotion-banners");
  };

  const handleActivate = async () => {
    if (!window.confirm("이 배너를 활성화 하시겠습니까?")) return;
    try {
      if (!id) throw new Error("잘못된 접근입니다.");
      await activatePromotionBanner(Number(id));
      setIsActive(true);
      alert("배너가 활성화되었습니다.");
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDeactivate = async () => {
    if (!window.confirm("이 배너를 비활성화 하시겠습니까?")) return;
    try {
      if (!id) throw new Error("잘못된 접근입니다.");
      await deactivatePromotionBanner(Number(id));
      setIsActive(false);
      alert("배너가 비활성화되었습니다.");
    } catch (e: any) {
      alert(e.message);
    }
  };

  // 저장
  const handleSave = async (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    await baseHandleSave();
    clearChanges();
    saveAlertRef.current = true;
    alert("저장되었습니다.");
    navigate("/promotion-banners");
  };

  // 저장 후 알림 여부 초기화
  useEffect(() => {
    if (saveAlertRef.current) {
      saveAlertRef.current = false;
    }
  }, [hasChanges, banner?.id]);

  if (loading) return <div className="p-6 sm:p-8 text-center">로딩 중...</div>;
  if (!banner) return <div className="p-6 sm:p-8 text-center">배너를 찾을 수 없습니다.</div>;

  // 활성화/비활성화 버튼은 ContentEditForm의 children으로 전달
  return (
    <ContentEditForm
      title={title}
      setTitle={setTitle}
      content={content}
      setContent={setContent}
      imageUrl={imageUrl}
      saving={saving}
      onSave={handleSave}
      onGoList={handleGoList}
      children={
        <div className="flex flex-row gap-2 mb-4">
          {isActive ? (
            <Button
              onClick={handleDeactivate}
              variant="outline"
              disabled={saving}
              type="button"
              className="w-full sm:w-auto"
            >
              비활성화
            </Button>
          ) : (
            <Button
              onClick={handleActivate}
              variant="outline"
              disabled={saving}
              type="button"
              className="w-full sm:w-auto"
            >
              활성화
            </Button>
          )}
        </div>
      }
    />
  );
}