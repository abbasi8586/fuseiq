"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass/glass-card";
import { StatusBadge } from "@/components/glass/status-badge";
import { ArrowRight, Users } from "lucide-react";
import Link from "next/link";
import type { Agent } from "@/types";

interface AgentStatusProps {
  agents: Agent[];
}

export function AgentStatus({ agents }: AgentStatusProps) {
  const onlineAgents = agents.filter((a) => a.status === "online");
  const busyAgents = agents.filter((a) => a.status === "busy");
  const offlineAgents = agents.filter((a) => a.status === "offline");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-semibold text-white">Agent Status</h3>
            <p className="text-xs text-[#6B7290] mt-0.5">
              {onlineAgents.length} online · {busyAgents.length} busy · {offlineAgents.length} offline
            </p>
          </div>
          <Link
            href="/staff"
            className="flex items-center gap-1 text-xs text-[#00D4FF] hover:text-[#00D4FF]/80 transition-colors"
          >
            <Users className="w-3 h-3" />
            Directory
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-3">
          {agents.slice(0, 6).map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-[#06070A]/40 border border-white/[0.04] hover:border-white/[0.08] transition-colors"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#B829DD] flex items-center justify-center text-white font-bold text-sm shrink-0">
                {(agent.name || "?").charAt(0)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-white font-medium truncate">
                    {agent.name || "Unnamed Agent"}
                  </p>
                  <StatusBadge
                    type={agent.type || "AI"}
                    framework={agent.framework}
                    status={agent.status}
                  />
                </div>
                <p className="text-xs text-[#4A5068] mt-0.5">
                  {agent.role || agent.framework} · {agent.executions || 0} runs
                </p>
              </div>

              {/* Efficiency */}
              <div className="text-right shrink-0">
                <p
                  className="text-sm font-semibold"
                  style={{
                    color:
                      (agent.efficiency || 0) >= 90
                        ? "#00E5A0"
                        : (agent.efficiency || 0) >= 70
                        ? "#FFC857"
                        : "#FF4757",
                  }}
                >
                  {agent.efficiency || 0}%
                </p>
                <p className="text-[10px] text-[#4A5068]">Efficiency</p>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}
