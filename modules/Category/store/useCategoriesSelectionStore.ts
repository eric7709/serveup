import { create } from "zustand";
import { UseCategorySelectionStore } from "../types/category";

export const useCategorySelectionStore = create<UseCategorySelectionStore>(
  (set) => ({
    activeModal: null,
    selectedCategory: null,
    selectCategory: (category) =>
      set({
        selectedCategory: category,
      }),
    clearCategory: () =>
      set({
        selectedCategory: null,
      }),
    setModal: (modal: "update" | "create" | "delete" | null) =>
      set({
        activeModal: modal,
      }),
    closeModal: () =>
      set({
        activeModal: null,
      }),
  })
);
