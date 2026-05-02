"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { AgentCard } from "@/components/marketplace/agent-card";
import { CategoryFilter } from "@/components/marketplace/category-filter";
import { SearchBar } from "@/components/marketplace/search-bar";
import { GlassCard } from "@/components/glass/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Star,
  Clock,
  Filter,
  ChevronDown,
  Flame,
  Package,
  Loader2,
  X,
  Bot,
  Download,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface MarketplaceAgent {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  framework: string;
  rating: number;
  installs: number;
  author: string;
  author_avatar: string;
  featured?: boolean;
  tags: string[];
  price?: string;
  is_installed?: boolean;
  config?: any;
  created_at?: string;
}

const categories = [
  "All",
  "Productivity",
  "Development",
  "Marketing",
  "Analysis",
  "Support",
  "Custom",
];

const frameworks = ["All", "Kimi", "GPT-4", "Claude", "CrewAI", "Custom"];

const sortOptions = [
  { label: "Popular", value: "popular", icon: TrendingUp },
  { label: "Newest", value: "newest", icon: Clock },
  { label: "Highest Rated", value: "rating", icon: Star },
];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFramework, setSelectedFramework] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [myAgentsOnly, setMyAgentsOnly] = useState(false);

  const [agents, setAgents] = useState<MarketplaceAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewAgent, setPreviewAgent] = useState<MarketplaceAgent | null>(null);

  // Fetch agents from API
  const fetchAgents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "All") params.set("category", selectedCategory);
      if (selectedFramework !== "All") params.set("framework", selectedFramework);
      if (searchQuery) params.set("search", searchQuery);
      if (myAgentsOnly) params.set("my", "true");

      const res = await fetch(`/api/marketplace?${params.toString()}`);
      const data = await res.json();
      if (data.agents) {
        setAgents(data.agents);
      }
    } catch (err) {
      console.error("Failed to fetch agents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [selectedCategory, selectedFramework, searchQuery, myAgentsOnly]);

  // Install agent
  const handleInstall = async (agentId: string) => {
    try {
      const res = await fetch("/api/marketplace/install", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent_id: agentId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setAgents((prev) =>
          prev.map((a) => (a.id === agentId ? { ...a, is_installed: true, installs: a.installs + 1 } : a))
        );
      } else {
        toast.error(data.error || "Failed to install");
      }
    } catch (err) {
      toast.error("Network error during install");
    }
  };

  // Uninstall agent
  const handleUninstall = async (agentId: string) => {
    try {
      const res = await fetch(`/api/marketplace/install?agent_id=${agentId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Agent uninstalled");
        setAgents((prev) =>
          prev.map((a) => (a.id === agentId ? { ...a, is_installed: false, installs: Math.max(0, a.installs - 1) } : a))
        );
      }
    } catch (err) {
      toast.error("Failed to uninstall");
    }
  };

  const featuredAgents = agents.filter((a) => a.featured);

  const filteredAgents = [...agents].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.installs - a.installs;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-8">
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#00D4FF]/10 via-[#B829DD]/10 to-[#00E5A0]/10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMjEyLDI1NSwgMC4wNSkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative p-8 md:p-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#B829DD] flex items-center justify-center shadow-lg shadow-[#00D4FF]/20">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Agent <span className="text-gradient">Marketplace</span>
              </h1>
              <p className="text-sm text-[#6B7290]">
                Discover, install, and deploy AI agents built by the community
              </p>
            </div>
          </div>

          {/* Search + Sort + My Agents Row */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <div className="flex-1">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMyAgentsOnly(!myAgentsOnly)}
                className={cn(
                  "glass-card border-[#2A2D3E] text-[#6B7290] hover:text-white hover:border-[#00D4FF]/30",
                  myAgentsOnly && "border-[#00E5A0]/50 text-[#00E5A0] bg-[#00E5A0]/10"
                )}
              >
                <Package className="w-4 h-4 mr-2" />
                {myAgentsOnly ? "My Agents" : "All Agents"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "glass-card border-[#2A2D3E] text-[#6B7290] hover:text-white hover:border-[#00D4FF]/30",
                  showFilters && "border-[#00D4FF]/50 text-[#00D4FF]"
                )}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                <ChevronDown
                  className={cn(
                    "w-3 h-3 ml-1 transition-transform",
                    showFilters && "rotate-180"
                  )}
                />
              </Button>
              <div className="flex items-center gap-1 glass-card rounded-lg p-1 border border-[#2A2D3E]">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                      sortBy === opt.value
                        ? "bg-[#00D4FF]/15 text-[#00D4FF]"
                        : "text-[#6B7290] hover:text-white"
                    )}
                  >
                    <opt.icon className="w-3.5 h-3.5" />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Category Chips ──────────────────────────────────────────────── */}
      {!myAgentsOnly && (
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      )}

      {/* ── Expandable Filters ──────────────────────────────────────────── */}
      <motion.div
        initial={false}
        animate={{
          height: showFilters ? "auto" : 0,
          opacity: showFilters ? 1 : 0,
        }}
        className="overflow-hidden"
      >
        <GlassCard className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-[#6B7290] font-medium">Framework:</span>
          {frameworks.map((fw) => (
            <button
              key={fw}
              onClick={() => setSelectedFramework(fw)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                selectedFramework === fw
                  ? "bg-[#B829DD]/15 border-[#B829DD]/40 text-[#B829DD]"
                  : "border-[#2A2D3E] text-[#6B7290] hover:text-white hover:border-[#6B7290]/40"
              )}
            >
              {fw}
            </button>
          ))}
        </GlassCard>
      </motion.div>

      {/* ── Loading State ───────────────────────────────────────────────── */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#00D4FF] animate-spin" />
          <span className="ml-3 text-sm text-[#6B7290]">Loading agents...</span>
        </div>
      )}

      {/* ── Featured Banner ─────────────────────────────────────────────── */}
      {!loading && !myAgentsOnly && selectedCategory === "All" && selectedFramework === "All" && searchQuery === "" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#FFC857]" />
            <h2 className="text-lg font-bold text-white">Featured Agents</h2>
            <Badge className="bg-[#FFC857]/10 text-[#FFC857] border-[#FFC857]/20 text-xs">
              Top Picks
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredAgents.map((agent, i) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <AgentCard
                  agent={agent}
                  featured
                  onInstall={handleInstall}
                  onUninstall={handleUninstall}
                  onPreview={setPreviewAgent}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Agent Grid ──────────────────────────────────────────────────── */}
      {!loading && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#FF6B35]" />
              <h2 className="text-lg font-bold text-white">
                {myAgentsOnly ? "My Agents" : selectedCategory === "All" ? "All Agents" : selectedCategory}
              </h2>
              <span className="text-sm text-[#6B7290]">({filteredAgents.length})</span>
            </div>
          </div>

          {filteredAgents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredAgents.map((agent, i) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <AgentCard
                    agent={agent}
                    onInstall={handleInstall}
                    onUninstall={handleUninstall}
                    onPreview={setPreviewAgent}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <GlassCard className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-[#2A2D3E] flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-[#6B7290]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {myAgentsOnly ? "No installed agents" : "No agents found"}
              </h3>
              <p className="text-sm text-[#6B7290]">
                {myAgentsOnly
                  ? "Browse the marketplace and install agents to see them here."
                  : "Try adjusting your search or filters."}
              </p>
            </GlassCard>
          )}
        </div>
      )}

      {/* ── Preview Modal ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {previewAgent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setPreviewAgent(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto glass-card border border-white/[0.08] shadow-2xl rounded-2xl"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden rounded-t-2xl">
                <img
                  src={previewAgent.image}
                  alt={previewAgent.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06070A] via-[#06070A]/40 to-transparent" />
                <button
                  onClick={() => setPreviewAgent(null)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/40 text-white hover:bg-black/60 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                {previewAgent.featured && (
                  <Badge className="absolute top-3 left-3 bg-[#FFC857]/15 text-[#FFC857] border border-[#FFC857]/30 backdrop-blur-md">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{previewAgent.name}</h2>
                  <p className="text-sm text-[#6B7290] mt-1">{previewAgent.description}</p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-[#FFC857]" />
                    <span className="text-white font-medium">{previewAgent.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#6B7290]">
                    <Download className="w-4 h-4" />
                    <span>{previewAgent.installs.toLocaleString()} installs</span>
                  </div>
                  <Badge
                    className={cn(
                      "border",
                      previewAgent.price === "Free"
                        ? "bg-[#00E5A0]/10 text-[#00E5A0] border-[#00E5A0]/30"
                        : "bg-[#B829DD]/10 text-[#B829DD] border-[#B829DD]/30"
                    )}
                  >
                    {previewAgent.price}
                  </Badge>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {previewAgent.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-[#2A2D3E]/60 text-[#6B7290] text-xs font-medium border border-[#2A2D3E]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#B829DD] flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">
                      {previewAgent.author_avatar || previewAgent.author?.charAt(0) || "A"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-white">{previewAgent.author}</p>
                    <p className="text-xs text-[#6B7290]">Creator</p>
                  </div>
                </div>

                {/* Config preview if available */}
                {previewAgent.config && (
                  <div className="bg-[#06070A]/50 rounded-xl p-3 border border-white/[0.06]">
                    <p className="text-xs text-[#6B7290] mb-1">Role</p>
                    <p className="text-sm text-[#B8BED8]">{previewAgent.config.role || "Assistant"}</p>
                    {previewAgent.config.skills && (
                      <>
                        <p className="text-xs text-[#6B7290] mt-2 mb-1">Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {previewAgent.config.skills.map((skill: string) => (
                            <span key={skill} className="px-2 py-0.5 rounded bg-[#00D4FF]/10 text-[#00D4FF] text-[10px]">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  {previewAgent.is_installed ? (
                    <Button
                      className="flex-1 bg-[#00E5A0]/15 text-[#00E5A0] border border-[#00E5A0]/30 hover:bg-[#00E5A0]/20"
                      onClick={() => {
                        handleUninstall(previewAgent.id);
                        setPreviewAgent(null);
                      }}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Installed — Uninstall
                    </Button>
                  ) : (
                    <Button
                      className="flex-1 bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/30 hover:bg-[#00D4FF]/25 hover:shadow-[0_0_15px_rgba(0,212,255,0.2)]"
                      onClick={() => {
                        handleInstall(previewAgent.id);
                        setPreviewAgent(null);
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Install {previewAgent.name}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
