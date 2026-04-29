"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search agents, tags, frameworks...",
  className,
}: SearchBarProps) {
  return (
    <div
      className={cn(
        "relative flex items-center group",
        className
      )}
    >
      <div className="absolute left-3.5 pointer-events-none">
        <Search className="w-4 h-4 text-[#6B7290] group-focus-within:text-[#00D4FF] transition-colors" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full pl-10 pr-10 py-2.5 rounded-xl",
          "bg-[#161925]/80 border border-[#2A2D3E]",
          "text-sm text-white placeholder:text-[#6B7290]/60",
          "focus:outline-none focus:border-[#00D4FF]/50 focus:shadow-[0_0_15px_rgba(0,212,255,0.1)]",
          "transition-all duration-300",
          "backdrop-blur-sm"
        )}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 p-0.5 rounded-md hover:bg-[#2A2D3E] text-[#6B7290] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
