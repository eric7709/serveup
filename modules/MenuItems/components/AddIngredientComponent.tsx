"use client";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useMenuItemFormStore } from "../store/useMenuItemFormStore";

export default function AddIngredientComponent() {
  const { addIngredient, removeIngredient, ingredients } = useMenuItemFormStore();
  const [value, setValue] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      addIngredient(value);
      setValue("");
    }
  };

  return (
    <form onSubmit={handleAdd} className="space-y-2 w-full">
      <div className="flex gap-3 w-full">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add ingredient"
          className="h-9 flex-1 px-3 rounded-md outline-none border-2 border-blue-200 text-xs focus:border-blue-400 transition-colors"
        />
        <button
          type="submit"
          onClick={handleAdd}
          className="py-2 px-4 rounded-md text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 active:scale-95 transition-all duration-200 shadow-sm"
        >
          Add
        </button>
      </div>

      <div
        className={`${
          ingredients.length > 0 ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        } grid transition-all duration-300`}
      >
        <div className="flex flex-wrap gap-2 overflow-hidden">
          {ingredients.map((el, index) => (
            <div
              key={`${el}-${index}`} // Unique key using ingredient and index
              onClick={() => removeIngredient(el)}
              className="bg-blue-50 text-xs px-2 py-1 flex items-center gap-2 rounded-md shadow-sm hover:bg-blue-100 cursor-pointer transition-colors"
            >
              <span className="capitalize font-medium">{el}</span>
              <FaTimes className="text-xs text-gray-600 hover:text-red-500 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}