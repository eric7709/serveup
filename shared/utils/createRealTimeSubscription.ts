import { supabase } from "@/shared/lib/supabase";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type Handlers<T extends { id: string | number }> = {
  onInsert?: (row: T) => void;
  onUpdate?: (row: T) => void;
  onDelete?: (id: T["id"]) => void;
};

export function createRealtimeSubscription<T extends { id: string | number }>(
  table: string,
  handlers: Handlers<T>,
) {
  const { onInsert, onUpdate, onDelete } = handlers;
  let channel: ReturnType<typeof supabase.channel>;
  const subscribe = () => {
    channel = supabase
      .channel(`${table}-changes`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        (payload: RealtimePostgresChangesPayload<T>) => {
          const { eventType, new: newRow, old } = payload;
          if (eventType === "INSERT" && newRow) {
            onInsert?.(newRow);
          } else if (eventType === "UPDATE" && newRow) {
            onUpdate?.(newRow);
          } else if (eventType === "DELETE" && old?.id) {
            onDelete?.(old.id);
          }
        },
      )
      .subscribe((status) => {
        if (status === "CLOSED" || status === "CHANNEL_ERROR") {
          console.warn(`⚠️ ${table} channel disconnected. Reconnecting...`);
          setTimeout(subscribe, 2000);
        }
      });
  };
  subscribe();
  // Heartbeat to keep WebSocket alive
  const heartbeat = setInterval(() => {
    if (!channel || channel.state !== "joined") {
      console.warn(`💔 ${table} heartbeat: channel lost. Reconnecting...`);
      supabase.removeChannel(channel);
      subscribe();
    }
  }, 20000); // Adjusted to 25s for balanced pinging
  // Cleanup
  return () => {
    clearInterval(heartbeat);
    supabase.removeChannel(channel);
  };
}