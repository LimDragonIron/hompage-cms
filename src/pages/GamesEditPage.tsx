import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ContentEditForm } from "@/components/contents/ContentEditForm";
import { useContentEdit } from "@/hooks/useContentEdit";
import { TiptapEditor } from "@/components/TiptapEditor";
import { Button } from "@/components/ui/button";
import type { Games, PlatformLink } from "@/types";
import { fetchGames, updateGames, deleteGames } from "@/api";
import { isContentEmpty } from "@/lib/contentUtils";

export function GamesEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 플랫폼/링크 관리
  const [platformLinks, setPlatformLinks] = useState<PlatformLink[]>([]);
  const [newPlatform, setNewPlatform] = useState("");
  const [newLink, setNewLink] = useState("");
  const [fileId, setFileId] = useState<number | undefined>(undefined);

  // 저장 후 알림 노출을 위한 ref
  const saveAlertRef = useRef(false);

  // useCallback으로 fields 함수 생성 (무한루프 방지)
  const fields = useCallback((data: Games) => ({
    title: data.title || "",
    content: data.content || "",
    imageUrl: data.files?.[0]?.url || null,
  }), []);

  // useContentEdit 사용
  const {
    data: game,
    loading,
    title,
    setTitle,
    content,
    setContent,
    imageUrl,
    saving,
    hasChanges,
    handleSave: baseHandleSave,
    clearChanges, // 저장 후 변경감지 초기화용
  } = useContentEdit<Games>({
    id,
    fetchFn: fetchGames,
    updateFn: updateGames,
    fields,
    buildUpdatePayload: ({ title, content }) => ({
      title,
      content,
      fileId,
      platformLinks,
    }),
  });

  // 최초 1회만 platformLinks, fileId 세팅
  useEffect(() => {
    if (game) {
      setPlatformLinks(game.platformLinks || []);
      setFileId(game.files?.[0]?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.id]); // id가 바뀔 때만 동기화

  // 플랫폼/링크 추가
  const handleAddPlatformLink = () => {
    const platform = newPlatform.trim();
    const link = newLink.trim();
    if (!platform || !link) {
      alert("플랫폼명과 링크를 모두 입력하세요.");
      return;
    }
    setPlatformLinks((prev) => [...prev, { platform, link }]);
    setNewPlatform("");
    setNewLink("");
  };

  // 플랫폼/링크 삭제
  const handleRemovePlatformLink = (idx: number) => {
    setPlatformLinks((prev) => prev.filter((_, i) => i !== idx));
  };

  // 삭제
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      if (!id) throw new Error("잘못된 접근입니다.");
      await deleteGames(Number(id));
      alert("삭제되었습니다.");
      navigate("/games");
    } catch (e: any) {
      alert(e.message);
    }
  };

  // 저장시 추가 검증
  const handleSave = async (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    if (!title.trim()) {
      alert("제목을 입력해야 합니다.");
      return;
    }
    if (isContentEmpty(content)) {
      alert("내용을 입력해야 합니다.");
      return;
    }
    if (!fileId) {
      alert("이미지를 등록해야 합니다.");
      return;
    }
    if (platformLinks.length === 0) {
      alert("플랫폼/링크를 하나 이상 입력해야 합니다.");
      return;
    }
    if (platformLinks.some((pl) => !pl.platform.trim() || !pl.link.trim())) {
      alert("플랫폼명과 링크는 모두 입력해야 합니다.");
      return;
    }
    await baseHandleSave();
    clearChanges();
    saveAlertRef.current = true;
    alert("저장되었습니다.");
    navigate("/games");
  };

  // 변경 여부: 타이틀/내용/플랫폼링크/파일
  const isChanged =
    hasChanges ||
    JSON.stringify(platformLinks) !== JSON.stringify(game?.platformLinks || []) ||
    fileId !== (game?.files?.[0]?.id ?? undefined);

  // 목록으로 돌아가기(+변경 감지)
  const handleGoList = () => {
    if (isChanged && !saveAlertRef.current) {
      if (
        !window.confirm(
          "변경된 내용이 있습니다. 저장하지 않고 목록으로 돌아가시겠습니까?"
        )
      ) {
        return;
      }
    }
    navigate("/games");
  };

  // 저장 후 알림 여부 초기화
  useEffect(() => {
    if (saveAlertRef.current) {
      saveAlertRef.current = false;
    }
  }, [hasChanges, game?.id]);

  if (loading) return <div className="p-8 text-center">로딩 중...</div>;
  if (!game) return <div className="p-8 text-center">기사를 찾을 수 없습니다.</div>;

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
      saveDisabled={!isChanged}
      deleteButton={
        <Button
          type="button"
          variant="outline"
          onClick={handleDelete}
          disabled={saving}
        >
          삭제
        </Button>
      }
      // 확장영역: 플랫폼/링크 UI 및 리치 에디터
      children={
        <>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">플랫폼/링크</label>
            <div className="space-y-1 mb-2">
              {platformLinks.map((pl, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="inline-block bg-gray-100 px-2 py-1 rounded text-sm">
                    {pl.platform}
                  </span>
                  <a
                    href={pl.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm break-all"
                  >
                    {pl.link}
                  </a>
                  <button
                    type="button"
                    className="ml-1 text-red-400 hover:text-red-700"
                    onClick={() => handleRemovePlatformLink(idx)}
                    title="삭제"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mb-1 flex-wrap">
              <input
                className="border rounded px-2 py-1 w-32"
                value={newPlatform}
                onChange={e => setNewPlatform(e.target.value)}
                disabled={saving}
                placeholder="플랫폼명"
              />
              <input
                className="border rounded px-2 py-1 flex-1 min-w-0"
                value={newLink}
                onChange={e => setNewLink(e.target.value)}
                disabled={saving}
                placeholder="링크"
              />
              <Button size="sm" onClick={handleAddPlatformLink} disabled={saving || !newPlatform.trim() || !newLink.trim()}>
                추가
              </Button>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              예: Steam, PlayStation, Xbox 등. 각 플랫폼별 링크를 입력하세요.
            </div>
          </div>
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
        </>
      }
    />
  );
}