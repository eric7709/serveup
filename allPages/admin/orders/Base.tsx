"use client";
import AdminOrderList from "@/modules/Orders/components/AdminOrderList";
import AdminOrderHeader from "@/modules/Orders/components/AdminOrderHeader";
import { useSyncTableDataStore } from "@/modules/Tables/hooks/useSyncTableDataStore";
import { useOrderDataSyncAndSubscribe } from "@/modules/Orders/hooks/useOrderDataSyncAndSubscribe";
import { useOrderDataStore } from "@/modules/Orders/store/useOrderDataStore";
import { useTableDataStore } from "@/modules/Tables/store/useTableDataStore";
import { useUIStore } from "@/store/useUIStore";
import { useEffect } from "react";

export default function Base() {
  useOrderDataSyncAndSubscribe();
  useSyncTableDataStore();
  const [{ isLoading: loadingOrders }, { isLoading: loadingTables }] = [
    useOrderDataStore(),
    useTableDataStore(),
  ];
  const { stopLoading } = useUIStore();
  useEffect(() => {
    if (!loadingOrders && !loadingTables) {
      stopLoading();
    }
  }, [loadingOrders, loadingTables]);

  return (
    <div className="h-screen  flex flex-col">
      <AdminOrderHeader />
      <AdminOrderList />
    </div>
  );
}
