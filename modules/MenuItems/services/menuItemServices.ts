import { supabase } from "@/shared/lib/supabase";
import { CreateMenuItem, MenuItem, UpdateMenuItem } from "../types/menuItems";
import {
  transformMenuItem,
  transformMenuItems,
} from "../utils/transformMenuItems";


export class MenuItemService {
  static async getAllMenuItems(): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from("menu_items")
      .select(
        `
        *,
        categories (id, name, created_at)
      `
      )
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching menu items:", error);
      return [];
    }
    return transformMenuItems(data || []);
  }
  static async fetchUnavailableItemsIds(ids: string[]): Promise<string[]> {
    if (ids.length === 0) return [];
    const { data, error } = await supabase
      .from("menu_items")
      .select("id")
      .in("id", ids)
      .eq("is_available", false);
    const newData = data?.map((el) => el.id);
    if (error) {
      throw new Error(error.message);
    }
    return newData || [];
  }

  /** Create a menu item */
  static async createMenuItem(menuItem: CreateMenuItem): Promise<MenuItem> {
    const { data, error } = await supabase
      .from("menu_items")
      .insert({
        name: menuItem.name,
        price: menuItem.price,
        description: menuItem.description,
        image_url: menuItem.imageUrl,
        is_available: menuItem.isAvailable,
        category_id: menuItem.categoryId,
        ingredients: menuItem.ingredients,
      })
      .select(
        `
        *,
        categories (id, name, created_at)
      `
      )
      .single();

    if (error) throw error;
    return transformMenuItem(data);
  }

  /** Update a menu item */
  static async updateMenuItem(
    id: string,
    updates: UpdateMenuItem
  ): Promise<MenuItem> {
    const { data, error } = await supabase
      .from("menu_items")
      .update({
        name: updates.name,
        price: updates.price,
        description: updates.description,
        image_url: updates.imageUrl,
        is_available: updates.isAvailable,
        category_id: updates.categoryId,
        ingredients: updates.ingredients,
      })
      .eq("id", id)
      .select(
        `
        *,
        categories (id, name, created_at)
      `
      )
      .single();
    if (error) throw error;
    return transformMenuItem(data); 
  }

  /** Update menu item availability only */
  static async updateMenuItemAvailability(
    id: string,
    isAvailable: boolean
  ): Promise<MenuItem> {
    const { data, error } = await supabase
      .from("menu_items")
      .update({ is_available: isAvailable })
      .eq("id", id)
      .select(
        `
        *,
        categories (id, name, created_at)
      `
      )
      .single();
    if (error) throw error;
    return transformMenuItem(data);
  }
  /** Delete a menu item */
  static async deleteMenuItem(id: string): Promise<void> {
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) throw error;
  }
}
