import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  try {
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

    // Route protection logic (your existing code is fine)
    if (req.nextUrl.pathname.startsWith("/cashier")) {
      if (!["cashier", "admin"].includes(role)) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    if (req.nextUrl.pathname.startsWith("/waiter")) {
      if (!["waiter", "admin"].includes(role)) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    if (req.nextUrl.pathname.startsWith("/kitchen")) {
      if (!["chef", "cook", "admin"].includes(role)) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

export const config = {
  matcher: ["/kitchen/:path*", "/admin/:path*", "/waiter/:path*", "/cashier/:path*"],
};