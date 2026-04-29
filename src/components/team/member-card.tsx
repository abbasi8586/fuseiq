"use client";

import { motion } from "framer-motion";
import { Mail, Shield, UserCheck, UserCog, Eye, Clock, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Director" | "Manager" | "Member" | "Viewer";
  department: string;
  status: "online" | "away" | "busy" | "offline";
  avatar: string;
  initials: string;
  lastActive: string;
  tasksCompleted: number;
  joinDate: string;
}

const statusConfig = {
  online: { color: "#00E5A0", label: "Online", pulse: true },
  away: { color: "#FFC857", label: "Away", pulse: true },
  busy: { color: "#FF6B35", label: "Busy", pulse: true },
  offline: { color: "#4A5068", label: "Offline", pulse: false },
};

const roleConfig = {
  Director: { icon: Shield, color: "#B829DD", bg: "rgba(184,41,221,0.1)" },
  Manager: { icon: UserCog, color: "#00D4FF", bg: "rgba(0,212,255,0.1)" },
  Member: { icon: UserCheck, color: "#00E5A0", bg: "rgba(0,229,160,0.1)" },
  Viewer: { icon: Eye, color: "#6B7290", bg: "rgba(107,114,144,0.1)" },
};

interface MemberCardProps {
  member: TeamMember;
  statusConfig?: typeof statusConfig;
  roleConfig?: typeof roleConfig;
}

export function MemberCard({ member, statusConfig: customStatus, roleConfig: customRole }: MemberCardProps) {
  const sc = customStatus || statusConfig;
  const rc = customRole || roleConfig;
  const status = sc[member.status];
  const role = rc[member.role];
  const RoleIcon = role.icon;

  return (
    <GlassCard hover className="p-4 relative overflow-visible">
      {/* Status indicator */}
      <div className="absolute -top-1 -right-1 z-10">
        <div
          className={`w-3.5 h-3.5 rounded-full border-2 border-[#06070A] ${status.pulse ? "status-pulse-" + member.status : ""}`}
          style={{ backgroundColor: status.color }}
        />
      </div>

      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
          style={{
            background: `linear-gradient(135deg, ${role.color}20, ${role.color}08)`,
            border: `1px solid ${role.color}30`,
            color: role.color,
          }}
        >
          {member.initials}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white truncate">{member.name}</h3>
          <p className="text-xs text-[#6B7290] truncate">{member.email}</p>
        </div>
      </div>

      {/* Role & Dept */}
      <div className="flex items-center gap-2 mt-3">
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
          style={{ backgroundColor: role.bg, color: role.color }}
        >
          <RoleIcon className="w-3 h-3" />
          {member.role}
        </span>
        <span className="text-[10px] text-[#4A5068] bg-white/[0.03] px-2 py-0.5 rounded-full">
          {member.department}
        </span>
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
        <div className="flex items-center gap-1 text-[10px] text-[#4A5068]">
          <Clock className="w-3 h-3" />
          {member.lastActive}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-[#4A5068]">
          <CheckCircle2 className="w-3 h-3" />
          {member.tasksCompleted} tasks
        </div>
      </div>
    </GlassCard>
  );
}
