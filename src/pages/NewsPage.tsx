import { useNavigate } from "react-router-dom";
import {
  fetchNewsList,
  deleteNews,
  updateNewsOrder,
  updateNewsOrderDirect,
} from "@/api";
import type { News } from "@/types";
import { GenericContentListPage } from "@/components/contents/GenericContentListPage";
import { OrderInputExtraContent } from "@/components/contents/OrderInputExtraContent";

export function NewsPage() {
  const navigate = useNavigate();
  return (
    <GenericContentListPage<News>
      title="뉴스 관리"
      fetchList={fetchNewsList}
      deleteItem={deleteNews}
      updateOrder={updateNewsOrder}
      mapItem={news => ({
        id: news.id,
        title: news.title ?? "제목 없음",
        isInactive: false,
      })}
      onEdit={id => navigate(`/news/${id}`)}
      onCreate={() => navigate("/news/new")}
      emptyText="뉴스가 없습니다."
      renderExtraContent={(item, currentMax, refetch) => (
        <OrderInputExtraContent
          itemId={item.id}
          currentMax={currentMax}
          onOrderUpdate={async (id, newOrder) => {
            await updateNewsOrderDirect(id, newOrder);
          }}
          onSuccess={refetch}
        />
      )}
    />
  );
}