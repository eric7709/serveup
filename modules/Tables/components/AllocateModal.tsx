"use client";
import { useEmployeeDataStore } from "@/modules/Employees/store/useEmployeeDataStore";
import { useTableSelectionStore } from "@/modules/Tables/store/useTableSelectionStore";
import ModalOverlay from "@/shared/components/ModalOverlay";
import { useEffect, useState } from "react";
import { useAllocateWaiter } from "../hooks/useTableServices";
import { toast } from "react-toastify";
import { useTableDataStore } from "../store/useTableDataStore";

export default function AllocateModal() {
  const [waiterId, setWaiterId] = useState("");
  const { employees } = useEmployeeDataStore();
  const { updateTable } = useTableDataStore();
  const { activeModal, closeModal, activeTable, clearActiveTable } =
    useTableSelectionStore();
  const { mutate, isPending } = useAllocateWaiter();
  const handleSubmit = () => {
    if (!activeTable) {
      toast.error("No table selected");
      return;
    }
    if (!waiterId.trim()) {
      toast.error("Please select a waiter");
      return;
    }
    mutate(
      {
        tableId: activeTable.id,
        waiterId,
      },
      {
        onSuccess: (updatedTable) => {
          toast.success("✅ Waiter allocated successfully");
          updatedTable && updateTable(activeTable.id, updatedTable);
          clearActiveTable();
          closeModal();
          setWaiterId("");
        },
        onError: (error: any) => {
          toast.error(error?.message || "❌ Failed to allocate waiter");
        },
      }
    );
  };


  useEffect(() => {
    if(activeTable && activeTable.waiterId){
      setWaiterId(activeTable.waiterId)
    }
  }, [])

  const waiters = employees.filter(el => el.role?.toLocaleLowerCase() == "waiter")
  

  return (
    <ModalOverlay  isOpen={activeModal == "allocate"} onClose={closeModal}>
      <div className="w-[320px] p-6 rounded-2xl shadow-2xl border bg-white text-center space-y-5">
        <div className="text-left">
          <h2 className="text-lg font-semibold text-center">Allocate Waiter</h2>
          <div className="text-sm space-y-3 text-gray-700 mt-3">
            <p>
              <strong>Table:</strong> {activeTable?.name}
            </p>
            <p>
              <strong>Number:</strong> #{activeTable?.tableNumber}
            </p>
          </div>
        </div>

        <div className="text-left">
          <label className="block text-sm font-medium mb-1" htmlFor="waiterId">
            Select Waiter
          </label>
          <select
            name="waiterId"
            id="waiterId"
            onChange={(e) => setWaiterId(e.target.value)}
            value={waiterId}
            className="w-full px-3 py-2 border rounded-md text-sm"
            disabled={false}
            required
          >
            <option value={activeTable?.waiterId ?? ""}>
              -- Choose Waiter --
            </option>
            {waiters.map((waiter) => (
              <option key={waiter.id} value={waiter.id}>
                {waiter.firstName} {waiter.lastName}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full py-3 cursor-pointer bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Allocating..." : "Allocate Waiter"}
        </button>
      </div>
    </ModalOverlay>
  );
}
