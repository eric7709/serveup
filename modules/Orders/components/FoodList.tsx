"use client"
import { useMemo } from "react";
import { useOrderSelectionStore } from "../store/useOrderSelectionStore";
import { useMenuItemDataStore } from "@/modules/MenuItems/store/useMenuItemsDataStore";
import FoodItem from "./FoodItem";

export default function FoodList() {
  const { menuItems} = useMenuItemDataStore();
  const { searchTerm, category, filterMenuItems } = useOrderSelectionStore();
  const filteredItems = useMemo(() => {
    return filterMenuItems(menuItems);
  }, [menuItems, searchTerm, category, filterMenuItems]);
  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="flex flex-col gap-2">
        {filteredItems.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">No items found.</p>
        ) : (
          filteredItems.map((menuItem) => (
            <FoodItem menuItem={menuItem} key={menuItem.id} />
          ))
        )}
      </div>
    </div>
  );
}
