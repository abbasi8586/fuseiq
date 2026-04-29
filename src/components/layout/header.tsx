"use client";

import { useState } from "react";
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
  const [notifications] = useState(3);
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };

  const userInitials = user?.email?.charAt(0).toUpperCase() || "U";
  const userEmail = user?.email || "Guest";
  const userName = user?.user_metadata?.full_name || userEmail.split("@")[0] || "User";

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
          className="hidden md:flex items-center gap-2 text-[#00D4FF] hover:bg-[#00D4FF]/10 border border-[#00D4FF]/20 hover:border-[#00D4FF]/40"
        >
          <span className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
          Co-Pilot
        </Button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-white/5 text-[#6B7290] hover:text-white transition-colors">
          <Bell className="w-4 h-4" />
          {notifications > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#FF4757] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {notifications}
            </span>
          )}
        </button>

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
              <p className="text-xs text-[#6B7290]">Director · Abbasi Global LTD</p>
            </div>
            <DropdownMenuItem className="text-[#B8BED8] focus:text-white focus:bg-white/5">
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#B8BED8] focus:text-white focus:bg-white/5">
              <CreditCard className="w-4 h-4 mr-2" />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#B8BED8] focus:text-white focus:bg-white/5">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/[0.06]" />
            <DropdownMenuItem 
              className="text-[#FF4757] focus:text-[#FF4757] focus:bg-[#FF4757]/10"
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
