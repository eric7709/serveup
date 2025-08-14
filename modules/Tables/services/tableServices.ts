import { supabase } from "@/shared/lib/supabase";
import { Table, TableFormData } from "../types/table";
import { transformTable, transformTables } from "../utils/transformTables";

export class TableService {
  // 🔹 Get all tables
  static async getAllTables(): Promise<Table[]> {
    const { data, error } = await supabase
      .from("tables")
      .select(
        `
        *,
        waiter:employees(*)
      `
      )
      .order("table_number");
    if (error) throw error;
    return transformTables(data as any);
  }

  // 🔹 Get single table
  static async getTableById(id: string): Promise<Table | null> {
    const { data, error } = await supabase
      .from("tables")
      .select(
        `
        *,
        waiter:employees(*)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return data ? transformTable(data as any) : null;
  }
  static async getTableByUrl(url: string): Promise<Table | null> {
    const { data, error } = await supabase
      .from("tables")
      .select(
        `
        *,
        waiter:employees(*)
      `
      )
      .eq("url", url)
      .single();

    if (error) throw error;
    return data ? transformTable(data as any) : null;
  }

  // 🔹 Create
  static async createTable(payload: TableFormData): Promise<Table> {
    // 1️⃣ Insert table and return with waiter relation
    const { data, error } = await supabase
      .from("tables")
      .insert({
        name: payload.name,
        table_number: payload.tableNumber,
        capacity: payload.capacity,
        is_available: payload.isAvailable ?? true,
        waiter_id: payload.waiterId ?? null,
        url: payload.url
      })
      .select(
        `
      *,
      waiter:employees(*)
    `
      )
      .single();

    if (error) throw error;

    // 2️⃣ If a waiter is assigned, insert allocation history
    if (payload.waiterId) {
      const { error: historyError } = await supabase
        .from("table_allocation_history")
        .insert({
          table_id: data.id,
          waiter_id: payload.waiterId,
          allocated_at: new Date().toISOString(),
        });

      if (historyError) {
        console.error("Failed to insert allocation history", historyError);
      }
    }

    // ✅ Transform before returning
    return transformTable(data as any);
  }

  // 🔹 Update
  static async updateTable(
    id: string,
    updates: Partial<TableFormData>
  ): Promise<Table> {
    const { data, error } = await supabase
      .from("tables")
      .update({
        ...(updates.name !== undefined && { name: updates.name }),
        ...(updates.tableNumber !== undefined && {
          table_number: updates.tableNumber,
        }),
        ...(updates.capacity !== undefined && { capacity: updates.capacity }),
        ...(updates.isAvailable !== undefined && {
          is_available: updates.isAvailable,
        }),
        ...(updates.waiterId !== undefined && { waiter_id: updates.waiterId }),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return transformTable(data as any);
  }

  // 🔹 Delete
  static async deleteTable(id: string): Promise<void> {
    const { error } = await supabase.from("tables").delete().eq("id", id);
    if (error) throw error;
  }

  static async allocateWaiter(
    tableId: string,
    waiterId: string
  ): Promise<Table | null> {
    // 1️⃣ Find current waiter
    const { data: table } = await supabase
      .from("tables")
      .select("waiter_id")
      .eq("id", tableId)
      .single();

    // 2️⃣ If existing waiter, close history
    if (table?.waiter_id) {
      await supabase
        .from("table_allocation_history")
        .update({ deallocated_at: new Date().toISOString() })
        .eq("table_id", tableId)
        .is("deallocated_at", null);
    }

    // 3️⃣ Update current table
    await supabase
      .from("tables")
      .update({ waiter_id: waiterId })
      .eq("id", tableId);

    // 4️⃣ Add new allocation history
    await supabase.from("table_allocation_history").insert({
      table_id: tableId,
      waiter_id: waiterId,
      allocated_at: new Date().toISOString(),
    });

    // 5️⃣ Fetch and return updated table with full waiter details
    const { data: updatedTable, error } = await supabase
      .from("tables")
      .select(
        `
      *,
      waiter:employees(*)
    `
      )
      .eq("id", tableId)
      .single();
    if (error) throw error;
    return updatedTable ? transformTable(updatedTable as any) : null;
  }

  // 🔹 Deallocate current waiter
  static async deallocateWaiter(tableId: string) {
    await supabase.from("tables").update({ waiter_id: null }).eq("id", tableId);
    await supabase
      .from("table_allocation_history")
      .update({ deallocated_at: new Date().toISOString() })
      .eq("table_id", tableId)
      .is("deallocated_at", null);
    const { data: updatedTable, error } = await supabase
      .from("tables")
      .select(
        `
      *,
      waiter:employees(*)
    `
      )
      .eq("id", tableId)
      .single();
    if (error) throw error;
    return updatedTable ? transformTable(updatedTable as any) : null;
  }
}
