"use client";
import { Check } from "lucide-react";
import ModalOverlay from "@/shared/components/ModalOverlay";
import { menuItemsForm } from "../constants/menuItemsForm";
import MenuItemImage from "./MenuItemImage";
import { Input } from "@/shared/components/Input";
import { Select } from "@/shared/components/Select";
import { useMenuItemSelectionStore } from "../store/useMenuItemSelectionStore";
import AddIngredientComponent from "./AddIngredientComponent";
import { useMenuItemFormActions } from "../hook/useMenuItemFormActions";
import { useCategoryDataStore } from "@/modules/Category/store/useCategoriesDataStore";

export default function CreateUpdateMenuItemModal() {
  const {
    form,
    errors,
    handleFormChange,
    isAvailable,
    setIsAvailable,
    isSubmitting,
    handleCreateSubmission,
    handleUpdateSubmission,
    resetForm,
    
  } = useMenuItemFormActions();

  const { activeModal, closeModal, setModal, selectedMenuItem } =
    useMenuItemSelectionStore();
  const { categories } = useCategoryDataStore();

  const handleSubmit = () => {
    if (activeModal === "create") {
      handleCreateSubmission();
    }
    if (activeModal === "update" && selectedMenuItem) {
      handleUpdateSubmission(selectedMenuItem.id);
    }
  };

  const buttonText =
    activeModal === "create"
      ? isSubmitting
        ? "Creating..."
        : "Create"
      : isSubmitting
      ? "Updating..."
      : "Update";

  return (
    <ModalOverlay
      onClose={() => {
        resetForm();
        closeModal();
      }}
      isOpen={activeModal === "create" || activeModal === "update"}
    >
      <div className="w-[400px] max-h-[85vh] flex flex-col gap-4 bg-white p-6 rounded-xl shadow-2xl overflow-y-auto scrollbar-hide">
        <h2 className="text-xl font-bold text-center text-blue-500 mb-6">
          {activeModal === "create" ? "Create Menu Item" : "Update Menu Item"}
        </h2>
        <MenuItemImage />
        {menuItemsForm.map((field) => {
          const error = errors[field.name as keyof typeof errors];
          const value = form[field.name as keyof typeof form] ?? "";
          if (field.name === "name" || field.name === "price") {
            return (
              <Input
                key={field.name}
                label={field.label}
                name={field.name}
                type={field.type}
                value={value}
                onChange={handleFormChange}
                error={error}
                className="capitalize"
              />
            );
          }
          if (field.name === "description") {
            return (
              <div key={field.name} className="space-y-1">
                <label className="block text-sm font-medium text-gray-600">
                  {field.label}
                </label>
                <textarea
                  name={field.name}
                  value={value}
                  onChange={handleFormChange}
                  placeholder={field.label}
                  className={`w-full h-32 p-3 text-sm rounded-lg outline-none border-2 ${
                    error ? "border-red-500" : "border-gray-200"
                  } text-gray-900 placeholder-gray-400 `}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
            );
          }
          if (field.name === "categoryId") {
            return (
              <Select
                key={field.name}
                label={field.label}
                name={field.name}
                value={value}
                onChange={handleFormChange}
                error={error}
                className="bg-white capitalize border-gray-200 text-gray-900"
              >
                <option value="" className="text-gray-500">
                  Select Category
                </option>
                {categories.map(({ id, name }) => (
                  <option key={id} value={id} className="capitalize">
                    {name}
                  </option>
                ))}
              </Select>
            );
          }
          return null;
        })}
        <div
          onClick={() => setIsAvailable(!isAvailable)}
          className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div
            className={`h-6 w-6 duration-300 border-2 rounded-full grid place-content-center ${
              isAvailable ? "bg-green-500 border-green-500" : "bg-gray-200 border-gray-200"
            }`}
          >
            <Check size={16} className={isAvailable ? "text-white" : "text-gray-400"} />
          </div>
          <p className="text-sm font-medium text-gray-700">Available</p>
        </div>
        <AddIngredientComponent />
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full py-3 cursor-pointer rounded-lg text-sm font-semibold shadow-md transition-all duration-300 ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed opacity-70"
              : "bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 active:scale-95 text-white"
          }`}
        >
          {buttonText}
        </button>
      </div>
    </ModalOverlay>
  );
}