import { useEffect, useState, useCallback } from "react";

type ContentListItemType = {
  id: number;
  title: string;
  isInactive?: boolean;
};

type UseContentListPageParams<T> = {
  /**
   * 콘텐츠 목록 데이터 비동기 조회 함수
   * @param status - 필터링할 상태(draft, active, inactive)
   * @returns {Promise<{ items: T[] }>} - 아이템 목록을 포함한 Promise 객체
   */
  fetchList: (status?: "draft" | "active" | "inactive") => Promise<{ items: T[] }>;
  /**
   * 개별 항목 삭제 함수
   * @param id - 삭제할 항목의 id
   * @returns {Promise<void>}
   */
  deleteItem: (id: number) => Promise<void>;
  /**
   * id 배열 기준으로 순서 저장 함수
   * @param ids - 새로 정렬된 id 배열
   * @returns {Promise<void>}
   */
  updateOrder: (ids: number[]) => Promise<void>;
  /**
   * 각 아이템을 리스트에 표시할 최소 정보로 변환하는 함수
   * @param item - 원본 데이터
   * @returns {ContentListItemType}
   */
  mapItem: (item: T) => ContentListItemType;
  /**
   * 리스트 조회 시 필터 적용(옵션)
   */
  filterStatus?: "draft" | "active" | "inactive" | "all";
};

/**
 * 리스트(카드형/테이블형 등) 형태로 콘텐츠 목록을 표시하는 페이지에서 공통적으로 사용하는 훅입니다.
 *
 * @template T - 실제 서버에서 받아오는 개별 콘텐츠 데이터 타입
 * @param {UseContentListPageParams<T>} params - 훅 파라미터
 * @returns {{
 *   cardItems: ContentListItemType[],
 *   loading: boolean,
 *   isOrdering: boolean,
 *   setIsOrdering: (v: boolean) => void,
 *   orderChanged: boolean,
 *   setOrderChanged: (v: boolean) => void,
 *   onDelete: (id: number) => Promise<void>,
 *   onOrderSave: (ids: number[]) => Promise<void>,
 *   reload: () => Promise<void>,
 *   setItems: (cb: (prev: T[]) => T[]) => void,
 * }}
 */
export function useContentListPage<T>({
  fetchList,
  deleteItem,
  updateOrder,
  mapItem,
  filterStatus,
}: UseContentListPageParams<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderChanged, setOrderChanged] = useState(false);

  // 목록 불러오기
  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      // filterStatus가 "all"이면 undefined로 넘기고, 아니면 그대로 넘겨줌
      const res = await fetchList(filterStatus === "all" ? undefined : filterStatus);
      setItems(res.items); // 항상 배열만 저장
    } catch (e: any) {
      alert(e.message || "목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [fetchList, filterStatus]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  // 삭제
  const onDelete = async (id: number) => {
    if (!window.confirm("정말 삭제할까요?")) return;
    try {
      await deleteItem(id);
      setItems(prev => prev.filter(item => mapItem(item).id !== id));
    } catch (e: any) {
      alert(e.message || "삭제 실패");
    }
  };

  // 순서 저장
  const onOrderSave = async (ids: number[]) => {
    try {
      setLoading(true);
      await updateOrder(ids);
      setOrderChanged(false);
      alert("순서가 저장되었습니다.");
    } catch (e: any) {
      alert(e.message || "순서 저장 실패");
    } finally {
      setLoading(false);
    }
  };

  const cardItems = items.map(mapItem);

  return {
    cardItems,
    loading,
    isOrdering,
    setIsOrdering,
    orderChanged,
    setOrderChanged,
    onDelete,
    onOrderSave,
    reload: loadList,
    setItems,
  };
}