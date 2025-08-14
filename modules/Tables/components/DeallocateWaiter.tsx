"use client";
import ModalOverlay from "@/shared/components/ModalOverlay";
import { useTableSelectionStore } from "../store/useTableSelectionStore";
import { useTableDataStore } from "../store/useTableDataStore";
import { toast } from "react-toastify";
import { useState } from "react";
import { useDeallocateWaiter } from "../hooks/useTableServices";

export default function DeallocateModal() {
  const { activeModal, closeModal, activeTable, clearActiveTable } =
    useTableSelectionStore();
  const { updateTable } = useTableDataStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync } = useDeallocateWaiter();

  const handleDeallocate = async () => {
    if (!activeTable?.id) {
      toast.error("❌ No table selected");
      return;
    }
    setIsSubmitting(true);
    try {
      await mutateAsync(activeTable.id, {
        onSuccess: (data) => {
          if (data) {
            updateTable(activeTable.id, data);
          }
          clearActiveTable();
          toast.success("✅ Waiter deallocated");
          closeModal();
        },
        onError: (error: any) => {
          console.error("Deallocate error:", error);
          toast.error("❌ Failed to deallocate waiter");
        },
        onSettled: () => setIsSubmitting(false),
      });
    } catch (error) {
      console.error("Deallocate error:", error);
      toast.error("❌ Failed to deallocate waiter");
      setIsSubmitting(false);
    }
  };

  return (
    <ModalOverlay isOpen={activeModal === "deallocate"} onClose={closeModal}>
      <div className="w-[320px] bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="px-4 py-2.5 border-b border-gray-100 bg-blue-50">
          <h2 className="text-base font-semibold text-blue-700">
            Deallocate Waiter
          </h2>
        </div>

        {/* Content */}
        <div className="px-4 py-3">
          <p className="text-sm text-gray-700">
            Are you sure you want to deallocate the waiter from{" "}
            <span className="font-medium capitalize">
              {activeTable?.name || "this table"}
            </span>
            ?
          </p>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50 flex gap-2">
          <button
            onClick={closeModal}
            disabled={isSubmitting}
            className="flex-1 py-2 rounded-md text-xs font-medium text-gray-600 bg-gray-200 hover:bg-gray-300 active:scale-95 transition-all duration-200 shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleDeallocate}
            disabled={isSubmitting}
            className={`flex-1 py-2 rounded-md text-xs font-medium text-white transition-all duration-200 shadow-sm ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 active:scale-95"
            }`}
          >
            {isSubmitting ? "Deallocating..." : "Confirm"}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}
