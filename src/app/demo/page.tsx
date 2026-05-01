"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { KPICard } from "@/components/dashboard/kpi-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { QuickTasks } from "@/components/dashboard/quick-tasks";
import { AgentStatus } from "@/components/dashboard/agent-status";
import { GlassCard } from "@/components/glass/glass-card";
import {
  Bot,
  Zap,
  CheckCircle,
  DollarSign,
  ArrowRight,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Cpu,
  Target,
  Clock,
  Users,
  Activity,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const DEMO_WORKSPACE_ID = "00000000-0000-0000-0000-000000000001";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

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

// Static demo data for charts
const costData = [
  { date: "Mon", cost: 12.5, agents: 4 },
  { date: "Tue", cost: 18.3, agents: 5 },
  { date: "Wed", cost: 15.2, agents: 5 },
  { date: "Thu", cost: 22.1, agents: 6 },
  { date: "Fri", cost: 19.8, agents: 6 },
  { date: "Sat", cost: 8.4, agents: 3 },
  { date: "Sun", cost: 6.2, agents: 2 },
];

const frameworkData = [
  { name: "Kimi", executions: 450, cost: 45.2 },
  { name: "OpenAI", executions: 320, cost: 68.5 },
  { name: "Anthropic", executions: 280, cost: 52.3 },
  { name: "CrewAI", executions: 150, cost: 23.1 },
  { name: "LangGraph", executions: 120, cost: 18.7 },
];

const efficiencyData = [
  { name: "MarketingBot", efficiency: 94, color: "#00D4FF" },
  { name: "SupportAI", efficiency: 96, color: "#00E5A0" },
  { name: "CodeReview", efficiency: 92, color: "#B829DD" },
  { name: "SalesScout", efficiency: 89, color: "#FF6B35" },
  { name: "DataSync", efficiency: 88, color: "#FFC857" },
];

const COLORS = ["#00D4FF", "#B829DD", "#00E5A0", "#FF6B35", "#FFC857"];

// Static fallback data when Supabase fails
const fallbackAgents = [
  { id: "1", name: "MarketingBot Pro", framework: "CrewAI", status: "online", type: "AI", role: "Marketing Specialist", department: "Marketing", efficiency: 94, executions: 128, costToday: 4.2, timezone: "America/New_York" },
  { id: "2", name: "SupportAI", framework: "OpenAI", status: "online", type: "AI", role: "Support Agent", department: "Support", efficiency: 96, executions: 342, costToday: 8.5, timezone: "UTC" },
  { id: "3", name: "CodeReview Bot", framework: "Kimi", status: "busy", type: "AI", role: "Code Reviewer", department: "Engineering", efficiency: 92, executions: 89, costToday: 2.1, timezone: "America/Los_Angeles" },
  { id: "4", name: "SalesScout", framework: "Anthropic", status: "online", type: "AI", role: "Sales Researcher", department: "Sales", efficiency: 89, executions: 56, costToday: 3.8, timezone: "Europe/London" },
  { id: "5", name: "DataSync Master", framework: "LangGraph", status: "offline", type: "AI", role: "Data Engineer", department: "Data", efficiency: 88, executions: 45, costToday: 1.2, timezone: "Asia/Tokyo" },
  { id: "6", name: "Rook AI", framework: "Custom", status: "online", type: "AI", role: "CEO Operator", department: "Executive", efficiency: 99, executions: 523, costToday: 12.4, timezone: "America/New_York" },
];

const fallbackEvents = [
  { id: "1", type: "agent.executed", actor: "MarketingBot Pro", target: "Campaign", message: "Email campaign executed: 10,000 sends", timestamp: new Date().toISOString(), severity: "success" },
  { id: "2", type: "approval.requested", actor: "SalesScout", target: "Budget", message: "Budget increase requested: $500", timestamp: new Date(Date.now() - 300000).toISOString(), severity: "warning" },
  { id: "3", type: "agent.completed", actor: "CodeReview Bot", target: "PR #234", message: "Code review completed for frontend refactor", timestamp: new Date(Date.now() - 600000).toISOString(), severity: "success" },
  { id: "4", type: "task.created", actor: "Awais Abbasi", target: "Landing Page", message: "New task: Design v3.0 landing page", timestamp: new Date(Date.now() - 900000).toISOString(), severity: "info" },
  { id: "5", type: "agent.failed", actor: "DataSync Master", target: "Pipeline", message: "Data pipeline sync failed: timeout", timestamp: new Date(Date.now() - 1200000).toISOString(), severity: "error" },
];

const fallbackTasks = [
  { id: "1", title: "Design new landing page", status: "in_progress", priority: "high", progress: 60, tags: ["design", "web"] },
  { id: "2", title: "Implement OAuth flow", status: "todo", priority: "urgent", progress: 0, tags: ["auth", "backend"] },
  { id: "3", title: "Write API documentation", status: "review", priority: "medium", progress: 90, tags: ["docs"] },
  { id: "4", title: "Optimize database queries", status: "done", priority: "high", progress: 100, tags: ["performance", "db"] },
];

export default function DemoPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    async function fetchData() {
      if (!supabase) {
        setUsingFallback(true);
        setAgents(fallbackAgents);
        setEvents(fallbackEvents);
        setTasks(fallbackTasks);
        setLoading(false);
        return;
      }

      // Set a 5-second timeout
      timeoutId = setTimeout(() => {
        setUsingFallback(true);
        setAgents(fallbackAgents);
        setEvents(fallbackEvents);
        setTasks(fallbackTasks);
        setLoading(false);
      }, 5000);

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

        clearTimeout(timeoutId);

        if (agentsRes.error || eventsRes.error || tasksRes.error) {
          throw new Error("Database error");
        }

        setAgents((agentsRes.data || []).map(mapAgent));
        setEvents((eventsRes.data || []).map(mapEvent));
        setTasks((tasksRes.data || []).map(mapTask));
        setUsingFallback(false);
      } catch (err) {
        console.error("Demo fetch error:", err);
        setUsingFallback(true);
        setAgents(fallbackAgents);
        setEvents(fallbackEvents);
        setTasks(fallbackTasks);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      clearTimeout(timeoutId);
    };
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
  const avgEfficiency = agents.length > 0
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
            {usingFallback && (
              <span className="text-xs text-[#FFC857] flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Using offline demo data
              </span>
            )}
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

          {/* Analytics Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#00D4FF]" />
                Analytics Overview
              </h2>
              <div className="flex items-center gap-2">
                {["24h", "7d", "30d"].map((range) => (
                  <button
                    key={range}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#6B7290] hover:text-white border border-white/[0.06] transition-all"
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GlassCard>
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#00D4FF]" />
                Cost Over Time
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={costData}>
                    <defs>
                      <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="#4A5068" fontSize={12} />
                    <YAxis stroke="#4A5068" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0B0D14",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="cost"
                      stroke="#00D4FF"
                      fill="url(#costGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#B829DD]" />
                Executions by Framework
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={frameworkData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#4A5068" fontSize={12} />
                    <YAxis stroke="#4A5068" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0B0D14",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="executions" fill="#B829DD" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GlassCard>
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-[#00E5A0]" />
                Agent Efficiency
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={efficiencyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="efficiency"
                    >
                      {efficiencyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0B0D14",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-3 justify-center mt-2">
                  {efficiencyData.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs text-[#6B7290]">
                        {item.name} ({item.efficiency}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FF6B35]" />
                Execution Latency
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Kimi K2.5", latency: "245ms", trend: "-12%", color: "#00D4FF" },
                  { label: "GPT-4", latency: "380ms", trend: "-5%", color: "#10A37F" },
                  { label: "Claude 3", latency: "420ms", trend: "-8%", color: "#CC785C" },
                  { label: "CrewAI", latency: "1.2s", trend: "+15%", color: "#00E5A0" },
                  { label: "LangGraph", latency: "890ms", trend: "-3%", color: "#B829DD" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-white">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[#B8BED8] font-mono">
                        {item.latency}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-lg"
                        style={{
                          backgroundColor: item.trend.startsWith("-")
                            ? "#00E5A010"
                            : "#FF475710",
                          color: item.trend.startsWith("-")
                            ? "#00E5A0"
                            : "#FF4757",
                        }}
                      >
                        {item.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Bottom Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassCard>
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#00D4FF]" />
                Team Activity
              </h3>
              <div className="space-y-2">
                {[
                  { name: "Awais Abbasi", actions: 45, color: "#00D4FF" },
                  { name: "Rook AI", actions: 234, color: "#B829DD" },
                  { name: "Sarah Chen", actions: 28, color: "#00E5A0" },
                ].map((user) => (
                  <div key={user.name} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#B829DD] flex items-center justify-center text-white text-xs font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">{user.name}</span>
                        <span className="text-xs text-[#6B7290]">
                          {user.actions} actions
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/[0.04] mt-1">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(user.actions / 250) * 100}%`,
                            backgroundColor: user.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FFC857]" />
                Success Rate by Type
              </h3>
              <div className="space-y-2">
                {[
                  { type: "Email Outreach", rate: 98.2, color: "#00E5A0" },
                  { type: "Code Review", rate: 94.5, color: "#00D4FF" },
                  { type: "Data Pipeline", rate: 91.3, color: "#B829DD" },
                  { type: "Support Response", rate: 96.8, color: "#FF6B35" },
                ].map((item) => (
                  <div key={item.type} className="flex items-center justify-between">
                    <span className="text-sm text-[#B8BED8]">{item.type}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 rounded-full bg-white/[0.04]">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${item.rate}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                      <span className="text-xs text-white font-mono w-10 text-right">
                        {item.rate}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#FF6B35]" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                {[
                  { label: "Deploy Agent", desc: "Create new AI agent", color: "#00D4FF", href: "/login?signup=1" },
                  { label: "Run Workflow", desc: "Execute multi-agent task", color: "#B829DD", href: "/login?signup=1" },
                  { label: "View Staff", desc: "Browse agent directory", color: "#00E5A0", href: "/login?signup=1" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors group"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <ArrowRight className="w-4 h-4" style={{ color: item.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white group-hover:text-[#00D4FF] transition-colors">
                        {item.label}
                      </p>
                      <p className="text-xs text-[#6B7290]">{item.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </GlassCard>
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
