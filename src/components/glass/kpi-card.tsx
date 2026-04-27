"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import { GlassCard } from "./glass-card";

interface KPICardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  trend: number;
  color: string;
  subtitle?: string;
  isPercentage?: boolean;
  isCurrency?: boolean;
}

export function KPICard({ label, value, icon: Icon, trend, color, subtitle, isPercentage, isCurrency }: KPICardProps) {
  const isPositive = trend >= 0;
  const formattedValue = isCurrency
    ? `$${value.toFixed(3)}`
    : isPercentage
    ? `${value.toFixed(1)}%`
    : value.toLocaleString();

  return (
    <GlassCard hover>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <span className="text-xs font-medium text-[#6B7290]">{label}</span>
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-medium ${
            isPositive ? "text-[#00E5A0]" : "text-[#FF4757]"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {isPositive ? "+" : ""}
          {trend}%
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-3"
      >
        <span className="text-3xl font-bold text-white" style={{ fontFamily: "Inter, sans-serif" }}>
          {formattedValue}
        </span>
      </motion.div>
      {subtitle && <p className="mt-1 text-xs text-[#4A5068]">{subtitle}</p>}
    </GlassCard>
  );
}
