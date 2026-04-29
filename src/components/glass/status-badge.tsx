"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { Agent } from "@/types";

interface StatusBadgeProps {
  type: Agent["type"];
  framework?: string;
  status?: string;
}

export function StatusBadge({ type, framework, status }: StatusBadgeProps) {
  const isAI = type === "AI";
  const color = isAI ? "#00D4FF" : "#FF6B35";
  
  // Status-based pulse effect
  const pulseClass = status === "online" ? "status-pulse-online" : 
                     status === "busy" ? "status-pulse-busy" : 
                     status === "away" ? "status-pulse-away" : "";

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-medium rounded-full",
        "border backdrop-blur-sm"
      )}
      style={{
        backgroundColor: `${color}12`,
        color,
        borderColor: `${color}30`,
        boxShadow: `0 0 10px ${color}15`,
      }}
    >
      <span 
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          pulseClass
        )} 
        style={{ backgroundColor: color }} 
      />
      {framework || type}
    </motion.span>
  );
}

// Enhanced status dot with neon ring for avatars
interface StatusDotProps {
  status: string;
  size?: "sm" | "md" | "lg";
}

export function StatusDot({ status, size = "md" }: StatusDotProps) {
  const sizeClasses = {
    sm: "w-2.5 h-2.5",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  const pulseSizes = {
    sm: "inset-[-3px]",
    md: "inset-[-6px]",
    lg: "inset-[-8px]",
  };

  const colorMap: Record<string, string> = {
    online: "#00E5A0",
    busy: "#FF6B35", 
    away: "#FFC857",
    offline: "#FF4757",
    paused: "#4A5068",
  };

  const color = colorMap[status] || "#4A5068";

  return (
    <div className={cn("relative", sizeClasses[size])}>
      <motion.div
        className={cn("absolute rounded-full", pulseSizes[size])}
        style={{ backgroundColor: `${color}40` }}
        animate={{
          scale: [1, 1.8, 1],
          opacity: [0.6, 0, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div 
        className={cn(
          "rounded-full border-2 border-[#06070A] relative z-10",
          sizeClasses[size]
        )}
        style={{ backgroundColor: color }}
      />
    </div>
  );
}
