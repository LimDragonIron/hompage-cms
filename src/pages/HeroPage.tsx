import { useNavigate } from "react-router-dom";
import {
  fetchHeroes,
  deleteHero,
  updateHeroOrder,
  updateHeroOrderDirect
} from "@/api";
import type { Hero, StatusFilter } from "@/types";
import { GenericContentListPage } from "@/components/contents/GenericContentListPage";
import { OrderInputExtraContent } from "@/components/contents/OrderInputExtraContent";

export function HeroPage() {
  const navigate = useNavigate();
  return (
    <GenericContentListPage<Hero>
      title="히어로 관리"
      fetchList={(status: StatusFilter | undefined) =>
        fetchHeroes({ status }).then(res => ({ items: res.items }))
      }
      deleteItem={deleteHero}
      updateOrder={updateHeroOrder}
      mapItem={h => ({
        id: h.id,
        title: h.title ?? "이름 없음",
        isInactive: !h.isActive,
      })}
      onEdit={id => navigate(`/heroes/${id}`)}
      onCreate={() => navigate("/heroes/new")}
      emptyText="히어로가 없습니다."
      renderExtraContent={(item, currentMax, refetch) => (
        <OrderInputExtraContent
          itemId={item.id}
          currentMax={currentMax}
          onOrderUpdate={async (id, newOrder) => {
            await updateHeroOrderDirect(id, newOrder);
          }}
          onSuccess={refetch}
        />
      )}
    />
  );
}