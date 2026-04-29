"use client";

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
  TrendingUp,
  AlertTriangle,
  Shield,
  Clock,
} from "lucide-react";
import type { Agent, Task, ActivityEvent } from "@/types";

// Mock data - replace with real data fetching
const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Rook",
    framework: "Custom",
    provider: "Custom",
    status: "online",
    type: "AI",
    role: "CEO Operator",
    efficiency: 99,
    executions: 1247,
  },
  {
    id: "2",
    name: "Kimi",
    framework: "Kimi",
    provider: "Moonshot",
    status: "online",
    type: "AI",
    role: "Code Assistant",
    efficiency: 94,
    executions: 892,
  },
  {
    id: "3",
    name: "Claude",
    framework: "Anthropic",
    provider: "Anthropic",
    status: "busy",
    type: "AI",
    role: "Analysis",
    efficiency: 91,
    executions: 634,
  },
  {
    id: "4",
    name: "GPT-4",
    framework: "OpenAI",
    provider: "OpenAI",
    status: "online",
    type: "AI",
    role: "General Purpose",
    efficiency: 88,
    executions: 1523,
  },
  {
    id: "5",
    name: "CrewAI",
    framework: "CrewAI",
    provider: "CrewAI",
    status: "offline",
    type: "AI",
    role: "Multi-Agent",
    efficiency: 85,
    executions: 234,
  },
];

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Implement Agent Forge UI",
    status: "in-progress",
    priority: "high",
    progress: 65,
    assigneeName: "Rook",
  },
  {
    id: "2",
    title: "Set up Supabase Realtime",
    status: "todo",
    priority: "urgent",
    progress: 0,
    assigneeName: "Kimi",
  },
  {
    id: "3",
    title: "Design Approval Flow",
    status: "review",
    priority: "medium",
    progress: 90,
    assigneeName: "Claude",
  },
  {
    id: "4",
    title: "Cost Tracking Dashboard",
    status: "done",
    priority: "low",
    progress: 100,
    assigneeName: "GPT-4",
  },
  {
    id: "5",
    title: "API Key Management",
    status: "in-progress",
    priority: "high",
    progress: 40,
    assigneeName: "Rook",
  },
];

const mockEvents: ActivityEvent[] = [
  {
    id: "1",
    type: "agent_complete",
    actor: "Kimi",
    message: "completed code review for",
    target: "Agent Forge PR",
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    severity: "success",
  },
  {
    id: "2",
    type: "agent_start",
    actor: "Claude",
    message: "started analysis on",
    target: "Q3 Financial Model",
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    severity: "info",
  },
  {
    id: "3",
    type: "approval_request",
    actor: "Rook",
    message: "requests approval for",
    target: "Production Deploy",
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
    severity: "warning",
  },
  {
    id: "4",
    type: "task_completed",
    actor: "GPT-4",
    message: "finished",
    target: "Cost Tracking Module",
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    severity: "success",
  },
  {
    id: "5",
    type: "agent_fail",
    actor: "CrewAI",
    message: "failed to execute",
    target: "Swarm Workflow #234",
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    severity: "error",
  },
  {
    id: "6",
    type: "message",
    actor: "Rook",
    message: "updated project roadmap",
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    severity: "info",
  },
];

export default function CommandCenterPage() {
  const onlineCount = mockAgents.filter((a) => a.status === "online").length;
  const totalExecutions = mockAgents.reduce((sum, a) => sum + (a.executions || 0), 0);
  const avgEfficiency = Math.round(
    mockAgents.reduce((sum, a) => sum + (a.efficiency || 0), 0) / mockAgents.length
  );

  return (
    <div className="space-y-6">
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
            <span className="text-xs text-[#00E5A0] font-medium">All Systems Operational</span>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Active Agents"
          value={onlineCount}
          subtitle={`${mockAgents.length} total agents`}
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
          <ActivityFeed events={mockEvents} />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <QuickTasks tasks={mockTasks} />
          <AgentStatus agents={mockAgents} />
        </div>
      </div>

      {/* Quick Actions Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-elevated rounded-2xl p-4 flex flex-wrap items-center gap-4"
      >
        <span className="text-sm text-[#6B7290] font-medium">Quick Actions:</span>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] text-sm font-medium hover:bg-[#00D4FF]/20 transition-colors">
          <Bot className="w-4 h-4" />
          New Agent
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B829DD]/10 border border-[#B829DD]/20 text-[#B829DD] text-sm font-medium hover:bg-[#B829DD]/20 transition-colors">
          <Zap className="w-4 h-4" />
          Run Workflow
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00E5A0]/10 border border-[#00E5A0]/20 text-[#00E5A0] text-sm font-medium hover:bg-[#00E5A0]/20 transition-colors">
          <Shield className="w-4 h-4" />
          Request Approval
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF6B35]/10 border border-[#FF6B35]/20 text-[#FF6B35] text-sm font-medium hover:bg-[#FF6B35]/20 transition-colors">
          <AlertTriangle className="w-4 h-4" />
          View Alerts
        </button>
      </motion.div>
    </div>
  );
}
