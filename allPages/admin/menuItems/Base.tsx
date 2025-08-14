"use client";
import MenuItemHeader from "@/modules/MenuItems/components/MenuItemHeader";
import CreateMenuItemForm from "@/modules/MenuItems/components/CreateUpdateMenuItemModal";
import MenuItemList from "@/modules/MenuItems/components/MenuItemList";
import DeleteMenuItem from "@/modules/MenuItems/components/DeleteMenuItem";
import { useSyncMenuItemsDataStore } from "@/modules/MenuItems/hook/useSyncMenuItemsDataStore";
import { useSyncCategoryDataStore } from "@/modules/Category/hooks/useSyncCategoryDataStore";
import { useMenuItemDataStore } from "@/modules/MenuItems/store/useMenuItemsDataStore";
import { useCategoryDataStore } from "@/modules/Category/store/useCategoriesDataStore";
import { useUIStore } from "@/store/useUIStore";
import { useEffect } from "react";

export default function Base() {
  useSyncMenuItemsDataStore();
  useSyncCategoryDataStore();
  const [{ isLoading: loadingMenuItems }, { isLoading: loadingCategory }] = [
    useMenuItemDataStore(),
    useCategoryDataStore(),
  ];
  const { stopLoading } = useUIStore();
  useEffect(() => {
    if (!loadingCategory && !loadingMenuItems) {
      stopLoading();
    }
  }, [loadingMenuItems, loadingCategory]);

  return (
    <div className="h-screen flex flex-col">
      <MenuItemHeader />
      <div className="flex-1 scrollbar-hide overflow-y-auto">
        <CreateMenuItemForm />
        <MenuItemList />
        <DeleteMenuItem />
      </div>
    </div>
  );
}
