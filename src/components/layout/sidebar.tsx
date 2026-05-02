"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Bot,
  MessageSquare,
  KanbanSquare,
  CheckCircle,
  BarChart3,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  GitBranch,
  FlaskConical,
  Building2,
  CreditCard,
  Settings,
  Hash,
  Bell,
  ShoppingBag,
} from "lucide-react";
import { LogoIcon } from "@/components/logo";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/lib/stores/workspace-store";

/* ── Navigation Schema ────────────────────────────── */

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  badge?: number | null;
  dot?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    title: "Platform",
    items: [
      { icon: LayoutDashboard, label: "Command Center", href: "/" },
      { icon: Users, label: "Staff Directory", href: "/staff" },
      { icon: Bot, label: "Agent Forge", href: "/agents" },
      { icon: KanbanSquare, label: "Operations", href: "/operations" },
      { icon: CheckCircle, label: "Approvals", href: "/approvals", badge: 3 },
      { icon: BarChart3, label: "Analytics", href: "/analytics" },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { icon: GitBranch, label: "Swarm Canvas", href: "/swarm" },
      { icon: FlaskConical, label: "Simulator", href: "/simulator" },
      { icon: Sparkles, label: "Co-Pilot", href: "/copilot" },
    ],
  },
  {
    title: "Discover",
    items: [
      { icon: ShoppingBag, label: "Marketplace", href: "/marketplace" },
    ],
  },
  {
    title: "Communications",
    items: [
      { icon: MessageSquare, label: "Communications Hub", href: "/comms", dot: true },
    ],
  },
  {
    title: "Workspace",
    items: [
      { icon: Building2, label: "Team", href: "/team" },
      { icon: CreditCard, label: "Billing", href: "/billing" },
      { icon: Settings, label: "Settings", href: "/settings" },
    ],
  },
];

const commSubItems = [
  { label: "All Team", href: "/comms?channel=general", icon: Hash },
  { label: "All Agents", href: "/comms?channel=agent-commands", icon: Hash },
  { label: "Agent Commands", href: "/comms?channel=operations", icon: Hash },
];

/* ── Component ────────────────────────────────────── */

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
          <LogoIcon size="md" />
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
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-5 scrollbar-hide">
        {sections.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#4A5068]">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 group relative",
                        isActive
                          ? "text-[#D4AF37] border-l-[3px] border-l-[#D4AF37] bg-[#D4AF37]/5"
                          : "text-[#6B7290] hover:text-white hover:bg-white/5 border-l-[3px] border-l-transparent"
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <item.icon
                        className={cn(
                          "w-4 h-4 shrink-0",
                          isActive && "text-[#D4AF37]"
                        )}
                      />
                      {!collapsed && (
                        <span className="truncate flex-1">{item.label}</span>
                      )}
                      {/* Badge */}
                      {!collapsed && item.badge != null && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#FF4757] text-white font-bold min-w-[18px] text-center">
                          {item.badge}
                        </span>
                      )}
                      {/* Dot */}
                      {!collapsed && item.dot && (
                        <span className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
                      )}
                    </Link>

                    {/* Communications sub-items */}
                    {item.href === "/comms" && !collapsed && isActive && (
                      <div className="ml-6 mt-0.5 space-y-0.5">
                        {commSubItems.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs text-[#6B7290] hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <sub.icon className="w-3 h-3 text-[#4A5068]" />
                            <span>{sub.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Mode Toggle */}
      <div className="p-3 border-t border-white/[0.06]">
        <div
          className={cn(
            "flex rounded-lg bg-[#0F111A] border border-white/[0.06] p-1",
            collapsed && "flex-col"
          )}
        >
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
              <div
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  m === "AI" && "bg-[#00D4FF]",
                  m === "Human" && "bg-[#FF6B35]",
                  m === "Hybrid" && "bg-[#B829DD]"
                )}
              />
              {!collapsed && m}
            </button>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}
