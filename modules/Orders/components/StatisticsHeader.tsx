"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { Filter, X } from "lucide-react";
import AdminTitle from "@/shared/components/AdminTitle";
import { Divide as Hamburger } from "hamburger-react";
import { useUIStore } from "@/store/useUIStore";

type TDateOption =
  | "today"
  | "yesterday"
  | "this week"
  | "this month"
  | "this year"
  | "custom";

interface StatisticsHeaderProps {
  dateOption: TDateOption;
  setDateOption: Dispatch<
    SetStateAction<
      | "today"
      | "yesterday"
      | "this week"
      | "this month"
      | "this year"
      | "custom"
    >
  >;
  startDate: string;
  setStartDate: Dispatch<SetStateAction<string>>;
  endDate: string;
  setEndDate: Dispatch<SetStateAction<string>>;
  showCustomPicker: boolean;
  setShowCustomPicker: Dispatch<SetStateAction<boolean>>;
  isRange: boolean;
  setIsRange: Dispatch<SetStateAction<boolean>>;
}

export default function StatisticsHeader({
  dateOption,
  setDateOption,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  showCustomPicker,
  setShowCustomPicker,
  isRange,
  setIsRange,
}: StatisticsHeaderProps) {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const { toggleDrawer, drawerOpened } = useUIStore();

  const today = new Date("2025-08-11"); // Updated to current date: 04:19 AM WAT, 2025-08-11
  const formatDate = (date: Date): string => date.toISOString().split("T")[0];

  const dateOptions = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "this week", label: "This Week" },
    { value: "this month", label: "This Month" },
    { value: "this year", label: "This Year" },
    { value: "custom", label: "Custom" },
  ];

  const handleDateOption = (option: typeof dateOption) => {
    setDateOption(option);
    setShowCustomPicker(false);
    let newStartDate: string, newEndDate: string;

    switch (option) {
      case "today":
        newStartDate = newEndDate = formatDate(today);
        break;
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1); // 2025-08-10
        newStartDate = newEndDate = formatDate(yesterday);
        break;
      case "this week":
        const monday = new Date(today);
        monday.setDate(
          today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
        ); // 2025-08-11 is Monday, so start is 2025-08-11
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6); // 2025-08-17
        newStartDate = formatDate(monday);
        newEndDate = formatDate(sunday);
        break;
      case "this month":
        newStartDate = formatDate(
          new Date(today.getFullYear(), today.getMonth(), 1)
        ); // 2025-08-01
        newEndDate = formatDate(
          new Date(today.getFullYear(), today.getMonth() + 1, 0)
        ); // 2025-08-31
        break;
      case "this year":
        newStartDate = formatDate(new Date(today.getFullYear(), 0, 1)); // 2025-01-01
        newEndDate = formatDate(new Date(today.getFullYear(), 11, 31)); // 2025-12-31
        break;
      case "custom":
        setShowCustomPicker(true);
        return;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const handleCustomDate = (
    e: React.ChangeEvent<HTMLInputElement>,
    isStart: boolean
  ) => {
    const newDate = e.target.value;
    if (isStart) {
      setStartDate(newDate);
      if (!isRange) setEndDate(newDate);
    } else {
      setEndDate(newDate);
    }
  };

  return (
    <>
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between pr-2 lg:px-6 h-16 mx-auto">
          <button className="lg:hidden">
            <Hamburger size={18} toggled={drawerOpened} toggle={toggleDrawer} />
          </button>
          <AdminTitle title="Statistics" />

          {/* Center Section - Desktop Date Options */}
          <div className="lg:flex hidden items-center gap-2">
            {dateOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleDateOption(option.value as TDateOption)}
                className={`px-3 py-2 text-xs font-medium rounded-md transition-colors duration-200 ${
                  dateOption === option.value
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-green-500"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Right Section - Mobile Filter Button */}
          <button
            onClick={() => setOverlayOpen(true)}
            className="rounded-md hover:bg-gray-100 lg:hidden p-2"
            aria-label="Open filters"
          >
            <Filter size={20} />
          </button>
        </div>

        {/* Desktop Custom Date Picker */}
        {showCustomPicker && (
          <div className="hidden lg:flex items-center justify-center gap-3 px-6 py-3 bg-gray-50 border-t border-gray-200">
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                checked={isRange}
                onChange={() => setIsRange(!isRange)}
                className="h-4 w-4 text-green-600 border-gray-200 rounded focus:ring-green-500"
              />
              <span className="text-sm font-medium">Date Range</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleCustomDate(e, true)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-sm text-gray-700 hover:border-green-500 focus:outline-none focus:ring focus:ring-blue-400 transition-colors duration-200"
              max={isRange ? endDate : formatDate(today)}
            />
            {isRange && (
              <>
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleCustomDate(e, false)}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-sm text-gray-700 hover:border-green-500 focus:outline-none focus:ring focus:ring-blue-400 transition-colors duration-200"
                  min={startDate}
                  max={formatDate(today)}
                />
              </>
            )}
          </div>
        )}
      </header>

      {/* MOBILE FILTER OVERLAY */}
      <div
        className={`fixed inset-0 z-50 bg-white pr-2 pl-3 py-4 flex flex-col gap-5 transition-opacity duration-300 lg:hidden ${
          overlayOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="flex justify-between items-center">
          <AdminTitle title="Date Filters" />
          <button
            onClick={() => setOverlayOpen(false)}
            className="rounded-md hover:bg-gray-100 transition"
            aria-label="Close filters"
          >
            <X />
          </button>
        </div>

        {/* Mobile Date Options */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Select Date Range
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {dateOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleDateOption(option.value as TDateOption)}
                className={`px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  dateOption === option.value
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-green-500"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Custom Date Picker */}
        {showCustomPicker && (
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                checked={isRange}
                onChange={() => setIsRange(!isRange)}
                className="h-4 w-4 text-green-600 border-gray-200 rounded focus:ring-green-500"
              />
              <span className="text-sm font-medium">Use Date Range</span>
            </label>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRange ? "Start Date" : "Date"}
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleCustomDate(e, true)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-sm text-gray-700 hover:border-green-500 focus:outline-none focus:ring focus:ring-blue-400 transition-colors duration-200"
                  max={isRange ? endDate : formatDate(today)}
                />
              </div>

              {isRange && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => handleCustomDate(e, false)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-sm text-gray-700 hover:border-green-500 focus:outline-none focus:ring focus:ring-blue-400 transition-colors duration-200"
                    min={startDate}
                    max={formatDate(today)}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => setOverlayOpen(false)}
          className="mt-auto py-3 cursor-pointer text-sm bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 active:scale-95 transition-transform duration-150"
        >
          Apply Filters
        </button>
      </div>
    </>
  );
}
