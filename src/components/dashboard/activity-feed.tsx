"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Bot,
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock,
  GitBranch,
  MessageSquare,
  Shield,
} from "lucide-react";
import type { ActivityEvent } from "@/types";

interface ActivityFeedProps {
  events: ActivityEvent[];
  className?: string;
}

const eventConfig: Record<string, { icon: React.ElementType; color: string; bgColor: string }> = {
  agent_start: { icon: Bot, color: "#00D4FF", bgColor: "#00D4FF15" },
  agent_complete: { icon: CheckCircle, color: "#00E5A0", bgColor: "#00E5A015" },
  agent_fail: { icon: AlertTriangle, color: "#FF4757", bgColor: "#FF475715" },
  approval_request: { icon: Shield, color: "#FFC857", bgColor: "#FFC85715" },
  approval_resolve: { icon: CheckCircle, color: "#00E5A0", bgColor: "#00E5A015" },
  task_created: { icon: GitBranch, color: "#B829DD", bgColor: "#B829DD15" },
  task_completed: { icon: CheckCircle, color: "#00E5A0", bgColor: "#00E5A015" },
  message: { icon: MessageSquare, color: "#6B7290", bgColor: "#6B729015" },
};

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ActivityFeed({ events, className }: ActivityFeedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={cn("glass-card p-5", className)}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-white">Activity Feed</h3>
          <p className="text-xs text-[#6B7290] mt-0.5">Real-time agent events</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#00E5A0] animate-pulse" />
          <span className="text-xs text-[#00E5A0] font-medium">Live</span>
        </div>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {events.map((event, index) => {
          const config = eventConfig[event.type] || eventConfig.message;
          const Icon = config.icon;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-[#06070A]/40 border border-white/[0.04] hover:border-white/[0.08] transition-colors"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: config.bgColor }}
              >
                <Icon className="w-4 h-4" style={{ color: config.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#B8BED8] leading-relaxed">
                  <span className="font-medium text-white">{event.actor}</span>{" "}
                  {event.message}
                  {event.target && (
                    <span className="text-[#00D4FF]"> {event.target}</span>
                  )}
                </p>
                <p className="text-xs text-[#4A5068] mt-1">
                  {formatTimeAgo(event.timestamp)}
                </p>
              </div>
              {event.severity && (
                <div
                  className={cn(
                    "w-2 h-2 rounded-full shrink-0 mt-2",
                    event.severity === "success" && "bg-[#00E5A0]",
                    event.severity === "warning" && "bg-[#FFC857]",
                    event.severity === "error" && "bg-[#FF4757]",
                    event.severity === "info" && "bg-[#00D4FF]"
                  )}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
