"use client";
import { useState, useEffect } from "react";
import { sortStatistics } from "@/shared/utils/sortStatistics";
import StatisticsCard from "./StatisticsCard";
import { useOrderDataStore } from "../store/useOrderDataStore";
import Loader from "@/shared/components/Loader";

interface StatItem {
  name: string;
  quantity?: number;
  total: number;
  orders?: number;
  table_number?: number;
}

interface Stats {
  totalSales: number;
  totalOrders: number;
  distinctCustomers: number;
  newCustomers: StatItem[];
  mostSoldMenuItems: StatItem[];
  leastSoldMenuItems: StatItem[];
  mostSoldCategories: StatItem[];
  leastSoldCategories: StatItem[];
  topWaiters: StatItem[];
  topTables: StatItem[];
  topCustomers: StatItem[];
}

interface SortedStats extends Stats {
  averageOrderValue: number;
  newCustomerRevenue: number;
}

interface StatisticsCardProps {
  title: string;
  name: string | number | undefined;
  metrics: Record<string, string | number | undefined>;
  bg?: string;
}

interface StatisticsBodyProps {
  stats: any;
  loading: boolean;
}

export default function StatisticsBody({
  stats,
  loading,
}: StatisticsBodyProps) {
  const { orders } = useOrderDataStore();
  const [sortedStats, setSortedStats] = useState<SortedStats | null>(null);
  useEffect(() => {
    if (stats) {
      setSortedStats(sortStatistics(stats));
    }
  }, [stats, orders]);
  if (loading) return <Loader />;

  if (!stats || !sortedStats)
    return <p className="p-4">No statistics available.</p>;

  const topItem = sortedStats.mostSoldMenuItems?.[0];
  const bottomItem = sortedStats.leastSoldMenuItems?.[0];
  const topCategory = sortedStats.mostSoldCategories?.[0];
  const bottomCategory = sortedStats.leastSoldCategories?.[0];
  const topTable = sortedStats.topTables?.[0];
  const topWaiter = sortedStats.topWaiters?.[0];
  const topCustomer = sortedStats.topCustomers?.[0];
  const newCustomers = sortedStats.newCustomers || [];

  // Compute averageOrderValue directly
  const averageOrderValue: number =
    stats.totalOrders > 0 ? stats.totalSales / stats.totalOrders : 0;

  const cards: StatisticsCardProps[] = [
    {
      title: "Top Selling Dish",
      name: topItem?.name,
      metrics: {
        "Quantity Sold": topItem?.quantity,
        Revenue: `₦${topItem?.total?.toLocaleString()}`,
      },
    },
    {
      title: "Top Selling Category",
      name: topCategory?.name,
      metrics: {
        "Items Sold": topCategory?.quantity,
        Revenue: `₦${topCategory?.total?.toLocaleString()}`,
      },
    },
    {
      title: "Lowest Selling Dish",
      name: bottomItem?.name,
      metrics: {
        "Quantity Sold": bottomItem?.quantity,
        Revenue: `₦${bottomItem?.total?.toLocaleString()}`,
      },
    },
    {
      title: "Lowest Selling Category",
      name: bottomCategory?.name,
      metrics: {
        "Items Sold": bottomCategory?.quantity ?? 0,
        Revenue: `₦${bottomCategory?.total?.toLocaleString()}`,
      },
    },
    {
      title: "Top Table by Revenue",
      name: topTable ? `#${topTable.table_number} ${topTable.name}` : undefined,
      metrics: {
        "Total Orders": topTable?.orders,
        Revenue: `₦${topTable?.total?.toLocaleString()}`,
      },
    },
    {
      title: "Top Performing Waiter",
      name: topWaiter?.name,
      metrics: {
        "Orders Handled": topWaiter?.orders,
        Revenue: `₦${topWaiter?.total?.toLocaleString()}`,
      },
    },
    {
      title: "Most Frequent Customer",
      name: topCustomer?.name,
      metrics: {
        Orders: topCustomer?.orders,
        Revenue: `₦${topCustomer?.total?.toLocaleString()}`,
      },
    },
    {
      title: "Total Unique Customers",
      name: sortedStats.distinctCustomers,
      metrics: {
        Orders: sortedStats.totalOrders,
        Revenue: `₦${sortedStats.totalSales?.toLocaleString()}`,
      },
    },
    {
      title: "New Customers",
      name: newCustomers.length,
      metrics: {
        "First Orders": newCustomers.length,
        Revenue: `₦${sortedStats.newCustomerRevenue?.toLocaleString() || "0"}`,
      },
    },
    {
      title: "Total Revenue",
      name: `₦${sortedStats.totalSales?.toLocaleString()}`,
      bg: "bg-green-800",
      metrics: {
        Period: "This Month",
        Orders: sortedStats.totalOrders,
      },
    },
    {
      title: "Average Order Value",
      name: `₦${Math.round(averageOrderValue).toLocaleString()}`,
      bg: "bg-green-800",
      metrics: {
        "Total Orders": sortedStats.totalOrders,
        "Total Revenue": `₦${sortedStats.totalSales?.toLocaleString()}`,
      },
    },
    {
      title: "Total Orders",
      name: sortedStats.totalOrders,
      bg: "bg-green-800",
      metrics: {
        Period: "This Month",
        "Avg. Daily": (sortedStats.totalOrders / 12).toFixed(1),
      },
    },
  ];

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="h-full w-full grid sm:grid-cols-2 lg:grid-cols-3 [@media(min-width:1400px)]:grid-cols-4 gap-5">
        {cards.map((card, index) => (
          <StatisticsCard
            key={index}
            title={card.title}
            name={card.name}
            metrics={card.metrics}
            bg={card.bg}
          />
        ))}
      </div>
    </div>
  );
}
