import { create } from "zustand";
import { toast } from "react-toastify";
import { uploadImageToSupabase } from "../services/uploadImageToSupabase";
import {
  Errors,
  Form,
  Image,
  MenuItem,
  MenuItemFormStore,
} from "../types/menuItems";

const initialForm: Form = {
  categoryId: "",
  name: "",
  price: 0,
  description: "",
};

const initialImage: Image = {
  file: null,
  url: "",
};

export const useMenuItemFormStore = create<MenuItemFormStore>((set, get) => ({
  // State
  form: { ...initialForm },
  image: { ...initialImage },
  isAvailable: true,
  errors: {} as Errors,
  ingredients: [] as string[],
  isSubmitting: false,
  setSubmitting: (isSubmitting) => {
    set({
      isSubmitting,
    });
  },

  // Actions
  setForm: (updates: Partial<Form>) =>
    set((state) => ({ form: { ...state.form, ...updates } })),

  handleFormChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    set((state) => ({
      form: {
        ...state.form,
        [name]: name === "price" ? +value : value,
      },
    }));
  },

  setImage: (image: Image) => set({ image }),
  clearImage: () => set({ image: { ...initialImage } }),
  setIsAvailable: (value: boolean) => set({ isAvailable: value }),
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const url = URL.createObjectURL(file);
      set({ image: { file, url } });
    } else {
      get().clearImage();
    }
  },
  addIngredient: (ingredient: string) =>
    set((state) => {
      if (
        !state.ingredients.some(
          (el) => el.toLowerCase() === ingredient.toLowerCase()
        )
      ) {
        return { ingredients: [...state.ingredients, ingredient] };
      }
      return {};
    }),
  removeIngredient: (ingredient: string) =>
    set((state) => ({
      ingredients: state.ingredients.filter(
        (el) => el.toLowerCase() !== ingredient.toLowerCase()
      ),
    })),
  validate: () => {
    const { form } = get();
    const newErrors: Errors = {};
    if (!form.categoryId.trim())
      newErrors.categoryId = "Please select a category";
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.price || form.price <= 0)
      newErrors.price = "Price must be greater than 0";
    if (!form.description.trim())
      newErrors.description = "Description is required";
    set({ errors: newErrors });
    return Object.keys(newErrors).length === 0;
  },
  buildPayload: async () => {
    const { image, form, ingredients, isAvailable } = get();
    let imageUrl: string | undefined | null;
    if (image.file) {
      try {
        imageUrl = await uploadImageToSupabase(image.file);
      } catch {
        toast.error("❌ Image upload failed");
        throw new Error("Image upload failed");
      }
    }
    return { ...form, ingredients, isAvailable, imageUrl };
  },
  resetForm: () =>
    set({
      form: { ...initialForm },
      image: { ...initialImage },
      isAvailable: true,
      errors: {},
      ingredients: [],
      isSubmitting: false,
    }),
  updateState: (menuItem: MenuItem) =>
    set({
      form: {
        categoryId: menuItem.categoryId ?? "",
        description: menuItem.description ?? "",
        name: menuItem.name ?? "",
        price: menuItem.price ?? 0,
      },
      ingredients: menuItem.ingredients ?? [],
      image: { url: menuItem.imageUrl ?? "", file: null },
      isAvailable: menuItem.isAvailable ?? true,
    }),
}));
