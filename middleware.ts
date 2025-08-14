import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabaseServer } from "./shared/lib/supabaseServer";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = await supabaseServer();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (!session || sessionError) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const { data: employee, error: employeeError } = await supabase
    .from("employees")
    .select("role")
    .eq("id", session.user.id)
    .maybeSingle();

  if (employeeError || !employee) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  const role = employee.role;

  // 👨‍🍳 /kitchen → only cashiers & admins
  if (req.nextUrl.pathname.startsWith("/kitchen")) {
    if (!["cashier", "admin"].includes(role)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  // 🛠 /admin → only admins
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  // 🧑‍🍽️ /waiter → only waiters & admins
  if (req.nextUrl.pathname.startsWith("/waiter")) {
    if (!["waiter", "admin"].includes(role)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/kitchen/:path*", "/admin/:path*", "/waiter/:path*"],
};
