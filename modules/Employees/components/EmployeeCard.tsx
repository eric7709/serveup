"use client"
import { FaUserCircle } from "react-icons/fa";
import { Employee } from "../types/employee";
import { Trash2 } from "lucide-react";
import { useEmployeeSelectionStore } from "../store/useEmployeeSelectionStore";

type Props = {
  employee: Employee;
};

export default function EmployeeCard({ employee }: Props) {
  const { selectEmployee, setModal } = useEmployeeSelectionStore();
  return (
    <div
      onClick={() => {
        selectEmployee(employee)
        setModal("update")
      }}
      className="relative bg-gradient-to-br border-2 border-blue-200 from-emerald-900 to-gray-900 text-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
    >
      <button
        onClick={(e) => {
          selectEmployee(employee)
          setModal("delete");
          e.stopPropagation()
        }}
        className="absolute top-3 right-3 cursor-pointer h-9 w-9 flex items-center justify-center rounded-full bg-red-500/20 hover:bg-red-500/40 transition-colors"
        title="Delete Employee"
      >
        <Trash2 size={18} className="text-red-400" />
      </button>

      {/* Avatar */}
      <FaUserCircle className="text-7xl text-gray-400 mb-4" />

      {/* Name */}
      <h3 className="text-lg font-semibold capitalize text-center">
        {employee.firstName} {employee.lastName}
      </h3>

      {/* Role */}
      <p className="text-sm text-blue-300 mb-1 capitalize">{employee.role}</p>

      {/* Phone */}
      <p className="text-sm text-gray-400">{employee.phoneNumber}</p>
    </div>
  );
}
