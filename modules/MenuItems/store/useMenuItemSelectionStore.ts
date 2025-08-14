import { create } from "zustand";
import { UseMenuItemSelectionStore } from "../types/menuItems";

export const useMenuItemSelectionStore = create<UseMenuItemSelectionStore>(
  (set) => ({
    activeModal: null,
    closeModal: () => set({ activeModal: null }),
    setModal: (activeModal) => set({ activeModal }),
    selectedMenuItem: null,
    selectMenuItem: (menuItem) => set({ selectedMenuItem: menuItem }),
    clearMenuItem: () => set({ selectedMenuItem: null }),
  })
);
