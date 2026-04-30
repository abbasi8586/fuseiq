"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Raw DB agent shape
interface DBAgent {
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  agent_type: string;
  framework: string;
  provider_id: string | null;
  status: string;
  role: string | null;
  department: string | null;
  config: any;
  efficiency_score: number;
  total_executions: number;
  total_cost: number;
  avatar_url: string | null;
  timezone: string;
  last_active_at: string | null;
  created_at: string;
}

// Raw DB activity log shape
interface DBActivityLog {
  id: string;
  workspace_id: string;
  actor_id: string | null;
  actor_type: string;
  actor_name: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  target_name: string | null;
  metadata: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

// Raw DB task shape
interface DBTask {
  id: string;
  workspace_id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assignee_id: string | null;
  assignee_type: string | null;
  due_date: string | null;
  progress: number;
  tags: string[] | null;
  created_by: string | null;
  created_at: string;
}

// Frontend types
export interface Agent {
  id: string;
  name: string;
  framework: string;
  status: "online" | "offline" | "busy" | "paused";
  type: "AI" | "Human";
  role?: string;
  department?: string;
  efficiency?: number;
  executions?: number;
  costToday?: number;
  avatar?: string;
  timezone?: string;
  lastActive?: string;
  config?: Record<string, any>;
}

export interface ActivityEvent {
  id: string;
  type: string;
  actor: string;
  target?: string;
  message: string;
  timestamp: string;
  severity?: "info" | "success" | "warning" | "error";
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  assignee?: string;
  assigneeName?: string;
  dueDate?: string;
  progress: number;
  tags?: string[];
}

interface DashboardData {
  agents: Agent[];
  events: ActivityEvent[];
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

// Helper to map DB agent to frontend agent
function mapDBAgent(dbAgent: DBAgent): Agent {
  return {
    id: dbAgent.id,
    name: dbAgent.name,
    framework: dbAgent.framework,
    status: dbAgent.status as Agent["status"],
    type: dbAgent.agent_type as Agent["type"],
    role: dbAgent.role || undefined,
    department: dbAgent.department || undefined,
    efficiency: dbAgent.efficiency_score,
    executions: dbAgent.total_executions,
    costToday: Number(dbAgent.total_cost),
    avatar: dbAgent.avatar_url || undefined,
    timezone: dbAgent.timezone,
    lastActive: dbAgent.last_active_at || undefined,
    config: dbAgent.config,
  };
}

// Helper to map DB activity log to frontend event
function mapDBEvent(dbEvent: DBActivityLog): ActivityEvent {
  // Determine severity from action
  let severity: ActivityEvent["severity"] = "info";
  if (dbEvent.action.includes("fail") || dbEvent.action.includes("error")) {
    severity = "error";
  } else if (dbEvent.action.includes("complete") || dbEvent.action.includes("success") || dbEvent.action.includes("approved")) {
    severity = "success";
  } else if (dbEvent.action.includes("pending") || dbEvent.action.includes("request")) {
    severity = "warning";
  }

  // Build message from action and metadata
  let message = dbEvent.action;
  if (dbEvent.metadata?.task) {
    message += `: ${dbEvent.metadata.task}`;
  } else if (dbEvent.metadata?.description) {
    message += `: ${dbEvent.metadata.description}`;
  }

  return {
    id: dbEvent.id,
    type: dbEvent.action,
    actor: dbEvent.actor_name || dbEvent.actor_type || "System",
    target: dbEvent.target_name || undefined,
    message,
    timestamp: dbEvent.created_at,
    severity,
  };
}

// Helper to map DB task to frontend task
function mapDBTask(dbTask: DBTask): Task {
  return {
    id: dbTask.id,
    title: dbTask.title,
    description: dbTask.description || undefined,
    status: dbTask.status as Task["status"],
    priority: dbTask.priority as Task["priority"],
    progress: dbTask.progress,
    tags: dbTask.tags || undefined,
  };
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
    let isMounted = true;

    // Initial fetch
    const fetchData = async () => {
      try {
        const [agentsRes, eventsRes, tasksRes] = await Promise.all([
          supabase.from("agents").select("*").order("created_at", { ascending: false }),
          supabase.from("activity_logs").select("*").order("created_at", { ascending: false }).limit(50),
          supabase.from("tasks").select("*").order("created_at", { ascending: false }).limit(20),
        ]);

        if (!isMounted) return;

        setData({
          agents: (agentsRes.data || []).map(mapDBAgent),
          events: (eventsRes.data || []).map(mapDBEvent),
          tasks: (tasksRes.data || []).map(mapDBTask),
          loading: false,
          error: null,
        });
      } catch (err: any) {
        if (!isMounted) return;
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
          if (!isMounted) return;
          setData((prev) => {
            if (payload.eventType === "INSERT") {
              return { ...prev, agents: [mapDBAgent(payload.new as DBAgent), ...prev.agents] };
            } else if (payload.eventType === "UPDATE") {
              return {
                ...prev,
                agents: prev.agents.map((a) =>
                  a.id === payload.new.id ? mapDBAgent(payload.new as DBAgent) : a
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
        { event: "INSERT", schema: "public", table: "activity_logs" },
        (payload) => {
          if (!isMounted) return;
          const newEvent = mapDBEvent(payload.new as DBActivityLog);
          setData((prev) => ({
            ...prev,
            events: [newEvent, ...prev.events].slice(0, 100),
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
          if (!isMounted) return;
          setData((prev) => {
            if (payload.eventType === "INSERT") {
              return { ...prev, tasks: [mapDBTask(payload.new as DBTask), ...prev.tasks] };
            } else if (payload.eventType === "UPDATE") {
              return {
                ...prev,
                tasks: prev.tasks.map((t) =>
                  t.id === payload.new.id ? mapDBTask(payload.new as DBTask) : t
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

    // Also subscribe to executions for KPI updates
    const executionsChannel = supabase
      .channel("executions_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "executions" },
        (payload) => {
          if (!isMounted) return;
          // Re-fetch agents to get updated execution counts
          supabase.from("agents").select("*").then(({ data }) => {
            if (isMounted && data) {
              setData((prev) => ({
                ...prev,
                agents: data.map(mapDBAgent),
              }));
            }
          });
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(agentsChannel);
      supabase.removeChannel(eventsChannel);
      supabase.removeChannel(tasksChannel);
      supabase.removeChannel(executionsChannel);
    };
  }, []);

  return data;
}
