import { useContentListPage } from "@/hooks/useContentListPage";
import { ContentListManager } from "./ContentListManager";
import { ContentPageHeader } from "./ContentPageHeader";
import { Button } from "@/components/ui/button";
import { FaSort, FaPlus } from "react-icons/fa";

/**
 * GenericContentListPage 컴포넌트
 * ----------------------------------------------------------------------------
 * 다양한 콘텐츠(뉴스/히어로/배너 등) 유형의 "목록 페이지"를 제네릭 방식으로 구현한 공통 페이지 컴포넌트입니다.
 * 목록 조회/삭제/순서변경/생성/편집 등 주요 기능과, 확장(extra content) 렌더링 및 반응형 레이아웃을 제공합니다.
 * useContentListPage 커스텀 훅과 조합해 상태 관리 및 핸들러를 일원화합니다.
 *
 * @template T - 원본 API 데이터 타입
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.title - 페이지 상단 제목
 * @param {Function} props.fetchList - 목록 요청 함수
 * @param {Function} props.deleteItem - 삭제 요청 함수
 * @param {Function} props.updateOrder - 순서 저장 요청 함수
 * @param {(item: T) => ContentListItemType} props.mapItem - 원본 데이터를 ContentListItemType으로 변환하는 함수
 * @param {(id: number) => void} props.onEdit - 편집 버튼 클릭 핸들러
 * @param {() => void} props.onCreate - 생성 버튼 클릭 핸들러
 * @param {string} props.emptyText - 빈 목록일 때 보여줄 안내문구
 * @param {(item: ContentListItemType, currentMax: number, refetch: () => void) => React.ReactNode} [props.renderExtraContent] - 각 항목 우측에 추가로 노출시킬 컴포넌트 렌더 함수(선택)
 *
 * @returns {JSX.Element} - 제네릭 콘텐츠 목록 페이지 UI
 */
type ContentListItemType = {
  id: number;
  title: string;
  isInactive?: boolean;
};

type GenericContentListPageProps<T> = {
  title: string;
  fetchList: any;
  deleteItem: any;
  updateOrder: any;
  mapItem: (item: T) => ContentListItemType;
  onEdit: (id: number) => void;
  onCreate: () => void;
  emptyText: string;
  renderExtraContent?: (item: ContentListItemType, currentMax: number, refetch: () => void) => React.ReactNode;
};

export function GenericContentListPage<T>({
  title, fetchList, deleteItem, updateOrder, mapItem,
  onEdit, onCreate, emptyText, renderExtraContent
}: GenericContentListPageProps<T>) {
  const {
    cardItems,
    loading,
    isOrdering,
    setIsOrdering,
    orderChanged,
    setOrderChanged,
    onDelete,
    onOrderSave,
    reload,
  } = useContentListPage<T>({
    fetchList,
    deleteItem,
    updateOrder,
    mapItem,
  });

  const actionArea = (
    <>
      <Button
        variant={isOrdering ? "outline" : "secondary"}
        onClick={() => {
          setIsOrdering((v) => !v);
          setOrderChanged(false);
        }}
      >
        <FaSort className="mr-2" />
        {isOrdering ? "순서 편집 취소" : "순서 편집"}
      </Button>
      <Button onClick={onCreate} disabled={isOrdering}>
        <FaPlus className="mr-2" /> 생성
      </Button>
    </>
  );

  return (
    <div className="p-2 sm:p-6 md:p-8 max-w-full sm:max-w-3xl mx-auto">
      <ContentPageHeader
        title={title}
        actionArea={actionArea}
      />
      <ContentListManager
        items={cardItems}
        onEdit={onEdit}
        onDelete={onDelete}
        isOrdering={isOrdering}
        onOrderSave={onOrderSave}
        onOrderModeChange={(val) => {
          setIsOrdering(val);
          if (!val) setOrderChanged(false);
        }}
        onOrderChanged={() => setOrderChanged(true)}
        orderChanged={orderChanged}
        loading={loading}
        emptyText={emptyText}
        renderExtraContent={
          renderExtraContent
            ? (item) => renderExtraContent(item, cardItems.length, reload)
            : undefined
        }
      />
    </div>
  );
}