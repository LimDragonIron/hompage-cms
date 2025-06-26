import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ContentEditForm } from "@/components/contents/ContentEditForm";
import { useContentEdit } from "@/hooks/useContentEdit";
import type { Hero } from "@/types";
import {
  fetchHero,
  updateHero,
  activateHero,
  deactivateHero,
} from "@/api/hero";
import { Button } from "@/components/ui/button";

export function HeroEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isActive, setIsActive] = useState(false);
  const saveAlertRef = useRef(false);

  const fields = useCallback((data: Hero) => ({
    title: data.title || "",
    content: data.content || "",
    imageUrl: data.files?.[0]?.url || null,
    fileType: data.files?.[0]?.type || null,
  }), []);

  const buildUpdatePayload = ({ title, content }: { title: string; content: string }) => ({
    title,
    content,
  });

  const {
    data: hero,
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
  } = useContentEdit<Hero>({
    id,
    fetchFn: fetchHero,
    updateFn: updateHero,
    fields,
    buildUpdatePayload,
  });

  useEffect(() => {
    if (hero) setIsActive(hero.isActive);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hero?.id]);

  const isImage = (url?: string | null) =>
    url ? /\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(url) : false;
  const isVideo = (url?: string | null) =>
    url ? /\.(mp4|mov|avi|wmv|flv|mkv|webm)$/i.test(url) : false;

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
    navigate("/heroes");
  };

  const handleActivate = async () => {
    if (!window.confirm("이 히어로를 활성화 하시겠습니까?")) return;
    try {
      if (!id) throw new Error("잘못된 접근입니다.");
      await activateHero(Number(id));
      setIsActive(true);
      alert("히어로가 활성화되었습니다.");
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDeactivate = async () => {
    if (!window.confirm("이 히어로를 비활성화 하시겠습니까?")) return;
    try {
      if (!id) throw new Error("잘못된 접근입니다.");
      await deactivateHero(Number(id));
      setIsActive(false);
      alert("히어로가 비활성화되었습니다.");
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleSave = async (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    await baseHandleSave();
    clearChanges();
    saveAlertRef.current = true;
    alert("저장되었습니다.");
    navigate("/heroes");
  };

  useEffect(() => {
    if (saveAlertRef.current) {
      saveAlertRef.current = false;
    }
  }, [hasChanges, hero?.id]);

  if (loading) return <div className="p-6 sm:p-8 text-center">로딩 중...</div>;
  if (!hero) return <div className="p-6 sm:p-8 text-center">히어로를 찾을 수 없습니다.</div>;

  return (
    <ContentEditForm
      title={title}
      setTitle={setTitle}
      content={content}
      setContent={setContent}
      imageUrl={imageUrl}
      renderPreview={() => {
        if (!imageUrl) return null;
        if (isImage(imageUrl)) {
          return (
            <img
              src={imageUrl}
              alt="첨부 이미지"
              className="w-full max-w-xs sm:max-w-sm max-h-40 sm:max-h-56 rounded object-cover"
            />
          );
        } else if (isVideo(imageUrl)) {
          return (
            <video
              src={imageUrl}
              controls
              className="w-full max-w-xs sm:max-w-sm max-h-40 sm:max-h-56 rounded object-cover bg-black"
            />
          );
        }
        return null;
      }}
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