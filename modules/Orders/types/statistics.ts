type StatisticsResult = {
  totalSales: number;
  totalOrders: number;
  distinctCustomers: number;
  mostSoldMenuItems: {
    name: string;
    quantity: number;
    total: number;
  }[];
  leastSoldMenuItems: {
    name: string;
    quantity: number;
    total: number;
  }[];
  mostSoldCategories: {
    name: string;
    quantity: number;
    total: number;
  }[];
  leastSoldCategories: {
    name: string;
    quantity: number;
    total: number;
  }[];
  topWaiters: {
    name: string;
    orders: number;
    total: number;
  }[];
  topTables: {
    name: string;
    orders: number;
    table_number: number
    total: number;
  }[];
  topCustomers: {
    name: string;
    orders: number;
    total: number;
  }[];
};
