"use client";

import { motion } from "framer-motion";
import { KPICard } from "@/components/dashboard/kpi-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { QuickTasks } from "@/components/dashboard/quick-tasks";
import { AgentStatus } from "@/components/dashboard/agent-status";
import { useRealtimeDashboard } from "@/hooks/use-realtime-dashboard";
import {
  Bot,
  Zap,
  CheckCircle,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Shield,
  Clock,
  Loader2,
} from "lucide-react";

export default function CommandCenterPage() {
  const { agents, events, tasks, loading, error } = useRealtimeDashboard();

  const onlineCount = agents.filter((a) => a.status === "online").length;
  const totalExecutions = agents.reduce((sum, a) => sum + (a.executions || 0), 0);
  const avgEfficiency = agents.length > 0
    ? Math.round(agents.reduce((sum, a) => sum + (a.efficiency || 0), 0) / agents.length)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#00D4FF] animate-spin" />
          <p className="text-[#6B7290]">Loading your command center...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="glass-card p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-[#FF4757] mx-auto mb-3" />
          <p className="text-[#FF4757] font-medium">Failed to load dashboard</p>
          <p className="text-[#6B7290] text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

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
