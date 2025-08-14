"use client";
import { FaTimes, FaClock } from "react-icons/fa";
import { Employee } from "@/modules/Employees/types/employee";
import { useOrderDataStore } from "@/modules/Orders/store/useOrderDataStore";
import { useTableDataStore } from "../store/useTableDataStore";
import Loader from "@/shared/components/Loader";

type Props = {
  loading: boolean;
  user: Employee | null;
};

export default function WaiterOrders({ loading, user }: Props) {
  const { orders } = useOrderDataStore();
  const { tables } = useTableDataStore();
  const today = new Date().toISOString().split("T")[0];
  const getTableName = (tableId: string): string => {
    const table = tables.find((el) => el.id === tableId);
    return table?.name || table?.tableNumber?.toString() || "Unknown";
  };
  const getTableNumber = (tableId: string): number | null => {
    const table = tables.find((el) => el.id === tableId);
    return table?.tableNumber || null;
  };
  const myOrders = orders.filter((order) => {
    if (!order.createdAt) return false;
    const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
    return (
      order.waiterId === user?.id &&
      orderDate === today &&
      order.status === "pending"
    );
  });
  if (loading) return <Loader />
  return (
    <div className="flex-1 overflow-y-auto space-y-4 mt-4">
      {myOrders.length > 0 ? (
        myOrders.map((order, index) => (
          <div
            key={order.id}
            className={` p-4 rounded-xl shadow`}
          >
            {/* Order info */}
            <div className="mb-2 text-sm space-y-2">
              <p className="font-semibold text-base">
                Order ID: {order.invoiceId}
              </p>
              {order.tableId && (
                <p>Table: {getTableName(order.tableId)}</p>
              )}
              {order.tableId && (
                <p>Table: #{getTableNumber(order.tableId)}</p>
              )}
              <p>Customer: {order.customerName || "—"}</p>
              <p className="flex items-center gap-1">
                <FaClock className="text-xs" />
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}
              </p>
            </div>

            <div className="space-y-1.5">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 bg-gray-100 p-2 rounded text-sm"
                >
                  <span>{item.name}</span>
                  <FaTimes className="text-xs" />
                  <span>{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-sm">
          No pending orders for you today.
        </p>
      )}
    </div>
  );
}
