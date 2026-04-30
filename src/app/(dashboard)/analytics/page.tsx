"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Cpu,
  Clock,
  Target,
  Zap,
  Users,
  Bot,
} from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { Badge } from "@/components/ui/badge";
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

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#00D4FF]" />
            Analytics
          </h1>
          <p className="text-sm text-[#6B7290] mt-1">
            Performance metrics and cost analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          {["24h", "7d", "30d", "90d"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                timeRange === range
                  ? "bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20"
                  : "text-[#6B7290] hover:text-white border border-white/[0.06]"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Executions",
            value: "1,340",
            trend: "+12.5%",
            up: true,
            icon: Activity,
            color: "#00D4FF",
          },
          {
            label: "Total Cost",
            value: "$102.50",
            trend: "+8.2%",
            up: true,
            icon: DollarSign,
            color: "#00E5A0",
          },
          {
            label: "Avg Efficiency",
            value: "91.8%",
            trend: "+2.1%",
            up: true,
            icon: Target,
            color: "#B829DD",
          },
          {
            label: "Active Agents",
            value: "6",
            trend: "+1",
            up: true,
            icon: Bot,
            color: "#FF6B35",
          },
        ].map((metric) => (
          <GlassCard key={metric.label} glow="none">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-[#6B7290] mb-1">{metric.label}</p>
                <p className="text-2xl font-bold" style={{ color: metric.color }}>
                  {metric.value}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {metric.up ? (
                    <TrendingUp className="w-3 h-3 text-[#00E5A0]" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-[#FF4757]" />
                  )}
                  <span
                    className={`text-[10px] ${
                      metric.up ? "text-[#00E5A0]" : "text-[#FF4757]"
                    }`}
                  >
                    {metric.trend}
                  </span>
                </div>
              </div>
              <metric.icon
                className="w-5 h-5"
                style={{ color: metric.color, opacity: 0.5 }}
              />
            </div>
          </GlassCard>
        ))}
      </div>

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
                  <Badge
                    variant="outline"
                    className="text-[10px] h-5"
                    style={{
                      borderColor:
                        item.trend.startsWith("-")
                          ? "#00E5A040"
                          : "#FF475740",
                      color: item.trend.startsWith("-")
                        ? "#00E5A0"
                        : "#FF4757",
                      backgroundColor: item.trend.startsWith("-")
                        ? "#00E5A010"
                        : "#FF475710",
                    }}
                  >
                    {item.trend}
                  </Badge>
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
            <DollarSign className="w-4 h-4 text-[#FF6B35]" />
            Cost Breakdown
          </h3>
          <div className="space-y-2">
            {[
              { label: "Input Tokens", cost: 45.2, percent: 44 },
              { label: "Output Tokens", cost: 38.7, percent: 38 },
              { label: "Storage", cost: 12.3, percent: 12 },
              { label: "Compute", cost: 6.3, percent: 6 },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-[#B8BED8]">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white">
                    ${item.cost.toFixed(1)}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] h-4 border-white/[0.08] text-[#6B7290]"
                  >
                    {item.percent}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-white/[0.04]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">Total</span>
              <span className="text-lg font-bold text-[#FF6B35]">$102.50</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}
