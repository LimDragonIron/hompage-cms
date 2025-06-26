import type { Editor } from "@tiptap/react";

interface MenuBarProps {
  editor: Editor | null;
}

const headingLevels = [1, 2, 3] as const;

/**
 * MenuBar 컴포넌트
 * ----------------------------------------------------------------------------
 * Tiptap Editor의 텍스트 서식 툴바(메뉴바) 컴포넌트입니다.
 * 에디터에 Bold, Italic, Underline, Strike, Heading(H1~H3), Bullet List 토글 버튼을 제공합니다.
 *
 * @param {Object} props - 컴포넌트 props
 * @param {Editor|null} props.editor - Tiptap 에디터 인스턴스
 *
 * @returns {JSX.Element|null} - 에디터가 없으면 null, 있으면 메뉴바 UI
 */
export function MenuBar({ editor }: MenuBarProps) {
  if (!editor) return null;

  return (
    <div className="flex gap-1 mb-2 flex-wrap">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "font-bold bg-gray-200 px-2 py-1 rounded" : "px-2 py-1"}
      >
        B
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "italic bg-gray-200 px-2 py-1 rounded" : "px-2 py-1"}
      >
        I
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "underline bg-gray-200 px-2 py-1 rounded" : "px-2 py-1"}
      >
        U
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "line-through bg-gray-200 px-2 py-1 rounded" : "px-2 py-1"}
      >
        S
      </button>
      {headingLevels.map((level) => (
        <button
          key={level}
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          className={editor.isActive("heading", { level }) ? "bg-gray-200 px-2 py-1 rounded" : "px-2 py-1"}
        >
          H{level}
        </button>
      ))}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "bg-gray-200 px-2 py-1 rounded" : "px-2 py-1"}
      >
        • List
      </button>
    </div>
  );
}