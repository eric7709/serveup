"use client"

import { useEffect, useRef } from "react";
import { useOrderDataStore } from "@/modules/Orders/store/useOrderDataStore";
import { playCustomBeep } from "@/shared/utils/playCustomBeep";

export function usePendingOrderAlarm() {
  const pendingCount = useOrderDataStore((state) => state.counts.pending); // Use counts.pending
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (pendingCount > 0 && intervalRef.current === null) {
      intervalRef.current = window.setInterval(() => {
        playCustomBeep({ frequency: 1200, duration: 0.5, volume: 0.2 });
      }, 2000);
    } else if (pendingCount === 0 && intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [pendingCount]);
}