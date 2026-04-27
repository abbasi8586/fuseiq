"use client";

import { motion } from "framer-motion";
import { DollarSign, ArrowUpRight } from "lucide-react";
import { GlassCard } from "./glass-card";

interface CostTickerProps {
  dailyTotal: number;
  providerBreakdown: { provider: string; cost: number; percentage: number }[];
}

export function CostTicker({ dailyTotal, providerBreakdown }: CostTickerProps) {
  return (
    <GlassCard glow="cyan">
      <div className="flex items-center gap-2 mb-3">
        <DollarSign className="w-4 h-4 text-[#00D4FF]" />
        <h3 className="text-sm font-semibold text-white">Cost Tracker</h3>
        <span className="ml-auto text-xs text-[#00E5A0]">Live</span>
      </div>
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-2xl font-bold text-white">${dailyTotal.toFixed(2)}</span>
        <span className="text-xs text-[#6B7290]">today</span>
      </div>
      <div className="space-y-2">
        {providerBreakdown.map((item) => (
          <div key={item.provider} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#B8BED8]">{item.provider}</span>
              <span className="text-[#6B7290]">${item.cost.toFixed(2)}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.06]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(to right, #00D4FF, #B829DD)`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-xs text-[#4A5068]">Monthly estimate</span>
        <span className="text-sm font-medium text-[#00D4FF]">~$374</span>
      </div>
    </GlassCard>
  );
}
