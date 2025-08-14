"use client";

import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { isSelected } from "../../MenuItems/utils/isSelected";
import { getSelectedItem } from "../../MenuItems/utils/getSelectedItem";
import { MenuItem } from "@/modules/MenuItems/types/menuItems";
import { useOrderSelectionStore } from "../store/useOrderSelectionStore";

type Props = {
  menuItem: MenuItem;
};

export default function FoodItem({ menuItem }: Props) {
  const {
    addMenuItem,
    items,
    removeMenuItem,
    increaseQuantity,
    decreaseQuantity,
    setModal,
    setItemDetails,
  } = useOrderSelectionStore();
  const selected = isSelected(items, menuItem.id);
  const selectedItem = getSelectedItem(items, menuItem.id);
  const isUnavailable = menuItem.isAvailable === false;
  const handleAddOrRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUnavailable) return;
    if (selected) {
      removeMenuItem(menuItem.id);
    } else {
      addMenuItem(menuItem);
    }
  };

  return (
    <div
      onClick={() => {
        if (isUnavailable) return;
        setItemDetails(menuItem);
        setModal("details");
      }}
      className={`text-sm flex select-none duration-300 rounded-2xl p-4 w-full gap-3 border
        ${selected ? "bg-gradient-to-tr from-blue-50 via-blue-200 to-blue-300 border-blue-300" : "bg-white border-gray-200"}
        ${isUnavailable ? "opacity-50 grayscale cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {/* Image */}
      <div className="h-24 shrink-0 overflow-hidden rounded-lg w-24 border relative border-gray-200">
        <img
          src={menuItem?.imageUrl || "/"}
          alt={menuItem?.name}
          className="rounded-lg object-cover absolute inset-0"
        />

        {/* Not Available Overlay */}
        {isUnavailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="text-white text-xs font-semibold tracking-wide">
              Not Available
            </span>
          </div>
        )}

        {/* Trash button if selected */}
        {selected && !isUnavailable && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              removeMenuItem(menuItem.id);
            }}
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-black/40 to-black/60"
          >
            <button
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg active:scale-95 transition"
              title="Remove item"
            >
              <FaTrash size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col w-full overflow-hidden justify-between">
        <p className="text-sm font-semibold capitalize truncate">{menuItem?.name}</p>
        <p className="text-xs text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">
          {menuItem?.description}
        </p>

        {/* Price + Controls */}
        <div className="flex items-center justify-between mt-2">
          <p className="text-base font-semibold">${menuItem?.price}</p>

          {!isUnavailable && selected ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex gap-3 items-center"
            >
              <div
                onClick={() => decreaseQuantity(menuItem.id)}
                className="h-6 w-6 rounded border-2 cursor-pointer duration-300 active:scale-90 grid place-content-center hover:bg-gray-100"
              >
                <FaMinus size={10} />
              </div>

              <p className="text-sm font-medium">{selectedItem?.quantity}</p>

              <div
                onClick={() => increaseQuantity(menuItem.id)}
                className="h-6 w-6 rounded border-2 cursor-pointer duration-300 active:scale-90 grid place-content-center hover:bg-gray-100"
              >
                <FaPlus size={10} />
              </div>
            </div>
          ) : (
            !isUnavailable && (
              <button
                onClick={handleAddOrRemove}
                className="bg-blue-600 px-4 text-white font-semibold cursor-pointer py-2 rounded-full shadow-md duration-300 active:scale-90 hover:bg-blue-700"
              >
                <FaPlus />
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
