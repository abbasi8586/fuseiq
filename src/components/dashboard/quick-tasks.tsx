"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass/glass-card";
import { StatusDot } from "@/components/glass/status-badge";
import { ProgressBar } from "@/components/glass/progress-bar";
import { ArrowRight, Clock, Zap } from "lucide-react";
import Link from "next/link";
import type { Task } from "@/types";

interface QuickTasksProps {
  tasks: Task[];
}

const priorityConfig = {
  low: { color: "#4A5068", label: "Low" },
  medium: { color: "#00D4FF", label: "Medium" },
  high: { color: "#FFC857", label: "High" },
  urgent: { color: "#FF4757", label: "Urgent" },
};

const statusConfig = {
  todo: { label: "To Do", color: "#4A5068" },
  "in-progress": { label: "In Progress", color: "#00D4FF" },
  review: { label: "Review", color: "#FFC857" },
  done: { label: "Done", color: "#00E5A0" },
};

export function QuickTasks({ tasks }: QuickTasksProps) {
  const activeTasks = tasks.filter((t) => t.status !== "done").slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-semibold text-white">Active Tasks</h3>
            <p className="text-xs text-[#6B7290] mt-0.5">
              {activeTasks.length} pending · {tasks.filter((t) => t.status === "done").length} completed
            </p>
          </div>
          <Link
            href="/operations"
            className="flex items-center gap-1 text-xs text-[#00D4FF] hover:text-[#00D4FF]/80 transition-colors"
          >
            View all
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-3">
          {activeTasks.map((task, index) => {
            const priority = priorityConfig[task.priority];
            const status = statusConfig[task.status];

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#06070A]/40 border border-white/[0.04] hover:border-white/[0.08] transition-colors group"
              >
                {/* Status indicator */}
                <div className="shrink-0">
                  <StatusDot status={task.status === "in-progress" ? "busy" : "online"} size="sm" />
                </div>

                {/* Task info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm text-white font-medium truncate group-hover:text-gradient transition-all">
                      {task.title}
                    </p>
                    <span
                      className="px-1.5 py-0.5 text-[10px] font-medium rounded-md shrink-0"
                      style={{
                        backgroundColor: `${priority.color}15`,
                        color: priority.color,
                      }}
                    >
                      {priority.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#4A5068]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {status.label}
                    </span>
                    {task.assigneeName && (
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {task.assigneeName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress */}
                <div className="w-16 shrink-0">
                  <ProgressBar
                    value={task.progress}
                    color={status.color}
                    height={4}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>
    </motion.div>
  );
}
