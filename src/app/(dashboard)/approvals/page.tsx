"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Shield, Clock, DollarSign, Filter } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const approvals = [
  { id: "1", agent: "MarketingBot Pro", action: "Deploy email campaign to 50K subscribers", risk: "high", cost: 0.85, status: "pending", requester: "Co-Pilot", time: "15 min ago" },
  { id: "2", agent: "SupportAI", action: "Bulk close 47 resolved tickets", risk: "low", cost: 0.12, status: "pending", requester: "Auto-trigger", time: "30 min ago" },
  { id: "3", agent: "CodeReview Bot", action: "Auto-merge PR #234 after review", risk: "medium", cost: 0.08, status: "pending", requester: "GitHub webhook", time: "1h ago" },
  { id: "4", agent: "Agent Forge Lead", action: "Deploy security audit to all repositories", risk: "high", cost: 1.20, status: "approved", requester: "Co-Pilot", time: "2h ago", resolver: "Awais Abbasi" },
  { id: "5", agent: "SalesScout", action: "Send follow-up sequence to 200 leads", risk: "medium", cost: 0.45, status: "rejected", requester: "Sales pipeline", time: "3h ago", resolver: "Sarah Chen" },
  { id: "6", agent: "DataSync Master", action: "Sync production database to Airtable", risk: "high", cost: 0.32, status: "approved", requester: "Scheduled", time: "5h ago", resolver: "Dr. Wilson" },
];

const riskConfig = {
  low: { bg: "rgba(0,229,160,0.08)", text: "#00E5A0", border: "rgba(0,229,160,0.15)" },
  medium: { bg: "rgba(255,193,87,0.08)", text: "#FFC857", border: "rgba(255,193,87,0.15)" },
  high: { bg: "rgba(255,71,87,0.08)", text: "#FF4757", border: "rgba(255,71,87,0.15)" },
  critical: { bg: "rgba(255,71,87,0.15)", text: "#FF4757", border: "rgba(255,71,87,0.30)" },
};

export default function ApprovalsPage() {
  const pending = approvals.filter((a) => a.status === "pending");
  const resolved = approvals.filter((a) => a.status !== "pending");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#00D4FF]" />
            Approval Queue
          </h1>
          <p className="text-sm text-[#6B7290] mt-1">
            {pending.length} pending · {resolved.filter((a) => a.status === "approved").length} approved · {resolved.filter((a) => a.status === "rejected").length} rejected
          </p>
        </div>
        <Button variant="outline" className="border-white/[0.08] text-[#B8BED8]">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Pending Approvals */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-[#6B7290] uppercase tracking-wider">Pending ({pending.length})</h2>
        {pending.map((approval) => {
          const risk = riskConfig[approval.risk as keyof typeof riskConfig];
          return (
            <GlassCard key={approval.id} glow="cyan">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant="outline"
                      className="text-[10px]"
                      style={{ backgroundColor: risk.bg, color: risk.text, borderColor: risk.border }}
                    >
                      {approval.risk} risk
                    </Badge>
                    <span className="text-xs text-[#4A5068]">{approval.time}</span>
                  </div>
                  <p className="text-sm font-medium text-white">{approval.action}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-[#6B7290]">
                    <span>Agent: <span className="text-[#00D4FF]">{approval.agent}</span></span>
                    <span>·</span>
                    <span>Requested by: {approval.requester}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      ~${approval.cost.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm" className="border-[#FF4757]/30 text-[#FF4757] hover:bg-[#FF4757]/10">
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                  <Button size="sm" className="bg-[#00E5A0]/15 text-[#00E5A0] hover:bg-[#00E5A0]/25 border border-[#00E5A0]/30">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Resolved Approvals */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-[#6B7290] uppercase tracking-wider">History</h2>
        {resolved.map((approval) => {
          const risk = riskConfig[approval.risk as keyof typeof riskConfig];
          const isApproved = approval.status === "approved";
          return (
            <GlassCard key={approval.id}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant="outline"
                      className="text-[10px]"
                      style={{ backgroundColor: risk.bg, color: risk.text, borderColor: risk.border }}
                    >
                      {approval.risk}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-[10px]"
                      style={{
                        backgroundColor: isApproved ? "rgba(0,229,160,0.08)" : "rgba(255,71,87,0.08)",
                        color: isApproved ? "#00E5A0" : "#FF4757",
                        borderColor: isApproved ? "rgba(0,229,160,0.15)" : "rgba(255,71,87,0.15)",
                      }}
                    >
                      {isApproved ? "Approved" : "Rejected"}
                    </Badge>
                    <span className="text-xs text-[#4A5068]">{approval.time}</span>
                  </div>
                  <p className="text-sm text-[#B8BED8]">{approval.action}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-[#4A5068]">
                    <span>By: {approval.resolver}</span>
                    <span>·</span>
                    <span>Agent: {approval.agent}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </motion.div>
  );
}
