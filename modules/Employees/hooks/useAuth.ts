"use client"
import { useEffect } from "react";
import { useAuthStore } from "@/modules/Employees/store/useAuthStore";

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading };
}
