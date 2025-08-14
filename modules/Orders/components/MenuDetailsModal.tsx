"use client";
import { FaTimes } from "react-icons/fa";
import { useOrderSelectionStore } from "../store/useOrderSelectionStore";
import ModalOverlay from "@/shared/components/ModalOverlay";

export default function MenuDetailsModal() {
  const {
    activeModal,
    closeModal,
    itemDetails: item,
  } = useOrderSelectionStore();

  return (
    <ModalOverlay isOpen={activeModal == "details"} onClose={closeModal}>
      <div
        onClick={(e: any) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl max-h-[90%] overflow-y-auto max-w-md mx-4 w-full p-6 relative text-gray-800"
      >

        {/* Image */}
        {item?.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-56 object-cover rounded-xl mb-4"
          />
        )}

        {/* Name and Price */}
        <div className="mb-2 flex justify-between items-center">
          <h2 className="text-base font-bold md:text-lg">{item?.name}</h2>
          <span className="text-base md:text-xl font-bold text-green-600">
            ${item?.price.toFixed(2)}
          </span>
        </div>

        {/* Description */}
        {item?.description && (
          <p className="text-[13px] md:text-sm text-gray-600 mb-4">
            {item.description}
          </p>
        )}

        {/* Ingredients */}
        {item && item.ingredients && item?.ingredients.length > 0 && (
          <div className="mt-2 text-[13px] md:text-sm">
            <h3 className="font-semibold text-sm mb-1">Ingredients:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {item.ingredients.map((ingredient, index) => (
                <li className="capitalize" key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ModalOverlay>
  );
}
