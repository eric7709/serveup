"use client";
import { useSyncTableDataStore } from "@/modules/Tables/hooks/useSyncTableDataStore";
import { useOrderDataSyncAndSubscribe } from "@/modules/Orders/hooks/useOrderDataSyncAndSubscribe";
import { usePendingOrderAlarm } from "@/modules/Orders/hooks/usePendingOrderAlarm";
import DateDropdown from "@/modules/Kitchen/components/DateDropdown";
import StatusDropdown from "@/modules/Kitchen/components/StatusDropdown";
import OrderPagination from "@/modules/Orders/components/OrderPagination";
import SortDropdown from "@/modules/Kitchen/components/SortDropdown";
import ScalingCircle from "@/modules/Kitchen/components/ScalingCircle";
import BitePointLogo from "@/shared/components/Logo";
import NotificationDropdown from "@/modules/Kitchen/components/NotificationDropdown";
import ProfileDropdown from "@/modules/Kitchen/components/ProfileDropdown";
import { useOrderDataStore } from "../store/useOrderDataStore";
import SearchText from "@/modules/Kitchen/components/SearchText";

export default function AdminHeader() {
  const { orders } = useOrderDataStore();
  const total = orders.reduce((acc, order) => {
    const orderTotal = order.items?.reduce((sum, item) => {
      return sum + (item.price || 0) * (item.quantity || 0);
    }, 0);
    return acc + orderTotal;
  }, 0);
  usePendingOrderAlarm();
  useSyncTableDataStore();
  useOrderDataSyncAndSubscribe();
  return (
    <div className="h-screen flex flex-col">
      <div className="relative z-30">
        <div className="flex px-7 z-30 relative items-center py-2 border-b border-gray-200 justify-between">
          <BitePointLogo />
          <div className="flex gap-8 items-center">
            <p className="text-[13px] font-medium">
              Active Orders:{" "}
              <span className="text-sm ml-1 text-emerald-600">{4}</span>
            </p>
            <p className="text-[13px] font-medium">
              Total:{" "}
              <span className="text-sm ml-1 text-blue-600">
                ₦{total.toLocaleString()}
              </span>
            </p>
            <NotificationDropdown />
            <ProfileDropdown />
          </div>
        </div>
        <div className="flex items-center mt-3 border-b border-gray-200 pb-3 gap-4 px-7">
          <SearchText />
          <DateDropdown />
          <StatusDropdown />
          <OrderPagination />
          <SortDropdown />
          <ScalingCircle />
        </div>
      </div>
    </div>
  );
}
