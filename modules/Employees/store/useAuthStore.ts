import { create } from "zustand";
import { supabase } from "@/shared/lib/supabase";
import { UseAuthStore, Employee } from "../types/employee";
import { transformEmployee } from "../utils/transformEmployees";

export const useAuthStore = create<UseAuthStore>((set) => ({
  user: null,
  loading: false,
  login: (user) => set({ user }),
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
  fetchUser: async () => {
    set({ loading: true });
    // 1️⃣ Get current auth user
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      set({ user: null, loading: false });
      return;
    }
    const email = authData.user.email;
    if (!email) {
      set({ user: null, loading: false });
      return;
    }

    // 2️⃣ Fetch employee details
    const { data: employee, error: dbError } = await supabase
      .from("employees")
      .select("*")
      .eq("email", email)
      .single();

    if (dbError || !employee) {
      console.error("Error fetching employee details:", dbError?.message);
      set({ user: null, loading: false });
      return;
    }

    // 3️⃣ Transform to camelCase
    const transformed = transformEmployee(employee);

    // 4️⃣ Store in state
    set({ user: transformed, loading: false });
  },
}));
