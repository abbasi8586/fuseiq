"use client";

import { motion } from "framer-motion";
import { Users, Search, Filter, Mail, Shield, UserCheck, UserCog, Eye, ChevronDown } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MemberCard } from "@/components/team/member-card";
import { useState, useMemo } from "react";

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

const mockMembers: TeamMember[] = [
  { id: "1", name: "Elena Rodriguez", email: "elena@fuseiq.io", role: "Director", department: "Design", status: "online", avatar: "", initials: "ER", lastActive: "Now", tasksCompleted: 47, joinDate: "2024-01-15" },
  { id: "2", name: "Marcus Chen", email: "marcus@fuseiq.io", role: "Manager", department: "Engineering", status: "busy", avatar: "", initials: "MC", lastActive: "2m ago", tasksCompleted: 32, joinDate: "2024-02-01" },
  { id: "3", name: "Sarah Kim", email: "sarah@fuseiq.io", role: "Member", department: "Product", status: "online", avatar: "", initials: "SK", lastActive: "Now", tasksCompleted: 28, joinDate: "2024-03-10" },
  { id: "4", name: "Dr. James Wilson", email: "james@fuseiq.io", role: "Director", department: "Security", status: "away", avatar: "", initials: "JW", lastActive: "15m ago", tasksCompleted: 19, joinDate: "2024-01-20" },
  { id: "5", name: "Mike Thompson", email: "mike@fuseiq.io", role: "Member", department: "Engineering", status: "offline", avatar: "", initials: "MT", lastActive: "2h ago", tasksCompleted: 35, joinDate: "2024-02-15" },
  { id: "6", name: "Agent Forge", email: "forge@fuseiq.io", role: "Manager", department: "AI", status: "online", avatar: "", initials: "AF", lastActive: "Now", tasksCompleted: 156, joinDate: "2024-01-01" },
  { id: "7", name: "CodeReview AI", email: "codereview@fuseiq.io", role: "Member", department: "Engineering", status: "online", avatar: "", initials: "CR", lastActive: "Now", tasksCompleted: 89, joinDate: "2024-01-01" },
  { id: "8", name: "ContentForge", email: "content@fuseiq.io", role: "Viewer", department: "Marketing", status: "offline", avatar: "", initials: "CF", lastActive: "5h ago", tasksCompleted: 12, joinDate: "2024-04-01" },
  { id: "9", name: "Priya Patel", email: "priya@fuseiq.io", role: "Member", department: "Product", status: "busy", avatar: "", initials: "PP", lastActive: "5m ago", tasksCompleted: 21, joinDate: "2024-03-20" },
  { id: "10", name: "David Okonkwo", email: "david@fuseiq.io", role: "Manager", department: "Operations", status: "online", avatar: "", initials: "DO", lastActive: "Now", tasksCompleted: 44, joinDate: "2024-02-28" },
];

const departments = ["All", "Design", "Engineering", "Product", "Security", "AI", "Marketing", "Operations"];
const roles = ["All", "Director", "Manager", "Member", "Viewer"];

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

export default function TeamPage() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [showInvite, setShowInvite] = useState(false);

  const filtered = useMemo(() => {
    return mockMembers.filter((m) => {
      const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter === "All" || m.department === deptFilter;
      const matchRole = roleFilter === "All" || m.role === roleFilter;
      return matchSearch && matchDept && matchRole;
    });
  }, [search, deptFilter, roleFilter]);

  const stats = {
    total: mockMembers.length,
    online: mockMembers.filter((m) => m.status === "online").length,
    directors: mockMembers.filter((m) => m.role === "Director").length,
    thisMonth: 3,
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-[#00D4FF]" />
            Team Management
          </h1>
          <p className="text-sm text-[#6B7290] mt-1">Manage workspace members, roles, and permissions</p>
        </div>
        <Button variant="neon" onClick={() => setShowInvite(true)}>
          <Mail className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Members", value: stats.total, color: "#00D4FF" },
          { label: "Online Now", value: stats.online, color: "#00E5A0" },
          { label: "Directors", value: stats.directors, color: "#B829DD" },
          { label: "New This Month", value: stats.thisMonth, color: "#FFC857" },
        ].map((stat) => (
          <GlassCard key={stat.label} className="p-4">
            <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs text-[#6B7290] mt-1">{stat.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5068]" />
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-lg glass-input text-sm text-white placeholder:text-[#4A5068]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#4A5068]" />
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="h-9 px-3 rounded-lg glass-input text-sm text-white bg-transparent"
          >
            {departments.map((d) => (
              <option key={d} value={d} className="bg-[#0F111A]">{d === "All" ? "All Depts" : d}</option>
            ))}
          </select>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-9 px-3 rounded-lg glass-input text-sm text-white bg-transparent"
          >
            {roles.map((r) => (
              <option key={r} value={r} className="bg-[#0F111A]">{r === "All" ? "All Roles" : r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <MemberCard member={member} statusConfig={statusConfig} roleConfig={roleConfig} />
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <GlassCard className="p-8 text-center">
          <Users className="w-8 h-8 text-[#4A5068] mx-auto mb-3" />
          <p className="text-sm text-[#6B7290]">No members match your filters</p>
        </GlassCard>
      )}

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowInvite(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <GlassCard elevated className="p-6">
              <h3 className="text-lg font-bold text-white mb-1">Invite Team Member</h3>
              <p className="text-xs text-[#6B7290] mb-4">Send an invitation to join your workspace</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-[#6B7290] mb-1 block">Email Address</label>
                  <input type="email" placeholder="colleague@company.com" className="w-full h-9 px-3 rounded-lg glass-input text-sm text-white placeholder:text-[#4A5068]" />
                </div>
                <div>
                  <label className="text-xs text-[#6B7290] mb-1 block">Role</label>
                  <select className="w-full h-9 px-3 rounded-lg glass-input text-sm text-white bg-transparent">
                    {roles.filter((r) => r !== "All").map((r) => (
                      <option key={r} value={r} className="bg-[#0F111A]">{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#6B7290] mb-1 block">Department</label>
                  <select className="w-full h-9 px-3 rounded-lg glass-input text-sm text-white bg-transparent">
                    {departments.filter((d) => d !== "All").map((d) => (
                      <option key={d} value={d} className="bg-[#0F111A]">{d}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="flex-1" onClick={() => setShowInvite(false)}>Cancel</Button>
                <Button variant="neon" className="flex-1" onClick={() => setShowInvite(false)}>Send Invite</Button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
