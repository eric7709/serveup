"use client";
import TotalAndBookButton from "@/modules/Orders/components/TotalAndBookButton";
import OrderSummaryModal from "@/modules/Orders/components/OrderSummaryModal";
import MenuDetailsModal from "@/modules/Orders/components/MenuDetailsModal";
import SearchMenu from "@/modules/Orders/components/SearchMenu";
import Category from "@/modules/Orders/components/Category";
import FoodList from "@/modules/Orders/components/FoodList";
import CreateCustomerModal from "@/modules/Orders/components/CreateCustomerModal";
import { Table } from "@/modules/Tables/types/table";
import { useEffect, useState } from "react";
import { useOrderSelectionStore } from "@/modules/Orders/store/useOrderSelectionStore";
import { useSyncCategoryDataStore } from "@/modules/Category/hooks/useSyncCategoryDataStore";
import { useSyncTableDataStore } from "@/modules/Tables/hooks/useSyncTableDataStore";
import { useMenuItemsDataSyncAndSubscribe } from "@/modules/MenuItems/hook/useMenuItemsDataSyncAndSubscribe";
import FullPageLoader from "@/shared/components/FullPageLoader";
import { useCategoryDataStore } from "@/modules/Category/store/useCategoriesDataStore";
import { useMenuItemDataStore } from "@/modules/MenuItems/store/useMenuItemsDataStore";
import { useTableDataStore } from "@/modules/Tables/store/useTableDataStore";

type Props = {
  table: Table | null;
};

export default function Base({ table }: Props) {
  const { setAllocatedTableId } = useOrderSelectionStore();
  const [isPageLoading, setIsPageLoading] = useState(true);
  useSyncCategoryDataStore();
  useSyncTableDataStore();
  useMenuItemsDataSyncAndSubscribe();
  useEffect(() => {
    if (table) setAllocatedTableId(table.id);
  }, []);

  const { isLoading: loadingCategories } = useCategoryDataStore();
  const { isLoading: loadingMenuItems } = useMenuItemDataStore();
  const { isLoading: loadingTables } = useTableDataStore();
  useEffect(() => {
    if (!loadingCategories && !loadingMenuItems && !loadingTables) {
      setIsPageLoading(false);
    }
  }, [loadingCategories, loadingMenuItems, loadingTables]);

  return (
    <div className="h-screen p-4 flex flex-col ">
      <FullPageLoader {...{ isPageLoading }} />
      <OrderSummaryModal />
      <SearchMenu />
      <MenuDetailsModal />
      <Category />
      <FoodList />
      <TotalAndBookButton />
      <CreateCustomerModal />
    </div>
  );
}
