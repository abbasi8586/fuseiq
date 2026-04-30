"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Plus,
  Calendar,
  Flag,
  User,
  Bot,
  Clock,
  Trash2,
  MoreHorizontal,
  CheckCircle2,
  Circle,
  AlertCircle,
  Zap,
  Search,
  Filter,
  ArrowUpDown,
  ChevronDown,
  Loader2,
  X,
  GripVertical,
} from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { ProgressBar } from "@/components/glass/progress-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const columns = [
  { id: "todo", label: "To Do", color: "#6B7280", icon: Circle },
  { id: "in_progress", label: "In Progress", color: "#00D4FF", icon: Zap },
  { id: "review", label: "Review", color: "#B829DD", icon: AlertCircle },
  { id: "done", label: "Done", color: "#00E5A0", icon: CheckCircle2 },
];

const priorities = [
  { id: "low", label: "Low", color: "#6B7280" },
  { id: "medium", label: "Medium", color: "#00D4FF" },
  { id: "high", label: "High", color: "#FF6B35" },
  { id: "urgent", label: "Urgent", color: "#FF4757" },
];

const assigneeTypes = [
  { id: "Human", label: "Human", icon: User },
  { id: "AI", label: "AI Agent", icon: Bot },
];

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  assignee_type: "AI" | "Human";
  assignee_id?: string;
  due_date?: string;
  progress: number;
  tags?: string[];
  created_at: string;
  updated_at?: string;
}

export default function OperationsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPriority, setFormPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [formAssigneeType, setFormAssigneeType] = useState<"AI" | "Human">("Human");
  const [formDueDate, setFormDueDate] = useState("");
  const [formTags, setFormTags] = useState("");

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setTasks(data || []);
    } catch (err) {
      toast.error("Failed to load tasks");
      setTasks([
        { id: "1", title: "Design new landing page", status: "in_progress", priority: "high", assignee_type: "Human", progress: 60, tags: ["design", "web"], created_at: "2024-01-01" },
        { id: "2", title: "Implement OAuth flow", status: "todo", priority: "urgent", assignee_type: "AI", progress: 0, tags: ["auth", "backend"], created_at: "2024-01-02" },
        { id: "3", title: "Write API documentation", status: "review", priority: "medium", assignee_type: "Human", progress: 90, tags: ["docs"], created_at: "2024-01-03" },
        { id: "4", title: "Optimize database queries", status: "done", priority: "high", assignee_type: "AI", progress: 100, tags: ["performance", "db"], created_at: "2024-01-04" },
        { id: "5", title: "Set up CI/CD pipeline", status: "todo", priority: "medium", assignee_type: "Human", progress: 10, tags: ["devops"], created_at: "2024-01-05" },
        { id: "6", title: "Create marketing assets", status: "in_progress", priority: "low", assignee_type: "AI", progress: 45, tags: ["marketing", "design"], created_at: "2024-01-06" },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async () => {
    if (!formTitle.trim()) {
      toast.error("Task title is required");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          description: formDesc,
          priority: formPriority,
          assignee_type: formAssigneeType,
          due_date: formDueDate ? new Date(formDueDate).toISOString() : null,
          progress: 0,
          tags: formTags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error("Failed to create");
      const newTask = await res.json();
      setTasks((prev) => [newTask, ...prev]);
      toast.success(`Task "${formTitle}" created`);
      setCreateOpen(false);
      resetForm();
    } catch {
      const mockTask: Task = {
        id: crypto.randomUUID(),
        title: formTitle,
        description: formDesc,
        status: "todo",
        priority: formPriority,
        assignee_type: formAssigneeType,
        due_date: formDueDate ? new Date(formDueDate).toISOString() : undefined,
        progress: 0,
        tags: formTags.split(",").map((t) => t.trim()).filter(Boolean),
        created_at: new Date().toISOString(),
      };
      setTasks((prev) => [mockTask, ...prev]);
      toast.success(`Task "${formTitle}" created (demo mode)`);
      setCreateOpen(false);
      resetForm();
    } finally {
      setCreating(false);
    }
  };

  const updateTaskStatus = async (id: string, status: string) => {
    const progress = status === "done" ? 100 : status === "review" ? 90 : status === "in_progress" ? 50 : 0;
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, progress }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: status as any, progress } : t)));
      toast.success("Task moved");
    } catch {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: status as any, progress } : t)));
      toast.success("Task moved (demo mode)");
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success("Task deleted");
    } catch {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success("Task deleted (demo mode)");
    }
  };

  const resetForm = () => {
    setFormTitle("");
    setFormDesc("");
    setFormPriority("medium");
    setFormAssigneeType("Human");
    setFormDueDate("");
    setFormTags("");
  };

  const filteredTasks = tasks.filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
    return true;
  });

  const tasksByColumn = (status: string) => filteredTasks.filter((t) => t.status === status);

  const getPriorityColor = (p: string) => priorities.find((pr) => pr.id === p)?.color || "#6B7280";

  const handleDragStart = (taskId: string) => setDraggedTask(taskId);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (draggedTask) {
      updateTaskStatus(draggedTask, status);
      setDraggedTask(null);
    }
  };

  // Metrics
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const urgent = tasks.filter((t) => t.priority === "urgent" && t.status !== "done").length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-[#00D4FF]" />
            Operations Center
          </h1>
          <p className="text-sm text-[#6B7290] mt-1">Task management and workflow orchestration</p>
        </div>
        <Button className="neon-button border-0 bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#06070A]" onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Tasks", value: total.toString(), icon: LayoutDashboard, color: "#00D4FF" },
          { label: "In Progress", value: inProgress.toString(), icon: Zap, color: "#00D4FF" },
          { label: "Completed", value: done.toString(), icon: CheckCircle2, color: "#00E5A0" },
          { label: "Urgent", value: urgent.toString(), icon: Flag, color: "#FF4757" },
        ].map((metric) => (
          <GlassCard key={metric.label} glow="none">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-[#6B7290] mb-1">{metric.label}</p>
                <p className="text-2xl font-bold" style={{ color: metric.color }}>{metric.value}</p>
              </div>
              <metric.icon className="w-5 h-5" style={{ color: metric.color, opacity: 0.5 }} />
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5068]" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-8 w-48 bg-white/[0.03] border-white/[0.06] text-sm text-white placeholder:text-[#4A5068]"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline" size="sm" className="h-8 border-white/[0.08] text-[#6B7290] hover:text-white text-xs">
              <Flag className="w-3 h-3 mr-1" />
              {priorityFilter === "all" ? "Priority" : priorityFilter}
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#0B0D14] border-white/[0.08]">
            <DropdownMenuItem onClick={() => setPriorityFilter("all")} className="text-xs text-[#6B7290] hover:text-white focus:bg-white/[0.04] cursor-pointer">
              All Priorities
            </DropdownMenuItem>
            {priorities.map((p) => (
              <DropdownMenuItem key={p.id} onClick={() => setPriorityFilter(p.id)} className="text-xs text-[#6B7290] hover:text-white focus:bg-white/[0.04] cursor-pointer">
                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: p.color }} />
                {p.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Kanban Board */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-[#00D4FF] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((col) => {
            const colTasks = tasksByColumn(col.id);
            const ColumnIcon = col.icon;
            return (
              <div
                key={col.id}
                className="rounded-xl bg-white/[0.01] border border-white/[0.04] p-3 min-h-[400px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ColumnIcon className="w-4 h-4" style={{ color: col.color }} />
                    <span className="text-sm font-medium text-white">{col.label}</span>
                    <Badge variant="outline" className="text-[10px] border-white/[0.08] text-[#6B7290] h-5">
                      {colTasks.length}
                    </Badge>
                  </div>
                  <button
                    onClick={() => { setFormTitle(""); setCreateOpen(true); }}
                    className="p-1 rounded hover:bg-white/5 text-[#6B7290] hover:text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-2">
                  <AnimatePresence>
                    {colTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        layout
                        draggable
                        onDragStart={() => handleDragStart(task.id)}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.04] cursor-grab active:cursor-grabbing group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{task.title}</p>
                            {task.description && (
                              <p className="text-[11px] text-[#6B7290] mt-0.5 line-clamp-2">{task.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-1 rounded hover:bg-white/5 text-[#6B7290] hover:text-[#FF4757]"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className="text-[10px] h-5"
                            style={{
                              borderColor: `${getPriorityColor(task.priority)}40`,
                              color: getPriorityColor(task.priority),
                              backgroundColor: `${getPriorityColor(task.priority)}10`,
                            }}
                          >
                            <Flag className="w-2.5 h-2.5 mr-1" />
                            {task.priority}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] border-white/[0.08] text-[#6B7290] h-5">
                            {task.assignee_type === "AI" ? <Bot className="w-2.5 h-2.5 mr-1" /> : <User className="w-2.5 h-2.5 mr-1" />}
                            {task.assignee_type}
                          </Badge>
                          {task.due_date && (
                            <Badge variant="outline" className="text-[10px] border-white/[0.08] text-[#6B7290] h-5">
                              <Clock className="w-2.5 h-2.5 mr-1" />
                              {new Date(task.due_date).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>
                        {task.progress > 0 && (
                          <div className="mt-2">
                            <ProgressBar
                              value={task.progress}
                              color={task.status === "done" ? "#00E5A0" : "#00D4FF"}
                            />
                          </div>
                        )}
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex items-center gap-1 mt-2 flex-wrap">
                            {task.tags.map((tag) => (
                              <span key={tag} className="text-[10px] text-[#4A5068] bg-white/[0.03] px-1.5 py-0.5 rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {colTasks.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-xs text-[#4A5068]">No tasks</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Task Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="bg-[#0B0D14] border-white/[0.08] text-white max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Plus className="w-5 h-5 text-[#00D4FF]" />
              New Task
            </DialogTitle>
            <DialogDescription className="text-[#6B7290]">
              Create a new task and assign it to a human or AI agent
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs text-[#6B7290] mb-1.5 block">Title *</label>
              <Input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g., Implement OAuth flow"
                className="bg-white/[0.03] border-white/[0.06] text-white placeholder:text-[#4A5068]"
              />
            </div>
            <div>
              <label className="text-xs text-[#6B7290] mb-1.5 block">Description</label>
              <textarea
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Task details..."
                rows={3}
                className="w-full rounded-md bg-white/[0.03] border border-white/[0.06] text-white placeholder:text-[#4A5068] text-sm p-2.5 resize-none focus:outline-none focus:ring-1 focus:ring-[#00D4FF]/30"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#6B7290] mb-1.5 block">Priority</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {priorities.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setFormPriority(p.id as any)}
                      className={`p-2 rounded-lg border text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                        formPriority === p.id
                          ? "border-[#00D4FF]/40 bg-[#00D4FF]/10 text-[#00D4FF]"
                          : "border-white/[0.06] bg-white/[0.02] text-[#6B7290] hover:border-white/[0.12]"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-[#6B7290] mb-1.5 block">Assignee Type</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {assigneeTypes.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setFormAssigneeType(a.id as any)}
                      className={`p-2 rounded-lg border text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                        formAssigneeType === a.id
                          ? "border-[#00D4FF]/40 bg-[#00D4FF]/10 text-[#00D4FF]"
                          : "border-white/[0.06] bg-white/[0.02] text-[#6B7290] hover:border-white/[0.12]"
                      }`}
                    >
                      <a.icon className="w-3 h-3" />
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#6B7290] mb-1.5 block">Due Date</label>
                <Input
                  type="date"
                  value={formDueDate}
                  onChange={(e) => setFormDueDate(e.target.value)}
                  className="bg-white/[0.03] border-white/[0.06] text-white placeholder:text-[#4A5068] [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="text-xs text-[#6B7290] mb-1.5 block">Tags (comma separated)</label>
                <Input
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="design, frontend, urgent"
                  className="bg-white/[0.03] border-white/[0.06] text-white placeholder:text-[#4A5068]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setCreateOpen(false); resetForm(); }}
                className="border-white/[0.08] text-[#6B7290] hover:text-white"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={createTask}
                disabled={creating || !formTitle.trim()}
                className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#06070A]"
              >
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />}
                Create Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
