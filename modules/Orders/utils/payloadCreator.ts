import { Customer } from "@/modules/Customers/types/customer";
import { CreateOrder, OrderMenutItem } from "../types/orders";
import { Table } from "@/modules/Tables/types/table";

type Props = {
    customer: Customer,
    table: Table
    items: OrderMenutItem[]
    total: number
}

export const orderPayloadCreator = ({customer, table, items, total}: Props): CreateOrder => {
  return {
    tableId: table.id,
    waiterId: table.waiterId,
    customerId: customer?.id ?? null,
    customerName: customer?.name ?? null,
    customerTitle: customer?.title ?? "",
    items,
    status: "pending",
    tableName: table.name,
    total,
    waiterName: table.waiter?.firstName ?? null,
  };
};
