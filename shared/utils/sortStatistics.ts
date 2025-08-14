export function sortStatistics(stats: any) {
  return {
    ...stats,
    mostSoldMenuItems: [...(stats.mostSoldMenuItems || [])].sort(
      (a, b) => b.quantity - a.quantity
    ),
    leastSoldMenuItems: [...(stats.leastSoldMenuItems || [])].sort(
      (a, b) => a.quantity - b.quantity
    ),
    mostSoldCategories: [...(stats.mostSoldCategories || [])].sort(
      (a, b) => b.quantity - a.quantity
    ),
    leastSoldCategories: [...(stats.leastSoldCategories || [])].sort(
      (a, b) => a.quantity - b.quantity
    ),
    mostProductiveTables: [...(stats.topTables || [])].sort(
      (a, b) => b.total - a.total
    ),
    mostProductiveWaiters: [...(stats.topWaiters || [])].sort(
      (a, b) => b.total - a.total
    ),
    mostActiveCustomers: [...(stats.topCustomers || [])].sort(
      (a, b) => b.total - a.total
    ),
    newCustomers: [...(stats.newCustomers || [])].sort(
      (a, b) => b.total - a.total
    ),
  };
}
