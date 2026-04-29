"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const kpiCardVariants = cva(
  "relative overflow-hidden rounded-2xl border p-6 transition-all duration-300",
  {
    variants: {
      variant: {
        default: "glass-card",
        elevated: "glass-elevated",
        holographic: "holo-card",
      },
      glow: {
        none: "",
        cyan: "glow-cyan-strong",
        purple: "glow-purple-strong",
        signal: "glow-signal",
        ember: "glow-ember",
      },
    },
    defaultVariants: {
      variant: "default",
      glow: "none",
    },
  }
);

interface KPICardProps extends VariantProps<typeof kpiCardVariants> {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  trendLabel?: string;
  icon: React.ReactNode;
  iconColor?: string;
  className?: string;
  delay?: number;
}

export function KPICard({
  title,
  value,
  subtitle,
  trend,
  trendLabel,
  icon,
  iconColor = "#00D4FF",
  variant,
  glow,
  className,
  delay = 0,
}: KPICardProps) {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(kpiCardVariants({ variant, glow }), className)}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: `${iconColor}15` }}
      >
        <div style={{ color: iconColor }}>{icon}</div>
      </div>

      {/* Value */}
      <div className="space-y-1">
        <p className="text-sm text-[#6B7290] font-medium">{title}</p>
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        {subtitle && <p className="text-xs text-[#4A5068]">{subtitle}</p>}
      </div>

      {/* Trend */}
      {trend !== undefined && (
        <div className="mt-4 flex items-center gap-2">
          <span
            className={cn(
              "text-xs font-medium px-2 py-1 rounded-lg",
              isPositive && "bg-[#00E5A0]/10 text-[#00E5A0]",
              isNegative && "bg-[#FF4757]/10 text-[#FF4757]",
              !isPositive && !isNegative && "bg-[#4A5068]/10 text-[#4A5068]"
            )}
          >
            {isPositive ? "+" : ""}
            {trend}%
          </span>
          {trendLabel && (
            <span className="text-xs text-[#4A5068]">{trendLabel}</span>
          )}
        </div>
      )}

      {/* Shimmer effect for holographic */}
      {variant === "holographic" && (
        <div className="absolute inset-0 glass-shimmer pointer-events-none" />
      )}
    </motion.div>
  );
}
