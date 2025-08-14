"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTableSelectionStore } from "@/modules/Tables/store/useTableSelectionStore";
import {
  useCreateTable,
  useUpdateTable,
} from "@/modules/Tables/hooks/useTableServices";
import { TableFormInput, TableFormError } from "../types/table";
import { useTableDataStore } from "../store/useTableDataStore";
import { useEmployeeDataStore } from "@/modules/Employees/store/useEmployeeDataStore";

export const useTableForm = () => {
  const formValues = {
    name: "",
    tableNumber: "",
    capacity: "",
    waiterId: "",
  };
  const { activeTable, activeModal, closeModal, clearActiveTable } =
    useTableSelectionStore();
  const { employees } = useEmployeeDataStore();
  const { addTable, updateTable } = useTableDataStore();
  const { mutate: createTable, isPending: isPendingCreate } = useCreateTable();
  const { mutate: updateTableMutation, isPending: isPendingUpdate } =
    useUpdateTable();
  const [form, setForm] = useState<TableFormInput>(formValues);

  const [errors, setErrors] = useState<Partial<TableFormError>>({});

  const isUpdateMode = activeModal === "update";
  const isCreateMode = activeModal === "create";
  const isPending = isPendingCreate || isPendingUpdate;

  useEffect(() => {
    if (isUpdateMode && activeTable) {
      setForm({
        name: activeTable?.name || "",
        tableNumber: activeTable?.tableNumber?.toString() || "",
        capacity: activeTable?.capacity?.toString() || "",
        waiterId: activeTable?.waiterId || "",
      });
    } else {
      setForm({
        name: "",
        tableNumber: "",
        capacity: "3",
        waiterId: "",
      });
    }
    setErrors({});
  }, [activeTable, isUpdateMode]);

  /** Validate form inputs */
  const validate = () => {
    const newErrors: Partial<TableFormError> = {};

    if (!form.name.trim()) {
      newErrors.name = "Table name is required";
    }

    if (!form.tableNumber.trim()) {
      newErrors.tableNumber = "Table number is required";
    } else if (isNaN(Number(form.tableNumber))) {
      newErrors.tableNumber = "Table number must be a number";
    }

    if (!form.capacity.trim()) {
      newErrors.capacity = "Capacity is required";
    } else if (isNaN(Number(form.capacity))) {
      newErrors.capacity = "Capacity must be a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Handle input changes + clear error */
  const handleChange = (field: keyof TableFormInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  /** Submit form for both create and update */
  const handleSubmit = () => {
    if (!validate()) return;
    const payload = {
      name: form.name.trim(),
      capacity: Number(form.capacity),
      tableNumber: Number(form.tableNumber),
      waiterId: form.waiterId || null,
      url: Math.random().toString(36).substring(2, 10),
    };
    if (isCreateMode) {
      createTable(payload, {
        onSuccess: (newTable) => {
          toast.success("✅ Table created successfully");
          addTable(newTable);
          setForm(formValues);
          clearActiveTable();
          closeModal();
        },
        onError: (error: any) => {
          toast.error(error?.message || "❌ Failed to create table");
        },
      });
    }

    if (isUpdateMode && activeTable) {
      updateTableMutation(
        { id: activeTable.id, updates: payload },
        {
          onSuccess: () => {
            toast.success("✅ Table updated successfully");
            updateTable(activeTable.id, payload);
            setForm(formValues);
            clearActiveTable();
            closeModal();
          },
          onError: (error: any) => {
            toast.error(error?.message || "❌ Failed to update table");
          },
        }
      );
    }
  };

  return {
    form,
    errors,
    handleChange,
    handleSubmit,
    isPending,
    isCreateMode,
    isUpdateMode,
    employees,
    closeModal,
  };
};
