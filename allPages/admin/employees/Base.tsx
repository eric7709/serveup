"use client";
import CreateEmployeeModal from "@/modules/Employees/components/CreateUpdateEmployeeModal";
import DeleteEmployee from "@/modules/Employees/components/DeleteEmployee";
import EmployeeHeader from "@/modules/Employees/components/EmployeeHeader";
import EmployeeList from "@/modules/Employees/components/EmployeeList";
import { useSyncEmployeesDataStore } from "@/modules/Employees/hooks/useSyncEmployeesDataStore";
import { useEmployeeDataStore } from "@/modules/Employees/store/useEmployeeDataStore";
import FadeIn from "@/shared/components/FadeIn";
import { useUIStore } from "@/store/useUIStore";
import { useEffect } from "react";

export default function Base() {
  useSyncEmployeesDataStore();
  const { isLoading } = useEmployeeDataStore();
  const { stopLoading } = useUIStore();
  useEffect(() => {
    if (!isLoading) stopLoading();
  }, [isLoading]);

  return (
      <div className="h-screen flex flex-col">
        <EmployeeHeader />
        <div className="overflow-y-auto flex-1">
          <EmployeeList />
          <CreateEmployeeModal />
          <DeleteEmployee />
        </div>
      </div>
  );
}
