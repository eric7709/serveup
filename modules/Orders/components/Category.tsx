"use client";
import { useCategoryDataStore } from "@/modules/Category/store/useCategoriesDataStore";
import { useOrderSelectionStore } from "../store/useOrderSelectionStore";

export default function Category() {
  const all = {
    id: "oo",
    name: "all"
  }
  const {categories} = useCategoryDataStore()
  const {changeCategory, category} = useOrderSelectionStore()
  return (
    <div className="w-full bg-white py-4">
      <div className="overflow-x-auto py-3 scrollbar-hide whitespace-nowrap px-4 flex gap-3 scroll-smooth snap-x snap-mandatory scrollbar-hide">
        {categories && [all, ...categories].map((cat, idx) => (
          <div
            onClick={() => changeCategory(cat.name.toLocaleLowerCase())}
            key={idx}
            className={`snap-start capitalize shrink-0 active:scale-90 px-4 py-3 select-none rounded-full  text-xs font-medium cursor-pointer duration-200 ${
              category.toLocaleLowerCase() == cat.name.toLocaleLowerCase()
                ? "bg-blue-600 shadow-md text-white"
                : "bg-blue-100"
            }`}
          >
            {cat.name}
          </div>
        ))}
      </div>
    </div>
  );
}
