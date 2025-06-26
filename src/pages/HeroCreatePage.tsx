import { useContentDraftEditor } from "@/hooks/useContentDraftEditor";
import {
  createOrFetchDraftHero,
  updateDraftHero,
  completeDraftHero,
  deleteDraftHero,
  uploadImage
} from "@/api";
import { Button } from "@/components/ui/button";
import { isContentEmpty } from "@/lib/contentUtils";

export function HeroCreatePage() {
  const {
    title, setTitle,
    content, setContent,
    fileId,
    imagePreview,
    currentImageUrl,
    uploading, draftId, loadingDraft,
    handleFileChange, handleComplete, handleCancel, autoSave,
  } = useContentDraftEditor({
    queryKey: "hero-draft",
    createOrFetchDraft: createOrFetchDraftHero,
    updateDraft: updateDraftHero,
    completeDraft: completeDraftHero,
    deleteDraft: deleteDraftHero,
    uploadImageApi: (file: File, context?: any) => uploadImage(file, context),
    afterCompleteNavigate: "/heroes",
    afterCancelNavigate: "/heroes",
    initialState: {},
    useTag: false,
    usePlatformLinks: false,
  });

  const handleValidate = () => {
    if (!fileId) return "이미지 또는 동영상을 등록해야 정식 등록이 가능합니다.";
    if (!String(title).trim()) return "이름을 입력해야 정식 등록이 가능합니다.";
    if (isContentEmpty(String(content))) return "설명을 입력해야 정식 등록이 가능합니다.";
    return undefined;
  };

  if (loadingDraft || draftId == null) {
    return <div className="p-6 sm:p-8 text-center">임시 저장 불러오는 중...</div>;
  }

  const isImage = (url?: string | null) =>
    url ? /\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(url) : false;
  const isVideo = (url?: string | null) =>
    url ? /\.(mp4|mov|avi|wmv|flv|mkv|webm)$/i.test(url) : false;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-full sm:max-w-lg md:max-w-xl mx-auto">
      <h2 className="text-lg sm:text-xl font-bold mb-4">히어로 생성</h2>
      <div className="mb-4">
        <label className="block mb-2 font-semibold text-sm sm:text-base">이름</label>
        <input
          className="border rounded px-3 py-2 w-full text-sm sm:text-base focus:outline-blue-400"
          value={String(title)}
          onChange={e => {
            setTitle(e.target.value);
            autoSave();
          }}
          disabled={uploading}
          maxLength={100}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold text-sm sm:text-base">설명</label>
        <textarea
          className="border rounded px-3 py-2 w-full text-sm sm:text-base focus:outline-blue-400"
          value={String(content)}
          onChange={e => {
            setContent(e.target.value);
            autoSave();
          }}
          rows={4}
          disabled={uploading}
          maxLength={500}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold text-sm sm:text-base">이미지/동영상</label>
        {currentImageUrl && !imagePreview && (
          <div className="mb-2">
            {isImage(currentImageUrl) ? (
              <img
                src={currentImageUrl}
                alt="현재 이미지"
                className="w-full max-w-xs sm:max-w-sm max-h-40 sm:max-h-56 rounded object-cover"
              />
            ) : isVideo(currentImageUrl) ? (
              <video
                src={currentImageUrl}
                controls
                className="w-full max-w-xs sm:max-w-sm max-h-40 sm:max-h-56 rounded object-cover bg-black"
              />
            ) : null}
          </div>
        )}
        {imagePreview && (
          <div className="mb-2">
            {isImage(imagePreview) ? (
              <img
                src={imagePreview}
                alt="새 이미지 미리보기"
                className="w-full max-w-xs sm:max-w-sm max-h-40 sm:max-h-56 rounded object-cover"
              />
            ) : isVideo(imagePreview) ? (
              <video
                src={imagePreview}
                controls
                className="w-full max-w-xs sm:max-w-sm max-h-40 sm:max-h-56 rounded object-cover bg-black"
              />
            ) : null}
          </div>
        )}
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp, image/gif, image/bmp, image/svg+xml, video/mp4, video/webm, video/ogg, video/avi, video/mov, video/wmv, video/flv, video/mkv"
          onChange={e => handleFileChange(e, { contentType: "HERO" })}
          disabled={uploading}
          className="block w-full text-sm"
        />
        {uploading && <div className="text-gray-500 mt-1">파일 업로드 중...</div>}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 mt-6">
        <Button
          variant="secondary"
          onClick={handleCancel}
          className="w-full sm:w-auto"
        >
          취소
        </Button>
        <Button
          variant="default"
          onClick={() => handleComplete(handleValidate)}
          disabled={uploading || !fileId || !String(title).trim() || isContentEmpty(String(content))}
          className="w-full sm:w-auto"
        >
          등록 완료
        </Button>
      </div>
    </div>
  );
}