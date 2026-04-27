"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Bot,
  MessageSquare,
  KanbanSquare,
  CheckCircle,
  BarChart3,
  Settings,
  Zap,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  GitBranch,
  FlaskConical,
  ShoppingBag,
  Building2,
  CreditCard,
  Shield,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/lib/stores/workspace-store";

const navItems = [
  { icon: LayoutDashboard, label: "Command Center", href: "/" },
  { icon: Users, label: "Staff Directory", href: "/staff" },
  { icon: MessageSquare, label: "Communications", href: "/comms" },
  { icon: Bot, label: "Agent Forge", href: "/agents" },
  { icon: KanbanSquare, label: "Operations", href: "/operations" },
  { icon: CheckCircle, label: "Approvals", href: "/approvals" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: GitBranch, label: "Swarm Canvas", href: "/swarm" },
  { icon: FlaskConical, label: "Simulator", href: "/simulator" },
  { icon: Sparkles, label: "Co-Pilot", href: "/copilot" },
  { icon: ShoppingBag, label: "Marketplace", href: "/marketplace" },
  { icon: Building2, label: "Team", href: "/team" },
  { icon: CreditCard, label: "Billing", href: "/billing" },
  { icon: Shield, label: "Audit Log", href: "/audit" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { mode, setMode } = useWorkspaceStore();

  return (
    <motion.aside
      className={cn(
        "flex flex-col bg-[#0A0B10] border-r border-white/[0.06] shrink-0 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#B829DD] flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-lg text-gradient"
            >
              FuseIQ
            </motion.span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1 rounded-md hover:bg-white/5 text-[#6B7290] hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1 scrollbar-hide">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 group relative",
                isActive
                  ? "bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20"
                  : "text-[#6B7290] hover:text-white hover:bg-white/5"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={cn("w-4 h-4 shrink-0", isActive && "text-[#00D4FF]")} />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
              {isActive && !collapsed && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#00D4FF] rounded-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Mode Toggle */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className={cn(
          "flex rounded-lg bg-[#0F111A] border border-white/[0.06] p-1",
          collapsed && "flex-col"
        )}>
          {(["AI", "Human", "Hybrid"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-all",
                mode === m
                  ? m === "AI"
                    ? "bg-[#00D4FF]/15 text-[#00D4FF]"
                    : m === "Human"
                    ? "bg-[#FF6B35]/15 text-[#FF6B35]"
                    : "bg-[#B829DD]/15 text-[#B829DD]"
                  : "text-[#4A5068] hover:text-[#6B7290]"
              )}
              title={m}
            >
              <div className={cn(
                "w-1.5 h-1.5 rounded-full",
                m === "AI" && "bg-[#00D4FF]",
                m === "Human" && "bg-[#FF6B35]",
                m === "Hybrid" && "bg-[#B829DD]"
              )} />
              {!collapsed && m}
            </button>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}
