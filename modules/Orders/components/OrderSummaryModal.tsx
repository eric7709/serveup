"use client";
import ModalBackdrop from "@/shared/components/ModalOverlay";
import { FaTrashAlt } from "react-icons/fa";
import { useOrderSummary } from "../hooks/useOrderSummary";
import { useEffect } from "react";

export default function OrderSummaryModal() {
  const {
    items,
    customer,
    unavailableIds,
    success,
    isSubmitting,
    total,
    activeModal,
    handleClick,
    handleConfirm,
    handleRemoveItem,
    closeModal,
    resetItems,
  } = useOrderSummary();

  useEffect(() => {
    if (items.length === 0) {
      closeModal();
    }
  }, [items, closeModal]);

  return (
    <ModalBackdrop isOpen={activeModal === "summary"} onClose={handleClick}>
      <div className="bg-white w-full max-w-[375px] rounded-2xl mx-4 shadow-lg flex flex-col max-h-[80vh] border border-gray-200">
        {/* Header */}
        <header className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-2xl">
          {!success ? (
            <h2 className="text-lg font-bold text-gray-900">
              Review Your Order
            </h2>
          ) : (
            <h2 className="text-lg font-semibold text-center text-gray-900">
              Thank you{" "}
              <span className="font-bold text-blue-700">
                {customer?.title} {customer?.name} 😊
              </span>
            </h2>
          )}
        </header>

        {/* Items List */}
        <section className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
          {items.map((item) => {
            const isUnavailable = unavailableIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`flex justify-between items-center p-3 rounded-lg shadow-sm ${
                  isUnavailable
                    ? "bg-red-100 text-red-800 border border-red-300"
                    : "bg-white text-gray-900 border border-gray-200"
                }`}
              >
                <div className="flex-1">
                  <p className="font-semibold text-sm capitalize">{item.name}</p>
                  {item.quantity && (
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  )}
                  {isUnavailable && (
                    <p className="mt-1 text-xs font-semibold text-red-700">
                      ❌ Unavailable
                    </p>
                  )}
                </div>

                <div className="mx-3 font-semibold text-gray-800 text-sm">
                  ${(item.quantity ? item.quantity * item.price : item.price).toFixed(2)}
                </div>

                {!success && (
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1.5 rounded-full hover:bg-red-200 text-red-700 transition"
                    aria-label="Remove item"
                    title="Remove item"
                  >
                    <FaTrashAlt size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 p-4 bg-white rounded-b-2xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-base font-semibold text-gray-800">Total:</span>
            <span className="text-lg font-extrabold text-gray-900">
              ${total.toFixed(2)}
            </span>
          </div>

          {success && (
            <p className="mb-4 text-center text-green-700 font-semibold text-sm">
              ✅ Order placed successfully!
            </p>
          )}

          {!success && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  closeModal();
                  resetItems();
                }}
                disabled={isSubmitting}
                className="py-3.5 rounded-lg cursor-pointer bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50 transition active:scale-95 text-sm"
              >
                Clear
              </button>
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className={`py-3.5 rounded-lg cursor-pointer text-white font-semibold transition shadow-md text-sm ${
                  isSubmitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600  active:scale-95 hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? "Placing..." : "Confirm"}
              </button>
            </div>
          )}
        </footer>
      </div>
    </ModalBackdrop>
  );
}
