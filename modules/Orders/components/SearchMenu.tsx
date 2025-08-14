"use client";
import { BsSearch } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import { useOrderSelectionStore } from "../store/useOrderSelectionStore";

export default function SearchMenu() {
  const {searchTerm, changeSearchTerm, clearSearchTerm} = useOrderSelectionStore()
  return (
    <div>
      <p className="text-lg font-semibold mb-2 text-center">
        Above Restaurant Menu 
      </p>
      <div className="w-full relative py-2">
        <BsSearch className="absolute top-1/2 left-2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search menu..."
          value={searchTerm}
          onChange={changeSearchTerm}
          className="w-full h-12 text-[15px] px-8 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
        />
        <FaTimes
          onClick={clearSearchTerm}
          className={`absolute top-1/2 cursor-pointer duration-300 active:scale-75 right-2 -translate-y-1/2 ${
            searchTerm.trim().length > 0
              ? "opacity-100 visible"
              : "opacity-0 invisible"
          }`}
        />
      </div>
    </div>
  );
}
