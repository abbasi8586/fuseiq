"use client";

import { motion } from "framer-motion";
import { Bot, User, CheckCircle, AlertTriangle, XCircle, MessageSquare, Clock, FileCheck } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import type { ActivityEvent } from "@/types";

const eventIcons: Record<string, React.ElementType> = {
  agent_start: Bot,
  agent_complete: CheckCircle,
  agent_fail: XCircle,
  approval_request: AlertTriangle,
  approval_resolve: FileCheck,
  task_created: FileCheck,
  task_completed: CheckCircle,
  message: MessageSquare,
};

const eventColors = {
  info: "#00D4FF",
  success: "#00E5A0",
  warning: "#FFC857",
  error: "#FF4757",
};

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}

interface ActivityFeedProps {
  events: ActivityEvent[];
  maxItems?: number;
}

export function ActivityFeed({ events, maxItems = 5 }: ActivityFeedProps) {
  const displayEvents = events.slice(0, maxItems);

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#00D4FF]" />
          Activity Feed
        </h3>
        <button className="text-xs text-[#00D4FF] hover:text-[#00D4FF]/80 transition-colors">
          View All
        </button>
      </div>
      <div className="space-y-3">
        {displayEvents.map((event, index) => {
          const Icon = eventIcons[event.type] || MessageSquare;
          const color = eventColors[event.severity || "info"];

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/[0.02] transition-colors"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#B8BED8] leading-snug">
                  <span className="font-medium text-white">{event.actor}</span>{" "}
                  {event.message}
                </p>
                <p className="text-xs text-[#4A5068] mt-1">{formatTime(event.timestamp)}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}
