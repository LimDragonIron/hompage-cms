import { useContentDraftEditor } from "@/hooks/useContentDraftEditor";
import {
  createOrFetchDraftPromotionBanner,
  updateDraftPromotionBanner,
  completeDraftPromotionBanner,
  deleteDraftPromotionBanner,
  uploadImage
} from "@/api";
import { Button } from "@/components/ui/button";
import { isContentEmpty } from "@/lib/contentUtils";

export function PromotionBannerCreatePage() {
  const {
    title, setTitle,
    content, setContent,
    fileId,
    imagePreview,
    currentImageUrl,
    uploading, draftId, loadingDraft,
    handleFileChange, handleComplete, handleCancel, autoSave,
  } = useContentDraftEditor({
    queryKey: "promotion-draft",
    createOrFetchDraft: createOrFetchDraftPromotionBanner,
    updateDraft: updateDraftPromotionBanner,
    completeDraft: completeDraftPromotionBanner,
    deleteDraft: deleteDraftPromotionBanner,
    // uploadImage의 두 번째 인자로 context(targetType)를 반드시 넘겨야 함!
    uploadImageApi: (file: File, context?: any) => uploadImage(file, context),
    afterCompleteNavigate: "/promotion-banners",
    afterCancelNavigate: "/promotion-banners",
    initialState: {},
    useTag: false,
    usePlatformLinks: false,
  });

  // 정식 등록시 검증 함수
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
    return undefined;
  };

  if (loadingDraft || draftId == null) {
    return <div className="p-6 sm:p-8 text-center">임시 저장 불러오는 중...</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-full sm:max-w-lg md:max-w-xl mx-auto">
      <h2 className="text-lg sm:text-xl font-bold mb-4">프로모션 배너 생성</h2>
      <div className="mb-4">
        <label className="block mb-2 font-semibold text-sm sm:text-base">제목</label>
        <input
          className="border rounded px-3 py-2 w-full text-sm sm:text-base focus:outline-blue-400"
          value={title}
          onChange={e => {
            setTitle(e.target.value);
            autoSave();
          }}
          disabled={uploading}
          maxLength={100}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold text-sm sm:text-base">내용</label>
        <textarea
          className="border rounded px-3 py-2 w-full text-sm sm:text-base focus:outline-blue-400"
          value={content}
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
        <label className="block mb-2 font-semibold text-sm sm:text-base">이미지</label>
        {currentImageUrl && !imagePreview && (
          <div className="mb-2">
            <img src={currentImageUrl} alt="현재 이미지" className="w-full max-w-xs sm:max-w-sm max-h-40 sm:max-h-56 rounded object-cover" />
          </div>
        )}
        {imagePreview && (
          <div className="mb-2">
            <img src={imagePreview} alt="새 이미지 미리보기" className="w-full max-w-xs sm:max-w-sm max-h-40 sm:max-h-56 rounded object-cover" />
          </div>
        )}
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={e => handleFileChange(e, { contentType: "PROMOTION_BANNER" })}
          disabled={uploading}
          className="block w-full text-sm"
        />
        {uploading && <div className="text-gray-500 mt-1">이미지 업로드 중...</div>}
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
          disabled={uploading || !fileId || !title.trim() || isContentEmpty(content)}
          className="w-full sm:w-auto"
        >
          등록 완료
        </Button>
      </div>
    </div>
  );
}