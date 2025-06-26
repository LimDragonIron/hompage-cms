import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ContentListItem } from "./ContentListItem";

/**
 * ContentListManager 컴포넌트
 * ----------------------------------------------------------------------------
 * 콘텐츠(뉴스, 히어로, 배너 등) 목록 관리용 리스트 컴포넌트입니다.
 * 목록 조회/편집/삭제/정렬(드래그&드롭) 및 확장 영역(Extra Content) 지원.
 * 내부적으로 아이템 순서 제어(드래그&드롭), 로딩 상태, 빈 목록 문구 등을 처리합니다.
 *
 * @param {Object} props - 컴포넌트 props
 * @param {ContentListItemType[]} props.items - 목록 아이템 배열
 * @param {(id: number) => void} props.onEdit - 편집 버튼 클릭 핸들러
 * @param {(id: number) => void} props.onDelete - 삭제 버튼 클릭 핸들러
 * @param {() => void} [props.onCreate] - 생성 버튼 클릭 핸들러(옵션)
 * @param {boolean} props.isOrdering - 순서 변경(드래그 정렬) 모드 여부
 * @param {(ids: number[]) => Promise<void>} props.onOrderSave - 순서 저장 핸들러(새 순서의 id 배열 전달)
 * @param {(isOrdering: boolean) => void} props.onOrderModeChange - 순서 편집 모드 전환 콜백
 * @param {() => void} [props.onOrderChanged] - 순서 변경 시 콜백(선택)
 * @param {boolean} props.orderChanged - 순서 변경됨 여부(저장 버튼 활성화 제어)
 * @param {boolean} props.loading - 로딩 상태
 * @param {string} props.emptyText - 빈 목록일 때 표시할 문자열
 * @param {(item: ContentListItemType) => React.ReactNode} [props.renderExtraContent] - 우측 확장 버튼/영역 렌더 함수(옵션)
 *
 * @returns {JSX.Element} - 콘텐츠 리스트 관리 UI
 */
type ContentListItemType = {
  id: number;
  title: string;
  isInactive?: boolean;
};

type ContentListManagerProps = {
  items: ContentListItemType[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onCreate?: () => void;
  isOrdering: boolean;
  onOrderSave: (ids: number[]) => Promise<void>;
  onOrderModeChange: (isOrdering: boolean) => void;
  onOrderChanged?: () => void;
  orderChanged: boolean;
  loading: boolean;
  emptyText: string;
  renderExtraContent?: (item: ContentListItemType) => React.ReactNode;
};

export function ContentListManager({
  items,
  onEdit,
  onDelete,
  isOrdering,
  onOrderSave,
  onOrderChanged,
  orderChanged,
  loading,
  emptyText,
  renderExtraContent,
}: ContentListManagerProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [innerItems, setInnerItems] = useState(items);

  // Synchronize innerItems with items from parent unless ordering
  useEffect(() => {
    if (!isOrdering) setInnerItems(items);
  }, [items, isOrdering]);

  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDragOver = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };
  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    setInnerItems(prev => {
      const updated = [...prev];
      const [removed] = updated.splice(draggedIndex, 1);
      updated.splice(index, 0, removed);
      return updated;
    });
    setDraggedIndex(null);
    setDragOverIndex(null);
    if (onOrderChanged) onOrderChanged();
  };
  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleOrderSave = async () => {
    await onOrderSave(innerItems.map(item => item.id));
  };

  return (
    <div>
      {isOrdering && (
        <div className="mb-2 flex justify-end">
          <Button
            onClick={handleOrderSave}
            disabled={!orderChanged || loading}
            variant="default"
          >
            순서 저장
          </Button>
        </div>
      )}
      {loading ? (
        <div className="p-8 text-center">로딩 중...</div>
      ) : (
        <ul className="list-none space-y-2 sm:space-y-3">
          {innerItems.map((item, idx) => (
            <li
              key={item.id}
              draggable={isOrdering}
              onDragStart={() => handleDragStart(idx)}
              onDragOver={e => {
                if (isOrdering) {
                  e.preventDefault();
                  handleDragOver(idx);
                }
              }}
              onDrop={() => isOrdering && handleDrop(idx)}
              onDragEnd={handleDragEnd}
            >
              <ContentListItem
                item={item}
                isOrdering={isOrdering}
                idx={idx}
                dragOverIndex={dragOverIndex}
                draggedIndex={draggedIndex}
                onEdit={onEdit}
                onDelete={onDelete}
                renderExtraContent={renderExtraContent}
              />
            </li>
          ))}
          {innerItems.length === 0 && (
            <li className="text-gray-500 text-center py-8">{emptyText}</li>
          )}
        </ul>
      )}
    </div>
  );
}