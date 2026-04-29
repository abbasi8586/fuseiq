"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Agent, ActivityEvent, Task } from "@/types";

interface DashboardData {
  agents: Agent[];
  events: ActivityEvent[];
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export function useRealtimeDashboard(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    agents: [],
    events: [],
    tasks: [],
    loading: true,
    error: null,
  });

  const supabase = createClient();

  useEffect(() => {
    // Initial fetch
    const fetchData = async () => {
      try {
        const [agentsRes, eventsRes, tasksRes] = await Promise.all([
          supabase.from("agents").select("*").order("created_at", { ascending: false }),
          supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(20),
          supabase.from("tasks").select("*").order("created_at", { ascending: false }).limit(10),
        ]);

        setData({
          agents: agentsRes.data || [],
          events: (eventsRes.data || []).map((e: any) => ({
            id: e.id,
            type: e.event_type,
            actor: e.actor_name,
            message: e.message,
            target: e.target_name,
            timestamp: e.created_at,
            severity: e.severity,
          })),
          tasks: tasksRes.data || [],
          loading: false,
          error: null,
        });
      } catch (err: any) {
        setData((prev) => ({ ...prev, loading: false, error: err.message }));
      }
    };

    fetchData();

    // Real-time subscriptions
    const agentsChannel = supabase
      .channel("agents_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "agents" },
        (payload) => {
          setData((prev) => {
            if (payload.eventType === "INSERT") {
              return { ...prev, agents: [payload.new as Agent, ...prev.agents] };
            } else if (payload.eventType === "UPDATE") {
              return {
                ...prev,
                agents: prev.agents.map((a) =>
                  a.id === payload.new.id ? (payload.new as Agent) : a
                ),
              };
            } else if (payload.eventType === "DELETE") {
              return {
                ...prev,
                agents: prev.agents.filter((a) => a.id !== payload.old.id),
              };
            }
            return prev;
          });
        }
      )
      .subscribe();

    const eventsChannel = supabase
      .channel("events_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "activity_log" },
        (payload) => {
          const newEvent: ActivityEvent = {
            id: payload.new.id,
            type: payload.new.event_type,
            actor: payload.new.actor_name,
            message: payload.new.message,
            target: payload.new.target_name,
            timestamp: payload.new.created_at,
            severity: payload.new.severity,
          };
          setData((prev) => ({
            ...prev,
            events: [newEvent, ...prev.events].slice(0, 50),
          }));
        }
      )
      .subscribe();

    const tasksChannel = supabase
      .channel("tasks_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        (payload) => {
          setData((prev) => {
            if (payload.eventType === "INSERT") {
              return { ...prev, tasks: [payload.new as Task, ...prev.tasks] };
            } else if (payload.eventType === "UPDATE") {
              return {
                ...prev,
                tasks: prev.tasks.map((t) =>
                  t.id === payload.new.id ? (payload.new as Task) : t
                ),
              };
            } else if (payload.eventType === "DELETE") {
              return {
                ...prev,
                tasks: prev.tasks.filter((t) => t.id !== payload.old.id),
              };
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(agentsChannel);
      supabase.removeChannel(eventsChannel);
      supabase.removeChannel(tasksChannel);
    };
  }, []);

  return data;
}
