import { OrderMenutItem } from "@/modules/Orders/types/orders";
import { MenuItem } from "../types/menuItems";
export const isSelected = (items: OrderMenutItem[], id: string) => {
  return items.some((el) => el.id == id);
};
