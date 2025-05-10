import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import {
  PresencePayload,
  PresenceStatus,
  PresenceIndicatorProps,
} from "@/types";

export function PresenceIndicator({
  userId,
  className,
}: PresenceIndicatorProps) {
  const supabase = createClient();
  const [status, setStatus] = useState<PresenceStatus>("offline");

  useEffect(() => {
    const channel = supabase
      .channel("user_presence")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_presence",
          filter: `user_id=eq.${userId}`,
        },
        (payload: RealtimePostgresChangesPayload<PresencePayload>) => {
          if (payload.new && "status" in payload.new) {
            setStatus(payload.new.status);
          }
        }
      )
      .subscribe();

    const getInitialStatus = async () => {
      const { data } = await supabase
        .from("user_presence")
        .select("status")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setStatus(data.status);
      }
    };

    getInitialStatus();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

  return (
    <div
      className={cn(
        "h-2 w-2 rounded-full",
        {
          "bg-green-500": status === "online",
          "bg-yellow-500": status === "away",
          "bg-gray-400": status === "offline",
        },
        className
      )}
      title={status.charAt(0).toUpperCase() + status.slice(1)}
    />
  );
}
