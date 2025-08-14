"use client";

import { Input } from "@/shared/components/Input";
import { Select } from "@/shared/components/Select";
import ModalOverlay from "@/shared/components/ModalOverlay";
import { useCustomerDetails } from "../store/useCustomerDetails";
import { titles } from "@/modules/Customers/constants/title";

export default function CreateCustomerModal() {
  const {
    isOpen,
    customer,
    errors,
    setField,
    closeModal,
    handleSubmit,
    isPending,
  } = useCustomerDetails();

  return (
    <ModalOverlay isOpen={isOpen} onClose={closeModal}>
      <form
        onSubmit={handleSubmit}
        className="w-[380px] space-y-4 p-5 bg-white shadow-md rounded-xl"
      >
        <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Customer Details
        </h2>

        {/* Title */}
        <Select
          label="Title"
          value={customer.title}
          onChange={(e) => setField("title", e.target.value)}
          error={errors.title}
          className="text-sm"
        >
          <option value="">Select title</option>
          {titles.map((title, key) => (
            <option value={title} key={key}>
              {title}
            </option>
          ))}
        </Select>

        {/* Name */}
        <Input
          label="Full Name"
          value={customer.name}
          onChange={(e) => setField("name", e.target.value)}
          placeholder="Enter full name"
          error={errors.name}
          inputClassName="text-sm"
          labelClassName="text-sm"
        />

        {/* Email */}
        <Input
          label="Email Address"
          type="email"
          value={customer.email}
          onChange={(e) => setField("email", e.target.value)}
          placeholder="Enter email"
          error={errors.email}
          inputClassName="text-sm"
          labelClassName="text-sm"
        />

        {/* Phone */}
        <Input
          label="Phone Number"
          type="tel"
          value={customer.phoneNumber}
          onChange={(e) => setField("phoneNumber", e.target.value)}
          placeholder="Enter phone number"
          error={errors.phoneNumber}
          inputClassName="text-sm"
          labelClassName="text-sm"
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
          <button
            type="button"
            onClick={closeModal}
            disabled={isPending}
            className="px-6 cursor-pointer py-2.5 rounded-md bg-gray-100 text-gray-700 hover:bg-red-500 active:scale-95 transition hover:text-white duration-300 disabled:opacity-50 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-6 cursor-pointer py-2.5 duration-300 rounded-md bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition disabled:opacity-50 text-sm"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </ModalOverlay>
  );
}
