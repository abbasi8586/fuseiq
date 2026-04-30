"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Search,
  Mail,
  Shield,
  Crown,
  Bot,
  User,
  MoreHorizontal,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const roles = [
  { id: "Director", label: "Director", color: "#B829DD", icon: Crown },
  { id: "Manager", label: "Manager", color: "#00D4FF", icon: Shield },
  { id: "Member", label: "Member", color: "#00E5A0", icon: User },
  { id: "Agent", label: "Agent", color: "#FF6B35", icon: Bot },
];

const defaultMembers = [
  {
    id: "1",
    name: "Awais Abbasi",
    email: "awais@abbasi.global",
    role: "Director",
    type: "Human",
    status: "online",
    department: "Executive",
    lastActive: "2 min ago",
    efficiency: 98,
  },
  {
    id: "2",
    name: "Rook AI",
    email: "rook@fuseiq.ai",
    role: "Agent",
    type: "AI",
    status: "online",
    department: "Engineering",
    lastActive: "Active now",
    efficiency: 99,
  },
  {
    id: "3",
    name: "Sarah Chen",
    email: "sarah@abbasi.global",
    role: "Manager",
    type: "Human",
    status: "away",
    department: "Marketing",
    lastActive: "1 hr ago",
    efficiency: 92,
  },
  {
    id: "4",
    name: "MarketingBot Pro",
    email: "marketing@fuseiq.ai",
    role: "Agent",
    type: "AI",
    status: "busy",
    department: "Marketing",
    lastActive: "Active now",
    efficiency: 94,
  },
  {
    id: "5",
    name: "SupportAI",
    email: "support@fuseiq.ai",
    role: "Agent",
    type: "AI",
    status: "online",
    department: "Support",
    lastActive: "Active now",
    efficiency: 96,
  },
  {
    id: "6",
    name: "CodeReview Bot",
    email: "code@fuseiq.ai",
    role: "Agent",
    type: "AI",
    status: "busy",
    department: "Engineering",
    lastActive: "Active now",
    efficiency: 92,
  },
];

export default function TeamPage() {
  const [members, setMembers] = useState(defaultMembers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");
  const [sending, setSending] = useState(false);

  const handleInvite = () => {
    if (!inviteEmail.trim()) {
      toast.error("Email is required");
      return;
    }
    setSending(true);
    setTimeout(() => {
      const newMember = {
        id: crypto.randomUUID(),
        name: inviteEmail.split("@")[0],
        email: inviteEmail,
        role: inviteRole,
        type: "Human",
        status: "offline",
        department: "Unassigned",
        lastActive: "Never",
        efficiency: 0,
      };
      setMembers((prev) => [...prev, newMember]);
      toast.success(`Invite sent to ${inviteEmail}`);
      setInviteOpen(false);
      setInviteEmail("");
      setSending(false);
    }, 1000);
  };

  const filteredMembers = members.filter((m) => {
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter !== "all" && m.role !== roleFilter) return false;
    return true;
  });

  const getRoleConfig = (role: string) => roles.find((r) => r.id === role) || roles[2];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-[#00D4FF]" />
            Team
          </h1>
          <p className="text-sm text-[#6B7290] mt-1">
            Manage team members and AI agents
          </p>
        </div>
        <Button
          onClick={() => setInviteOpen(true)}
          className="neon-button border-0 bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#06070A]"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5068]" />
          <Input
            placeholder="Search team..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-8 w-48 bg-white/[0.03] border-white/[0.06] text-sm text-white placeholder:text-[#4A5068]"
          />
        </div>
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => setRoleFilter(roleFilter === role.id ? "all" : role.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              roleFilter === role.id
                ? "bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20"
                : "text-[#6B7290] hover:text-white border border-white/[0.06]"
            }`}
          >
            {role.label}
          </button>
        ))}
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => {
          const roleConfig = getRoleConfig(member.role);
          const RoleIcon = roleConfig.icon;
          return (
            <motion.div
              key={member.id}
              whileHover={{ y: -2, scale: 1.01 }}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-[#00D4FF]/20 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      member.type === "AI"
                        ? "bg-gradient-to-br from-[#00D4FF] to-[#B829DD]"
                        : "bg-gradient-to-br from-[#00E5A0] to-[#00D4FF]"
                    }`}
                  >
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{member.name}</p>
                    <p className="text-xs text-[#6B7290]">{member.email}</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] h-5"
                  style={{
                    borderColor: `${roleConfig.color}40`,
                    color: roleConfig.color,
                    backgroundColor: `${roleConfig.color}10`,
                  }}
                >
                  <RoleIcon className="w-3 h-3 mr-1" />
                  {member.role}
                </Badge>
              </div>

              <div className="space-y-2 text-xs text-[#6B7290]">
                <div className="flex items-center justify-between">
                  <span>Department</span>
                  <span className="text-white">{member.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Type</span>
                  <span className={member.type === "AI" ? "text-[#00D4FF]" : "text-[#00E5A0]"}>
                    {member.type}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  <span className="flex items-center gap-1">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor:
                          member.status === "online"
                            ? "#00E5A0"
                            : member.status === "busy"
                            ? "#FF6B35"
                            : "#FFC857",
                      }}
                    />
                    {member.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last Active</span>
                  <span className="text-white">{member.lastActive}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Efficiency</span>
                  <span className="text-[#00E5A0]">{member.efficiency}%</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Invite Dialog */}
      {inviteOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setInviteOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0B0D14] border border-white/[0.08] rounded-xl p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#00D4FF]" />
              Invite Team Member
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#6B7290] mb-1.5 block">Email</label>
                <Input
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="bg-white/[0.03] border-white/[0.06] text-white placeholder:text-[#4A5068]"
                />
              </div>
              <div>
                <label className="text-xs text-[#6B7290] mb-1.5 block">Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {roles.filter((r) => r.id !== "Agent").map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setInviteRole(role.id)}
                      className={`p-2 rounded-lg border text-xs transition-all ${
                        inviteRole === role.id
                          ? "border-[#00D4FF]/40 bg-[#00D4FF]/10 text-[#00D4FF]"
                          : "border-white/[0.06] bg-white/[0.02] text-[#6B7290]"
                      }`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInviteOpen(false)}
                  className="border-white/[0.08] text-[#6B7290]"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleInvite}
                  disabled={sending}
                  className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#06070A]"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Invite
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
