"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Input } from "@/shared/components/Input";
import ModalOverlay from "@/shared/components/ModalOverlay";
import { useCategorySelectionStore } from "../store/useCategoriesSelectionStore";
import { useCategoryDataStore } from "../store/useCategoriesDataStore";
import {
  useCreateCategory,
  useUpdateCategory,
} from "../hooks/useCategoryServices";

export default function CreateUpdateCategoryModal() {
  const { activeModal, closeModal, selectedCategory } =
    useCategorySelectionStore();

  const { addCategory, updateCategory: updateCategoryRedux } =
    useCategoryDataStore();

  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const { mutate: createCategory, isPending: isPendingCreate } =
    useCreateCategory();
  const { mutate: updateCategory, isPending: isPendingUpdate } =
    useUpdateCategory();

  const loading = isPendingCreate || isPendingUpdate;
  const isCreateMode = activeModal === "create";
  const isUpdateMode = activeModal === "update";

  // Fill input on modal open
  useEffect(() => {
    if (isUpdateMode && selectedCategory) {
      setValue(selectedCategory.name);
    } else if (isCreateMode) {
      setValue("");
    }
  }, [isCreateMode, isUpdateMode, selectedCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!value.trim()) {
      setError("Please fill in the field");
      return;
    }

    if (isCreateMode) {
      createCategory(value, {
        onSuccess: (data) => {
          addCategory(data);
          toast.success("Category created successfully");
          handleClose();
        },
        onError: (err) => toast.error(err.message),
      });
    }

    if (isUpdateMode && selectedCategory) {
      updateCategory(
        { id: selectedCategory.id, name: value },
        {
          onSuccess: (data) => {
            updateCategoryRedux(selectedCategory.id, data);
            toast.success("Category updated successfully");
            handleClose();
          },
          onError: (err) => toast.error(err.message),
        }
      );
    }
  };

  const handleClose = () => {
    closeModal();
    setValue("");
    setError("");
  };

  useEffect(() => {
    setError("");
  }, [value]);

  const titleText =
    activeModal == null
      ? ""
      : isCreateMode
      ? "Add Menu Item Category"
      : "Update Menu Item Category";

  const buttonText =
    activeModal == null
      ? ""
      : loading
      ? isCreateMode
        ? "Creating..."
        : "Updating..."
      : isCreateMode
      ? "Create"
      : "Update";

  return (
    <ModalOverlay isOpen={isCreateMode || isUpdateMode} onClose={handleClose}>
      <form
        onSubmit={handleSubmit}
        className="w-[370px] space-y-4 p-6 bg-white shadow rounded-md"
      >
        <h2 className="text-lg font-semibold">{titleText}</h2>

        <Input
          label="Category Name"
          placeholder="Enter category name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          error={error}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {buttonText}
        </button>
      </form>
    </ModalOverlay>
  );
}
