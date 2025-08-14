"use client"
import { useOrderDataSyncAndSubscribe } from "@/modules/Orders/hooks/useOrderDataSyncAndSubscribe";

export default function Base() {
  useOrderDataSyncAndSubscribe();
  return <div></div>;
}
