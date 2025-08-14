"use client";
import { getCustomerFromCookie } from "@/shared/utils/getCustomerFromCookie";
import { useOrderSelectionStore } from "../store/useOrderSelectionStore";
import { useEffect } from "react";

export default function TotalAndBookButton() {
  const { getTotal, items, setModal,} = useOrderSelectionStore();
  const handleSubmit = () => {
    const customer = getCustomerFromCookie();
    if (customer) {
      setModal("summary");
    } else {
      setModal("create");
    }
  };

  return (
    
    <div
      className={`${
        items.length > 0 ? "h-12 opacity-100" : "h-0 opacity-0"
      } overflow-hidden duration-500 flex justify-between items-center`}
    >
      <p className="font-semibold text-lg">Total: {getTotal()}</p>
      <button
        onClick={handleSubmit}
        className={`w-fit px-6 cursor-pointer py-3 rounded-lg bg-blue-600 text-white font-semibold text-sm active:scale-90 duration-300`}
      >
        Place Order
      </button>
    </div>
  );
}
