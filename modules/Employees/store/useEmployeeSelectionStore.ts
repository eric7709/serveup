import { create } from "zustand";
import { UseEmployeeSelectionStore } from "../types/employee";

export const useEmployeeSelectionStore = create<UseEmployeeSelectionStore>(
  (set) => ({
    selectedEmployee: null,
    selectEmployee: (employee) =>
      set({
        selectedEmployee: employee,
      }),
    clearEmployee: () =>
      set({
        selectedEmployee: null,
      }),
    activeModal: null,
    setModal: (modal) =>
      set({
        activeModal: modal,
      }),
    closeModal: () =>
      set({
        activeModal: null,
      }),
  })
);
