"use client";

import { motion } from "framer-motion";
import { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Mock Data ───────────────────────────────────────────────────────────────

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
  authorAvatar: string;
  featured?: boolean;
  tags: string[];
  price?: string;
}

const agents: MarketplaceAgent[] = [
  {
    id: "1",
    name: "Code Review Pro",
    description:
      "Automated code review with AI-powered suggestions, security scans, and performance analysis for every pull request.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop",
    category: "Development",
    framework: "GPT-4",
    rating: 4.8,
    installs: 12453,
    author: "DevOps Labs",
    authorAvatar: "DL",
    featured: true,
    tags: ["GitHub", "CI/CD", "Security"],
    price: "Free",
  },
  {
    id: "2",
    name: "Content Catalyst",
    description:
      "Generate SEO-optimized blog posts, social media content, and email campaigns with brand voice consistency.",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a6667a?w=400&h=250&fit=crop",
    category: "Marketing",
    framework: "Claude",
    rating: 4.6,
    installs: 8932,
    author: "GrowthStack",
    authorAvatar: "GS",
    featured: true,
    tags: ["SEO", "Social", "Email"],
    price: "$9/mo",
  },
  {
    id: "3",
    name: "Data Insight Engine",
    description:
      "Transform raw data into actionable business intelligence with automated reports and predictive analytics.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
    category: "Analysis",
    framework: "Kimi",
    rating: 4.9,
    installs: 6721,
    author: "Analytics Pro",
    authorAvatar: "AP",
    featured: true,
    tags: ["BI", "Predictive", "Reports"],
    price: "$19/mo",
  },
  {
    id: "4",
    name: "Support Sentinel",
    description:
      "24/7 intelligent customer support with sentiment analysis, escalation routing, and multilingual responses.",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=250&fit=crop",
    category: "Support",
    framework: "GPT-4",
    rating: 4.5,
    installs: 15420,
    author: "HelpDesk AI",
    authorAvatar: "HA",
    tags: ["Ticketing", "Chat", "NLP"],
    price: "Free",
  },
  {
    id: "5",
    name: "Task Master",
    description:
      "Project management automation with smart task assignment, deadline tracking, and team productivity insights.",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=250&fit=crop",
    category: "Productivity",
    framework: "CrewAI",
    rating: 4.3,
    installs: 5432,
    author: "Productive AI",
    authorAvatar: "PA",
    tags: ["PM", "Kanban", "Teams"],
    price: "$5/mo",
  },
  {
    id: "6",
    name: "Sales Accelerator",
    description:
      "AI-powered sales pipeline management, lead scoring, and automated follow-ups to close deals faster.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
    category: "Marketing",
    framework: "Claude",
    rating: 4.7,
    installs: 7891,
    author: "Revenue AI",
    authorAvatar: "RA",
    tags: ["CRM", "Leads", "Funnel"],
    price: "$15/mo",
  },
  {
    id: "7",
    name: "DevOps Guardian",
    description:
      "Infrastructure monitoring, anomaly detection, and automated incident response for cloud-native systems.",
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07cc9?w=400&h=250&fit=crop",
    category: "Development",
    framework: "Custom",
    rating: 4.4,
    installs: 3210,
    author: "CloudOps",
    authorAvatar: "CO",
    tags: ["DevOps", "SRE", "Cloud"],
    price: "$25/mo",
  },
  {
    id: "8",
    name: "Meeting Scribe",
    description:
      "Real-time meeting transcription, action item extraction, and smart summarization for every conversation.",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=250&fit=crop",
    category: "Productivity",
    framework: "GPT-4",
    rating: 4.6,
    installs: 9876,
    author: "NoteTaker AI",
    authorAvatar: "NT",
    tags: ["Transcription", "Notes", "Zoom"],
    price: "$7/mo",
  },
  {
    id: "9",
    name: "Security Auditor",
    description:
      "Continuous security posture assessment, vulnerability scanning, and compliance report generation.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=250&fit=crop",
    category: "Analysis",
    framework: "Kimi",
    rating: 4.2,
    installs: 2156,
    author: "SecureAI",
    authorAvatar: "SA",
    tags: ["Security", "Compliance", "Audit"],
    price: "$29/mo",
  },
  {
    id: "10",
    name: "Email Composer",
    description:
      "Smart email drafting with tone adjustment, follow-up scheduling, and inbox prioritization.",
    image: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=250&fit=crop",
    category: "Productivity",
    framework: "Claude",
    rating: 4.1,
    installs: 4567,
    author: "Inbox AI",
    authorAvatar: "IA",
    tags: ["Email", "Gmail", "Outlook"],
    price: "$3/mo",
  },
  {
    id: "11",
    name: "Custom Workflow Builder",
    description:
      "Build your own multi-step AI workflows with visual drag-and-drop interface and 50+ integrations.",
    image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&h=250&fit=crop",
    category: "Custom",
    framework: "CrewAI",
    rating: 4.5,
    installs: 3456,
    author: "FlowBuilder",
    authorAvatar: "FB",
    tags: ["No-Code", "Workflow", "Integration"],
    price: "$49/mo",
  },
  {
    id: "12",
    name: "Social Media Pilot",
    description:
      "Automated social media scheduling, content curation, and engagement analytics across all platforms.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop",
    category: "Marketing",
    framework: "GPT-4",
    rating: 4.3,
    installs: 6789,
    author: "SocialFly",
    authorAvatar: "SF",
    tags: ["Social", "Analytics", "Scheduler"],
    price: "$12/mo",
  },
];

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

// ─── Component ───────────────────────────────────────────────────────────────

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFramework, setSelectedFramework] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);

  const featuredAgents = agents.filter((a) => a.featured);

  const filteredAgents = agents
    .filter((agent) => {
      const matchesSearch =
        searchQuery === "" ||
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory =
        selectedCategory === "All" || agent.category === selectedCategory;
      const matchesFramework =
        selectedFramework === "All" || agent.framework === selectedFramework;
      return matchesSearch && matchesCategory && matchesFramework;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.installs - a.installs;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return parseInt(b.id) - parseInt(a.id);
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

          {/* Search + Sort Row */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <div className="flex-1">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            <div className="flex items-center gap-2">
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
      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

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

      {/* ── Featured Banner ─────────────────────────────────────────────── */}
      {selectedCategory === "All" &&
        selectedFramework === "All" &&
        searchQuery === "" && (
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
                  <AgentCard agent={agent} featured />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

      {/* ── Agent Grid ──────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#FF6B35]" />
            <h2 className="text-lg font-bold text-white">
              {selectedCategory === "All" ? "All Agents" : selectedCategory}
            </h2>
            <span className="text-sm text-[#6B7290]">
              ({filteredAgents.length})
            </span>
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
                <AgentCard agent={agent} />
              </motion.div>
            ))}
          </div>
        ) : (
          <GlassCard className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-[#2A2D3E] flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-[#6B7290]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              No agents found
            </h3>
            <p className="text-sm text-[#6B7290]">
              Try adjusting your search or filters to find what you&apos;re looking
              for.
            </p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
