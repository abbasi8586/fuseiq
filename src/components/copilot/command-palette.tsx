"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  Search,
  Bot,
  Zap,
  BarChart3,
  Settings,
  Users,
  FileText,
  Shield,
  X,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Command {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
  category: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Toggle with ⌘K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const commands: Command[] = [
    {
      id: "deploy-agent",
      title: "Deploy New Agent",
      description: "Create and configure a new AI agent",
      icon: <Bot className="w-4 h-4" />,
      shortcut: "⌘A",
      category: "Agents",
      action: () => {
        setLoading(true);
        router.push("/agents");
        setOpen(false);
      },
    },
    {
      id: "view-analytics",
      title: "View Analytics",
      description: "Open the analytics dashboard",
      icon: <BarChart3 className="w-4 h-4" />,
      shortcut: "⌘D",
      category: "Dashboard",
      action: () => {
        router.push("/analytics");
        setOpen(false);
      },
    },
    {
      id: "run-workflow",
      title: "Run Workflow",
      description: "Execute a saved multi-agent workflow",
      icon: <Zap className="w-4 h-4" />,
      shortcut: "⌘R",
      category: "Workflows",
      action: () => {
        router.push("/swarm");
        setOpen(false);
      },
    },
    {
      id: "view-staff",
      title: "Staff Directory",
      description: "View all agents and team members",
      icon: <Users className="w-4 h-4" />,
      shortcut: "⌘T",
      category: "Team",
      action: () => {
        router.push("/staff");
        setOpen(false);
      },
    },
    {
      id: "create-task",
      title: "Create Task",
      description: "Add a new task to the operations board",
      icon: <FileText className="w-4 h-4" />,
      category: "Operations",
      action: () => {
        router.push("/operations");
        setOpen(false);
      },
    },
    {
      id: "view-approvals",
      title: "Pending Approvals",
      description: "Review and approve agent actions",
      icon: <Shield className="w-4 h-4" />,
      category: "Approvals",
      action: () => {
        router.push("/approvals");
        setOpen(false);
      },
    },
    {
      id: "open-settings",
      title: "Settings",
      description: "Configure workspace and integrations",
      icon: <Settings className="w-4 h-4" />,
      shortcut: "⌘,",
      category: "System",
      action: () => {
        router.push("/settings");
        setOpen(false);
      },
    },
    {
      id: "toggle-theme",
      title: "Toggle Theme",
      description: "Switch between dark and light mode",
      icon: <Zap className="w-4 h-4" />,
      category: "System",
      action: () => {
        toast.info("Theme toggle coming soon");
        setOpen(false);
      },
    },
  ];

  const filtered = commands.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(search.toLowerCase()) ||
      cmd.description.toLowerCase().includes(search.toLowerCase()) ||
      cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        filtered[selectedIndex]?.action();
      }
    },
    [filtered, selectedIndex]
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-lg glass-card border border-white/[0.08] shadow-2xl shadow-black/50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
              {loading ? (
                <Loader2 className="w-5 h-5 text-[#00D4FF] animate-spin" />
              ) : (
                <Search className="w-5 h-5 text-[#6B7290]" />
              )}
              <input
                autoFocus
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search commands..."
                className="flex-1 bg-transparent text-white placeholder:text-[#4A5068] outline-none text-sm"
              />
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded hover:bg-white/5 text-[#4A5068]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Command List */}
            <div className="max-h-[50vh] overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <div className="px-4 py-8 text-center text-[#6B7290]">
                  No commands found for "{search}"
                </div>
              ) : (
                filtered.map((cmd, index) => (
                  <button
                    key={cmd.id}
                    onClick={() => cmd.action()}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      index === selectedIndex
                        ? "bg-[#00D4FF]/10 border-l-2 border-[#00D4FF]"
                        : "hover:bg-white/[0.02] border-l-2 border-transparent"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        index === selectedIndex
                          ? "bg-[#00D4FF]/20 text-[#00D4FF]"
                          : "bg-white/[0.03] text-[#6B7290]"
                      }`}
                    >
                      {cmd.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {cmd.title}
                      </p>
                      <p className="text-xs text-[#6B7290] truncate">
                        {cmd.description}
                      </p>
                    </div>
                    {cmd.shortcut && (
                      <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] text-[#4A5068] bg-white/[0.05] rounded border border-white/[0.06]">
                        {cmd.shortcut}
                      </kbd>
                    )}
                    {index === selectedIndex && (
                      <ArrowRight className="w-4 h-4 text-[#00D4FF]" />
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-[#4A5068]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 rounded bg-white/[0.05] border border-white/[0.06]">↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 rounded bg-white/[0.05] border border-white/[0.06]">↵</kbd>
                  Select
                </span>
              </div>
              <span>{filtered.length} commands</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
