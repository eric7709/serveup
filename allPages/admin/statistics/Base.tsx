  "use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart,
  Calendar,
  Filter,
  RefreshCw,
  CreditCard,
  User,
  Table2,
  UserCheck,
  UtensilsCrossed,
  Grid3x3,
} from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import AdminTitle from "@/shared/components/AdminTitle";
import { Divide as Hamburger } from "hamburger-react";

interface PaymentMethodData {
  paymentMethod: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  percentageOfOrders: number;
}

interface CustomerData {
  id: string;
  name: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastVisit: string;
}

interface TableData {
  id: string;
  name: string;
  tableNumber: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

interface WaiterData {
  id: string;
  name: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

interface MenuItemData {
  id: string;
  name: string;
  totalQuantity: number;
  totalRevenue: number;
  orderCount: number;
}

interface CategoryData {
  id: string;
  name: string;
  totalQuantity: number;
  totalRevenue: number;
  orderCount: number;
}

interface AnalyticsData {
  customerRanking: CustomerData[];
  tablesSoldRanking: TableData[];
  waiterSoldRanking: WaiterData[];
  menuItemSoldRanking: MenuItemData[];
  categorySoldRanking: CategoryData[];
  mostFrequentCustomers: CustomerData[];
  newCustomers: any[];
  paymentMethodRanking: PaymentMethodData[];
  uniqueCustomers: number;
  averageOrderValue: number;
  totalRevenue: number;
  totalOrders: number;
  newCustomersCount: number;
  dateRange: { startDate: string; endDate: string };
  generatedAt: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  description,
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  description?: string;
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow w-full">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium capitalize text-gray-600">{title}</p>
        <p className={`text-2xl font-bold capitalize ${color} mt-2`}>{value}</p>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>
      <div className={`p-3 rounded-lg ${color.replace("text-", "bg-").replace("-600", "-100")}`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
    </div>
  </div>
);

const TableSection = ({
  title,
  icon: Icon,
  children,
  isEmpty = false,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
  isEmpty?: boolean;
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full">
    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
    </div>
    {isEmpty ? (
      <div className="p-8 text-center text-gray-500">
        <Icon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p>No data available for the selected period</p>
      </div>
    ) : (
      <div className="overflow-x-auto">{children}</div>
    )}
  </div>
);

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const { toggleDrawer, drawerOpened, stopLoading } = useUIStore();

  const [startDate, setStartDate] = useState("2025-08-01");
  const [endDate, setEndDate] = useState("2025-08-13");
  const [limitSize, setLimitSize] = useState(10);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
        limitSize: limitSize.toString(),
      });
      const response = await fetch(`/api/analytics?${params}`);
      if (!response.ok) throw new Error("Failed to fetch analytics");
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [startDate, endDate, limitSize]);

  useEffect(() => {
    if (!loading) stopLoading();
  }, [loading]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8 max-w-md text-center">
          <div className="text-red-500 mb-4">
            <TrendingUp className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Analytics</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  // Sort customers by totalSpent
  const sortedCustomers = [...(analytics.customerRanking || [])]
    .filter((c) => c && c.totalOrders > 0)
    .sort((a, b) => (Number(b.totalSpent) || 0) - (Number(a.totalSpent) || 0));

  // Sort tables by totalRevenue
  const sortedTables = [...(analytics.tablesSoldRanking || [])]
    .filter((t) => t && t.totalOrders > 0)
    .sort((a, b) => (Number(b.totalRevenue) || 0) - (Number(a.totalRevenue) || 0));

  // Sort waiters by totalRevenue
  const sortedWaiters = [...(analytics.waiterSoldRanking || [])]
    .filter((w) => w && w.totalOrders > 0)
    .sort((a, b) => (Number(b.totalRevenue) || 0) - (Number(a.totalRevenue) || 0));

  // Sort menu items by totalQuantity
  const sortedMenuItems = [...(analytics.menuItemSoldRanking || [])]
    .filter((i) => i && i.totalRevenue > 0)
    .sort((a, b) => (Number(b.totalQuantity) || 0) - (Number(a.totalQuantity) || 0));

  // Sort categories by totalQuantity
  const sortedCategories = [...(analytics.categorySoldRanking || [])]
    .filter((c) => c && c.totalRevenue > 0)
    .sort((a, b) => (Number(b.totalQuantity) || 0) - (Number(a.totalQuantity) || 0));

  // Sort payment methods by totalOrders
  const sortedPaymentMethods = [...(analytics.paymentMethodRanking || [])]
    .filter((m) => m && m.totalRevenue > 0)
    .sort((a, b) => (Number(b.totalOrders) || 0) - (Number(a.totalOrders) || 0));

  // Global max values for performance calculations
  const allItemsAndCategories = [...(analytics.menuItemSoldRanking || []), ...(analytics.categorySoldRanking || [])];
  const globalMaxRevenue =
    allItemsAndCategories.length > 0
      ? Math.max(...allItemsAndCategories.map((item) => Number(item.totalRevenue) || 0))
      : 1;
  const globalMaxQuantity =
    allItemsAndCategories.length > 0
      ? Math.max(...allItemsAndCategories.map((item) => Number(item.totalQuantity) || 0))
      : 1;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
      {/* Sticky Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 w-full">
        <div className="flex items-center justify-between px-4 h-16 w-full max-w-7xl mx-auto">
          <div className="flex items-center">
            <button className="lg:hidden flex items-center">
              <Hamburger size={18} toggled={drawerOpened} toggle={toggleDrawer} />
            </button>
          </div>
          <AdminTitle title="Analytics" />
          <div className="flex items-center gap-2">
            <p className="text-gray-600 text-sm hidden lg:block">
              {new Date(startDate).toLocaleDateString()} -{" "}
              {new Date(endDate).toLocaleDateString()}
            </p>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto w-full px-4 py-8 box-border">
        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 w-full">
            <div className="flex items-center gap-3 mb-4">
              <Filter className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" /> Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" /> End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Limit Results</label>
                <input
                  type="number"
                  value={limitSize}
                  onChange={(e) => setLimitSize(Number(e.target.value))}
                  min="1"
                  max="50"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={fetchAnalytics}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  {loading ? "Loading..." : "Refresh"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 w-full">
          <StatCard
            title="Total Revenue"
            value={`$${analytics.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            color="text-green-600"
            description="Total sales revenue"
          />
          <StatCard
            title="Total Orders"
            value={analytics.totalOrders.toLocaleString()}
            icon={ShoppingCart}
            color="text-blue-600"
            description="Number of orders"
          />
          <StatCard
            title="Average Order Value"
            value={`$${analytics.averageOrderValue}`}
            icon={TrendingUp}
            color="text-purple-600"
            description="Per order average"
          />
          <StatCard
            title="Unique Customers"
            value={analytics.uniqueCustomers.toLocaleString()}
            icon={Users}
            color="text-orange-600"
            description="Active customers"
          />
        </div>

        {/* Payment Methods */}
        <div className="mb-8 w-full">
          <TableSection title="Payment Methods Performance" icon={CreditCard} isEmpty={sortedPaymentMethods.length === 0}>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-0">
                    Payment Method
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-0">
                    Orders
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-0">
                    Revenue
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-0">
                    Avg Order
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-0">
                    Share
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedPaymentMethods.slice(0, limitSize).map((method, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-2 py-3 whitespace-nowrap min-w-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {method.paymentMethod}
                      </span>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-xs font-medium text-gray-900 min-w-0">
                      {method.totalOrders.toLocaleString()}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900 font-semibold min-w-0">
                      ${method.totalRevenue.toLocaleString()}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900 min-w-0">
                      ${method.averageOrderValue}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap min-w-0">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${method.percentageOfOrders}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">{method.percentageOfOrders}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableSection>
        </div>

        {/* Top Customers */}
        <div className="mb-8 w-full">
          <TableSection title="Top Customers By Spending" icon={User} isEmpty={sortedCustomers.length === 0}>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-0">Customer</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-0">Orders</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-0">Total Spent</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-0">Avg Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedCustomers.slice(0, limitSize).map((customer, index) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-2 py-3 min-w-0">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-800">#{index + 1}</span>
                          </div>
                        </div>
                        <div className="ml-2">
                          <div className="text-xs capitalize font-medium text-gray-900">{customer.name}</div>
                          <div className="text-xs text-gray-500">
                            Last visit: {customer.lastVisit ? new Date(customer.lastVisit).toLocaleDateString() : "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-xs text-gray-900 min-w-0">{customer.totalOrders}</td>
                    <td className="px-2 py-3 text-xs font-semibold text-green-600 min-w-0">${customer.totalSpent}</td>
                    <td className="px-2 py-3 text-xs text-gray-900 min-w-0">${customer.averageOrderValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableSection>
        </div>

        {/* Top Tables */}
        <div className="mb-8 w-full">
          <TableSection title="Top Tables By Revenue" icon={Table2} isEmpty={sortedTables.length === 0}>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-0">Table</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-0">Orders</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-0">Revenue</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-0">Avg Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedTables.slice(0, limitSize).map((table, index) => (
                  <tr key={table.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-2 py-3 min-w-0">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-purple-800">#{index + 1}</span>
                          </div>
                        </div>
                        <div className="ml-2">
                          <div className="text-xs capitalize font-medium text-gray-900">{table.name}</div>
                          <div className="text-xs text-gray-500">Table #{table.tableNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-xs text-gray-900 min-w-0">{table.totalOrders}</td>
                    <td className="px-2 py-3 text-xs font-semibold text-green-600 min-w-0">${table.totalRevenue}</td>
                    <td className="px-2 py-3 text-xs text-gray-900 min-w-0">${table.averageOrderValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableSection>
        </div>

        {/* Top Waiters */}
        <div className="mb-8 w-full">
          <TableSection title="Top Waiters By Revenue" icon={UserCheck} isEmpty={sortedWaiters.length === 0}>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-0">Waiter</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-0">Orders</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-0">Revenue</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-0">Avg Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedWaiters.slice(0, limitSize).map((waiter, index) => (
                  <tr key={waiter.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-2 py-3 min-w-0">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-green-800">#{index + 1}</span>
                          </div>
                        </div>
                        <div className="ml-2">
                          <div className="text-xs capitalize font-medium text-gray-900">{waiter.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-xs text-gray-900 min-w-0">{waiter.totalOrders}</td>
                    <td className="px-2 py-3 text-xs font-semibold text-green-600 min-w-0">${waiter.totalRevenue}</td>
                    <td className="px-2 py-3 text-xs text-gray-900 min-w-0">${waiter.averageOrderValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableSection>
        </div>

        {/* Top Menu Items */}
        <div className="mb-8 w-full">
          <TableSection title="Top Menu Items" icon={UtensilsCrossed} isEmpty={sortedMenuItems.length === 0}>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-0">Item</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-0">Qty Sold</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-0">Revenue</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-0">Orders</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-0">Performance (Qty)</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-0">Performance (Rev)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedMenuItems.slice(0, limitSize).map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-2 py-3 min-w-0">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-orange-800">#{index + 1}</span>
                          </div>
                        </div>
                        <div className="ml-2">
                          <div className="text-xs capitalize font-medium text-gray-900">{item.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-xs font-semibold text-blue-600 min-w-0">{item.totalQuantity}</td>
                    <td className="px-2 py-3 text-xs text-gray-900 min-w-0">${item.totalRevenue}</td>
                    <td className="px-2 py-3 text-xs text-gray-500 min-w-0">{item.orderCount}</td>
                    <td className="px-2 py-3 whitespace-nowrap min-w-0">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-orange-600 h-2 rounded-full"
                            style={{ width: `${(item.totalQuantity / globalMaxQuantity) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">
                          {Math.round((item.totalQuantity / globalMaxQuantity) * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap min-w-0">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-orange-600 h-2 rounded-full"
                            style={{ width: `${(item.totalRevenue / globalMaxRevenue) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">
                          {Math.round((item.totalRevenue / globalMaxRevenue) * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableSection>
        </div>

        {/* Top Categories */}
        <div className="mb-8 w-full">
          <TableSection title="Top Categories" icon={Grid3x3} isEmpty={sortedCategories.length === 0}>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-0">Rank</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-0">Category</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-0">Quantity Sold</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-0">Revenue</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-0">Orders</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-0">Performance (Qty)</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-0">Performance (Rev)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedCategories.slice(0, limitSize).map((category, index) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-2 py-3 whitespace-nowrap min-w-0">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-indigo-800">#{index + 1}</span>
                      </div>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap min-w-0">
                      <div className="text-xs capitalize font-medium text-gray-900">{category.name}</div>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap min-w-0">
                      <div className="text-xs font-semibold text-blue-600">{category.totalQuantity.toLocaleString()}</div>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap min-w-0">
                      <div className="text-xs font-semibold text-green-600">${category.totalRevenue.toLocaleString()}</div>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap min-w-0">
                      <div className="text-xs text-gray-900">{category.orderCount}</div>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap min-w-0">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${(category.totalQuantity / globalMaxQuantity) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">
                          {Math.round((category.totalQuantity / globalMaxQuantity) * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap min-w-0">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${(category.totalRevenue / globalMaxRevenue) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">
                          {Math.round((category.totalRevenue / globalMaxRevenue) * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableSection>
        </div>
      </div>
    </div>
  );
}