import { useQuery } from "@tanstack/react-query";

type AnalyticsParams = {
  startDate: string;
  endDate: string;
  limitSize?: number;
};
async function fetchAnalytics({ startDate, endDate, limitSize = 5 }: AnalyticsParams) {
  const params = new URLSearchParams({
    startDate,
    endDate,
    limitSize: limitSize.toString(),
  });
  const res = await fetch(`/api/analytics?${params}`);
  if (!res.ok) {
    throw new Error("Failed to fetch analytics");
  }
  return res.json();
}
export function useAnalytics({ startDate, endDate, limitSize = 5 }: AnalyticsParams) {
  return useQuery({
    queryKey: ["analytics", startDate, endDate, limitSize],
    queryFn: () => fetchAnalytics({ startDate, endDate, limitSize }),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}
