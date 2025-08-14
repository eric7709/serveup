import { OrderMenutItem } from "@/modules/Orders/types/orders";
import { MenuItem } from "../types/menuItems";

export const getSelectedItem = (items: OrderMenutItem[], id: string) => {
    return items.find((el) => el.id == id);
}
