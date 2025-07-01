import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TiptapEditor } from "@/components/TiptapEditor";
import { useContentDraftEditor } from "@/hooks/useContentDraftEditor";
import {
  createOrFetchDraftGames,
  updateDraftGames,
  completeDraftGames,
  deleteDraftGames,
  uploadImage,
} from "@/api";
import { isContentEmpty } from "@/lib/contentUtils";

type PlatformLink = { platform: string; link: string };

export function GamesCreatePage() {
  // 플랫폼-링크 입력 상태
  const [platformLinks, setPlatformLinks] = useState<PlatformLink[]>([]);
  const [newPlatform, setNewPlatform] = useState("");
  const [newLink, setNewLink] = useState("");

  const {
    title, setTitle,
    content, setContent,
    fileId,
    imagePreview,
    currentImageUrl,
    uploading,
    draftId,
    loadingDraft,
    handleFileChange,
    handleComplete,
    handleCancel,
    autoSave,
    draft,
  } = useContentDraftEditor({
    queryKey: "games-draft",
    createOrFetchDraft: createOrFetchDraftGames,
    updateDraft: updateDraftGames,
    completeDraft: completeDraftGames,
    deleteDraft: deleteDraftGames,
    uploadImageApi: (file: File, context?: any) => uploadImage(file, context),
    afterCompleteNavigate: "/games",
    afterCancelNavigate: "/games",
    initialState: {},
    useTag: false, // 태그 사용 안함
  });

  // 최초 draft 불러오면 platformLinks도 반영
  useState(() => {
    if (draft?.platformLinks && Array.isArray(draft.platformLinks)) {
      setPlatformLinks(draft.platformLinks);
    }
  });

  // 플랫폼-링크 추가
  const handleAddPlatformLink = () => {
    const platform = newPlatform.trim();
    const link = newLink.trim();
    if (!platform || !link) {
      alert("플랫폼명과 링크를 모두 입력하세요.");
      return;
    }
    setPlatformLinks((prev) => {
      const next = [...prev, { platform, link }];
      setTimeout(() => autoSave({ platformLinks: next }), 0);
      return next;
    });
    setNewPlatform("");
    setNewLink("");
  };

  // 플랫폼-링크 삭제
  const handleRemovePlatformLink = (idx: number) => {
    setPlatformLinks((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      setTimeout(() => autoSave({ platformLinks: next }), 0);
      return next;
    });
  };

  // 정식 등록시 검증
  const handleValidate = () => {
    if (!fileId) {
      return "이미지를 등록해야 정식 등록이 가능합니다.";
    }
    if (!title.trim()) {
      return "제목을 입력해야 정식 등록이 가능합니다.";
    }
    if (isContentEmpty(content)) {
      return "내용을 입력해야 정식 등록이 가능합니다.";
    }
    if (platformLinks.length === 0) {
      return "플랫폼/링크를 1개 이상 입력해야 합니다.";
    }
    if (platformLinks.some((pl) => !pl.platform.trim() || !pl.link.trim())) {
      return "플랫폼명과 링크는 모두 입력해야 합니다.";
    }
    return undefined;
  };

  if (loadingDraft || draftId == null) {
    return <div className="p-8">임시 저장 불러오는 중...</div>;
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">게임 뉴스 생성</h2>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">제목</label>
        <input
          className="border rounded px-3 py-2 w-full"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            autoSave({ platformLinks });
          }}
          disabled={uploading}
        />
      </div>
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
            disabled={uploading}
            placeholder="플랫폼명"
          />
          <input
            className="border rounded px-2 py-1 flex-1 min-w-0"
            value={newLink}
            onChange={e => setNewLink(e.target.value)}
            disabled={uploading}
            placeholder="링크"
          />
          <Button size="sm" onClick={handleAddPlatformLink} disabled={uploading || !newPlatform.trim() || !newLink.trim()}>
            추가
          </Button>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          예: Steam, PlayStation, Xbox 등. 각 플랫폼별 링크를 입력하세요.
        </div>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">이미지</label>
        {currentImageUrl && !imagePreview && (
          <div className="mb-2">
            <img
              src={currentImageUrl}
              alt="현재 이미지"
              className="max-w-xs max-h-40 rounded"
            />
          </div>
        )}
        {imagePreview && (
          <div className="mb-2">
            <img
              src={imagePreview}
              alt="새 이미지 미리보기"
              className="max-w-xs max-h-40 rounded"
            />
          </div>
        )}
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={e => handleFileChange(e, { contentType: "GAMES_NEWS" })}
          disabled={uploading}
        />
        {uploading && <div className="text-gray-500">이미지 업로드 중...</div>}
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">내용</label>
        <div className="border rounded bg-white min-h-[200px]">
          <TiptapEditor
            content={content}
            onChange={val => {
              setContent(val);
              autoSave({ platformLinks });
            }}
            editable={!uploading}
          />
        </div>
      </div>
      <div className="flex space-x-2">
        <Button variant="secondary" onClick={handleCancel}>
          취소
        </Button>
        <Button
          variant="default"
          onClick={() => handleComplete(handleValidate)}
          disabled={
            uploading ||
            !fileId ||
            !title.trim() ||
            isContentEmpty(content) ||
            platformLinks.length === 0
          }
        >
          등록 완료
        </Button>
      </div>
    </div>
  );
}