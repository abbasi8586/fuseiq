"use client";

import { useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

type RealtimeChange = {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: Record<string, any> | null;
  old: Record<string, any> | null;
};

type RealtimeConfig = {
  table: string;
  event?: "*" | "INSERT" | "UPDATE" | "DELETE";
  filter?: string;
  onChange: (change: RealtimeChange) => void;
  onError?: (error: Error) => void;
  enableToast?: boolean;
  toastMessage?: string;
};

export function useRealtimeSubscription(config: RealtimeConfig) {
  const { table, event = "*", filter, onChange, onError, enableToast, toastMessage } = config;
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null);
  const callbackRef = useRef(onChange);

  // Keep callback ref fresh without re-subscribing
  useEffect(() => {
    callbackRef.current = onChange;
  }, [onChange]);

  const subscribe = useCallback(() => {
    const supabase = createClient();
    const channelName = `realtime:${table}:${Math.random().toString(36).slice(2, 9)}`;

    let channel = supabase.channel(channelName);

    const filterConfig: any = {
      event,
      schema: "public",
      table,
    };

    if (filter) {
      filterConfig.filter = filter;
    }

    channel = channel.on(
      "postgres_changes" as any,
      filterConfig,
      (payload: any) => {
        const change: RealtimeChange = {
          eventType: payload.eventType,
          new: payload.new,
          old: payload.old,
        };
        callbackRef.current(change);

        if (enableToast && toastMessage) {
          if (payload.eventType === "INSERT") {
            toast.success(`${toastMessage} created`);
          } else if (payload.eventType === "UPDATE") {
            toast.info(`${toastMessage} updated`);
          } else if (payload.eventType === "DELETE") {
            toast.error(`${toastMessage} deleted`);
          }
        }
      }
    );

    channel.subscribe((status: any) => {
      if (status === "CHANNEL_ERROR" && onError) {
        onError(new Error(`Realtime channel error for ${table}`));
      }
    });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [table, event, filter, onError, enableToast, toastMessage]);

  useEffect(() => {
    const cleanup = subscribe();
    return cleanup;
  }, [subscribe]);

  return {
    unsubscribe: useCallback(() => {
      if (channelRef.current) {
        const supabase = createClient();
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    }, []),
  };
}

// Convenience hook for single-table realtime with array state management
export function useRealtimeArray<T extends { id: string }>(
  table: string,
  options?: {
    filter?: string;
    onInsert?: (item: T) => void;
    onUpdate?: (item: T) => void;
    onDelete?: (id: string) => void;
    enableToasts?: boolean;
    itemName?: string;
  }
) {
  const { filter, onInsert, onUpdate, onDelete, enableToasts, itemName } = options || {};

  const handleChange = useCallback(
    (change: RealtimeChange) => {
      if (change.eventType === "INSERT" && change.new) {
        onInsert?.(change.new as T);
      } else if (change.eventType === "UPDATE" && change.new) {
        onUpdate?.(change.new as T);
      } else if (change.eventType === "DELETE" && change.old) {
        onDelete?.(change.old.id);
      }
    },
    [onInsert, onUpdate, onDelete]
  );

  useRealtimeSubscription({
    table,
    event: "*",
    filter,
    onChange: handleChange,
    enableToast: enableToasts,
    toastMessage: itemName || table,
  });
}
