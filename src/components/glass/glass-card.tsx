"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "cyan" | "purple" | "signal" | "ember" | "none";
  holographic?: boolean;
  elevated?: boolean;
  perspective?: boolean;
  onClick?: () => void;
}

export function GlassCard({ 
  children, 
  className, 
  hover = false, 
  glow = "none",
  holographic = false,
  elevated = false,
  perspective = false,
  onClick 
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { 
        y: -4,
        scale: 1.01,
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
      } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={cn(
        elevated ? "glass-elevated" : holographic ? "holo-card" : "glass-card",
        "p-5",
        hover && !elevated && !holographic && "transition-all duration-300 hover:glass-card-hover",
        hover && elevated && "tilt-card",
        hover && holographic && "perspective-card",
        glow === "cyan" && "glow-cyan",
        glow === "purple" && "glow-purple",
        glow === "signal" && "glow-signal",
        glow === "ember" && "glow-ember",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
