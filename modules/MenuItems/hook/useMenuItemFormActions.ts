"use client"

import { toast } from "react-toastify";
import {
  useCreateMenuItem,
  useUpdateMenuItem,
} from "../hook/useMenuItemsServices";
import { useMenuItemDataStore } from "../store/useMenuItemsDataStore";
import { useMenuItemSelectionStore } from "../store/useMenuItemSelectionStore";
import { useMenuItemFormStore } from "../store/useMenuItemFormStore";

export function useMenuItemFormActions() {
  const {
    buildPayload,
    resetForm,
    validate,
    setSubmitting,
    form,
    errors,
    handleFormChange,
    isAvailable,
    setIsAvailable,
    isSubmitting,
  } = useMenuItemFormStore((s) => s);
  const {mutate: createHook, isPending: createPending} = useCreateMenuItem();
  const {mutate: updateHook, isPending: updatePending} = useUpdateMenuItem();
  const { addMenuItem, updateMenuItem } = useMenuItemDataStore();
  const { closeModal } = useMenuItemSelectionStore();

  const handleCreateSubmission = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = await buildPayload();
      createHook(payload, {
        onSuccess: (data: any) => {
          addMenuItem(data);
          toast.success("✅ Menu item created");
          closeModal();
          resetForm();
        },
        onError: (error: any) => {
          console.error("Create error:", error);
          toast.error("❌ Failed to create menu item");
        },
        onSettled: () => setSubmitting(false),
      });
    } catch (error) {
      console.error("Create submission error:", error);
      setSubmitting(false);
      toast.error("❌ Failed to create menu item");
    }
  };

  const handleUpdateSubmission = async (id: string) => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = await buildPayload();
      updateHook(
        { id, updates: payload },
        {
          onSuccess: (data: any) => {
            const updatedItem = data && data.id ? data : { ...payload, id };
            updateMenuItem(id, updatedItem);
            toast.success("✅ Menu item updated");
            closeModal();
            resetForm();
          },
          onError: (error: any) => {
            console.error("Update error:", error);
            toast.error("❌ Failed to update menu item");
          },
          onSettled: () => setSubmitting(false),
        }
      );
    } catch (error) {
      console.error("Update submission error:", error);
      setSubmitting(false);
      toast.error("❌ Failed to update menu item");
    }
  };

  return {
    resetForm,
    validate,
    form,
    errors,
    handleFormChange,
    updatePending,
    createPending,
    isAvailable,
    setIsAvailable,
    isSubmitting,
    handleCreateSubmission,
    handleUpdateSubmission,
  };
}