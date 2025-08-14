import { supabaseAdmin } from "@/shared/lib/supabaseAdmin";
import { NextResponse } from "next/server";



export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate") || "2025-08-01";
  const endDate = searchParams.get("endDate") || "2025-08-13";
  const limitSize = Number(searchParams.get("limitSize") || 5);
  const { data, error } = await supabaseAdmin.rpc("get_restaurant_analytics", {
    start_date: startDate,
    end_date: endDate,
    limit_size: limitSize,
  });
  if (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
