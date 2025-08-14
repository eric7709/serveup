"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getCustomerFromCookie } from "@/shared/utils/getCustomerFromCookie";
import { useOrderSelectionStore } from "../store/useOrderSelectionStore";
import { useCreateOrder } from "../hooks/useOrderServices";
import { Customer } from "@/modules/Customers/types/customer";
import { supabase } from "@/shared/lib/supabase";
import { useMenuItemDataStore } from "@/modules/MenuItems/store/useMenuItemsDataStore";
import {
  useGetCustomerById,
  useGetOrCreateCustomer,
} from "@/modules/Customers/hooks/useCustomerSerivces";
import { orderPayloadCreator } from "../utils/payloadCreator";
import { useTableDataStore } from "@/modules/Tables/store/useTableDataStore";

export function useOrderSummary() {
  const {
    items,
    getTotal,
    resetItems,
    allocatedTableId,
    checkSuccessful,
    clearSuccess,
    success,
    activeModal,
    setModal,
    closeModal,
    removeMenuItem,
  } = useOrderSelectionStore();

  const { menuItems } = useMenuItemDataStore();
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();

  const fetchedCustomer = getCustomerFromCookie();
  const {
    data: ensuredCustomer,
    error: customerError,
    isLoading: isLoadingCustomer,
  } = useGetCustomerById(fetchedCustomer?.id ?? "");

  const {
    mutateAsync: createCustomer,
    error: creationError,
    isPending: isCreatingCustomer,
  } = useGetOrCreateCustomer();
  const { fetchTables, tables } = useTableDataStore();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [unavailableIds, setUnavailableIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** Close modal & reset state after success */
  const handleClick = () => {
    closeModal();
    if (success) {
      clearSuccess();
      resetItems();
    }
  };

  /** Remove items that are no longer available */
  useEffect(() => {
    if (activeModal === "summary") return;

    const unavailableOrderedItems = items.filter((orderItem) => {
      const menuItem = menuItems.find((m) => m.id === orderItem.id);
      return menuItem && !menuItem.isAvailable;
    });

    unavailableOrderedItems.forEach((item) => removeMenuItem(item.id));
  }, [menuItems, items, removeMenuItem, activeModal]);

  /** Reset unavailable items when reopening summary modal */
  useEffect(() => {
    if (activeModal === "summary") setUnavailableIds([]);
  }, [activeModal]);

  const handleRemoveItem = (id: string) => removeMenuItem(id);

  /** Confirm and place the order */
  const handleConfirm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await fetchTables();

      if (isLoadingCustomer || isCreatingCustomer) {
        toast.info("Please wait, verifying customer information...");
        return;
      }

      if (!fetchedCustomer) {
        setModal("create");
        return;
      }

      if (!items.length) {
        toast.error("You must add at least one item.");
        return;
      }

      if (!allocatedTableId) {
        toast.error("Please select a table before placing the order.");
        return;
      }

      const table = tables.find((el) => el.id === allocatedTableId);
      if (!table) {
        toast.error("Selected table not found.");
        return;
      }

      // Ensure we have a valid customer
      let finalCustomer = ensuredCustomer ?? null;
      if (!finalCustomer || customerError) {
        finalCustomer = await createCustomer({
          email: fetchedCustomer.email,
          name: String(fetchedCustomer.name),
          phoneNumber: String(fetchedCustomer.phone),
          title: fetchedCustomer.title ?? "",
        });

        if (creationError || !finalCustomer) {
          toast.error("Failed to create customer.");
          return;
        }
      }
      setCustomer(finalCustomer);

      // Verify item availability
      const { data: latestItems, error: stockError } = await supabase
        .from("menu_items")
        .select("id, name, is_available")
        .in(
          "id",
          items.map((i) => i.id)
        );

      if (stockError) {
        console.error(stockError);
        toast.error("Could not verify item availability. Please try again.");
        return;
      }

      const unavailable = latestItems?.filter((i) => !i.is_available) ?? [];
      if (unavailable.length > 0) {
        setUnavailableIds(unavailable.map((i) => i.id));
        toast.error(
          `These items are no longer available: ${unavailable.map((i) => i.name).join(", ")}`
        );
        return;
      }

      if (!finalCustomer) {
        toast.error("Customer details are required.");
        return;
      }

      // Submit the order
      const payload = orderPayloadCreator({
        customer: finalCustomer,
        table,
        items,
        total: getTotal(),
      });

      createOrder(payload, {
        onSettled: () => setIsSubmitting(false),
      });

      checkSuccessful();
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    items,
    customer,
    unavailableIds,
    success,
    isSubmitting: isSubmitting || isCreatingOrder || isCreatingCustomer,
    total: getTotal(),
    activeModal,
    handleClick,
    handleConfirm,
    handleRemoveItem,
    closeModal,
    resetItems,
  };
}
