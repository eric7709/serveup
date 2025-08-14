// store/useOrderDataStore.ts
import { create } from "zustand";
import { OrderDataStore } from "../types/orders";
import { OrderService } from "../services/orderServices";

export const useOrderDataStore = create<OrderDataStore>((set, get) => ({
  orders: [],
  total: 0,
  totalPages: 1,
  paymentMethod: null,
  page: 1,
  limit: 50,
  search: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  status: "",
  dateFrom: undefined,
  dateTo: undefined,
  counts: { pending: 0, completed: 0, cancelled: 0, paid: 0, all: 0 },
  totals: { pending: 0, completed: 0, cancelled: 0, paid: 0, all: 0 },
  isLoading: false,
  setPage: (page) => {
    set({ page });
    get().fetchOrders();
  },
  setPaymentMethod: (paymentMethod) => {
    set({ paymentMethod });
    get().fetchOrders();
  },
  clearPaymentMethod: () => {
    set({ paymentMethod: "all" });
    get().fetchOrders();
  },
  setSearch: (search) => {
    set({ search, page: 1 });
    get().fetchOrders();
  },
  setSort: (sortBy, sortOrder) => {
    set({ sortBy, sortOrder, page: 1 });
    get().fetchOrders();
  },
  setStatus: (status) => {
    set({ status, page: 1 });
    get().fetchOrders();
  },
  setDateRange: (dateFrom, dateTo) => {
    set({ dateFrom, dateTo, page: 1 });
    get().fetchOrders();
  },

  fetchOrders: async () => {
    set({ isLoading: true });
    const { page, limit, search, sortBy, sortOrder, status, dateFrom, dateTo, paymentMethod } =
      get();
    try {
      const { orders, total, totalPages, counts, totals } =
        await OrderService.getAllOrders({
          page,
          limit,
          search,
          sortBy,
          sortOrder,
          status,
          dateFrom,
          dateTo,
          paymentMethod: paymentMethod!
        });
      set({ orders, total, totalPages, counts, totals, isLoading: false });
    } catch (error) {
      console.error("Fetch orders failed:", error);
      set({ isLoading: false });
    }
  },

  addOrder: (order) => {
    set((state) => {
      const exists = state.orders.some((o) => o.id === order.id);
      if (!exists) {
        const statusKey = order.status as keyof typeof state.counts;
        return {
          orders: [order, ...state.orders],
          counts: {
            ...state.counts,
            [statusKey]: (state.counts[statusKey] ?? 0) + 1,
            all: state.counts.all + 1,
          },
        };
      }
      return state;
    });
  },

  updateOrder: (id, updates) => {
    set((state) => {
      let newCounts = { ...state.counts };
      const updatedOrders = state.orders.map((o) => {
        if (o.id === id) {
          // if status changes, adjust counts
          if (updates.status && updates.status !== o.status) {
            const oldStatusKey = o.status as keyof typeof newCounts;
            const newStatusKey = updates.status as keyof typeof newCounts;
            newCounts[oldStatusKey] = Math.max(0, newCounts[oldStatusKey] - 1);
            newCounts[newStatusKey] = (newCounts[newStatusKey] ?? 0) + 1;
          }
          return { ...o, ...updates };
        }
        return o;
      });
      return { orders: updatedOrders, counts: newCounts };
    });
  },

  removeOrder: (id) =>
    set((state) => {
      const orderToRemove = state.orders.find((o) => o.id === id);
      if (!orderToRemove) return state;
      const statusKey = orderToRemove.status as keyof typeof state.counts;
      return {
        orders: state.orders.filter((o) => o.id !== id),
        counts: {
          ...state.counts,
          [statusKey]: Math.max(0, state.counts[statusKey] - 1),
          all: Math.max(0, state.counts.all - 1),
        },
      };
    }),
}));
