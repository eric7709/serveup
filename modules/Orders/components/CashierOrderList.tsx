"use client";
import Loader from "@/shared/components/Loader";
import NoResultFound from "@/shared/components/NoResultFound";
import CashierOrderCard from "./CashierOrderCard";
import { useOrderDataStore } from "../store/useOrderDataStore";
import { useEffect, useState } from "react";

export default function CashierOrderList() {
  const { orders, isLoading } = useOrderDataStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  if (loading) return <Loader />;
  if (orders.length === 0 && !isLoading && !loading) return <NoResultFound />;
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide z-20 relative">
      <div className="grid p-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {orders.map((order) => (
          <CashierOrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
