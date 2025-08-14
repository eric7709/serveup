import { Category } from "@/modules/Category/types/category";
import { Dispatch, SetStateAction } from "react";

export type UpdateMenuItem = Partial<
  Omit<MenuItem, "id" | "createdAt" | "categoryName">
>;
export type CreateMenuItem = Omit<
  MenuItem,
  "id" | "createdAt" | "categoryName"
>;

export type ActiveModal =
  | "create"
  | "update"
  | "delete"
  | null;


export type MenuFormError = "name" | "price" | "description" | "categoryId";



export type MenuItemResult = {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url?: string | null;
  is_available: boolean;
  created_at?: string;
  category_id?: string | null;
  category: Category;
  ingredients: string[];
};

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  description: string;
  isAvailable: boolean;
  categoryId: string;
  imageUrl?: string | null;
  ingredients?: string[];
  quantity?: number;
  createdAt?: string;
  category?: Category;
};

export type Errors = Partial<Record<keyof Form, string>>;

export type Form = {
  price: number;
  name: string;
  categoryId: string;
  description: string;
};

export type Error = {
  price: string;
  name: string;
  categoryId: string;
  description: string;
};

export type Image = {
  file: File | null;
  url: string;
};




export type MenuItemFormStore = {
  // State
  form: Form;
  image: Image;
  isAvailable: boolean;
  errors: Errors;
  ingredients: string[];
  isSubmitting: boolean;
  setSubmitting: (isSubmitting: boolean) => void

  // Actions - state setters
  setForm: (updates: Partial<Form>) => void;
  handleFormChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  setImage: (image: Image) => void;
  clearImage: () => void;
  setIsAvailable: (value: boolean) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // Actions - ingredient management
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;

  // Actions - validation & payload
  validate: () => boolean;
  buildPayload: () => Promise<{
    categoryId: string;
    name: string;
    price: number;
    description: string;
    ingredients: string[];
    isAvailable: boolean;
    imageUrl?: string | null;
  }>;

  // Actions - CRUD submission

  // Actions - state manipulation
  updateState: (menuItem: MenuItem) => void;
  resetForm: () => void;
};

 

export type UseMenuItemDataStore = {
  menuItems: MenuItem[];
  searchTerm: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  isLoading: boolean;
  error: string | null;
  selectedCategory: string | null;
  selectedAvailability: "available" | "unavailable" | null;
  setMenuItems: (items: MenuItem[]) => void;
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  setLoading: (loading: boolean) => void
  removeMenuItem: (id: string) => void;
  setSearchTerm: (term: string) => void;
  setSortBy: (field: string) => void;
  setSortOrder: (order: "asc" | "desc") => void;
  setSelectedCategory: (categoryId: string | null) => void;
  setSelectedAvailability: (status: "available" | "unavailable" | null) => void; // 🆕

  filteredMenuItems: () => MenuItem[];
};




export type UseMenuItemSelectionStore = {
  activeModal:
    | "create"
    | "update"
    | "delete"
    | null;
  setModal: (
    modal:
     | "create"
    | "update"
    | "delete"
    | null
  ) => void;
  closeModal: () => void;
  selectedMenuItem: MenuItem | null;
  selectMenuItem: (menuItem: MenuItem) => void;
  clearMenuItem: () => void;
};
