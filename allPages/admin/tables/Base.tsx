"use client";
import TableModal from "@/modules/Tables/components/TableModal";
import QRCodePreviewModal from "@/modules/Tables/components/QRCodePreviewModal";
import TableList from "@/modules/Tables/components/TableList";
import TableHeader from "@/modules/Tables/components/TableHeader";
import DeallocateModal from "@/modules/Tables/components/DeallocateWaiter";
import AllocateModal from "@/modules/Tables/components/AllocateModal";
import DeleteTable from "@/modules/Tables/components/DeletTable";
import { useSyncTableDataStore } from "@/modules/Tables/hooks/useSyncTableDataStore";
import { useSyncEmployeesDataStore } from "@/modules/Employees/hooks/useSyncEmployeesDataStore";
import { useUIStore } from "@/store/useUIStore";
import { useEmployeeDataStore } from "@/modules/Employees/store/useEmployeeDataStore";
import { useTableDataStore } from "@/modules/Tables/store/useTableDataStore";
import { useEffect } from "react";

export default function Base() {
  useSyncEmployeesDataStore();
  useSyncTableDataStore();
  const { stopLoading } = useUIStore();
  const [{ isLoading: loadingEmployee }, { isLoading: loadingTable }] = [
    useEmployeeDataStore(),
    useTableDataStore(),
  ];

  useEffect(() => {
    if (!loadingTable && !loadingEmployee) {
      stopLoading();
    }
  }, [loadingEmployee, loadingTable, stopLoading]);

  if (loadingTable || loadingEmployee) return null;

  return (
    <div className="flex h-screen gap-2 flex-col">
      <TableHeader />
      <div className="flex-1 z-10 p-4 pt-0 pb-2 scrollbar-hide overflow-y-auto">
        <TableList />
        <DeallocateModal />
        <AllocateModal />
        <QRCodePreviewModal />
        <DeleteTable />
        <TableModal />
      </div>
    </div>
  );
}