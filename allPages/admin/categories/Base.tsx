"use client";
import CreateUpdateCategoryModal from "@/modules/Category/components/CreateUpdateCategoryModal";
import { useSyncCategoryDataStore } from "@/modules/Category/hooks/useSyncCategoryDataStore";
import DeleteCategoryModal from "@/modules/Category/components/DeleteCategory";
import CategoriesHeader from "@/modules/Category/components/CategoriesHeader";
import CategoryList from "@/modules/Category/components/CategoryList";
import { useCategoryDataStore } from "@/modules/Category/store/useCategoriesDataStore";
import { useEffect } from "react";
import { useUIStore } from "@/store/useUIStore";
export default function Base() {
  useSyncCategoryDataStore();
  const { isLoading } = useCategoryDataStore();
  const { stopLoading } = useUIStore();
  
  useEffect(() => {
    if (!isLoading) stopLoading();
  }, [isLoading]);
  return (
    <div className="h-screen flex flex-col">
      <CategoriesHeader />
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <CategoryList />
        <DeleteCategoryModal />
        <CreateUpdateCategoryModal />
      </div>
    </div>
  );
}
