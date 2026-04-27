"use client";

import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "cyan" | "purple" | "none";
}

export function GlassCard({ children, className, hover = false, glow = "none" }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card p-5",
        hover && "transition-all duration-300 hover:glass-card-hover",
        glow === "cyan" && "glow-cyan",
        glow === "purple" && "glow-purple",
        className
      )}
    >
      {children}
    </div>
  );
}
