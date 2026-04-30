"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Bell,
  Command,
  User,
  Settings,
  LogOut,
  CreditCard,
  ChevronDown,
  Loader2,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Agent deployment complete", message: "MarketingBot is now online", time: "2m ago", read: false, type: "success" },
    { id: 2, title: "High-risk approval required", message: "SalesScout wants to send $5K campaign", time: "15m ago", read: false, type: "warning" },
    { id: 3, title: "Daily cost threshold", message: "You've used 78% of your daily budget", time: "1h ago", read: true, type: "info" },
  ]);
  const [notifOpen, setNotifOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };

  const handleOpenCopilot = () => {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const userInitials = user?.email?.charAt(0).toUpperCase() || "G";
  const userEmail = user?.email || "Guest";
  const userName = user?.user_metadata?.full_name || userEmail.split("@")[0] || "Guest";

  return (
    <header className="h-14 glass-panel flex items-center px-4 justify-between shrink-0 z-50">
      {/* Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5068]" />
          <Input
            placeholder="Search agents, tasks, commands..."
            className="pl-9 h-9 bg-white/[0.03] border-white/[0.06] text-sm text-[#B8BED8] placeholder:text-[#4A5068] focus:border-[#00D4FF]/50 focus:ring-[#00D4FF]/20"
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setSearchOpen(false)}
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] text-[#4A5068] bg-white/[0.05] rounded border border-white/[0.06]">
            <Command className="w-3 h-3" /> K
          </kbd>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Co-Pilot Trigger */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleOpenCopilot}
          className="hidden md:flex items-center gap-2 text-[#00D4FF] hover:bg-[#00D4FF]/10 border border-[#00D4FF]/20 hover:border-[#00D4FF]/40"
        >
          <span className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
          Co-Pilot
        </Button>

        {/* Notifications */}
        <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
          <DropdownMenuTrigger>
            <button className="relative p-2 rounded-lg hover:bg-white/5 text-[#6B7290] hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#FF4757] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 glass-card border-white/[0.08] p-0"
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
              <p className="text-sm font-medium text-white">Notifications</p>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-[#00D4FF] hover:text-[#00D4FF]/80"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-3 py-6 text-center text-[#6B7290] text-sm">
                  No notifications
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-3 px-3 py-2.5 hover:bg-white/[0.03] cursor-pointer border-l-2 transition-colors ${
                      notif.read ? "border-transparent" : "border-[#00D4FF]"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        backgroundColor:
                          notif.type === "success"
                            ? "#00E5A015"
                            : notif.type === "warning"
                            ? "#FFC85715"
                            : "#00D4FF15",
                      }}
                    >
                      {notif.type === "success" ? (
                        <CheckCircle className="w-4 h-4 text-[#00E5A0]" />
                      ) : notif.type === "warning" ? (
                        <AlertTriangle className="w-4 h-4 text-[#FFC857]" />
                      ) : (
                        <MessageSquare className="w-4 h-4 text-[#00D4FF]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium">{notif.title}</p>
                      <p className="text-xs text-[#6B7290] mt-0.5">{notif.message}</p>
                      <p className="text-[10px] text-[#4A5068] mt-1">{notif.time}</p>
                    </div>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#00D4FF] shrink-0 mt-2" />
                    )}
                  </div>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#B829DD] flex items-center justify-center">
                <span className="text-xs font-bold text-white">{userInitials}</span>
              </div>
              <ChevronDown className="w-3 h-3 text-[#4A5068]" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 glass-card border-white/[0.08]"
          >
            <div className="px-3 py-2 border-b border-white/[0.06]">
              <p className="text-sm font-medium text-white">{userName}</p>
              <p className="text-xs text-[#6B7290]">{userEmail}</p>
            </div>
            <DropdownMenuItem
              className="text-[#B8BED8] focus:text-white focus:bg-white/5 cursor-pointer"
              onClick={() => router.push("/settings")}
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-[#B8BED8] focus:text-white focus:bg-white/5 cursor-pointer"
              onClick={() => router.push("/billing")}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-[#B8BED8] focus:text-white focus:bg-white/5 cursor-pointer"
              onClick={() => router.push("/settings")}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/[0.06]" />
            <DropdownMenuItem
              className="text-[#FF4757] focus:text-[#FF4757] focus:bg-[#FF4757]/10 cursor-pointer"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
