"use client"
import WaiterOrderCard from "./WaiterOrderCard";
import { useOrderDataStore } from "@/modules/Orders/store/useOrderDataStore";
import { useAuth } from "../hooks/useAuth";
import Loader from "@/shared/components/Loader";

export default function WaiterOrderList() {
  const { orders } = useOrderDataStore();
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <p className="text-center text-gray-500 mt-4">No user found.</p>;
  const myOrders = orders.filter((el) => el.waiterId === user.id);
  if (myOrders.length === 0)
    return <p className="text-center text-gray-500 mt-4">No orders assigned to you.</p>;
  return (
    <div>
      {myOrders.map((order) => (
        <WaiterOrderCard key={order.invoiceId} order={order} />
      ))}
    </div>
  );
}
