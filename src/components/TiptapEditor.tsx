import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { MenuBar } from "./MenuBar";

/**
 * TiptapEditor 컴포넌트
 * ---------------------------------------------------------------------------
 * Tiptap 기반의 WYSIWYG 리치 텍스트 에디터 컴포넌트입니다.
 * 텍스트, 이미지, 링크, 표, 밑줄 등 다양한 서식 기능을 지원합니다.
 * 상단에 MenuBar(서식 툴바) 포함, 내용 변경 시 onChange 콜백으로 상위에 알림.
 *
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.content - 에디터에 표시할 초기 HTML 콘텐츠
 * @param {(value: string) => void} props.onChange - 에디터 내 내용 변경 시 호출되는 콜백(HTML string 전달)
 * @param {boolean} [props.editable=true] - 에디터 수정 가능 여부(기본값 true)
 *
 * @returns {JSX.Element} Tiptap 에디터 UI
 * ---------------------------------------------------------------------------
 */
interface TiptapEditorProps {
  /** 에디터에 표시할 초기 HTML 콘텐츠 */
  content: string;
  /** 에디터 내 내용 변경 시 호출되는 콜백(HTML string 전달) */
  onChange: (value: string) => void;
  /** 에디터 수정 가능 여부(기본값 true) */
  editable?: boolean;
}

export function TiptapEditor({ content, onChange, editable = true }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    editorProps: {
      attributes: {
        class: "prose max-w-full focus:outline-none bg-white min-h-[200px] p-4 rounded border border-gray-200",
      },
    },
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editable, editor]);

  if (!editor) {
    return <div>에디터 로딩 중...</div>;
  }

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}