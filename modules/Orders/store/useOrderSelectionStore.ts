"use client";

import { create } from "zustand";
import { UseOrderSelectionStore } from "../types/orders";
import { MenuItem } from "@/modules/MenuItems/types/menuItems";

export const useOrderSelectionStore = create<UseOrderSelectionStore>(
  (set, get) => ({
    // SEARCH & FILTER
    searchTerm: "",
    category: "all",
    changeCategory: (category) => {
      set({ category });
    },
    changeSearchTerm: (e) => set({ searchTerm: e.target.value }),
    clearSearchTerm: () => set({ searchTerm: "" }),
    resetFields: () => set({ searchTerm: "", category: "all" }),
    filterMenuItems: (menuItems: MenuItem[]) => {
      const { searchTerm, category } = get();
      return menuItems.filter((item) => {
        const matchesText =
          !searchTerm ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const itemCategoryName = item.category?.name?.toLowerCase() || "";
        const matchesCategory =
          category === "all" || itemCategoryName === category.toLowerCase();
        return matchesText && matchesCategory;
      });
    },
    // MODAL
    activeModal: null,
    setModal: (value) => set({ activeModal: value }),
    closeModal: () => set({ activeModal: null }),

    // SUCCESS
    success: false,
    checkSuccessful: () => set({ success: true }),
    clearSuccess: () => set({ success: false }),

    // CUSTOMER
    customerDetails: null,
    setCustomerDetails: (customer) => set({ customerDetails: customer }),
    clearCustomerDetails: () => set({ customerDetails: null }),

    // SELECTED ITEMS
    items: [],
    itemDetails: null,
    setItemDetails: (itemDetails) => set({ itemDetails }),
    clearItemDetails: () => set({ itemDetails: null }),

    addMenuItem: (item) => {
      const exists = get().items.some((i) => i.id === item.id);
      if (!exists) {
        set((state) => ({
          items: [...state.items, { ...item, quantity: 1 }],
        }));
      }
    },
    removeMenuItem: (id) =>
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      })),
    increaseQuantity: (id) =>
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id
            ? { ...item, quantity: (item.quantity ?? 1) + 1 }
            : item
        ),
      })),
    decreaseQuantity: (id) =>
      set((state) => ({
        items: state.items
          .map((item) =>
            item.id === id
              ? { ...item, quantity: (item.quantity ?? 1) - 1 }
              : item
          )
          .filter((item) => (item.quantity ?? 1) > 0),
      })),
    resetItems: () => set({ items: [] }),
    isSelected: (id) => get().items.some((item) => item.id === id),
    getTotal: () => {
      const total = get().items.reduce((acc, item) => {
        const quantity = item.quantity ?? 1;
        return acc + item.price * quantity;
      }, 0);
      return parseFloat(total.toFixed(2));
    },

    // ALLOCATED TABLE
    allocatedTableId: null,
    setAllocatedTableId: (id) => set({ allocatedTableId: id }),
    clearAllocatedTableId: () => set({ allocatedTableId: null }),
  })
);
