"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, DollarSign, Activity, Clock, AlertTriangle } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";

export default function AnalyticsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-[#00D4FF]" />
          Analytics
        </h1>
        <p className="text-sm text-[#6B7290] mt-1">Cost, performance, and agent telemetry</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today Spend", value: "$12.47", trend: "+8%", icon: DollarSign, color: "#00D4FF" },
          { label: "Success Rate", value: "98.7%", trend: "+2.1%", icon: Activity, color: "#00E5A0" },
          { label: "Avg Latency", value: "1.24s", trend: "-12%", icon: Clock, color: "#B829DD" },
          { label: "Error Rate", value: "0.3%", trend: "-0.1%", icon: AlertTriangle, color: "#FF6B35" },
        ].map((metric) => (
          <GlassCard key={metric.label}>
            <div className="flex items-center gap-2 mb-2">
              <metric.icon className="w-4 h-4" style={{ color: metric.color }} />
              <span className="text-xs text-[#6B7290]">{metric.label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{metric.value}</p>
            <p className="text-xs text-[#00E5A0] mt-1">{metric.trend} vs yesterday</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4">Cost by Provider</h3>
          <div className="space-y-4">
            {[
              { provider: "OpenAI", cost: 6.23, color: "#00D4FF" },
              { provider: "Kimi", cost: 3.12, color: "#B829DD" },
              { provider: "Anthropic", cost: 2.47, color: "#00E5A0" },
              { provider: "Google", cost: 0.65, color: "#FF6B35" },
            ].map((item) => (
              <div key={item.provider} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#B8BED8]">{item.provider}</span>
                  <span className="text-white font-medium">${item.cost.toFixed(2)}</span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.06]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.cost / 12.47) * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4">Agent Performance</h3>
          <div className="space-y-3">
            {[
              { name: "SupportAI", efficiency: 96, executions: 234, latency: 0.8 },
              { name: "CodeReview Bot", efficiency: 92, executions: 67, latency: 1.2 },
              { name: "Agent Forge Lead", efficiency: 94, executions: 127, latency: 1.5 },
              { name: "MarketingBot Pro", efficiency: 91, executions: 89, latency: 2.1 },
              { name: "SalesScout", efficiency: 89, executions: 156, latency: 1.8 },
            ].map((agent) => (
              <div key={agent.name} className="flex items-center gap-4 p-2 rounded-lg bg-white/[0.02]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#B829DD] flex items-center justify-center text-white text-xs font-bold">
                  {agent.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">{agent.name}</p>
                  <div className="h-1.5 rounded-full bg-white/[0.06] mt-1">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${agent.efficiency}%`, backgroundColor: "#00E5A0" }}
                    />
                  </div>
                </div>
                <div className="text-right text-xs text-[#6B7290]">
                  <p>{agent.efficiency}%</p>
                  <p>{agent.executions} runs</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}
