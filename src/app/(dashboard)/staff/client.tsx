"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Grid,
  List,
  Clock,
  Sun,
  Moon,
  Sparkles,
  UserPlus,
  Bot,
  User,
  Hash,
} from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { StatusBadge, StatusDot } from "@/components/glass/status-badge";
import { ProgressBar } from "@/components/glass/progress-bar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRealtimeArray } from "@/hooks/useRealtime";
import type { StaffMember } from "@/types";

const departments = ["All", "Engineering", "Product", "Marketing", "Data", "Support", "Design", "Sales", "Finance"];

type TypeFilter = "AI" | "Human" | "Hybrid";

function getLocalTime(timezone: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date());
  } catch {
    return "--:--";
  }
}

function isWithinWorkHours(timezone: string) {
  const hour = new Date().toLocaleString("en-US", { timeZone: timezone, hour: "numeric", hour12: false });
  const h = parseInt(hour);
  return h >= 9 && h < 18;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
  },
};

interface Props {
  initialStaff: StaffMember[];
}

export function StaffDirectoryClient({ initialStaff }: Props) {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("Hybrid");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Real-time subscription for agents (staff updates)
  useRealtimeArray<any>("agents", {
    onInsert: (newAgent) => {
      const newMember: StaffMember = {
        id: newAgent.id,
        name: newAgent.name,
        role: newAgent.role || newAgent.framework || 'Agent',
        department: newAgent.department || 'Engineering',
        type: 'AI',
        provider: newAgent.framework || 'Kimi',
        status: newAgent.status || 'offline',
        timezone: newAgent.timezone || 'UTC',
        efficiency: newAgent.efficiency_score || 85,
        skills: [newAgent.framework || 'AI'],
        email: `${newAgent.name?.toLowerCase()?.replace(/\s+/g, '.')}@fuseiq.ai`,
      };
      setStaff((prev) => {
        if (prev.find((s) => s.id === newMember.id)) return prev;
        return [...prev, newMember];
      });
    },
    onUpdate: (updatedAgent) => {
      setStaff((prev) => prev.map((s) => {
        if (s.id !== updatedAgent.id) return s;
        return {
          ...s,
          name: updatedAgent.name || s.name,
          role: updatedAgent.role || updatedAgent.framework || s.role,
          department: updatedAgent.department || s.department,
          status: updatedAgent.status || s.status,
          efficiency: updatedAgent.efficiency_score || s.efficiency,
          timezone: updatedAgent.timezone || s.timezone,
        };
      }));
    },
    onDelete: (deletedId) => {
      setStaff((prev) => prev.filter((s) => s.id !== deletedId));
    },
    enableToasts: false,
  });

  // Apply all filters
  const filteredStaff = staff.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === "All" || member.department === selectedDept;
    const matchesStatus = statusFilter === "all" || member.status === statusFilter;
    const matchesType = typeFilter === "Hybrid" || member.type === typeFilter;
    return matchesSearch && matchesDept && matchesStatus && matchesType;
  });

  const aiCount = staff.filter((s) => s.type === "AI").length;
  const humanCount = staff.filter((s) => s.type === "Human").length;

  const typePills = [
    { key: "AI" as TypeFilter, label: "AI Agents", count: aiCount, icon: Bot },
    { key: "Human" as TypeFilter, label: "Human", count: humanCount, icon: User },
    { key: "Hybrid" as TypeFilter, label: "Hybrid", count: staff.length, icon: Hash },
  ];

  const getHeaderSubtitle = () => {
    if (typeFilter === "AI") return `Showing ${filteredStaff.length} AI agents`;
    if (typeFilter === "Human") return `Showing ${filteredStaff.length} human team members`;
    return `${staff.length} members · ${aiCount} AI · ${humanCount} Human`;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-white flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#B829DD] flex items-center justify-center shadow-lg shadow-[#00D4FF]/20">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-gradient">Staff Directory</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-[#6B7290] mt-2 ml-13"
          >
            {getHeaderSubtitle()}
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button variant="neon" size="sm" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Invite Member
          </Button>
        </motion.div>
      </div>

      {/* ── Type Filter: 3 Equal-Width Pills via Grid ─────────────── */}
      <div className="grid grid-cols-3 gap-2 p-2 rounded-2xl bg-[#0B0D14] border border-white/[0.06] w-full shadow-[0_0_20px_rgba(0,212,255,0.04)]">
        {typePills.map((pill) => {
          const isSelected = typeFilter === pill.key;
          const Icon = pill.icon;
          const theme: Record<TypeFilter, { glow: string; text: string; bg: string }> = {
            AI:    { glow: "shadow-[0_0_16px_rgba(0,212,255,0.25)] border-[#00D4FF]/40", text: "text-[#00D4FF]", bg: "bg-[#00D4FF]/10" },
            Human: { glow: "shadow-[0_0_16px_rgba(0,229,160,0.25)] border-[#00E5A0]/40", text: "text-[#00E5A0]", bg: "bg-[#00E5A0]/10" },
            Hybrid:{ glow: "shadow-[0_0_16px_rgba(184,41,221,0.25)] border-[#B829DD]/40", text: "text-[#B829DD]", bg: "bg-[#B829DD]/10" },
          };
          const t = theme[pill.key];
          return (
            <motion.button
              key={pill.key}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setTypeFilter(pill.key)}
              className={`relative flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 border ${
                isSelected
                  ? `${t.bg} ${t.text} ${t.glow} backdrop-blur-sm`
                  : "bg-transparent text-[#6B7290] border-transparent hover:text-[#B8BED8] hover:bg-white/[0.03]"
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${
                isSelected ? t.bg : "bg-white/[0.04]"
              }`}>
                <Icon className={`w-3.5 h-3.5 transition-colors duration-300 ${
                  isSelected ? t.text : "text-[#6B7290]"
                }`} />
              </div>
              <span>{pill.label}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all duration-300 ${
                isSelected ? "bg-white/[0.15] text-white" : "bg-white/[0.04] text-[#4A5068]"
              }`}>
                {pill.count}
              </span>
              {isSelected && (
                <motion.div
                  layoutId="staff-active-pill"
                  className="absolute inset-0 rounded-xl border border-inherit pointer-events-none"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Filters Bar */}
      <GlassCard elevated>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00D4FF]/60" />
            <Input
              placeholder="Search by name, role, department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-[#06070A]/50 border-[#00D4FF]/20 text-sm text-white placeholder:text-[#4A5068] focus:border-[#00D4FF]/50 focus:ring-[#00D4FF]/20"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-xl glass-subtle p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-300 ${viewMode === "grid"
                  ? "bg-[#00D4FF]/20 text-[#00D4FF] shadow-lg shadow-[#00D4FF]/10"
                  : "text-[#4A5068] hover:text-[#6B7290]"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-300 ${viewMode === "list"
                  ? "bg-[#00D4FF]/20 text-[#00D4FF] shadow-lg shadow-[#00D4FF]/10"
                  : "text-[#4A5068] hover:text-[#6B7290]"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Department Filters */}
        <div className="flex flex-wrap gap-2 mt-5">
          {departments.map((dept, i) => (
            <motion.button
              key={dept}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.03 }}
              onClick={() => setSelectedDept(dept)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all duration-300 ${
                selectedDept === dept
                  ? "bg-gradient-to-r from-[#00D4FF]/20 to-[#B829DD]/20 text-[#00D4FF] border border-[#00D4FF]/40 shadow-lg shadow-[#00D4FF]/10"
                  : "bg-[#06070A]/50 text-[#6B7290] border border-[#00D4FF]/10 hover:border-[#00D4FF]/25 hover:text-[#B8BED8]"
              }`}
            >
              {dept}
            </motion.button>
          ))}
        </div>
      </GlassCard>

      {/* Empty State for Human filter */}
      <AnimatePresence mode="wait">
        {typeFilter === "Human" && filteredStaff.length === 0 && (
          <motion.div
            key="human-empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
              <UserPlus className="w-8 h-8 text-[#6B7290]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No human team members yet</h3>
            <p className="text-sm text-[#6B7290] mb-6 max-w-sm text-center">
              Your team is currently all AI agents. Invite human colleagues to collaborate alongside your AI workforce.
            </p>
            <Button className="neon-button-cyan">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Staff Grid/List — Full-Width Equal Grid */}
      {filteredStaff.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full"
              : "space-y-3"
          }
        >
          {filteredStaff.map((member, i) => (
            <motion.div
              key={member.id}
              variants={itemVariants}
              custom={i}
              layout
              className="h-full"
            >
              <GlassCard
                hover
                glow={member.isCEO ? "purple" : member.status === "online" ? "cyan" : member.status === "busy" ? "ember" : "none"}
                className={`h-full flex flex-col group ${member.isCEO ? 'border-[#00D4FF]/30 shadow-[0_0_30px_rgba(0,212,255,0.1)]' : ''}`}
              >
                {member.isCEO ? (
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00D4FF] via-[#00D4FF] to-[#B829DD] flex items-center justify-center text-white text-2xl shadow-[0_0_20px_rgba(0,212,255,0.4),0_0_40px_rgba(184,41,221,0.2)] border border-[#00D4FF]/30 relative overflow-hidden"
                      >
                        <span className="drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]">♛</span>
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-pulse" />
                      </motion.div>
                      <div className="absolute -bottom-1 -right-1">
                        <StatusDot status={member.status || "offline"} size="md" />
                      </div>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#00D4FF]/20 to-[#B829DD]/20 border border-[#00D4FF]/40 text-[10px] font-bold text-[#00D4FF] tracking-wider uppercase shadow-lg shadow-[#00D4FF]/10">
                      CEO
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg ${
                          member.type === "AI"
                            ? "bg-gradient-to-br from-[#00D4FF] to-[#B829DD] shadow-[#00D4FF]/20"
                            : "bg-gradient-to-br from-[#00E5A0] to-[#00D4FF] shadow-[#00E5A0]/20"
                        }`}
                      >
                        {member.name.charAt(0)}
                      </motion.div>
                      <div className="absolute -bottom-1 -right-1">
                        <StatusDot status={member.status || "offline"} size="md" />
                      </div>
                    </div>
                    <StatusBadge
                      type={member.type}
                      framework={member.provider || member.type}
                      status={member.status}
                    />
                  </div>
                )}

                <h3 className={`text-base font-semibold group-hover:text-gradient transition-all duration-300 ${member.isCEO ? 'text-gradient text-lg' : 'text-white'}`}>
                  {member.name}
                </h3>
                <p className={`text-sm ${member.isCEO ? 'text-[#00D4FF]' : 'text-[#6B7290]'} font-medium`}>{member.role}</p>
                <p className="text-xs text-[#4A5068] mt-1">{member.department}</p>

                <div className="mt-4 flex items-center gap-2 text-xs text-[#6B7290]">
                  <Clock className="w-3.5 h-3.5 text-[#00D4FF]/60" />
                  <span>{getLocalTime(member.timezone)}</span>
                  {isWithinWorkHours(member.timezone) ? (
                    <Sun className="w-3.5 h-3.5 text-[#FFC857]" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-[#4A5068]" />
                  )}
                  <span className="text-[#4A5068]">·</span>
                  <span>{member.timezone.split("/").pop()?.replace("_", " ")}</span>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-[#6B7290]">Efficiency</span>
                    <span
                      className="font-medium"
                      style={{
                        color: member.efficiency >= 90 ? "#00E5A0" :
                          member.efficiency >= 70 ? "#FFC857" : "#FF4757"
                      }}
                    >
                      {member.efficiency}%
                    </span>
                  </div>
                  <ProgressBar
                    value={member.efficiency}
                    color={member.efficiency >= 90 ? "#00E5A0" :
                      member.efficiency >= 70 ? "#FFC857" : "#FF4757"}
                    height={5}
                  />
                </div>

                {member.skills && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {member.skills.slice(0, 3).map((skill, j) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + j * 0.05 }}
                        className="px-2.5 py-1 text-[10px] rounded-lg bg-[#06070A]/60 text-[#6B7290] border border-[#00D4FF]/10 hover:border-[#00D4FF]/25 hover:text-[#B8BED8] transition-colors cursor-default"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
