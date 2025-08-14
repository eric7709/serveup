"use client";

import ConfirmDeleteModal from "@/shared/components/ConfirmDeleteModal";
import { useDeleteTable } from "../hooks/useTableServices";
import { useTableSelectionStore } from "../store/useTableSelectionStore";
import { useTableDataStore } from "../store/useTableDataStore";
import { toast } from "react-toastify";

export default function DeleteTable() {
  const { activeModal, closeModal, activeTable, clearActiveTable } =
    useTableSelectionStore();
  const { mutate, isPending } = useDeleteTable();
  const { removeTable } = useTableDataStore();

  const handleDelete = () => {
    if (!activeTable) return;
    mutate(activeTable.id, {
      onSuccess: () => {
        toast.success("✅ Table deleted successfully");
        removeTable(activeTable.id);
        closeModal();
        clearActiveTable();
      },
      onError: (error: any) => {
        toast.error(error?.message || "❌ Failed to delete table");
      },
    });
  };

  return (
    <ConfirmDeleteModal
      isOpen={activeModal === "delete"}
      type="table"
      name={activeTable?.name}
      onClose={() => {
        closeModal();
        clearActiveTable();
      }}
      onConfirm={handleDelete}
      isLoading={isPending}
    />
  );
}
