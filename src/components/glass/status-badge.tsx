"use client";

import type { Agent } from "@/types";

interface StatusBadgeProps {
  type: Agent["type"];
  framework?: string;
}

export function StatusBadge({ type, framework }: StatusBadgeProps) {
  const isAI = type === "AI";
  const color = isAI ? "#00D4FF" : "#FF6B35";

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full"
      style={{
        backgroundColor: `${color}15`,
        color,
        border: `1px solid ${color}20`,
      }}
    >
      <span className="w-1 h-1 rounded-full" style={{ backgroundColor: color }} />
      {framework || type}
    </span>
  );
}
