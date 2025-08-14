import { transformEmployee } from "@/modules/Employees/utils/transformEmployees";
import { Table, TableResult } from "../types/table";

export function transformTable(table: TableResult): Table {
  return {
    id: table.id,
    name: table.name,
    tableNumber: table.table_number,
    capacity: table.capacity,
    isAvailable: table.is_available,
    waiterId: table.waiter_id,
    waiter: table.waiter ? transformEmployee(table.waiter) : undefined,
    url: table.url
  };
}

export function transformTables(tables: TableResult[]): Table[] {
  return tables.map(transformTable);
}
