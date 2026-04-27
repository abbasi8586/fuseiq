"use client";

import { motion } from "framer-motion";
import { Bot, Plus, Search, Play, Pause, Copy, Trash2, Settings as SettingsIcon, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { StatusBadge } from "@/components/glass/status-badge";
import { ProgressBar } from "@/components/glass/progress-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const agentTemplates = [
  { name: "Email Outreach", icon: "✉️", category: "Sales", framework: "OpenAI" },
  { name: "Security Auditor", icon: "🔒", category: "Security", framework: "Kimi" },
  { name: "Support Bot", icon: "💬", category: "Support", framework: "Anthropic" },
  { name: "Data Pipeline", icon: "📊", category: "Data", framework: "Google" },
  { name: "Code Review", icon: "📝", category: "Engineering", framework: "Kimi" },
  { name: "Content Generator", icon: "✍️", category: "Marketing", framework: "OpenAI" },
];

const deployedAgents = [
  { id: "1", name: "Agent Forge Lead", framework: "Kimi", status: "online", efficiency: 94, executions: 127, costToday: 2.34 },
  { id: "2", name: "MarketingBot Pro", framework: "OpenAI", status: "busy", efficiency: 91, executions: 89, costToday: 4.12 },
  { id: "3", name: "SupportAI", framework: "Anthropic", status: "online", efficiency: 96, executions: 234, costToday: 1.87 },
  { id: "4", name: "CodeReview Bot", framework: "Kimi", status: "busy", efficiency: 92, executions: 67, costToday: 0.94 },
  { id: "5", name: "SalesScout", framework: "OpenAI", status: "busy", efficiency: 89, executions: 156, costToday: 3.45 },
  { id: "6", name: "DataSync Master", framework: "Google", status: "paused", efficiency: 88, executions: 45, costToday: 0.23 },
];

export default function AgentForgePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-[#00D4FF]" />
            Agent Forge
          </h1>
          <p className="text-sm text-[#6B7290] mt-1">Create, deploy, and manage AI agents</p>
        </div>
        <Button className="neon-button border-0">
          <Plus className="w-4 h-4 mr-2" />
          Create Agent
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Agents", value: "6", color: "#00D4FF" },
          { label: "Active Deployments", value: "5", color: "#00E5A0" },
          { label: "Avg Efficiency", value: "91.7%", color: "#B829DD" },
          { label: "Today's Cost", value: "$12.85", color: "#FF6B35" },
        ].map((metric) => (
          <GlassCard key={metric.label}>
            <p className="text-xs text-[#6B7290] mb-1">{metric.label}</p>
            <p className="text-2xl font-bold" style={{ color: metric.color }}>{metric.value}</p>
          </GlassCard>
        ))}
      </div>

      {/* Templates */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#B829DD]" />
          Agent Templates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {agentTemplates.map((template) => (
            <div
              key={template.name}
              className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-[#00D4FF]/20 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{template.icon}</span>
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-[#00D4FF] transition-colors">{template.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px] border-white/[0.08] text-[#6B7290]">{template.category}</Badge>
                    <Badge variant="outline" className="text-[10px] border-[#00D4FF]/20 text-[#00D4FF]">{template.framework}</Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Deployed Agents Table */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Deployed Agents</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5068]" />
            <Input placeholder="Search agents..." className="pl-9 h-8 w-64 bg-white/[0.03] border-white/[0.06] text-sm" />
          </div>
        </div>
        <div className="space-y-2">
          {deployedAgents.map((agent) => (
            <div
              key={agent.id}
              className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#B829DD] flex items-center justify-center text-white font-bold">
                {agent.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{agent.name}</span>
                  <StatusBadge type="AI" framework={agent.framework} />
                  <span
                    className={`w-2 h-2 rounded-full ${
                      agent.status === "online" ? "bg-[#00E5A0]" :
                      agent.status === "busy" ? "bg-[#FF6B35]" :
                      "bg-[#FFC857]"
                    }`}
                  />
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-[#6B7290]">
                  <span>{agent.executions} executions</span>
                  <span>·</span>
                  <span>${agent.costToday} today</span>
                </div>
              </div>
              <div className="w-24">
                <ProgressBar value={agent.efficiency} color="#00E5A0" />
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg hover:bg-white/5 text-[#6B7290] hover:text-white transition-colors">
                  <SettingsIcon className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-white/5 text-[#6B7290] hover:text-white transition-colors">
                  {agent.status === "paused" ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
                <button className="p-1.5 rounded-lg hover:bg-white/5 text-[#6B7290] hover:text-white transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-white/5 text-[#6B7290] hover:text-[#FF4757] transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}
