"use client";
import { useAuth } from "@/modules/Employees/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Ensure client-side only rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading during hydration
  if (!mounted || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-amber-700">
        <p className="text-white text-xl">Loading...</p>
      </div>
      
    );
  }

  const role = user?.role ?? "guest";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-950 text-white px-4">
      <h1 className="text-3xl font-bold mb-4">
        Welcome to Restaurant Management
      </h1>
      <p className="mb-6 max-w-md text-center">
        Manage your restaurant efficiently with role based dashboards for Admin,
        Cashier, and Waiter.
      </p>

      {role === "admin" && (
        <>
          <p className="mb-4">
            You have full admin access to manage everything.
          </p>
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="bg-white text-blue-900 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
          >
            Go to Admin Dashboard
          </button>
        </>
      )}

      {role === "cashier" && (
        <>
          <p className="mb-4">You can manage orders and payments.</p>
          <button
            onClick={() => router.push("/cashier")}
            className="bg-white text-blue-900 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
          >
            Go to Cashier Dashboard
          </button>
        </>
      )}

      {role === "cook" && (
        <>
          <p className="mb-4">You can manage orders and payments.</p>
          <button
            onClick={() => router.push("/kitchen")}
            className="bg-white text-blue-900 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
          >
            Go to Cook Dashboard
          </button>
        </>
      )}

      {role === "chef" && (
        <>
          <p className="mb-4">You can manage orders and payments.</p>
          <button
            onClick={() => router.push("/kitchen")}
            className="bg-white text-blue-900 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
          >
            Go to Chef Dashboard
          </button>
        </>
      )}

      {role === "waiter" && (
        <>
          <p className="mb-4">You can take orders and manage tables.</p>
          <button
            onClick={() => router.push("/waiter")}
            className="bg-white text-blue-900 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
          >
            Go to Waiter Dashboard
          </button>
        </>
      )}

      {!user && (
        <>
          <p className="mb-4 italic">Please login to access your dashboard.</p>
          <button
            onClick={() => router.push("/auth/login")}
            className="bg-white text-blue-900 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
          >
            Login
          </button>
        </>
      )}
    </div>
  );
}