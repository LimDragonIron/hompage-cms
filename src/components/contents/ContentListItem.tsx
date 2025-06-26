import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

/**
 * ContentListItem 컴포넌트
 * ----------------------------------------------------------------------------
 * 콘텐츠(뉴스, 히어로, 배너 등) 관리 리스트의 단일 항목을 렌더링하는 컴포넌트입니다.
 * 제목, 상태(비활성), 편집/삭제 버튼, 확장 콘텐츠(옵션), 드래그 정렬 UI를 지원합니다.
 *
 * @param {Object} props - 컴포넌트 props
 * @param {ContentListItemType} props.item - 항목 데이터
 * @param {boolean} props.isOrdering - 순서 변경(드래그 정렬) 모드 여부
 * @param {number} props.idx - 현재 항목 인덱스(0부터 시작)
 * @param {number | null} props.dragOverIndex - 드래그 중 마우스가 올라간 인덱스
 * @param {number | null} props.draggedIndex - 현재 드래그 중인 인덱스
 * @param {(id: number) => void} props.onEdit - 편집 버튼 클릭 시 호출
 * @param {(id: number) => void} props.onDelete - 삭제 버튼 클릭 시 호출
 * @param {(item: ContentListItemType) => React.ReactNode} [props.renderExtraContent] - 우측 버튼 영역에 추가 요소 렌더 함수(옵션)
 *
 * @returns {JSX.Element} - 콘텐츠 리스트 단일 아이템 UI
 */
type ContentListItemType = {
  id: number;
  title: string;
  isInactive?: boolean;
};

type ContentListItemProps = {
  item: ContentListItemType;
  isOrdering: boolean;
  idx: number;
  dragOverIndex: number | null;
  draggedIndex: number | null;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  renderExtraContent?: (item: ContentListItemType) => React.ReactNode;
};
export function ContentListItem({
  item,
  isOrdering,
  idx,
  dragOverIndex,
  draggedIndex,
  onEdit,
  onDelete,
  renderExtraContent,
}: ContentListItemProps) {
  return (
    <Card
      className={
        "flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 py-3 gap-2 transition bg-white rounded shadow-sm " +
        (isOrdering ? "cursor-move border-2 border-dashed " : "") +
        (dragOverIndex === idx && isOrdering
          ? "border-blue-500 "
          : isOrdering
          ? "border-blue-300 "
          : "")
      }
      style={{ opacity: draggedIndex === idx ? 0.5 : 1 }}
    >
      {/* 왼쪽: 제목/상태 */}
      <div className="flex-1 min-w-0">
        <CardHeader className="p-0 mb-2">
          <CardTitle className="flex items-center gap-2 text-base font-semibold truncate">
            {isOrdering && (
              <span className="text-gray-400 mr-2 select-none">#{idx + 1}</span>
            )}
            <span className="truncate">{item.title}</span>
            {item.isInactive && (
              <span className="ml-2 text-xs text-gray-500">(비활성)</span>
            )}
          </CardTitle>
        </CardHeader>
      </div>
      {/* 오른쪽: 인풋/버튼 한 줄 세로중앙정렬 */}
      {!isOrdering && (
        <div className="flex flex-row flex-wrap items-center gap-2 mt-2 sm:mt-0 min-w-fit justify-end">
          {renderExtraContent && renderExtraContent(item)}
          <Button size="sm" variant="outline" className="h-8 px-3" onClick={() => onEdit(item.id)}>
            <FaEdit className="mr-1" /> 편집
          </Button>
          <Button size="sm" variant="destructive" className="h-8 px-3" onClick={() => onDelete(item.id)}>
            <FaTrashAlt className="mr-1" /> 삭제
          </Button>
        </div>
      )}
    </Card>
  );
}