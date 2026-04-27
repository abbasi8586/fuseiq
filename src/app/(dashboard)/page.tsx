"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Play,
  CheckCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  Shield,
  MessageSquare,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { KPICard } from "@/components/glass/kpi-card";
import { ActivityFeed } from "@/components/data-display/activity-feed";
import { CostTicker } from "@/components/glass/cost-ticker";
import { ProgressBar } from "@/components/glass/progress-bar";
import { StatusBadge } from "@/components/glass/status-badge";
import { Button } from "@/components/ui/button";
import type { Agent, Task, Approval, ActivityEvent } from "@/types";

// Demo data
const kpiData = [
  {
    label: "Active Agents",
    value: 12,
    icon: Bot,
    trend: 8.5,
    color: "#00D4FF",
    subtitle: "8 AI · 4 Human",
  },
  {
    label: "Executions Today",
    value: 1,
    icon: Play,
    trend: 24.3,
    color: "#00E5A0",
    subtitle: "847 successful",
  },
  {
    label: "Success Rate",
    value: 98.7,
    icon: CheckCircle,
    trend: 2.1,
    color: "#B829DD",
    subtitle: "+2.1% vs yesterday",
    isPercentage: true,
  },
  {
    label: "Avg Cost / Run",
    value: 0.042,
    icon: DollarSign,
    trend: -5.2,
    color: "#FF6B35",
    subtitle: "$12.47 today total",
    isCurrency: true,
  },
];

const activeAgents: Agent[] = [
  { id: "1", name: "Agent Forge Lead", framework: "Kimi", provider: "Kimi", status: "online", type: "AI", efficiency: 94, executions: 127, costToday: 2.34, role: "Developer", department: "Engineering" },
  { id: "2", name: "Sarah Chen", framework: "Human", provider: "Human", status: "online", type: "Human", efficiency: 88, executions: 45, costToday: 0, role: "Product Manager", department: "Product" },
  { id: "3", name: "MarketingBot Pro", framework: "OpenAI", provider: "OpenAI", status: "busy", type: "AI", efficiency: 91, executions: 89, costToday: 4.12, role: "Marketing Lead", department: "Marketing" },
  { id: "4", name: "SupportAI", framework: "Anthropic", provider: "Anthropic", status: "online", type: "AI", efficiency: 96, executions: 234, costToday: 1.87, role: "Customer Support", department: "Support" },
  { id: "5", name: "CodeReview Bot", framework: "Kimi", provider: "Kimi", status: "busy", type: "AI", efficiency: 92, executions: 67, costToday: 0.94, role: "Code Reviewer", department: "Engineering" },
];

const pendingApprovals: Approval[] = [
  { id: "1", agentId: "3", agentName: "MarketingBot Pro", action: "Deploy email campaign to 50K subscribers", riskLevel: "high", estimatedCost: 0.85, status: "pending", requester: "Co-Pilot", createdAt: "2026-04-27T05:30:00Z" },
  { id: "2", agentId: "4", agentName: "SupportAI", action: "Bulk close 47 resolved tickets", riskLevel: "low", estimatedCost: 0.12, status: "pending", requester: "Auto-trigger", createdAt: "2026-04-27T05:15:00Z" },
  { id: "3", agentId: "5", agentName: "CodeReview Bot", action: "Auto-merge PR #234 after review", riskLevel: "medium", estimatedCost: 0.08, status: "pending", requester: "GitHub webhook", createdAt: "2026-04-27T04:45:00Z" },
];

const recentActivity: ActivityEvent[] = [
  { id: "1", type: "agent_complete", actor: "SupportAI", target: "Ticket #4821", message: "Resolved customer inquiry — Premium plan question", timestamp: "2026-04-27T06:20:00Z", severity: "success" },
  { id: "2", type: "approval_request", actor: "Co-Pilot", target: "MarketingBot Pro", message: "High-risk action: Deploy email campaign to 50K subscribers", timestamp: "2026-04-27T05:30:00Z", severity: "warning" },
  { id: "3", type: "agent_start", actor: "CodeReview Bot", target: "PR #234", message: "Started code review for repository fuseiq-web", timestamp: "2026-04-27T05:15:00Z", severity: "info" },
  { id: "4", type: "task_completed", actor: "Sarah Chen", target: "Sprint 3 planning", message: "Marked 12 tasks as completed in Operations Center", timestamp: "2026-04-27T04:45:00Z", severity: "success" },
  { id: "5", type: "agent_fail", actor: "DataSync Master", target: "Airtable sync", message: "Connection timeout after 30s — retry scheduled", timestamp: "2026-04-27T04:20:00Z", severity: "error" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function CommandCenterPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Command Center</h1>
          <p className="text-sm text-[#6B7290] mt-1">Real-time overview of your AI workforce</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-white/[0.08] text-[#B8BED8] hover:text-white hover:bg-white/5">
            <Shield className="w-4 h-4 mr-2" />
            Security Audit
          </Button>
          <Button className="neon-button border-0">
            <Zap className="w-4 h-4 mr-2" />
            Deploy Agent
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Agents */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#00D4FF]" />
                Active Agents
              </h3>
              <Button variant="ghost" size="sm" className="text-[#00D4FF] hover:bg-[#00D4FF]/10">
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {activeAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors border border-white/[0.04]"
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#B829DD] flex items-center justify-center text-white font-bold text-sm">
                      {agent.name.charAt(0)}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#161925]"
                      style={{
                        backgroundColor:
                          agent.status === "online" ? "#00E5A0" :
                          agent.status === "busy" ? "#FF6B35" :
                          agent.status === "paused" ? "#FFC857" : "#FF4757"
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white truncate">{agent.name}</span>
                      <StatusBadge type={agent.type} framework={agent.framework} />
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-[#6B7290]">{agent.role}</span>
                      <span className="text-xs text-[#4A5068]">·</span>
                      <span className="text-xs text-[#6B7290]">{agent.executions} executions</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-[#6B7290]">Efficiency</div>
                      <div className="text-sm font-semibold text-[#00E5A0]">{agent.efficiency}%</div>
                    </div>
                    <div className="w-24">
                      <ProgressBar value={agent.efficiency || 0} color="#00E5A0" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Execution Trends Chart Placeholder */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#00E5A0]" />
                Execution Trends
              </h3>
              <div className="flex gap-2">
                {["1H", "24H", "7D", "30D"].map((period) => (
                  <button
                    key={period}
                    className="px-2 py-1 text-xs rounded-md bg-white/[0.05] text-[#6B7290] hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-48 flex items-end justify-between gap-2 px-2">
              {[65, 42, 78, 55, 89, 67, 95, 72, 58, 84, 91, 76].map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="flex-1 rounded-t-sm"
                  style={{
                    background: `linear-gradient(to top, rgba(0,212,255,0.3), rgba(184,41,221,0.3))`,
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-[#4A5068]">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>23:59</span>
            </div>
          </GlassCard>
        </motion.div>

        {/* Right Column */}
        <motion.div variants={itemVariants} className="space-y-4">
          {/* Cost Ticker */}
          <CostTicker dailyTotal={12.47} providerBreakdown={[
            { provider: "OpenAI", cost: 6.23, percentage: 50 },
            { provider: "Kimi", cost: 3.12, percentage: 25 },
            { provider: "Anthropic", cost: 2.47, percentage: 20 },
            { provider: "Google", cost: 0.65, percentage: 5 },
          ]} />

          {/* Pending Approvals */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#FFC857]" />
                Pending Approvals
              </h3>
              <span className="px-2 py-0.5 text-xs font-medium bg-[#FFC857]/15 text-[#FFC857] rounded-full">
                {pendingApprovals.length}
              </span>
            </div>
            <div className="space-y-3">
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{approval.agentName}</p>
                      <p className="text-xs text-[#6B7290] mt-0.5 line-clamp-2">{approval.action}</p>
                    </div>
                    <span className={`
                      px-2 py-0.5 text-[10px] font-medium rounded-full
                      ${approval.riskLevel === "high" ? "bg-[#FF4757]/15 text-[#FF4757]" :
                        approval.riskLevel === "medium" ? "bg-[#FFC857]/15 text-[#FFC857]" :
                        "bg-[#00E5A0]/15 text-[#00E5A0]"}
                    `}>
                      {approval.riskLevel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#4A5068]">~${approval.estimatedCost?.toFixed(2)}</span>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-xs rounded-md bg-[#FF4757]/10 text-[#FF4757] hover:bg-[#FF4757]/20 transition-colors">
                        Reject
                      </button>
                      <button className="px-3 py-1 text-xs rounded-md bg-[#00E5A0]/10 text-[#00E5A0] hover:bg-[#00E5A0]/20 transition-colors">
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Activity Feed */}
          <ActivityFeed events={recentActivity} />
        </motion.div>
      </div>
    </motion.div>
  );
}
