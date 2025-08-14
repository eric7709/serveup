"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Clock,
  Utensils,
  ShoppingBag,
  X as MultiplyIcon,
  User,
  CreditCard,
} from "lucide-react";

import { Order, OrderStatus } from "../types/orders";
import { Table } from "@/modules/Tables/types/table";
import { useTableDataStore } from "@/modules/Tables/store/useTableDataStore";
import { useOrderDataStore } from "../store/useOrderDataStore";
import { useUpdateOrderStatus } from "../hooks/useOrderServices";
import { convertTo12HourFormat } from "@/shared/utils/convertTo12HourFormat";
import { statusBadgeColors } from "../constants/statusBadgeColors";
import ModalOverlay from "@/shared/components/ModalOverlay";

interface AdminOrderCardProps {
  order: Order;
}

const CARD_STYLES = {
  container: `
    w-full h-full flex flex-col bg-white border border-slate-200 rounded-lg p-2.5 
    transition-all duration-150 ease-in-out hover:shadow-md hover:shadow-slate-200/40 
    hover:border-slate-300 hover:-translate-y-px
  `,
  cancelButton: {
    pending: "bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200",
    active: `bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 
            border-red-200 hover:border-red-300`,
  },
  statusBadge: `
    px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide
    whitespace-nowrap flex-shrink-0 border
  `,
  itemCard: `
    flex justify-between items-center py-1.5 px-2 bg-slate-50/50 rounded 
    border border-slate-100 hover:border-slate-200 transition-colors
  `,
  quantityBadge: `
    w-5 h-5 bg-indigo-100 text-indigo-700 rounded flex items-center 
    justify-center text-xs font-semibold flex-shrink-0
  `,
} as const;

export default function AdminOrderCard({ order }: AdminOrderCardProps) {
  const { tables } = useTableDataStore();
  const { updateOrder } = useOrderDataStore();
  const { mutate: updateOrderStatus, isPending } = useUpdateOrderStatus();
  const [currentTable, setCurrentTable] = useState<Table | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Find and set current table
  useEffect(() => {
    const foundTable = tables.find((table) => table.id === order.tableId);
    setCurrentTable(foundTable || null);
  }, [tables, order.tableId]);

  const canCancelOrder = (): boolean => {
    return order.status !== "cancelled" && order.status !== "paid";
  };

  const handleOrderCancellation = (): void => {
    if (!canCancelOrder()) return;

    updateOrderStatus(
      { id: order.id, status: "cancelled" },
      {
        onSuccess: () => {
          updateOrder(order.id, { status: "cancelled" });
          toast.success(`Order #${order.invoiceId} cancelled`);
          setShowCancelModal(false);
        },
        onError: () => {
          toast.error(`Failed to cancel order #${order.invoiceId}`);
          setShowCancelModal(false);
        },
      }
    );
  };

  const handleCancelClick = (): void => {
    setShowCancelModal(true);
  };

  const getCancelButtonStyles = (): string => {
    const baseStyles =
      "p-1 rounded cursor-pointer transition-all duration-150 flex-shrink-0 border";
    const stateStyles = isPending
      ? CARD_STYLES.cancelButton.pending
      : CARD_STYLES.cancelButton.active;

    return `${baseStyles} ${stateStyles}`;
  };

  const formatItemsCount = (count: number): string => {
    return `${count} ${count === 1 ? "Item" : "Items"}`;
  };

  return (
    <div
      className={CARD_STYLES.container}
      role="article"
      aria-label={`Order card for invoice ${order.invoiceId}`}
    >
      {/* Header Section */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-900 tracking-tight truncate">
              {order.customerName}
            </h2>
            {renderCancelButton()}
          </div>
          <p className="text-xs text-blue-600 font-medium tracking-wide">
            #{order.invoiceId}
          </p>
        </div>

        <div
          className={`${CARD_STYLES.statusBadge} ${statusBadgeColors[order.status as OrderStatus]}`}
          aria-live="polite"
        >
          {order.status}
        </div>
      </div>

      {/* Order Metadata */}
      {renderOrderMetadata()}

      {/* Items Section - Now grows to fill space */}
      <div className="border-t border-slate-200 pt-2 flex-1 flex flex-col">
        <h3 className="text-xs font-semibold text-slate-800 mb-2 uppercase tracking-wider">
          Order Items
        </h3>
        <div className="flex-1">
          {renderOrderItems()}
        </div>
        {/* Total Section - Pushed to bottom */}
        {renderTotalSection()}
      </div>

      {/* Cancel Confirmation Modal */}
      {renderCancelModal()}
    </div>
  );

  // Render helper functions
  function renderCancelButton() {
    return (
      canCancelOrder() && (
        <button
          onClick={handleCancelClick}
          disabled={isPending}
          className={getCancelButtonStyles()}
          title={isPending ? "Cancelling..." : "Cancel Order"}
          aria-label={`Cancel order ${order.invoiceId}`}
        >
          <MultiplyIcon size={12} strokeWidth={2.5} />
        </button>
      )
    );
  }

  function renderOrderMetadata() {
    return (
      <div className="grid grid-cols-2 gap-1.5 mb-2.5 p-1.5 bg-slate-50 rounded border border-slate-100">
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <Clock
            size={12}
            className="text-slate-500 flex-shrink-0"
            strokeWidth={2}
          />
          <span className="font-medium">
            {convertTo12HourFormat(order.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <Utensils
            size={12}
            className="text-slate-500 flex-shrink-0"
            strokeWidth={2}
          />
          <span className="font-medium">
            Table #{currentTable?.tableNumber ?? "—"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <ShoppingBag
            size={12}
            className="text-slate-500 flex-shrink-0"
            strokeWidth={2}
          />
          <span className="font-medium">
            {formatItemsCount(order.items.length)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <CreditCard
            size={12}
            className="text-slate-500 flex-shrink-0"
            strokeWidth={2}
          />
          <span className="font-medium capitalize">
            {order.paymentMethod || "N/A"}
          </span>
        </div>

        {order.waiterName && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 col-span-2">
            <User
              size={12}
              className="text-emerald-500 flex-shrink-0"
              strokeWidth={2}
            />
            <span className="font-medium capitalize truncate">
              {order.waiterName}
            </span>
          </div>
        )}
      </div>
    );
  }

  function renderOrderItems() {
    return (
      <div className="space-y-1.5 overflow-y-auto">
        {order.items.map((item, index) => (
          <div
            key={index}
            className={CARD_STYLES.itemCard}
            role="listitem"
            aria-label={`${item.quantity} x ${item.name}`}
          >
            <div className="flex items-center gap-2 text-xs flex-1 min-w-0">
              <div className={CARD_STYLES.quantityBadge}>{item.quantity}</div>
              <span className="font-medium text-slate-800 capitalize truncate">
                {item.name}
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-900 ml-2">
              ${item.price.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    );
  }

  function renderTotalSection() {
    return (
      <div className="pt-2.5 border-t border-slate-200 bg-emerald-50 rounded p-2 mt-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
            Total
          </span>
          <span className="text-sm font-bold text-emerald-700">
            ${order.total.toFixed(2)}
          </span>
        </div>
      </div>
    );
  }

  function renderCancelModal() {
    if (!showCancelModal) return null;
    return (
      <ModalOverlay
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
      >
        <div className="bg-white rounded-lg shadow-xl lg:w-[400px] mx-4  p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Cancel Order
          </h3>
          <p className="text-sm text-slate-600 mb-6">
            Are you sure you want to cancel order{" "}
            <span className="font-semibold text-blue-600">
              #{order.invoiceId}
            </span>{" "}
            for <span className="font-semibold">{order.customerName}</span>?
            This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowCancelModal(false)}
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Keep Order
            </button>
            <button
              onClick={handleOrderCancellation}
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Cancelling..." : "Yes, Cancel Order"}
            </button>
          </div>
        </div>
      </ModalOverlay>
    );
  }
}