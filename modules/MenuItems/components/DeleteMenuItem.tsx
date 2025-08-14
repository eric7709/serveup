"use client";

import ConfirmDeleteModal from "@/shared/components/ConfirmDeleteModal";
import { useMenuItemSelectionStore } from "../store/useMenuItemSelectionStore";
import { useDeleteMenuItem } from "../hook/useMenuItemsServices";
import { toast } from "react-toastify";
import { useMenuItemDataStore } from "../store/useMenuItemsDataStore";
import { useMenuItemFormStore } from "../store/useMenuItemFormStore";

export default function DeleteMenuItem() {
  const { selectedMenuItem, closeModal, activeModal } = useMenuItemSelectionStore();
  const { mutate, isPending } = useDeleteMenuItem();
  const { removeMenuItem } = useMenuItemDataStore();
  const { resetForm } = useMenuItemFormStore();

  const handleDelete = () => {
    if (!selectedMenuItem?.id) return;
    mutate(selectedMenuItem.id, {
      onSuccess: () => {
        removeMenuItem(selectedMenuItem.id);
        resetForm();
        toast.success("Menu Item deleted successfully");
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <ConfirmDeleteModal
      isOpen={activeModal === "delete"}
      type="menu item"
      name={selectedMenuItem?.name}
      onClose={closeModal}
      onConfirm={handleDelete}
      isLoading={isPending}
    />
  );
}
