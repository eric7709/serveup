"use client"

// hooks/useStatistics.ts
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

export const useStatistics = ({
  startDate,
  endDate,
  waiterLimit = 50,
  waiterOffset = 0,
  tableLimit = 50,
  tableOffset = 0,
  customerLimit = 100,
  customerOffset = 0,
}: UseStatisticsOptions) => {
  return useQuery({
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
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });
};
