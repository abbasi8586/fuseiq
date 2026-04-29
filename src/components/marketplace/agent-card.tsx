"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { GlassCard } from "@/components/glass/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Download,
  Eye,
  Check,
  Bot,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MarketplaceAgent } from "@/app/(dashboard)/marketplace/page";

// ─── Framework Color Map ─────────────────────────────────────────────────────

const frameworkColors: Record<string, { bg: string; text: string; border: string }> = {
  "GPT-4": { bg: "bg-[#00D4FF]/10", text: "text-[#00D4FF]", border: "border-[#00D4FF]/20" },
  Claude: { bg: "bg-[#B829DD]/10", text: "text-[#B829DD]", border: "border-[#B829DD]/20" },
  Kimi: { bg: "bg-[#00E5A0]/10", text: "text-[#00E5A0]", border: "border-[#00E5A0]/20" },
  CrewAI: { bg: "bg-[#FF6B35]/10", text: "text-[#FF6B35]", border: "border-[#FF6B35]/20" },
  Custom: { bg: "bg-[#FFC857]/10", text: "text-[#FFC857]", border: "border-[#FFC857]/20" },
};

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-3.5 h-3.5",
            i < fullStars
              ? "text-[#FFC857] fill-[#FFC857]"
              : i === fullStars && hasHalf
                ? "text-[#FFC857] fill-[#FFC857]/50"
                : "text-[#2A2D3E] fill-[#2A2D3E]"
          )}
        />
      ))}
      <span className="text-xs text-[#6B7290] ml-1 font-medium">{rating}</span>
    </div>
  );
}

function InstallButton({ agent }: { agent: MarketplaceAgent }) {
  const [installed, setInstalled] = useState(false);

  const handleInstall = () => {
    setInstalled(true);
    // In a real app, this would call an API to install the agent
    // toast.success(`${agent.name} installed successfully`);
    setTimeout(() => setInstalled(false), 3000);
  };

  return (
    <Button
      size="sm"
      onClick={handleInstall}
      disabled={installed}
      className={cn(
        "transition-all duration-300 text-xs font-medium",
        installed
          ? "bg-[#00E5A0]/15 text-[#00E5A0] border border-[#00E5A0]/30 hover:bg-[#00E5A0]/20"
          : "bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/30 hover:bg-[#00D4FF]/25 hover:shadow-[0_0_15px_rgba(0,212,255,0.2)]"
      )}
    >
      {installed ? (
        <>
          <Check className="w-3.5 h-3.5 mr-1.5" />
          Installed
        </>
      ) : (
        <>
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Install
        </>
      )}
    </Button>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

interface AgentCardProps {
  agent: MarketplaceAgent;
  featured?: boolean;
}

export function AgentCard({ agent, featured = false }: AgentCardProps) {
  const fwStyle = frameworkColors[agent.framework] || frameworkColors.Custom;
  const installCount = agent.installs.toLocaleString();

  return (
    <GlassCard
      hover
      glow={featured ? "cyan" : "none"}
      className={cn(
        "group relative overflow-hidden p-0",
        featured && "ring-1 ring-[#00D4FF]/20"
      )}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={agent.image}
          alt={agent.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06070A] via-[#06070A]/40 to-transparent" />

        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-[#FFC857]/15 text-[#FFC857] border border-[#FFC857]/30 backdrop-blur-md">
              <Sparkles className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <Badge
            className={cn(
              "backdrop-blur-md border",
              agent.price === "Free"
                ? "bg-[#00E5A0]/15 text-[#00E5A0] border-[#00E5A0]/30"
                : "bg-[#B829DD]/15 text-[#B829DD] border-[#B829DD]/30"
            )}
          >
            {agent.price}
          </Badge>
        </div>

        {/* Framework Badge */}
        <div className="absolute bottom-3 left-3">
          <Badge
            className={cn(
              "backdrop-blur-md border text-xs font-semibold",
              fwStyle.bg,
              fwStyle.text,
              fwStyle.border
            )}
          >
            <Bot className="w-3 h-3 mr-1" />
            {agent.framework}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title + Rating */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-[#00D4FF] transition-colors">
              {agent.name}
            </h3>
            <p className="text-xs text-[#6B7290] mt-0.5 line-clamp-2 leading-relaxed">
              {agent.description}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {agent.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md bg-[#2A2D3E]/60 text-[#6B7290] text-[10px] font-medium border border-[#2A2D3E]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between pt-2 border-t border-[#2A2D3E]/50">
          <div className="flex items-center gap-3">
            <StarRating rating={agent.rating} />
            <div className="flex items-center gap-1 text-[#6B7290]">
              <Download className="w-3 h-3" />
              <span className="text-xs font-medium">{installCount}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#B829DD] flex items-center justify-center">
              <span className="text-[8px] font-bold text-white">
                {agent.authorAvatar}
              </span>
            </div>
            <span className="text-xs text-[#6B7290]">{agent.author}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <InstallButton agent={agent} />
          <Button
            variant="outline"
            size="sm"
            className="glass-card border-[#2A2D3E] text-[#6B7290] hover:text-white hover:border-[#6B7290]/40 text-xs"
          >
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            Preview
          </Button>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          background:
            "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0,212,255,0.06), transparent 40%)",
        }}
      />
    </GlassCard>
  );
}
