"use client";
import NoResultFound from "@/shared/components/NoResultFound";
import { useMenuItemDataStore } from "../store/useMenuItemsDataStore";
import MenuItemCard from "./MenuItemCard";
import Loader from "@/shared/components/Loader";
import { useMenuItemSelectionStore } from "../store/useMenuItemSelectionStore";
import { Plus } from "lucide-react";

export default function MenuItemList() {
  const { filteredMenuItems, isLoading } = useMenuItemDataStore();
  const { setModal } = useMenuItemSelectionStore();
  const menuItems = filteredMenuItems();
  if (isLoading) return <Loader />;
  if (menuItems.length === 0) return <NoResultFound />;
  return (
    <div className="grid p-5 z-0 relative grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      <div
        onClick={() => setModal("create")}
        className="min-h-56 flex flex-col items-center justify-center 
             border-2 border-dashed border-blue-300 rounded-xl 
             bg-gradient-to-br from-blue-50 to-white 
             text-blue-600 hover:bg-blue-100 hover:border-blue-400 
             hover:shadow-lg transform transition-all duration-300 
             cursor-pointer active:scale-95"
      >
        <Plus size={48} strokeWidth={2.5} className="text-blue-500" />
        <span className="mt-3 text-lg font-semibold uppercase tracking-wide">
          Add Menu Item
        </span>
      </div>

      {menuItems.map((menuItem, index) => (
        <MenuItemCard key={menuItem.id} {...{ menuItem, index }} />
      ))}
    </div>
  );
}
