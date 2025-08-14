"use client"

import { fetchStatistics } from "@/shared/utils/fetchStatistics";
import { useQuery } from "@tanstack/react-query";

type UseStatisticsOptions = {
  startDate: string;
  endDate: string;
  waiterLimit?: number;
  waiterOffset?: number;
  tableLimit?: number;
  tableOffset?: number;
  customerLimit?: number;
  customerOffset?: number;
};

export function useStatistics({
  startDate,
  endDate,
  waiterLimit = 50,
  waiterOffset = 0,
  tableLimit = 50,
  tableOffset = 0,
  customerLimit = 100,
  customerOffset = 0,
}: UseStatisticsOptions) {
  const query = useQuery({
    queryKey: [
      "statistics",
      startDate,
      endDate,
      waiterLimit,
      waiterOffset,
      tableLimit,
      tableOffset,
      customerLimit,
      customerOffset,
    ],
    queryFn: () =>
      fetchStatistics({
        startDate,
        endDate,
        waiterLimit,
        waiterOffset,
        tableLimit,
        tableOffset,
        customerLimit,
        customerOffset,
      }),
    staleTime: 1000 * 60 * 5,
  });
  return {
    stats: query.data,
    loading: query.isLoading,
    error: query.error,
  };
}
