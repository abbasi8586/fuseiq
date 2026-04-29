"use client";

import { motion } from "framer-motion";
import { Task } from "@/app/(dashboard)/operations/page";
import { TaskCard } from "./task-card";

const priorityColors = {
  low: { bg: "rgba(255,255,255,0.05)", text: "#6B7290", border: "rgba(255,255,255,0.06)" },
  medium: { bg: "rgba(0,212,255,0.08)", text: "#00D4FF", border: "rgba(0,212,255,0.15)" },
  high: { bg: "rgba(255,193,87,0.08)", text: "#FFC857", border: "rgba(255,193,87,0.15)" },
  urgent: { bg: "rgba(255,71,87,0.08)", text: "#FF4757", border: "rgba(255,71,87,0.15)" },
};

interface ColumnConfig {
  id: string;
  label: string;
  color: string;
}

interface KanbanColumnProps {
  column: ColumnConfig;
  tasks: Task[];
  priorityColors?: typeof priorityColors;
  onDragStart?: (taskId: string) => void;
  onDrop?: (columnId: string) => void;
  draggedTaskId?: string | null;
}

export function KanbanColumn({
  column,
  tasks,
  priorityColors: customPriority,
  onDragStart,
  onDrop,
  draggedTaskId,
}: KanbanColumnProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop?.(column.id);
  };

  return (
    <div
      className="w-72 shrink-0 flex flex-col"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: column.color }} />
        <span className="text-sm font-medium text-[#B8BED8]">{column.label}</span>
        <span
          className="text-xs ml-auto min-w-[20px] h-5 flex items-center justify-center rounded-full px-1.5"
          style={{
            backgroundColor: `${column.color}15`,
            color: column.color,
          }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        className="flex-1 rounded-xl border border-dashed border-transparent transition-colors min-h-[120px]"
        style={{
          backgroundColor: draggedTaskId ? `${column.color}08` : "transparent",
          borderColor: draggedTaskId ? `${column.color}30` : "transparent",
        }}
      >
        <div className="space-y-3 p-1">
          {tasks.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <TaskCard
                task={task}
                priorityColors={customPriority}
                onDragStart={onDragStart}
                isDragging={draggedTaskId === task.id}
              />
            </motion.div>
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-8">
              <p className="text-xs text-[#4A5068]">No tasks</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
