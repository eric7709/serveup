import { supabase } from "../lib/supabase";

export async function fetchStatistics({
  startDate,
  endDate,
  waiterLimit = 50,
  waiterOffset = 0,
  tableLimit = 50,
  tableOffset = 0,
  customerLimit = 100,
  customerOffset = 0,
}: {
  startDate: string; 
  endDate: string;   
  waiterLimit?: number;
  waiterOffset?: number;
  tableLimit?: number;
  tableOffset?: number;
  customerLimit?: number;
  customerOffset?: number;
}) {
  const { data, error } = await supabase.rpc("get_statistics", {
    start_date: startDate,
    end_date: endDate,
    waiter_limit: waiterLimit,
    waiter_offset: waiterOffset,
    table_limit: tableLimit,
    table_offset: tableOffset,
    customer_limit: customerLimit,
    customer_offset: customerOffset,
  });
  if (error) {
    console.error("Error fetching statistics:", error.message);
    throw error;
  }

  return data;
}
