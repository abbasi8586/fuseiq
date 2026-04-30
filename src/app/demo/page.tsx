"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { KPICard } from "@/components/dashboard/kpi-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { QuickTasks } from "@/components/dashboard/quick-tasks";
import { AgentStatus } from "@/components/dashboard/agent-status";
import {
  Bot,
  Zap,
  CheckCircle,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const DEMO_WORKSPACE_ID = "00000000-0000-0000-0000-000000000001";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function mapAgent(dbAgent: any) {
  return {
    id: dbAgent.id,
    name: dbAgent.name,
    framework: dbAgent.framework,
    status: dbAgent.status,
    type: dbAgent.agent_type,
    role: dbAgent.role,
    department: dbAgent.department,
    efficiency: dbAgent.efficiency_score,
    executions: dbAgent.total_executions,
    costToday: Number(dbAgent.total_cost),
    avatar: dbAgent.avatar_url,
    timezone: dbAgent.timezone,
    lastActive: dbAgent.last_active_at,
    config: dbAgent.config,
  };
}

function mapEvent(dbEvent: any) {
  let severity: any = "info";
  if (dbEvent.action?.includes("fail") || dbEvent.action?.includes("error")) {
    severity = "error";
  } else if (
    dbEvent.action?.includes("complete") ||
    dbEvent.action?.includes("success") ||
    dbEvent.action?.includes("approved")
  ) {
    severity = "success";
  } else if (
    dbEvent.action?.includes("pending") ||
    dbEvent.action?.includes("request")
  ) {
    severity = "warning";
  }

  let message = dbEvent.action || "Event";
  if (dbEvent.metadata?.task) {
    message += `: ${dbEvent.metadata.task}`;
  } else if (dbEvent.metadata?.description) {
    message += `: ${dbEvent.metadata.description}`;
  }

  return {
    id: dbEvent.id,
    type: dbEvent.action || "event",
    actor: dbEvent.actor_name || dbEvent.actor_type || "System",
    target: dbEvent.target_name || undefined,
    message,
    timestamp: dbEvent.created_at,
    severity,
  };
}

function mapTask(dbTask: any) {
  return {
    id: dbTask.id,
    title: dbTask.title,
    description: dbTask.description,
    status: dbTask.status,
    priority: dbTask.priority,
    progress: dbTask.progress,
    tags: dbTask.tags,
  };
}

export default function DemoPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [agentsRes, eventsRes, tasksRes] = await Promise.all([
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
        ]);

        setAgents((agentsRes.data || []).map(mapAgent));
        setEvents((eventsRes.data || []).map(mapEvent));
        setTasks((tasksRes.data || []).map(mapTask));
      } catch (err) {
        console.error("Demo fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen bg-radial-glow items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#6B7290]">Loading demo data...</p>
        </div>
      </div>
    );
  }

  const onlineCount = agents.filter((a) => a.status === "online").length;
  const totalExecutions = agents.reduce((sum, a) => sum + (a.executions || 0), 0);
  const avgEfficiency =
    agents.length > 0
      ? Math.round(agents.reduce((sum, a) => sum + (a.efficiency || 0), 0) / agents.length)
      : 0;

  return (
    <div className="flex flex-col h-screen bg-radial-glow overflow-hidden">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-[#00D4FF]/10 to-[#B829DD]/10 border-b border-[#00D4FF]/20 px-6 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00E5A0] animate-pulse" />
            <span className="text-sm text-[#B8BED8]">
              <span className="text-[#00D4FF] font-medium">Live Demo</span> —
              Real seed data from FuseIQ. No account required.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-[#6B7290] hover:text-[#B8BED8] transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/login?signup=1"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] text-sm font-medium hover:bg-[#00D4FF]/20 transition-colors"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        <div className="space-y-6 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#B829DD] flex items-center justify-center shadow-lg shadow-[#00D4FF]/20">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-gradient">Command Center</span>
              </h1>
              <p className="text-sm text-[#6B7290] mt-2 ml-13">
                Real-time overview of your AI agent operations
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00E5A0]/10 border border-[#00E5A0]/20">
                <div className="w-2 h-2 rounded-full bg-[#00E5A0] animate-pulse" />
                <span className="text-xs text-[#00E5A0] font-medium">
                  All Systems Operational
                </span>
              </div>
            </div>
          </motion.div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Active Agents"
              value={onlineCount}
              subtitle={`${agents.length} total agents`}
              trend={12}
              trendLabel="vs last hour"
              icon={<Bot className="w-5 h-5" />}
              iconColor="#00D4FF"
              glow="cyan"
              delay={0}
            />
            <KPICard
              title="Executions Today"
              value={totalExecutions.toLocaleString()}
              subtitle="Across all frameworks"
              trend={8}
              trendLabel="vs yesterday"
              icon={<Zap className="w-5 h-5" />}
              iconColor="#B829DD"
              glow="purple"
              delay={0.1}
            />
            <KPICard
              title="Success Rate"
              value={`${avgEfficiency}%`}
              subtitle="Average efficiency"
              trend={3}
              trendLabel="vs last week"
              icon={<CheckCircle className="w-5 h-5" />}
              iconColor="#00E5A0"
              glow="signal"
              delay={0.2}
            />
            <KPICard
              title="Cost Today"
              value="$12.47"
              subtitle="Budget: $50/day"
              trend={-15}
              trendLabel="under budget"
              icon={<DollarSign className="w-5 h-5" />}
              iconColor="#FF6B35"
              glow="ember"
              delay={0.3}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Activity Feed - Takes 2 columns */}
            <div className="lg:col-span-2">
              <ActivityFeed events={events} />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <QuickTasks tasks={tasks} />
              <AgentStatus agents={agents} />
            </div>
          </div>

          {/* Footer CTA */}
          <div className="text-center py-8">
            <p className="text-[#6B7290] text-sm mb-4">
              This is live demo data. Sign up to create your own workspace.
            </p>
            <Link
              href="/login?signup=1"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#B829DD] text-white font-medium hover:opacity-90 transition-opacity"
            >
              Start Your Free Trial
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
