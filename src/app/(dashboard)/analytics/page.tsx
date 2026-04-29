"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  TrendingUp,
  Clock,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ExecutionChart } from "@/components/analytics/execution-chart";
import { CostChart } from "@/components/analytics/cost-chart";

// ── Demo Data ──────────────────────────────────────────────

const generateExecutionData = (days: number) => {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const base = 800 + Math.random() * 400;
    const success = Math.floor(base * (0.92 + Math.random() * 0.06));
    const failed = Math.floor(base - success);
    data.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      executions: Math.floor(base),
      success,
      failed,
    });
  }
  return data;
};

const costData = [
  { provider: "OpenAI", cost: 2847.5, color: "#00D4FF" },
  { provider: "Kimi", cost: 1923.8, color: "#B829DD" },
  { provider: "Anthropic", cost: 1567.2, color: "#00E5A0" },
  { provider: "Google", cost: 943.6, color: "#FF6B35" },
];

const frameworkData = [
  { name: "OpenAI Agents", value: 42, color: "#00D4FF" },
  { name: "LangChain", value: 28, color: "#B829DD" },
  { name: "CrewAI", value: 15, color: "#00E5A0" },
  { name: "AutoGen", value: 10, color: "#FF6B35" },
  { name: "Other", value: 5, color: "#FFC857" },
];

const topAgents = [
  { name: "Data Analyst Pro", executions: 12453, successRate: 98.2, avgCost: 0.042 },
  { name: "Code Reviewer", executions: 9871, successRate: 96.7, avgCost: 0.031 },
  { name: "Content Writer", executions: 8234, successRate: 94.5, avgCost: 0.028 },
  { name: "Customer Support", executions: 7652, successRate: 97.1, avgCost: 0.019 },
  { name: "Research Assistant", executions: 6123, successRate: 95.8, avgCost: 0.055 },
  { name: "DevOps Agent", executions: 5431, successRate: 99.1, avgCost: 0.038 },
  { name: "Security Scanner", executions: 4892, successRate: 97.5, avgCost: 0.067 },
  { name: "Doc Generator", executions: 3456, successRate: 93.2, avgCost: 0.024 },
];

const dateRanges = [
  { label: "Last 7 days", value: 7 },
  { label: "Last 30 days", value: 30 },
  { label: "Last 90 days", value: 90 },
];

// ── Components ─────────────────────────────────────────────

const KPICard = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  delay,
}: {
  title: string;
  value: string;
  change: string;
  changeType: "up" | "down";
  icon: any;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="glass-card p-5 rounded-xl group hover:glass-card-hover transition-all duration-300"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="p-2 rounded-lg bg-primary-cyan/10 border border-primary-cyan/20">
        <Icon className="w-5 h-5 text-primary-cyan" />
      </div>
      <div
        className={`flex items-center gap-1 text-xs font-medium ${
          changeType === "up" ? "text-signal" : "text-danger"
        }`}
      >
        {changeType === "up" ? (
          <ArrowUpRight className="w-3 h-3" />
        ) : (
          <ArrowDownRight className="w-3 h-3" />
        )}
        {change}
      </div>
    </div>
    <p className="text-text-muted text-sm mb-1">{title}</p>
    <p className="text-text-hero text-2xl font-bold">{value}</p>
  </motion.div>
);

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 rounded-lg border border-primary-cyan/30">
        <p className="text-text-body text-sm font-medium">{payload[0].name}</p>
        <p className="text-text-hero font-semibold">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState(30);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const executionData = generateExecutionData(dateRange);

  const totalExecutions = executionData.reduce((s, d) => s + d.executions, 0);
  const avgResponse = (1.2 + Math.random() * 0.8).toFixed(2);
  const costSavings = "$12,847";
  const uptime = "99.97%";

  const exportData = () => {
    const payload = {
      dateRange,
      generatedAt: new Date().toISOString(),
      kpi: { totalExecutions, avgResponse, costSavings, uptime },
      executions: executionData,
      costs: costData,
      frameworks: frameworkData,
      topAgents,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fuseiq-analytics-${dateRange}d.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-text-hero">Analytics</h1>
          <p className="text-text-muted text-sm mt-1">
            Monitor agent performance, costs, and system health
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date Range Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="glass-input px-4 py-2 rounded-lg text-sm text-text-body flex items-center gap-2 hover:border-primary-cyan/40 transition-colors"
            >
              {dateRanges.find((r) => r.value === dateRange)?.label}
              <ChevronDown className="w-4 h-4 text-text-muted" />
            </button>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full mt-2 right-0 glass-card rounded-lg p-1 min-w-[160px] z-50"
              >
                {dateRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => {
                      setDateRange(range.value);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      dateRange === range.value
                        ? "bg-primary-cyan/15 text-primary-cyan"
                        : "text-text-muted hover:text-text-body hover:bg-white/5"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
          <button
            onClick={exportData}
            className="neon-button px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Executions"
          value={totalExecutions.toLocaleString()}
          change="12.5%"
          changeType="up"
          icon={TrendingUp}
          delay={0}
        />
        <KPICard
          title="Avg Response Time"
          value={`${avgResponse}s`}
          change="8.3%"
          changeType="down"
          icon={Clock}
          delay={0.1}
        />
        <KPICard
          title="Cost Savings"
          value={costSavings}
          change="23.1%"
          changeType="up"
          icon={DollarSign}
          delay={0.2}
        />
        <KPICard
          title="Uptime"
          value={uptime}
          change="0.01%"
          changeType="down"
          icon={Activity}
          delay={0.3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Executions Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 rounded-xl"
        >
          <h3 className="text-text-hero font-semibold mb-1">
            Executions Over Time
          </h3>
          <p className="text-text-muted text-sm mb-4">
            Total, successful, and failed executions
          </p>
          <div className="h-[300px]">
            <ExecutionChart data={executionData} />
          </div>
        </motion.div>

        {/* Cost by Provider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 rounded-xl"
        >
          <h3 className="text-text-hero font-semibold mb-1">
            Cost by Provider
          </h3>
          <p className="text-text-muted text-sm mb-4">
            LLM provider spend breakdown
          </p>
          <div className="h-[300px]">
            <CostChart data={costData} />
          </div>
        </motion.div>
      </div>

      {/* Framework Distribution + Top Agents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6 rounded-xl"
        >
          <h3 className="text-text-hero font-semibold mb-1">
            Framework Distribution
          </h3>
          <p className="text-text-muted text-sm mb-4">
            Agent framework usage share
          </p>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={frameworkData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {frameworkData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {frameworkData.map((f) => (
              <div key={f.name} className="flex items-center gap-1.5 text-xs">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: f.color }}
                />
                <span className="text-text-muted">
                  {f.name} ({f.value}%)
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Agents Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-6 rounded-xl lg:col-span-2"
        >
          <h3 className="text-text-hero font-semibold mb-1">
            Top Performing Agents
          </h3>
          <p className="text-text-muted text-sm mb-4">
            Ranked by execution volume and reliability
          </p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-cyan/10">
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider py-3 pr-4">
                    Agent
                  </th>
                  <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider py-3 px-4">
                    Executions
                  </th>
                  <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider py-3 px-4">
                    Success Rate
                  </th>
                  <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider py-3 pl-4">
                    Avg Cost
                  </th>
                </tr>
              </thead>
              <tbody>
                {topAgents.map((agent, i) => (
                  <tr
                    key={agent.name}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary-cyan/10 border border-primary-cyan/20 flex items-center justify-center text-xs font-bold text-primary-cyan">
                          {i + 1}
                        </div>
                        <span className="text-text-body text-sm font-medium">
                          {agent.name}
                        </span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 text-text-hero text-sm font-semibold">
                      {agent.executions.toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          agent.successRate >= 98
                            ? "bg-signal/15 text-signal"
                            : agent.successRate >= 95
                              ? "bg-primary-cyan/15 text-primary-cyan"
                              : "bg-warn/15 text-warn"
                        }`}
                      >
                        {agent.successRate}%
                      </span>
                    </td>
                    <td className="text-right py-3 pl-4 text-text-muted text-sm">
                      ${agent.avgCost.toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
