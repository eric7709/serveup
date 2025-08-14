"use client"

import { useEffect } from "react";
import { useTableDataStore } from "@/modules/Tables/store/useTableDataStore";
import { useGetAllTables } from "./useTableServices";
export const useSyncTableDataStore = () => {
  const { setLoading, setTables } = useTableDataStore();
  const { data, isLoading } = useGetAllTables();
  useEffect(() => {
    setLoading(isLoading);
    if (data) setTables(data);
  }, [data, setTables]);
};
