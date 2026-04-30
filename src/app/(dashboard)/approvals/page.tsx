"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  AlertOctagon,
  User,
  Bot,
  DollarSign,
  Calendar,
  Loader2,
  Search,
  Filter,
  ChevronDown,
  History,
} from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
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

const riskLevels = [
  { id: "low", label: "Low", color: "#00E5A0", icon: Shield },
  { id: "medium", label: "Medium", color: "#00D4FF", icon: AlertTriangle },
  { id: "high", label: "High", color: "#FF6B35", icon: AlertOctagon },
  { id: "critical", label: "Critical", color: "#FF4757", icon: AlertOctagon },
];

interface Approval {
  id: string;
  action: string;
  risk_level: "low" | "medium" | "high" | "critical";
  estimated_cost?: number;
  status: "pending" | "approved" | "rejected" | "expired";
  requester: string;
  agent_id?: string;
  resolution_notes?: string;
  created_at: string;
  resolved_at?: string;
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchApprovals = useCallback(async () => {
    try {
      const res = await fetch("/api/approvals");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setApprovals(data || []);
    } catch {
      setApprovals([
        { id: "1", action: "Deploy MarketingBot to production", risk_level: "medium", estimated_cost: 45.0, status: "pending", requester: "Agent Forge Lead", created_at: "2024-01-01" },
        { id: "2", action: "Access customer database for analysis", risk_level: "high", estimated_cost: 12.5, status: "pending", requester: "DataSync Master", created_at: "2024-01-02" },
        { id: "3", action: "Send 10,000 automated emails", risk_level: "low", estimated_cost: 89.0, status: "approved", requester: "MarketingBot Pro", created_at: "2024-01-03", resolved_at: "2024-01-03" },
        { id: "4", action: "Modify payment gateway configuration", risk_level: "critical", estimated_cost: 0, status: "rejected", requester: "SalesScout", created_at: "2024-01-04", resolved_at: "2024-01-04" },
        { id: "5", action: "Generate API keys for new workspace", risk_level: "medium", estimated_cost: 3.2, status: "pending", requester: "SupportAI", created_at: "2024-01-05" },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  const handleApprove = async (id: string) => {
    setProcessing(id);
    try {
      const res = await fetch("/api/approvals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "approved", resolution_notes: "Approved via dashboard" }),
      });
      if (!res.ok) throw new Error("Failed");
      setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status: "approved" as const, resolved_at: new Date().toISOString() } : a)));
      toast.success("Approval granted");
    } catch {
      setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status: "approved" as const, resolved_at: new Date().toISOString() } : a)));
      toast.success("Approval granted (demo mode)");
    } finally {
      setProcessing(null);
      setDetailOpen(false);
    }
  };

  const handleReject = async (id: string) => {
    setProcessing(id);
    try {
      const res = await fetch("/api/approvals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "rejected", resolution_notes: "Rejected via dashboard" }),
      });
      if (!res.ok) throw new Error("Failed");
      setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status: "rejected" as const, resolved_at: new Date().toISOString() } : a)));
      toast.error("Approval rejected");
    } catch {
      setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status: "rejected" as const, resolved_at: new Date().toISOString() } : a)));
      toast.error("Approval rejected (demo mode)");
    } finally {
      setProcessing(null);
      setDetailOpen(false);
    }
  };

  const getRiskColor = (r: string) => riskLevels.find((rl) => rl.id === r)?.color || "#6B7280";
  const getRiskIcon = (r: string) => riskLevels.find((rl) => rl.id === r)?.icon || Shield;

  const filteredApprovals = approvals.filter((a) => {
    if (search && !a.action.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (riskFilter !== "all" && a.risk_level !== riskFilter) return false;
    return true;
  });

  const pending = approvals.filter((a) => a.status === "pending").length;
  const approved = approvals.filter((a) => a.status === "approved").length;
  const rejected = approvals.filter((a) => a.status === "rejected").length;
  const criticalPending = approvals.filter((a) => a.status === "pending" && a.risk_level === "critical").length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#00D4FF]" />
            Approval Queue
          </h1>
          <p className="text-sm text-[#6B7290] mt-1">Human-in-the-loop oversight for agent actions</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Pending", value: pending.toString(), icon: Clock, color: "#FFC857" },
          { label: "Approved", value: approved.toString(), icon: CheckCircle2, color: "#00E5A0" },
          { label: "Rejected", value: rejected.toString(), icon: XCircle, color: "#FF4757" },
          { label: "Critical Risk", value: criticalPending.toString(), icon: AlertOctagon, color: "#FF4757" },
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
            placeholder="Search approvals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-8 w-48 bg-white/[0.03] border-white/[0.06] text-sm text-white placeholder:text-[#4A5068]"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline" size="sm" className="h-8 border-white/[0.08] text-[#6B7290] hover:text-white text-xs">
              <Filter className="w-3 h-3 mr-1" />
              {statusFilter === "all" ? "Status" : statusFilter}
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#0B0D14] border-white/[0.08]">
            {["all", "pending", "approved", "rejected"].map((s) => (
              <DropdownMenuItem key={s} onClick={() => setStatusFilter(s)} className="text-xs text-[#6B7290] hover:text-white focus:bg-white/[0.04] cursor-pointer">
                {s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline" size="sm" className="h-8 border-white/[0.08] text-[#6B7290] hover:text-white text-xs">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {riskFilter === "all" ? "Risk" : riskFilter}
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#0B0D14] border-white/[0.08]">
            <DropdownMenuItem onClick={() => setRiskFilter("all")} className="text-xs text-[#6B7290] hover:text-white focus:bg-white/[0.04] cursor-pointer">All Risks</DropdownMenuItem>
            {riskLevels.map((r) => (
              <DropdownMenuItem key={r.id} onClick={() => setRiskFilter(r.id)} className="text-xs text-[#6B7290] hover:text-white focus:bg-white/[0.04] cursor-pointer">
                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: r.color }} />
                {r.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Approval List */}
      <GlassCard>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-[#00D4FF] animate-spin" />
          </div>
        ) : filteredApprovals.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-[#4A5068] mx-auto mb-3" />
            <p className="text-[#6B7290] text-sm">No approvals found</p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {filteredApprovals.map((approval) => {
                const RiskIcon = getRiskIcon(approval.risk_level);
                const isPending = approval.status === "pending";
                return (
                  <motion.div
                    key={approval.id}
                    layout
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => { setSelectedApproval(approval); setDetailOpen(true); }}
                    className="flex items-center gap-4 p-4 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${getRiskColor(approval.risk_level)}15` }}>
                      <RiskIcon className="w-5 h-5" style={{ color: getRiskColor(approval.risk_level) }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-white">{approval.action}</span>
                        <Badge
                          variant="outline"
                          className="text-[10px] h-5"
                          style={{
                            borderColor: `${getRiskColor(approval.risk_level)}40`,
                            color: getRiskColor(approval.risk_level),
                            backgroundColor: `${getRiskColor(approval.risk_level)}10`,
                          }}
                        >
                          {approval.risk_level.toUpperCase()}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-[10px] h-5"
                          style={{
                            borderColor: approval.status === "approved" ? "#00E5A040" : approval.status === "rejected" ? "#FF475740" : "#FFC85740",
                            color: approval.status === "approved" ? "#00E5A0" : approval.status === "rejected" ? "#FF4757" : "#FFC857",
                            backgroundColor: approval.status === "approved" ? "#00E5A010" : approval.status === "rejected" ? "#FF475710" : "#FFC85710",
                          }}
                        >
                          {approval.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-[#6B7290] flex-wrap">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" />{approval.requester}</span>
                        {approval.estimated_cost !== undefined && (
                          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{approval.estimated_cost.toFixed(2)}</span>
                        )}
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(approval.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {isPending && (
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); handleApprove(approval.id); }}
                          disabled={processing === approval.id}
                          className="h-7 bg-[#00E5A0]/10 text-[#00E5A0] hover:bg-[#00E5A0]/20 border border-[#00E5A0]/30 text-xs"
                        >
                          {processing === approval.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3 mr-1" />}
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); handleReject(approval.id); }}
                          disabled={processing === approval.id}
                          className="h-7 bg-[#FF4757]/10 text-[#FF4757] hover:bg-[#FF4757]/20 border border-[#FF4757]/30 text-xs"
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                    {!isPending && approval.resolved_at && (
                      <div className="text-xs text-[#4A5068] shrink-0 flex items-center gap-1">
                        <History className="w-3 h-3" />
                        {new Date(approval.resolved_at).toLocaleDateString()}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </GlassCard>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="bg-[#0B0D14] border-white/[0.08] text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Shield className="w-5 h-5 text-[#00D4FF]" />
              Approval Details
            </DialogTitle>
          </DialogHeader>
          {selectedApproval && (
            <div className="space-y-4 mt-2">
              <div>
                <p className="text-xs text-[#6B7290] mb-1">Action</p>
                <p className="text-sm text-white">{selectedApproval.action}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-[#6B7290] mb-1">Risk Level</p>
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: `${getRiskColor(selectedApproval.risk_level)}40`,
                      color: getRiskColor(selectedApproval.risk_level),
                      backgroundColor: `${getRiskColor(selectedApproval.risk_level)}10`,
                    }}
                  >
                    {selectedApproval.risk_level.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-[#6B7290] mb-1">Status</p>
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: selectedApproval.status === "approved" ? "#00E5A040" : selectedApproval.status === "rejected" ? "#FF475740" : "#FFC85740",
                      color: selectedApproval.status === "approved" ? "#00E5A0" : selectedApproval.status === "rejected" ? "#FF4757" : "#FFC857",
                      backgroundColor: selectedApproval.status === "approved" ? "#00E5A010" : selectedApproval.status === "rejected" ? "#FF475710" : "#FFC85710",
                    }}
                  >
                    {selectedApproval.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-[#6B7290] mb-1">Requester</p>
                  <p className="text-sm text-white">{selectedApproval.requester}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7290] mb-1">Estimated Cost</p>
                  <p className="text-sm text-white">${selectedApproval.estimated_cost?.toFixed(2) || "0.00"}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-[#6B7290] mb-1">Created</p>
                <p className="text-sm text-white">{new Date(selectedApproval.created_at).toLocaleString()}</p>
              </div>
              {selectedApproval.resolved_at && (
                <div>
                  <p className="text-xs text-[#6B7290] mb-1">Resolved</p>
                  <p className="text-sm text-white">{new Date(selectedApproval.resolved_at).toLocaleString()}</p>
                </div>
              )}
              {selectedApproval.status === "pending" && (
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => handleReject(selectedApproval.id)}
                    disabled={processing === selectedApproval.id}
                    className="bg-[#FF4757]/10 text-[#FF4757] hover:bg-[#FF4757]/20 border border-[#FF4757]/30"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(selectedApproval.id)}
                    disabled={processing === selectedApproval.id}
                    className="bg-[#00E5A0]/10 text-[#00E5A0] hover:bg-[#00E5A0]/20 border border-[#00E5A0]/30"
                  >
                    {processing === selectedApproval.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-1" />}
                    Approve
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
