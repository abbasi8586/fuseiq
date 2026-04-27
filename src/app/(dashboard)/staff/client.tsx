"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Grid,
  List,
  Clock,
  Sun,
  Moon,
} from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { StatusBadge } from "@/components/glass/status-badge";
import { ProgressBar } from "@/components/glass/progress-bar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { StaffMember } from "@/types";

const departments = ["All", "Engineering", "Product", "Marketing", "Data", "Support", "Design", "Sales", "Finance"];

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
  show: { opacity: 1, transition: { staggerChildren: 0.03 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

interface Props {
  initialStaff: StaffMember[];
}

export function StaffDirectoryClient({ initialStaff }: Props) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredStaff = initialStaff.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === "All" || member.department === selectedDept;
    const matchesStatus = statusFilter === "all" || member.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-[#00D4FF]" />
            Staff Directory
          </h1>
          <p className="text-sm text-[#6B7290] mt-1">
            {initialStaff.length} members · {initialStaff.filter((s) => s.type === "AI").length} AI · {initialStaff.filter((s) => s.type === "Human").length} Human
          </p>
        </div>
        <Button className="neon-button border-0">
          <Users className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Filters */}
      <GlassCard>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5068]" />
            <Input
              placeholder="Search by name, role, department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-white/[0.03] border-white/[0.06] text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg bg-[#0F111A] border border-white/[0.06] p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-white/10 text-white" : "text-[#4A5068] hover:text-[#6B7290]"}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-white/10 text-white" : "text-[#4A5068] hover:text-[#6B7290]"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Department Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                selectedDept === dept
                  ? "bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/30"
                  : "bg-white/[0.03] text-[#6B7290] border border-white/[0.06] hover:text-white hover:bg-white/5"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Staff Grid/List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-2"}
      >
        {filteredStaff.map((member) => (
          <motion.div key={member.id} variants={itemVariants}>
            <GlassCard hover className="h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#B829DD] flex items-center justify-center text-white font-bold text-lg">
                    {member.name.charAt(0)}
                  </div>
                  <div
                    className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#161925]"
                    style={{
                      backgroundColor:
                        member.status === "online" ? "#00E5A0" :
                        member.status === "busy" ? "#FF6B35" :
                        member.status === "away" ? "#FFC857" : "#FF4757"
                    }}
                  />
                </div>
                <StatusBadge type={member.type} framework={member.provider || member.type} />
              </div>

              <h3 className="text-base font-semibold text-white">{member.name}</h3>
              <p className="text-sm text-[#6B7290]">{member.role}</p>
              <p className="text-xs text-[#4A5068] mt-0.5">{member.department}</p>

              <div className="mt-3 flex items-center gap-2 text-xs text-[#6B7290]">
                <Clock className="w-3 h-3" />
                <span>{getLocalTime(member.timezone)}</span>
                {isWithinWorkHours(member.timezone) ? (
                  <Sun className="w-3 h-3 text-[#FFC857]" />
                ) : (
                  <Moon className="w-3 h-3 text-[#4A5068]" />
                )}
                <span className="text-[#4A5068]">·</span>
                <span>{member.timezone.split("/").pop()?.replace("_", " ")}</span>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#6B7290]">Efficiency</span>
                  <span className="text-[#00E5A0] font-medium">{member.efficiency}%</span>
                </div>
                <ProgressBar value={member.efficiency} color="#00E5A0" />
              </div>

              {member.skills && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {member.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="px-2 py-0.5 text-[10px] rounded-full bg-white/[0.05] text-[#6B7290] border border-white/[0.06]">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
