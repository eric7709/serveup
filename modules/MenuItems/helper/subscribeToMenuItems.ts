import { createRealtimeSubscription } from "@/shared/utils/createRealTimeSubscription";
import { useMenuItemDataStore } from "../store/useMenuItemsDataStore";
import { MenuItem } from "@/modules/MenuItems/types/menuItems";
import { normalizeMenuItem } from "../utils/normalizeMenuItems";
type MenuItemWithId = MenuItem & { id: string | number };
export const subscribeToMenuItems = () => {
  const { addMenuItem, updateMenuItem, removeMenuItem } = useMenuItemDataStore.getState();
  return createRealtimeSubscription<MenuItemWithId>("menu_items", {
    onInsert: (row) => addMenuItem(normalizeMenuItem(row)),
    onUpdate: (row) => updateMenuItem(row.id, normalizeMenuItem(row)),
    onDelete: (id) => removeMenuItem(id),
  });
};