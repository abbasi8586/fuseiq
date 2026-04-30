"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Search,
  Filter,
  ChevronDown,
  User,
  Bot,
  Settings,
  Key,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Loader2,
  Download,
  Eye,
} from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const actionTypes = [
  { id: "all", label: "All Actions" },
  { id: "agent", label: "Agent Actions" },
  { id: "auth", label: "Authentication" },
  { id: "billing", label: "Billing" },
  { id: "settings", label: "Settings" },
];

const actorTypes = [
  { id: "all", label: "All Actors" },
  { id: "user", label: "Human Users" },
  { id: "agent", label: "AI Agents" },
  { id: "system", label: "System" },
];

interface AuditEntry {
  id: string;
  actor_type: "user" | "agent" | "system";
  action: string;
  target_type?: string;
  target_id?: string;
  metadata?: any;
  created_at: string;
  ip_address?: string;
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [actorFilter, setActorFilter] = useState("all");
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch("/api/audit?limit=100");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setLogs(data.logs || []);
    } catch {
      setLogs([
        { id: "1", actor_type: "user", action: "Created agent 'MarketingBot Pro'", target_type: "agent", target_id: "agent_1", created_at: "2024-01-15T10:30:00Z", ip_address: "192.168.1.1", metadata: { framework: "OpenAI" } },
        { id: "2", actor_type: "agent", action: "Executed task 'Email Campaign'", target_type: "task", target_id: "task_42", created_at: "2024-01-15T11:15:00Z", metadata: { cost: 2.34, tokens: 1543 } },
        { id: "3", actor_type: "system", action: "Auto-scaled agent pool", target_type: "workspace", target_id: "ws_1", created_at: "2024-01-15T12:00:00Z", metadata: { reason: "high_load" } },
        { id: "4", actor_type: "user", action: "Approved high-risk action", target_type: "approval", target_id: "app_5", created_at: "2024-01-15T14:22:00Z", ip_address: "192.168.1.1", metadata: { risk_level: "high" } },
        { id: "5", actor_type: "agent", action: "Failed execution: API timeout", target_type: "execution", target_id: "exec_99", created_at: "2024-01-15T15:45:00Z", metadata: { error: "timeout", retry_count: 3 } },
        { id: "6", actor_type: "user", action: "Updated billing plan to Professional", target_type: "subscription", target_id: "sub_1", created_at: "2024-01-15T16:00:00Z", ip_address: "192.168.1.1", metadata: { plan: "professional" } },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filteredLogs = logs.filter((log) => {
    if (search && !log.action.toLowerCase().includes(search.toLowerCase())) return false;
    if (actionFilter !== "all" && !log.action.toLowerCase().includes(actionFilter)) return false;
    if (actorFilter !== "all" && log.actor_type !== actorFilter) return false;
    return true;
  });

  const getActorIcon = (type: string) => {
    switch (type) {
      case "user": return <User className="w-4 h-4" />;
      case "agent": return <Bot className="w-4 h-4" />;
      case "system": return <Settings className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getActorColor = (type: string) => {
    switch (type) {
      case "user": return "#00D4FF";
      case "agent": return "#B829DD";
      case "system": return "#00E5A0";
      default: return "#6B7280";
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#00D4FF]" />
            Audit Log
          </h1>
          <p className="text-sm text-[#6B7290] mt-1">Immutable record of all actions</p>
        </div>
        <button
          onClick={() => toast.info("Export feature coming soon")}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-[#6B7290] hover:text-white transition-colors"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5068]" />
          <Input
            placeholder="Search audit log..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-8 w-64 bg-white/[0.03] border-white/[0.06] text-sm text-white placeholder:text-[#4A5068]"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-[#6B7290] hover:text-white transition-colors">
              <Filter className="w-3 h-3" />
              {actionTypes.find((a) => a.id === actionFilter)?.label}
              <ChevronDown className="w-3 h-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#0B0D14] border-white/[0.08]">
            {actionTypes.map((a) => (
              <DropdownMenuItem
                key={a.id}
                onClick={() => setActionFilter(a.id)}
                className="text-xs text-[#6B7290] hover:text-white focus:bg-white/[0.04] cursor-pointer"
              >
                {a.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-[#6B7290] hover:text-white transition-colors">
              <User className="w-3 h-3" />
              {actorTypes.find((a) => a.id === actorFilter)?.label}
              <ChevronDown className="w-3 h-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#0B0D14] border-white/[0.08]">
            {actorTypes.map((a) => (
              <DropdownMenuItem
                key={a.id}
                onClick={() => setActorFilter(a.id)}
                className="text-xs text-[#6B7290] hover:text-white focus:bg-white/[0.04] cursor-pointer"
              >
                {a.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Log Table */}
      <GlassCard>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-[#00D4FF] animate-spin" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-[#4A5068] mx-auto mb-3" />
            <p className="text-[#6B7290] text-sm">No audit entries found</p>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="grid grid-cols-[100px_1fr_120px_100px] gap-4 px-3 py-2 text-[10px] uppercase tracking-wider text-[#4A5068] font-medium">
              <span>Actor</span>
              <span>Action</span>
              <span>Target</span>
              <span className="text-right">Time</span>
            </div>
            <AnimatePresence>
              {filteredLogs.map((log) => (
                <motion.div
                  key={log.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedEntry(log)}
                  className="grid grid-cols-[100px_1fr_120px_100px] gap-4 px-3 py-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] cursor-pointer transition-colors items-center"
                >
                  <div className="flex items-center gap-2">
                    <span style={{ color: getActorColor(log.actor_type) }}>
                      {getActorIcon(log.actor_type)}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] h-5"
                      style={{
                        borderColor: `${getActorColor(log.actor_type)}40`,
                        color: getActorColor(log.actor_type),
                        backgroundColor: `${getActorColor(log.actor_type)}10`,
                      }}
                    >
                      {log.actor_type}
                    </Badge>
                  </div>
                  <span className="text-sm text-white truncate">{log.action}</span>
                  <span className="text-xs text-[#6B7290] truncate">
                    {log.target_type || "—"}
                  </span>
                  <span className="text-xs text-[#4A5068] text-right">
                    {new Date(log.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </GlassCard>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEntry(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0B0D14] border border-white/[0.08] rounded-xl p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#00D4FF]" />
                Audit Entry Details
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[#6B7290] mb-1">Action</p>
                  <p className="text-sm text-white">{selectedEntry.action}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-[#6B7290] mb-1">Actor Type</p>
                    <Badge
                      variant="outline"
                      style={{
                        borderColor: `${getActorColor(selectedEntry.actor_type)}40`,
                        color: getActorColor(selectedEntry.actor_type),
                        backgroundColor: `${getActorColor(selectedEntry.actor_type)}10`,
                      }}
                    >
                      {selectedEntry.actor_type}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7290] mb-1">Timestamp</p>
                    <p className="text-xs text-white">
                      {new Date(selectedEntry.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                {selectedEntry.target_type && (
                  <div>
                    <p className="text-xs text-[#6B7290] mb-1">Target</p>
                    <p className="text-sm text-white">
                      {selectedEntry.target_type} ({selectedEntry.target_id})
                    </p>
                  </div>
                )}
                {selectedEntry.ip_address && (
                  <div>
                    <p className="text-xs text-[#6B7290] mb-1">IP Address</p>
                    <p className="text-sm text-white font-mono">{selectedEntry.ip_address}</p>
                  </div>
                )}
                {selectedEntry.metadata && (
                  <div>
                    <p className="text-xs text-[#6B7290] mb-1">Metadata</p>
                    <pre className="text-xs text-[#6B7290] bg-white/[0.02] p-2 rounded-lg overflow-auto">
                      {JSON.stringify(selectedEntry.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
