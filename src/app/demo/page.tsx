import { createClient } from "@supabase/supabase-js";
import { Metadata } from "next";
import { DemoDashboard } from "./demo-dashboard";

export const metadata: Metadata = {
  title: "FuseIQ Demo — AI Agent Command Center",
  description: "See your AI agents live in real-time. The command center for AI agent teams.",
};

// Demo workspace ID (same as seed data)
const DEMO_WORKSPACE_ID = "00000000-0000-0000-0000-000000000001";

async function getDemoData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );

  const [agentsRes, eventsRes, tasksRes, workspaceRes] = await Promise.all([
    supabase
      .from("agents")
      .select("*")
      .eq("workspace_id", DEMO_WORKSPACE_ID)
      .order("created_at", { ascending: false }),
    supabase
      .from("activity_logs")
      .select("*")
      .eq("workspace_id", DEMO_WORKSPACE_ID)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("tasks")
      .select("*")
      .eq("workspace_id", DEMO_WORKSPACE_ID)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("workspaces")
      .select("*")
      .eq("id", DEMO_WORKSPACE_ID)
      .single(),
  ]);

  return {
    agents: agentsRes.data || [],
    events: eventsRes.data || [],
    tasks: tasksRes.data || [],
    workspace: workspaceRes.data || null,
  };
}

export default async function DemoPage() {
  const data = await getDemoData();

  return (
    <div className="flex h-screen bg-radial-glow overflow-hidden">
      <DemoDashboard {...data} />
    </div>
  );
}
