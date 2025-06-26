import { useNavigate } from "react-router-dom";
import {
  fetchPromotionBanners,
  deletePromotionBanner,
  updatePromotionBannerOrder,
  updatePromotionBannerOrderDirect
} from "@/api/promotion";
import type { PromotionBanner, StatusFilter } from "@/types";
import { GenericContentListPage } from "@/components/contents/GenericContentListPage";
import { OrderInputExtraContent } from "@/components/contents/OrderInputExtraContent";

export function PromotionBannerPage() {
  const navigate = useNavigate();
  return (
    <GenericContentListPage<PromotionBanner>
      title="프로모션 배너 관리"
      fetchList={(status: StatusFilter | undefined) =>
        fetchPromotionBanners({ status }).then(res => ({ items: res.items }))
      }
      deleteItem={deletePromotionBanner}
      updateOrder={updatePromotionBannerOrder}
      mapItem={b => ({
        id: b.id,
        title: b.title ?? "제목 없음",
        isInactive: !b.isActive,
      })}
      onEdit={id => navigate(`/promotion-banners/${id}`)}
      onCreate={() => navigate("/promotion-banners/new")}
      emptyText="배너가 없습니다."
      renderExtraContent={(item, currentMax, refetch) => (
        <OrderInputExtraContent
          itemId={item.id}
          currentMax={currentMax}
          onOrderUpdate={async (id, newOrder) => {
            await updatePromotionBannerOrderDirect(id, newOrder);
          }}
          onSuccess={refetch}
        />
      )}
    />
  );
}