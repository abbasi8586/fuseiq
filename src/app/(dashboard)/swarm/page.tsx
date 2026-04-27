"use client";

import { motion } from "framer-motion";
import { GitBranch, Sparkles, FlaskConical, ShoppingBag, Users, CreditCard, Shield, Building2 } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";

function PlaceholderPage({ icon: Icon, title, description, status }: { icon: any, title: string, description: string, status: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh] space-y-4"
    >
      <GlassCard className="text-center max-w-md"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00D4FF]/20 to-[#B829DD]/20 flex items-center justify-center mx-auto mb-4"
        >
          <Icon className="w-8 h-8 text-[#00D4FF]" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2"
        >{title}</h2>
        <p className="text-sm text-[#6B7290] mb-4"
        >{description}</p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFC857]/10 text-[#FFC857] text-xs font-medium"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFC857] animate-pulse"
          />
          {status}
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default function SwarmPage() {
  return (
    <PlaceholderPage
      icon={GitBranch}
      title="Swarm Canvas"
      description="Visual workflow orchestration with drag-and-drop agent nodes. Build complex multi-agent systems without code."
      status="Phase 2 — Coming Soon"
    />
  );
}
