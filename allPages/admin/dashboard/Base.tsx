"use client";
import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import AdminTitle from "@/shared/components/AdminTitle";
import { supabase } from "@/shared/lib/supabase";
import { useUIStore } from "@/store/useUIStore";
import { Divide as Hamburger } from "hamburger-react";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState([
    { title: "Total Employees", value: 0, icon: "👥" },
    { title: "Total Menu Items", value: 0, icon: "📦" },
    { title: "Total Categories", value: 0, icon: "🗂" },
    { title: "Today's Revenue", value: "$0", icon: "💰" },
    { title: "Orders Today", value: 0, icon: "🛎" },
    { title: "Pending Orders", value: 0, icon: "⏳" },
    { title: "Active Waiters", value: 0, icon: "🧑‍🍳" },
    { title: "Total Tables", value: 0, icon: "🪑" },
    { title: "Cancelled Orders", value: 0, icon: "❌" },
  ]);
  const [loading, setLoading] = useState(true);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const { stopLoading } = useUIStore();

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);

      const { count: totalEmployees } = await supabase
        .from("employees")
        .select("*", { count: "exact", head: true });

      const { count: totalMenuItems } = await supabase
        .from("menu_items")
        .select("*", { count: "exact", head: true });

      const { count: totalCategories } = await supabase
        .from("categories")
        .select("*", { count: "exact", head: true });

      const today = new Date();
      const start = new Date(today);
      start.setUTCHours(-1, 0, 0, 0);
      const end = new Date(today);
      end.setUTCHours(22, 59, 59, 999);

      const { data: ordersTodayData } = await supabase
        .from("orders")
        .select("total, status")
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString());

      const ordersToday = ordersTodayData?.length || 0;
      const todaysRevenue =
        ordersTodayData?.reduce(
          (sum, order) =>
            sum + (order.status !== "cancelled" ? order.total : 0),
          0
        ) || 0;
      const pendingOrders =
        ordersTodayData?.filter((o) => o.status === "pending").length || 0;
      const cancelledOrders =
        ordersTodayData?.filter((o) => o.status === "cancelled").length || 0;

      const { data: activeWaitersData } = await supabase
        .from("tables")
        .select("waiter_id")
        .not("waiter_id", "is", null);

      const activeWaiters =
        [...new Set(activeWaitersData?.map((item) => item.waiter_id))].length ||
        0;

      const { count: totalTables } = await supabase
        .from("tables")
        .select("*", { count: "exact", head: true });

      setDashboardData([
        { title: "Total Employees", value: totalEmployees || 0, icon: "👥" },
        { title: "Orders Today", value: ordersToday, icon: "🛎" },
        {
          title: "Today's Revenue",
          value: `$${todaysRevenue.toLocaleString()}`,
          icon: "💰",
        },
        { title: "Total Menu Items", value: totalMenuItems || 0, icon: "📦" },
        { title: "Total Categories", value: totalCategories || 0, icon: "🗂" },
        { title: "Total Tables", value: totalTables || 0, icon: "🪑" },
        { title: "Pending Orders", value: pendingOrders, icon: "⏳" },
        { title: "Active Waiters", value: activeWaiters, icon: "🧑‍🍳" },
        { title: "Cancelled Orders", value: cancelledOrders, icon: "❌" },
      ]);

      setLoading(false);
    }

    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!loading) stopLoading();
  }, [loading, stopLoading]);

  const backgrounds = [
    "bg-amber-600",
    "bg-emerald-950",
    "bg-red-900",
    "bg-blue-950",
    "bg-gray-900",
    "bg-pink-900",
    "bg-purple-900",
    "bg-cyan-700",
    "bg-red-950",
  ];
  const { toggleDrawer, drawerOpened } = useUIStore();
  return (
    <div className="flex flex-col text-white bg-gray-50 h-screen">
      {/* HEADER */}
      <header className="h-16 pr-3 lg:px-4 bg-white z-20 relative flex border-b items-center justify-between border-gray-300">
        <button className=" lg:hidden">
          <Hamburger
            size={18}
            color="black"
            toggled={drawerOpened}
            toggle={toggleDrawer}
          />
        </button>
        <AdminTitle title="Dashboard" />
        <Search
          className="text-black"
          size={18}
        />
      </header>

      {/* Main dashboard grid */}
      <main className="grid flex-1 overflow-y-auto p-2 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
        {dashboardData.map((item, idx) => (
          <section
            key={idx}
            className={`shadow rounded-lg py-12 p-4 ${backgrounds[idx]} flex flex-col items-center justify-center text-center transition-colors gap-3 md:gap-0`}
          >
            <span className="text-3xl">{item.icon}</span>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-xl font-bold">{item.value}</p>
          </section>
        ))}
      </main>
    </div>
  );
}
