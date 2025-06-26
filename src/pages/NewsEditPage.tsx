import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useRef, useEffect } from "react";
import { ContentEditForm } from "@/components/contents/ContentEditForm";
import { useContentEdit } from "@/hooks/useContentEdit";
import { TiptapEditor } from "@/components/TiptapEditor";
import type { News } from "@/types";
import { fetchNews, updateNews } from "@/api";

export function NewsEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const saveAlertRef = useRef(false);

  // useCallback으로 fields 함수 생성 (불필요한 렌더 방지)
  const fields = useCallback(
    (data: News) => ({
      title: data.title || "",
      content: data.content || "",
      imageUrl: data.files?.[0]?.url || null,
    }),
    []
  );

  const {
    data: news,
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
  } = useContentEdit<News>({
    id,
    fetchFn: fetchNews,
    updateFn: updateNews,
    fields,
  });

  // 저장
  const handleSave = async (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    await baseHandleSave();
    clearChanges();
    saveAlertRef.current = true;
    alert("저장되었습니다.");
    navigate("/news");
  };

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
    navigate("/news");
  };

  // 저장 후 알림 여부 초기화
  useEffect(() => {
    if (saveAlertRef.current) {
      saveAlertRef.current = false;
    }
  }, [hasChanges, news?.id]);

  if (loading) return <div className="p-6 sm:p-8 text-center">로딩 중...</div>;
  if (!news) return <div className="p-6 sm:p-8 text-center">뉴스를 찾을 수 없습니다.</div>;

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
        <div className="mb-4">
          <label className="block mb-2 font-semibold">내용</label>
          <div className="border rounded bg-white min-h-[200px]">
            <TiptapEditor
              content={content}
              onChange={setContent}
              editable={!saving}
            />
          </div>
        </div>
      }
    />
  );
}