"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

type Props = {
  children: React.ReactNode;
};

export default function RedirectIfAuthenticated({ children }: Props) {
  const router = useRouter();
  useEffect(() => {
    const checkSessionAndRole = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return; 
      const { data: employee, error } = await supabase
        .from("employees")
        .select("role")
        .eq("id", sessionData.session.user.id)
        .maybeSingle();
      if (error) {
        console.error("Failed to fetch employee role:", error.message);
        router.replace("/"); // Fallback redirect
        return;
      }
      if (!employee?.role) {
        router.replace("/"); 
        return;
      }
      switch (employee.role) {
        case "admin":
          router.replace("/admin/dashboard");
          break;
        case "waiter":
          router.replace("/kitchen/orders");
          break;
        default:
          router.replace("/");
      }
    };
    checkSessionAndRole();
  }, [router]);
  return <>{children}</>;
}
