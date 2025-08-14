"use client"
import { useUIStore } from "@/store/useUIStore";

export default function PageLoader() {
  const { isPageLoading } = useUIStore();
  return (
    <div
      className={`fixed z-[50000000] top-0 lg:left-60 left-0 bg-white right-0 h-full grid place-content-center duration-300 ${isPageLoading ? "opacity-100 visible" : "invisible opacity-0"}`}
    >
      <div className="flex space-x-2">
        <div
          className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
    </div>
  );
}
