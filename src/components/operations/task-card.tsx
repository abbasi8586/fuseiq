"use client";

import { motion } from "framer-motion";
import { User, MessageSquare, Calendar } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { Task } from "@/app/(dashboard)/operations/page";

const priorityColors = {
  low: { bg: "rgba(255,255,255,0.05)", text: "#6B7290", border: "rgba(255,255,255,0.06)" },
  medium: { bg: "rgba(0,212,255,0.08)", text: "#00D4FF", border: "rgba(0,212,255,0.15)" },
  high: { bg: "rgba(255,193,87,0.08)", text: "#FFC857", border: "rgba(255,193,87,0.15)" },
  urgent: { bg: "rgba(255,71,87,0.08)", text: "#FF4757", border: "rgba(255,71,87,0.15)" },
};

interface TaskCardProps {
  task: Task;
  priorityColors?: typeof priorityColors;
  onDragStart?: (taskId: string) => void;
  isDragging?: boolean;
}

export function TaskCard({ task, priorityColors: customPriority, onDragStart, isDragging }: TaskCardProps) {
  const pc = customPriority || priorityColors;
  const priority = pc[task.priority];
  const columnColor =
    task.status === "todo"
      ? "#4A5068"
      : task.status === "in-progress"
      ? "#00D4FF"
      : task.status === "review"
      ? "#B829DD"
      : "#00E5A0";

  return (
    <motion.div
      layout
      draggable
      onDragStart={() => onDragStart?.(task.id)}
      className={`cursor-grab active:cursor-grabbing ${isDragging ? "opacity-50" : ""}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <GlassCard hover className="p-4">
        {/* Priority badge */}
        <div className="flex items-start justify-between mb-2">
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border"
            style={{
              backgroundColor: priority.bg,
              color: priority.text,
              borderColor: priority.border,
            }}
          >
            {task.priority}
          </span>
          <span className="text-[10px] text-[#4A5068]">{task.progress}%</span>
        </div>

        {/* Title */}
        <p className="text-sm font-medium text-white mb-1 leading-snug">{task.title}</p>
        <p className="text-[11px] text-[#6B7290] mb-3 line-clamp-2">{task.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] text-[#4A5068] bg-white/[0.03] px-1.5 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[10px] text-[#4A5068]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold"
                style={{
                  background: `linear-gradient(135deg, ${columnColor}30, ${columnColor}10)`,
                  color: columnColor,
                  border: `1px solid ${columnColor}40`,
                }}
              >
                {task.assigneeInitials}
              </div>
              {task.assignee}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {task.comments}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {task.dueDate}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-2 h-1 rounded-full bg-white/[0.06]">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: columnColor }}
            initial={{ width: 0 }}
            animate={{ width: `${task.progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </GlassCard>
    </motion.div>
  );
}
