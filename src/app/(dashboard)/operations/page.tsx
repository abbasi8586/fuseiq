"use client";

import { motion } from "framer-motion";
import { KanbanSquare, Plus, Calendar, Flag, User, MessageSquare, Clock, Filter, Search } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TaskCard } from "@/components/operations/task-card";
import { KanbanColumn } from "@/components/operations/kanban-column";
import { useState, useMemo } from "react";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  assignee: string;
  assigneeInitials: string;
  dueDate: string;
  tags: string[];
  comments: number;
  progress: number;
}

const initialTasks: Task[] = [
  { id: "1", title: "Design glassmorphism system", description: "Create comprehensive glassmorphism design tokens and component library", status: "done", priority: "high", assignee: "Elena", assigneeInitials: "ER", dueDate: "2024-12-01", tags: ["Design"], comments: 5, progress: 100 },
  { id: "2", title: "Implement BYOK key vault", description: "Build bring-your-own-key encryption vault with secure key rotation", status: "in-progress", priority: "urgent", assignee: "Agent Forge", assigneeInitials: "AF", dueDate: "2024-12-15", tags: ["Security", "Backend"], comments: 12, progress: 75 },
  { id: "3", title: "Build Co-Pilot command palette", description: "AI-powered command palette with natural language interface", status: "in-progress", priority: "high", assignee: "CodeReview", assigneeInitials: "CR", dueDate: "2024-12-20", tags: ["AI", "Frontend"], comments: 3, progress: 60 },
  { id: "4", title: "Setup Supabase realtime", description: "Configure realtime subscriptions for live collaboration features", status: "todo", priority: "medium", assignee: "Mike", assigneeInitials: "MT", dueDate: "2024-12-25", tags: ["Backend"], comments: 0, progress: 0 },
  { id: "5", title: "Create agent marketplace UI", description: "Design and build the agent marketplace browsing and discovery interface", status: "todo", priority: "medium", assignee: "Sarah", assigneeInitials: "SK", dueDate: "2025-01-05", tags: ["Frontend", "Product"], comments: 2, progress: 0 },
  { id: "6", title: "Write API documentation", description: "Comprehensive API docs with examples and authentication guide", status: "review", priority: "low", assignee: "ContentForge", assigneeInitials: "CF", dueDate: "2024-12-10", tags: ["Docs"], comments: 1, progress: 90 },
  { id: "7", title: "SOC 2 compliance checklist", description: "Prepare all documentation and evidence for SOC 2 Type II audit", status: "todo", priority: "high", assignee: "Dr. Wilson", assigneeInitials: "JW", dueDate: "2025-01-15", tags: ["Security", "Compliance"], comments: 8, progress: 15 },
  { id: "8", title: "Mobile app wireframes", description: "Low and high fidelity wireframes for iOS and Android apps", status: "in-progress", priority: "medium", assignee: "Elena", assigneeInitials: "ER", dueDate: "2024-12-30", tags: ["Design", "Mobile"], comments: 4, progress: 40 },
  { id: "9", title: "Stripe billing integration", description: "Implement subscription billing with Stripe Connect", status: "todo", priority: "high", assignee: "Marcus", assigneeInitials: "MC", dueDate: "2025-01-10", tags: ["Backend", "Fintech"], comments: 6, progress: 5 },
  { id: "10", title: "Performance optimization", description: "Audit and optimize Core Web Vitals across all pages", status: "review", priority: "medium", assignee: "Mike", assigneeInitials: "MT", dueDate: "2024-12-18", tags: ["Performance"], comments: 2, progress: 85 },
];

const columns = [
  { id: "todo" as const, label: "To Do", color: "#4A5068" },
  { id: "in-progress" as const, label: "In Progress", color: "#00D4FF" },
  { id: "review" as const, label: "Review", color: "#B829DD" },
  { id: "done" as const, label: "Done", color: "#00E5A0" },
];

const priorityColors = {
  low: { bg: "rgba(255,255,255,0.05)", text: "#6B7290", border: "rgba(255,255,255,0.06)" },
  medium: { bg: "rgba(0,212,255,0.08)", text: "#00D4FF", border: "rgba(0,212,255,0.15)" },
  high: { bg: "rgba(255,193,87,0.08)", text: "#FFC857", border: "rgba(255,193,87,0.15)" },
  urgent: { bg: "rgba(255,71,87,0.08)", text: "#FF4757", border: "rgba(255,71,87,0.15)" },
};

export default function OperationsPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("All");
  const [showAddTask, setShowAddTask] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    priority: "medium",
    assignee: "",
    assigneeInitials: "",
    dueDate: "",
    tags: [],
  });

  const assignees = useMemo(() => {
    const all = Array.from(new Set(tasks.map((t) => t.assignee)));
    return ["All", ...all];
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
      const matchPriority = priorityFilter === "All" || t.priority === priorityFilter;
      const matchAssignee = assigneeFilter === "All" || t.assignee === assigneeFilter;
      return matchSearch && matchPriority && matchAssignee;
    });
  }, [tasks, search, priorityFilter, assigneeFilter]);

  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleDrop = (columnId: string) => {
    if (!draggedTaskId) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === draggedTaskId
          ? { ...t, status: columnId as Task["status"], progress: columnId === "done" ? 100 : columnId === "todo" ? 0 : t.progress }
          : t
      )
    );
    setDraggedTaskId(null);
  };

  const handleAddTask = () => {
    if (!newTask.title || !newTask.assignee) return;
    const task: Task = {
      id: String(Date.now()),
      title: newTask.title,
      description: newTask.description || "",
      status: "todo",
      priority: (newTask.priority as Task["priority"]) || "medium",
      assignee: newTask.assignee,
      assigneeInitials: newTask.assigneeInitials || newTask.assignee.slice(0, 2).toUpperCase(),
      dueDate: newTask.dueDate || new Date().toISOString().split("T")[0],
      tags: newTask.tags?.length ? newTask.tags : ["General"],
      comments: 0,
      progress: 0,
    };
    setTasks((prev) => [...prev, task]);
    setNewTask({ title: "", description: "", priority: "medium", assignee: "", assigneeInitials: "", dueDate: "", tags: [] });
    setShowAddTask(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <KanbanSquare className="w-6 h-6 text-[#00D4FF]" />
            Operations Center
          </h1>
          <p className="text-sm text-[#6B7290] mt-1">Kanban board for team task management</p>
        </div>
        <Button variant="neon" onClick={() => setShowAddTask(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5068]" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-lg glass-input text-sm text-white placeholder:text-[#4A5068]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#4A5068]" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="h-9 px-3 rounded-lg glass-input text-sm text-white bg-transparent"
          >
            <option value="All" className="bg-[#0F111A]">All Priorities</option>
            <option value="urgent" className="bg-[#0F111A]">Urgent</option>
            <option value="high" className="bg-[#0F111A]">High</option>
            <option value="medium" className="bg-[#0F111A]">Medium</option>
            <option value="low" className="bg-[#0F111A]">Low</option>
          </select>
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="h-9 px-3 rounded-lg glass-input text-sm text-white bg-transparent"
          >
            {assignees.map((a) => (
              <option key={a} value={a} className="bg-[#0F111A]">{a === "All" ? "All Assignees" : a}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban */}
      <div className="flex gap-4 overflow-x-auto pb-2" style={{ minHeight: "500px" }}>
        {columns.map((column) => {
          const columnTasks = filteredTasks.filter((t) => t.status === column.id);
          return (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={columnTasks}
              priorityColors={priorityColors}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              draggedTaskId={draggedTaskId}
            />
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAddTask(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <GlassCard elevated className="p-6">
              <h3 className="text-lg font-bold text-white mb-1">Create New Task</h3>
              <p className="text-xs text-[#6B7290] mb-4">Add a task to the operations board</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-[#6B7290] mb-1 block">Title</label>
                  <input
                    type="text"
                    placeholder="Task title..."
                    value={newTask.title || ""}
                    onChange={(e) => setNewTask((p) => ({ ...p, title: e.target.value }))}
                    className="w-full h-9 px-3 rounded-lg glass-input text-sm text-white placeholder:text-[#4A5068]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#6B7290] mb-1 block">Description</label>
                  <textarea
                    placeholder="Task description..."
                    value={newTask.description || ""}
                    onChange={(e) => setNewTask((p) => ({ ...p, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg glass-input text-sm text-white placeholder:text-[#4A5068] resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#6B7290] mb-1 block">Priority</label>
                    <select
                      value={newTask.priority || "medium"}
                      onChange={(e) => setNewTask((p) => ({ ...p, priority: e.target.value as Task["priority"] }))}
                      className="w-full h-9 px-3 rounded-lg glass-input text-sm text-white bg-transparent"
                    >
                      <option value="low" className="bg-[#0F111A]">Low</option>
                      <option value="medium" className="bg-[#0F111A]">Medium</option>
                      <option value="high" className="bg-[#0F111A]">High</option>
                      <option value="urgent" className="bg-[#0F111A]">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#6B7290] mb-1 block">Due Date</label>
                    <input
                      type="date"
                      value={newTask.dueDate || ""}
                      onChange={(e) => setNewTask((p) => ({ ...p, dueDate: e.target.value }))}
                      className="w-full h-9 px-3 rounded-lg glass-input text-sm text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#6B7290] mb-1 block">Assignee</label>
                    <input
                      type="text"
                      placeholder="Name"
                      value={newTask.assignee || ""}
                      onChange={(e) => setNewTask((p) => ({ ...p, assignee: e.target.value, assigneeInitials: e.target.value.slice(0, 2).toUpperCase() }))}
                      className="w-full h-9 px-3 rounded-lg glass-input text-sm text-white placeholder:text-[#4A5068]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#6B7290] mb-1 block">Tags (comma separated)</label>
                    <input
                      type="text"
                      placeholder="Frontend, Bug"
                      value={newTask.tags?.join(", ") || ""}
                      onChange={(e) => setNewTask((p) => ({ ...p, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) }))}
                      className="w-full h-9 px-3 rounded-lg glass-input text-sm text-white placeholder:text-[#4A5068]"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="flex-1" onClick={() => setShowAddTask(false)}>Cancel</Button>
                <Button variant="neon" className="flex-1" onClick={handleAddTask}>Create Task</Button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
