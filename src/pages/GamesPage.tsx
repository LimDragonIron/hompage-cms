import { useNavigate } from "react-router-dom";
import {
  fetchGamesList,
  deleteGames,
  updateGamesOrder,
  updateGamesOrderDirect,
} from "@/api/games";
import type { Games } from "@/types";
import { GenericContentListPage } from "@/components/contents/GenericContentListPage";
import { OrderInputExtraContent } from "@/components/contents/OrderInputExtraContent";

export function GamesPage() {
  const navigate = useNavigate();
  return (
    <GenericContentListPage<Games>
      title="게임 뉴스 관리"
      fetchList={fetchGamesList}
      deleteItem={deleteGames}
      updateOrder={updateGamesOrder}
      mapItem={n => ({
        id: n.id,
        title: n.title ?? "제목 없음",
        isInactive: false,
      })}
      onEdit={id => navigate(`/games/${id}`)}
      onCreate={() => navigate("/games/new")}
      emptyText="뉴스가 없습니다."
      renderExtraContent={(item, currentMax, refetch) => (
        <OrderInputExtraContent
          itemId={item.id}
          currentMax={currentMax}
          onOrderUpdate={async (id, newOrder) => {
            await updateGamesOrderDirect(id, newOrder);
          }}
          onSuccess={refetch}
        />
      )}
    />
  );
}