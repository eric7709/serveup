"use client";
import { useTableSelectionStore } from "../store/useTableSelectionStore";
import { useTableDataStore } from "../store/useTableDataStore";
import NoResultFound from "@/shared/components/NoResultFound";
import Loader from "@/shared/components/Loader";
import TableCard from "./TableCard";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function TableList() {
  const { filteredTables } = useTableDataStore();
  const { setModal } = useTableSelectionStore();
  const tables = filteredTables();
  if (tables.length === 0) return <NoResultFound />;
  return (
    <div className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div
          onClick={() => setModal("create")}
          className="min-h-52 flex flex-col items-center justify-center 
               border-2 border-dashed border-blue-300 rounded-xl 
               bg-gradient-to-br from-blue-50 to-white 
               text-blue-600 hover:bg-blue-100 hover:border-blue-400 
               hover:shadow-lg transform transition-all duration-300 
               cursor-pointer active:scale-95"
        >
          <Plus size={48} strokeWidth={2.5} className="text-blue-500" />
          <span className="mt-3 text-lg font-semibold uppercase tracking-wide">
            Add Table
          </span>
        </div>
        {tables.map((table) => (
          <TableCard key={table.id} table={table} />
        ))}
      </div>
    </div>
  );
}
