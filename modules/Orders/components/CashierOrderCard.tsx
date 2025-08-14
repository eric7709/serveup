"use client";
import { Order, OrderStatus } from "@/modules/Orders/types/orders";
import { FaPrint, FaClock, FaUser } from "react-icons/fa";
import { getStyle } from "../../Kitchen/utils/getStyle";
import {
  useUpdateOrder,
} from "@/modules/Orders/hooks/useOrderServices";
import { useQueryClient } from "@tanstack/react-query";
import { convertTo12HourFormat } from "@/shared/utils/convertTo12HourFormat";
import { useEffect, useState, useRef } from "react";
import { useTableDataStore } from "@/modules/Tables/store/useTableDataStore";
import { Table } from "@/modules/Tables/types/table";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import Invoice from "@/modules/Orders/components/Invoice";
import { useOrderDataStore } from "../store/useOrderDataStore";
import PaymentMethod from "./PaymentMethod";

type Props = {
  order: Order;
};

export default function CashierOrderCard({ order }: Props) {
  const { customerName, customerTitle, waiterName } = order;
  const { tables } = useTableDataStore();
  const queryClient = useQueryClient();
  const { mutate, isPending: isLoading } = useUpdateOrder();
  const { updateOrder } = useOrderDataStore();
  const [table, setTable] = useState<Table | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const t = tables.find((el) => el.id === order.tableId);
    if (t) setTable(t);
  }, [tables, order.tableId]);

  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: "Invoice",
  });

  const getNextStatus = (current: OrderStatus): OrderStatus => {
    if (current === "cancelled") return "cancelled";
    const sequence: OrderStatus[] = ["pending", "completed", "paid"];
    const index = sequence.indexOf(current);
    return index < sequence.length - 1 ? sequence[index + 1] : current;
  };

  const getButtonText = (status: OrderStatus): string => {
    switch (status) {
      case "pending":
        return "Start Preparing";
      case "completed":
        return "Complete";
      case "paid":
        return "Paid";
      case "cancelled":
        return "Cancelled";
      default:
        return "Mark Complete";
    }
  };

  const handleUpdateStatus = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (order.status === "cancelled") return;
    const next = getNextStatus(order.status);
    if (next === "paid" && !paymentMethod) {
      setError("Please select a payment method");
      toast.error("Please select a payment method");
      return;
    }
    setError("");
    const updates: any = { status: next };
    if (next === "paid" && paymentMethod) {
      updates.paymentMethod = paymentMethod;
    }
    mutate(
      { id: order.id, updates },
      {
        onSuccess: () => {
          // Also update the local store with the same data
          const localUpdates: any = { status: next };
          if (next === "paid" && paymentMethod) {
            localUpdates.paymentMethod = paymentMethod;
          }
          updateOrder(order.id, localUpdates);

          queryClient.invalidateQueries({ queryKey: ["orders"] });
          if (order.status === "pending" && next === "completed") {
            toast.success(
              `Order for table #${table?.tableNumber} is preparing`
            );
          }
          if (order.status === "completed" && next === "paid") {
            toast.success(`Order #${table?.tableNumber} has been paid ✅`);
          }
        },
        onError: (error) => {
          console.error("Update failed:", error);
          toast.error("Failed to update order status");
        },
      }
    );
  };
  useEffect(() => {
    if (paymentMethod && error) {
      setError("");
    }
  }, [paymentMethod, error]);

  const getCurrentDateTime = (): string => {
    return new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <>
      <article className="w-full bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col select-none">
        <header className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <div
              className={`flex-shrink-0 px-3 py-2 rounded-lg font-semibold text-lg text-white ${getStyle(order.status).bg} shadow-sm`}
              aria-label={`Table number ${table?.tableNumber ?? "?"}`}
            >
              #{table?.tableNumber ?? "?"}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {customerTitle} {customerName}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5 select-text">
                <FaClock />
                <time dateTime={order.createdAt}>
                  {convertTo12HourFormat(order.createdAt)}
                </time>
              </div>
            </div>
          </div>
          <button
            onClick={handlePrint}
            title="Print Invoice"
            aria-label="Print Invoice"
            className="text-gray-500 cursor-pointer hover:text-gray-700 transition"
          >
            <FaPrint size={18} />
          </button>
        </header>

        <section className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 text-gray-700 text-xs">
          <div className="flex items-center gap-1.5">
            <FaUser className="text-gray-400" size={14} />
            <span>Waiter:</span>
            <span className="font-semibold text-gray-900">{waiterName}</span>
          </div>
          <p className="font-medium italic text-gray-600 truncate max-w-[120px] text-right">
            {order.tableName}
          </p>
        </section>

        <section className="flex-1 px-4 py-3 bg-white overflow-auto">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center mb-2 last:mb-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center rounded bg-blue-600 text-white font-semibold w-6 h-6 text-xs select-none">
                  {item.quantity}
                </div>
                <p className="text-gray-900 font-medium text-[13px] capitalize">
                  {item.name}
                </p>
              </div>
              <p className="font-semibold text-gray-800 text-[13px]">
                ${item.price.toFixed(2)}
              </p>
            </div>
          ))}
        </section>

        <section className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200 font-semibold text-gray-900 text-[15px] select-text">
          <p>
            {order.items.length} {order.items.length > 1 ? "Items" : "Item"}
          </p>
          {order.status === "paid" && (
            <p className="text-sm capitalize text-green-500">
              {order.paymentMethod}
            </p>
          )}
          <p>${order.total.toLocaleString()}</p>
        </section>

        {order.status === "completed" && (
          <>
            <PaymentMethod {...{ paymentMethod, setPaymentMethod }} />
            {error && <p className="text-red-500 text-xs mt-1 px-4">{error}</p>}
          </>
        )}

        <footer className="p-4 bg-white border-t border-gray-100">
          <button
            onClick={handleUpdateStatus}
            disabled={
              isLoading ||
              order.status === "paid" ||
              order.status === "cancelled"
            }
            className={`w-full rounded-md py-3 font-semibold text-sm transition-transform duration-150
              ${
                order.status === "cancelled"
                  ? "bg-red-500 text-white cursor-not-allowed"
                  : order.status === "pending"
                    ? "bg-amber-500 text-white shadow-md cursor-pointer hover:bg-amber-600 active:scale-95"
                    : isLoading || order.status === "paid"
                      ? "bg-green-500 text-white cursor-not-allowed"
                      : "bg-cyan-500 text-white shadow-md hover:bg-green-700 active:scale-95 cursor-pointer"
              }
            `}
          >
            {isLoading ? "Loading..." : getButtonText(order.status)}
          </button>
        </footer>
      </article>

      <div style={{ display: "none" }}>
        <Invoice
          ref={invoiceRef}
          order={order}
          waiterName={waiterName}
          currentDateTime={getCurrentDateTime()}
        />
      </div>
    </>
  );
}
