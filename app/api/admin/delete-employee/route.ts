import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabaseAdmin";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json(); // Get id from request body

    if (!id) {
      return NextResponse.json({ error: "Employee ID is required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("employees")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to delete employee" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Employee deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Server Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Set runtime to Node.js to avoid Supabase Edge Runtime issues
export const runtime = "nodejs";