import { Customer, CustomerResult } from "@/modules/Customers/types/customer";

export function transformCustomer(dbRow: CustomerResult): Customer {
  return {
    id: dbRow.id,
    name: dbRow.name,
    email: dbRow.email,
    title: dbRow.title,
    phone: dbRow.phone_number, 
    createdAt: dbRow.created_at,
  };
}