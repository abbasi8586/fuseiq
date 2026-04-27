"use client";

import { motion } from "framer-motion";
import { KanbanSquare, Plus, Calendar, Flag, User, MessageSquare, Clock } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const columns = [
  { id: "todo", label: "To Do", color: "#4A5068" },
  { id: "in-progress", label: "In Progress", color: "#00D4FF" },
  { id: "review", label: "Review", color: "#B829DD" },
  { id: "done", label: "Done", color: "#00E5A0" },
];

const tasks = [
  { id: "1", title: "Design glassmorphism system", status: "done", priority: "high", assignee: "Elena", progress: 100, tags: ["Design"], comments: 5 },
  { id: "2", title: "Implement BYOK key vault", status: "in-progress", priority: "urgent", assignee: "Agent Forge", progress: 75, tags: ["Security", "Backend"], comments: 12 },
  { id: "3", title: "Build Co-Pilot command palette", status: "in-progress", priority: "high", assignee: "CodeReview", progress: 60, tags: ["AI", "Frontend"], comments: 3 },
  { id: "4", title: "Setup Supabase realtime", status: "todo", priority: "medium", assignee: "Mike", progress: 0, tags: ["Backend"], comments: 0 },
  { id: "5", title: "Create agent marketplace UI", status: "todo", priority: "medium", assignee: "Sarah", progress: 0, tags: ["Frontend", "Product"], comments: 2 },
  { id: "6", title: "Write API documentation", status: "review", priority: "low", assignee: "ContentForge", progress: 90, tags: ["Docs"], comments: 1 },
  { id: "7", title: "SOC 2 compliance checklist", status: "todo", priority: "high", assignee: "Dr. Wilson", progress: 15, tags: ["Security", "Compliance"], comments: 8 },
  { id: "8", title: "Mobile app wireframes", status: "in-progress", priority: "medium", assignee: "Elena", progress: 40, tags: ["Design", "Mobile"], comments: 4 },
];

const priorityColors = {
  low: { bg: "rgba(255,255,255,0.05)", text: "#6B7290", border: "rgba(255,255,255,0.06)" },
  medium: { bg: "rgba(0,212,255,0.08)", text: "#00D4FF", border: "rgba(0,212,255,0.15)" },
  high: { bg: "rgba(255,193,87,0.08)", text: "#FFC857", border: "rgba(255,193,87,0.15)" },
  urgent: { bg: "rgba(255,71,87,0.08)", text: "#FF4757", border: "rgba(255,71,87,0.15)" },
};

export default function OperationsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <KanbanSquare className="w-6 h-6 text-[#00D4FF]" />
            Operations Center
          </h1>
          <p className="text-sm text-[#6B7290] mt-1">Kanban board for team task management</p>
        </div>
        <Button className="neon-button border-0">
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {columns.map((column) => {
          const columnTasks = tasks.filter((t) => t.status === column.id);
          return (
            <div key={column.id} className="w-72 shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: column.color }} />
                <span className="text-sm font-medium text-[#B8BED8]">{column.label}</span>
                <span className="text-xs text-[#4A5068] ml-auto">{columnTasks.length}</span>
              </div>
              <div className="space-y-3">
                {columnTasks.map((task) => {
                  const priority = priorityColors[task.priority as keyof typeof priorityColors];
                  return (
                    <GlassCard key={task.id} hover className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Badge
                          variant="outline"
                          className="text-[10px]"
                          style={{
                            backgroundColor: priority.bg,
                            color: priority.text,
                            borderColor: priority.border,
                          }}
                        >
                          {task.priority}
                        </Badge>
                        <button className="text-[#4A5068] hover:text-white transition-colors">
                          <Clock className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-medium text-white mb-2">{task.title}</p>
                      <div className="flex items-center gap-2 mb-3">
                        {task.tags.map((tag) => (
                          <span key={tag} className="text-[10px] text-[#4A5068] bg-white/[0.03] px-1.5 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-[#4A5068]">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {task.assignee}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {task.comments}
                          </span>
                        </div>
                        <span>{task.progress}%</span>
                      </div>
                      <div className="mt-2 h-1 rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${task.progress}%`,
                            backgroundColor: column.color,
                          }}
                        />
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
