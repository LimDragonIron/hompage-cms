import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

/**
 * ContentEditForm 컴포넌트
 * ----------------------------------------------------------------------------
 * 콘텐츠(뉴스, 히어로, 배너 등) 편집용 폼 컴포넌트입니다.
 * 제목, 내용, 미디어(이미지 등) 입력과 저장/삭제/목록 이동 버튼을 제공합니다.
 * 미디어 영역은 imageUrl 또는 renderPreview 함수(props)로 커스텀 미리보기를 지원합니다.
 * 자식 컴포넌트(children) 삽입이 가능하여, 추가 필드 확장에 유연합니다.
 *
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.title - 제목값
 * @param {(t: string) => void} props.setTitle - 제목 변경 함수
 * @param {string} props.content - 내용값
 * @param {(c: string) => void} props.setContent - 내용 변경 함수
 * @param {string | null} [props.imageUrl] - 미디어(이미지) URL
 * @param {boolean} props.saving - 저장 중 여부(입력 비활성화)
 * @param {(e?: React.FormEvent) => void} props.onSave - 저장(폼 제출) 핸들러
 * @param {() => void} props.onGoList - 목록 이동 핸들러
 * @param {ReactNode} [props.children] - 추가 입력 컴포넌트
 * @param {boolean} [props.saveDisabled] - 저장버튼 비활성화 여부
 * @param {ReactNode} [props.deleteButton] - 삭제버튼(옵션)
 * @param {() => ReactNode} [props.renderPreview] - 미디어 미리보기 렌더 함수(옵션)
 *
 * @returns {JSX.Element} - 콘텐츠 편집 폼 UI
 */
type InputProps = {
  title: string;
  setTitle: (t: string) => void;
  content: string;
  setContent: (c: string) => void;
  imageUrl?: string | null;
  saving: boolean;
  onSave: (e?: React.FormEvent) => void;
  onGoList: () => void;
  children?: ReactNode;
  saveDisabled?: boolean;
  deleteButton?: ReactNode;
  renderPreview?: () => ReactNode;
};

export function ContentEditForm({
  title,
  setTitle,
  content,
  setContent,
  imageUrl,
  saving,
  onSave,
  onGoList,
  children,
  saveDisabled,
  deleteButton,
  renderPreview,
}: InputProps) {
  return (
    <form
      className="p-4 sm:p-6 md:p-8 max-w-full sm:max-w-lg md:max-w-xl mx-auto"
      onSubmit={onSave}
    >
      <h2 className="text-lg sm:text-xl font-bold mb-4">편집</h2>
      <div className="mb-4">
        <label className="block mb-2 font-semibold text-sm sm:text-base">제목</label>
        <input
          className="border rounded px-3 py-2 w-full text-sm sm:text-base focus:outline-blue-400"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={saving}
          maxLength={100}
        />
      </div>
      {children}
      <div className="mb-4">
        <label className="block mb-2 font-semibold text-sm sm:text-base">내용</label>
        <textarea
          className="border rounded px-3 py-2 w-full text-sm sm:text-base focus:outline-blue-400"
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={4}
          disabled={saving}
          maxLength={500}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold text-sm sm:text-base">미디어</label>
        {renderPreview ? (
          renderPreview()
        ) : imageUrl ? (
          <div className="mb-2">
            <img
              src={imageUrl}
              alt="이미지"
              className="w-full max-w-xs sm:max-w-sm max-h-40 sm:max-h-56 rounded object-cover"
            />
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 mt-6">
        <Button
          type="submit"
          disabled={saving || saveDisabled}
          className="w-full sm:w-auto"
        >
          저장
        </Button>
        {deleteButton}
        <Button
          variant="secondary"
          type="button"
          onClick={onGoList}
          className="w-full sm:w-auto"
        >
          목록으로
        </Button>
      </div>
    </form>
  );
}