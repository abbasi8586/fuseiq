"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

const categoryIcons: Record<string, string> = {
  All: "◈",
  Productivity: "⚡",
  Development: "</>",
  Marketing: "📢",
  Analysis: "📊",
  Support: "🎧",
  Custom: "🔧",
};

export function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-2"
    >
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={cn(
            "relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border",
            selected === category
              ? "bg-[#00D4FF]/10 border-[#00D4FF]/40 text-[#00D4FF] shadow-[0_0_12px_rgba(0,212,255,0.15)]"
              : "bg-[#161925]/60 border-[#2A2D3E] text-[#6B7290] hover:text-white hover:border-[#6B7290]/40 hover:bg-[#1E2130]"
          )}
        >
          <span className="flex items-center gap-2">
            <span className="text-xs opacity-70">
              {categoryIcons[category] || "◈"}
            </span>
            {category}
          </span>
          {selected === category && (
            <motion.div
              layoutId="category-pill"
              className="absolute inset-0 rounded-xl border border-[#00D4FF]/40"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </button>
      ))}
    </motion.div>
  );
}
