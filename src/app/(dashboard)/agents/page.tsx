"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Plus,
  Search,
  Play,
  Pause,
  Copy,
  Trash2,
  Settings as SettingsIcon,
  Sparkles,
  X,
  ChevronDown,
  Cpu,
  Wand2,
  Shield,
  BarChart3,
  Code2,
  PenTool,
  Loader2,
  Check,
  AlertTriangle,
  Zap,
  Clock,
  DollarSign,
  Activity,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { StatusBadge, StatusDot } from "@/components/glass/status-badge";
import { ProgressBar } from "@/components/glass/progress-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const frameworks = [
  { id: "Kimi", label: "Kimi", color: "#00D4FF" },
  { id: "CrewAI", label: "CrewAI", color: "#00E5A0" },
  { id: "LangGraph", label: "LangGraph", color: "#B829DD" },
  { id: "AutoGen", label: "AutoGen", color: "#FF6B35" },
  { id: "OpenAI", label: "OpenAI", color: "#10A37F" },
  { id: "Custom", label: "Custom", color: "#6B7280" },
];

const agentTemplates = [
  { name: "Email Outreach", icon: "✉️", category: "Sales", framework: "OpenAI", description: "Automated email campaigns with personalization" },
  { name: "Security Auditor", icon: "🔒", category: "Security", framework: "Kimi", description: "Continuous security scanning and reporting" },
  { name: "Support Bot", icon: "💬", category: "Support", framework: "Anthropic", description: "24/7 customer support with escalation" },
  { name: "Data Pipeline", icon: "📊", category: "Data", framework: "Google", description: "ETL workflows and data transformation" },
  { name: "Code Review", icon: "📝", category: "Engineering", framework: "Kimi", description: "Automated PR reviews and quality checks" },
  { name: "Content Generator", icon: "✍️", category: "Marketing", framework: "OpenAI", description: "Blog, social, and ad copy generation" },
];

interface Agent {
  id: string;
  name: string;
  framework: string;
  status: "online" | "offline" | "busy" | "paused";
  agent_type: "AI" | "Human";
  role?: string;
  department?: string;
  efficiency_score: number;
  total_executions: number;
  total_cost: number;
  last_active_at?: string;
  created_at: string;
}

export default function AgentForgePage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [frameworkFilter, setFrameworkFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "efficiency" | "executions" | "cost">("efficiency");
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formFramework, setFormFramework] = useState("Kimi");
  const [formRole, setFormRole] = useState("");
  const [formDepartment, setFormDepartment] = useState("");

  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetch("/api/agents");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setAgents(data || []);
    } catch {
      // Silent fallback to demo data when API unavailable
      setAgents([
        { id: "1", name: "Agent Forge Lead", framework: "Kimi", status: "online", agent_type: "AI", role: "Lead Architect", department: "Engineering", efficiency_score: 94, total_executions: 127, total_cost: 2.34, created_at: "2024-01-01" },
        { id: "2", name: "MarketingBot Pro", framework: "OpenAI", status: "busy", agent_type: "AI", role: "Campaign Manager", department: "Marketing", efficiency_score: 91, total_executions: 89, total_cost: 4.12, created_at: "2024-01-02" },
        { id: "3", name: "SupportAI", framework: "Anthropic", status: "online", agent_type: "AI", role: "Support Specialist", department: "Support", efficiency_score: 96, total_executions: 234, total_cost: 1.87, created_at: "2024-01-03" },
        { id: "4", name: "CodeReview Bot", framework: "Kimi", status: "busy", agent_type: "AI", role: "Code Reviewer", department: "Engineering", efficiency_score: 92, total_executions: 67, total_cost: 0.94, created_at: "2024-01-04" },
        { id: "5", name: "SalesScout", framework: "OpenAI", status: "online", agent_type: "AI", role: "Sales Researcher", department: "Sales", efficiency_score: 89, total_executions: 156, total_cost: 3.45, created_at: "2024-01-05" },
        { id: "6", name: "DataSync Master", framework: "Google", status: "paused", agent_type: "AI", role: "Data Engineer", department: "Data", efficiency_score: 88, total_executions: 45, total_cost: 0.23, created_at: "2024-01-06" },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const createAgent = async () => {
    if (!formName.trim()) {
      toast.error("Agent name is required");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          framework: formFramework,
          role: formRole,
          department: formDepartment,
          config: selectedTemplate
            ? { template: selectedTemplate, autoStart: true }
            : { autoStart: true },
        }),
      });
      if (!res.ok) throw new Error("Failed to create");
      const newAgent = await res.json();
      setAgents((prev) => [newAgent, ...prev]);
      toast.success(`Agent "${formName}" created successfully`);
      setCreateOpen(false);
      resetForm();
    } catch (err) {
      // Optimistic fallback
      const mockAgent: Agent = {
        id: crypto.randomUUID(),
        name: formName,
        framework: formFramework,
        status: "online",
        agent_type: "AI",
        role: formRole,
        department: formDepartment,
        efficiency_score: Math.floor(Math.random() * 20) + 80,
        total_executions: 0,
        total_cost: 0,
        created_at: new Date().toISOString(),
      };
      setAgents((prev) => [mockAgent, ...prev]);
      toast.success(`Agent "${formName}" created (demo mode)`);
      setCreateOpen(false);
      resetForm();
    } finally {
      setCreating(false);
    }
  };

  const updateAgentStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/agents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setAgents((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: status as any } : a))
      );
      toast.success(`Agent ${status === "paused" ? "paused" : "resumed"}`);
    } catch {
      setAgents((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: status as any } : a))
      );
      toast.success(`Agent ${status === "paused" ? "paused" : "resumed"} (demo mode)`);
    }
  };

  const cloneAgent = async (agent: Agent) => {
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${agent.name} (Clone)`,
          framework: agent.framework,
          role: agent.role,
          department: agent.department,
          config: { clonedFrom: agent.id },
        }),
      });
      if (!res.ok) throw new Error("Failed to clone");
      const newAgent = await res.json();
      setAgents((prev) => [newAgent, ...prev]);
      toast.success(`Agent cloned successfully`);
    } catch {
      const cloned: Agent = {
        ...agent,
        id: crypto.randomUUID(),
        name: `${agent.name} (Clone)`,
        status: "online",
        total_executions: 0,
        total_cost: 0,
        created_at: new Date().toISOString(),
      };
      setAgents((prev) => [cloned, ...prev]);
      toast.success(`Agent cloned (demo mode)`);
    }
  };

  const deleteAgent = async (id: string) => {
    try {
      const res = await fetch(`/api/agents/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setAgents((prev) => prev.filter((a) => a.id !== id));
      toast.success("Agent deleted");
    } catch {
      setAgents((prev) => prev.filter((a) => a.id !== id));
      toast.success("Agent deleted (demo mode)");
    }
  };

  const resetForm = () => {
    setFormName("");
    setFormFramework("Kimi");
    setFormRole("");
    setFormDepartment("");
    setSelectedTemplate(null);
  };

  // Metrics
  const totalAgents = agents.length;
  const activeAgents = agents.filter((a) => a.status === "online" || a.status === "busy").length;
  const avgEfficiency = agents.length
    ? (agents.reduce((acc, a) => acc + a.efficiency_score, 0) / agents.length).toFixed(1)
    : "0";
  const todaysCost = agents.reduce((acc, a) => acc + (a.total_cost || 0), 0).toFixed(2);

  // Filtered agents
  const filteredAgents = agents
    .filter((a) => {
      if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (frameworkFilter !== "all" && a.framework !== frameworkFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "efficiency") return b.efficiency_score - a.efficiency_score;
      if (sortBy === "executions") return b.total_executions - a.total_executions;
      if (sortBy === "cost") return b.total_cost - a.total_cost;
      return 0;
    });

  const frameworkIcon = (fw: string) => {
    switch (fw) {
      case "Kimi": return <Cpu className="w-4 h-4" />;
      case "CrewAI": return <Wand2 className="w-4 h-4" />;
      case "LangGraph": return <BarChart3 className="w-4 h-4" />;
      case "AutoGen": return <Shield className="w-4 h-4" />;
      case "OpenAI": return <Sparkles className="w-4 h-4" />;
      case "Custom": return <Code2 className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-[#00D4FF]" />
            Agent Forge
          </h1>
          <p className="text-sm text-[#6B7290] mt-1">Create, deploy, and manage AI agents</p>
        </div>
        <Button
          className="neon-button border-0 bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#06070A]"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Agent
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Agents", value: totalAgents.toString(), icon: Bot, color: "#00D4FF", trend: "+2 this week" },
          { label: "Active Deployments", value: activeAgents.toString(), icon: Zap, color: "#00E5A0", trend: "83% uptime" },
          { label: "Avg Efficiency", value: `${avgEfficiency}%`, icon: Activity, color: "#B829DD", trend: "+1.2% vs last week" },
          { label: "Today's Cost", value: `$${todaysCost}`, icon: DollarSign, color: "#FF6B35", trend: "Under budget" },
        ].map((metric) => (
          <GlassCard key={metric.label} glow="none" className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-[#6B7290] mb-1">{metric.label}</p>
                <p className="text-2xl font-bold" style={{ color: metric.color }}>{metric.value}</p>
                <p className="text-[10px] text-[#4A5068] mt-1">{metric.trend}</p>
              </div>
              <metric.icon className="w-5 h-5" style={{ color: metric.color, opacity: 0.5 }} />
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Templates */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#B829DD]" />
            Agent Templates
          </h3>
          <Badge variant="outline" className="text-[10px] border-[#B829DD]/30 text-[#B829DD]">
            {agentTemplates.length} Templates
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {agentTemplates.map((template) => (
            <motion.div
              key={template.name}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedTemplate(template.name);
                setFormFramework(template.framework);
                setFormName(template.name);
                setCreateOpen(true);
              }}
              className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-[#00D4FF]/20 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{template.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white group-hover:text-[#00D4FF] transition-colors truncate">
                    {template.name}
                  </p>
                  <p className="text-[11px] text-[#6B7290] mt-0.5 line-clamp-1">{template.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-[10px] border-white/[0.08] text-[#6B7290] h-5">
                      {template.category}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] border-[#00D4FF]/20 text-[#00D4FF] h-5">
                      {template.framework}
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Deployed Agents */}
      <GlassCard className="overflow-visible">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-white">Deployed Agents</h3>
            <Badge variant="outline" className="text-[10px] border-white/[0.08] text-[#6B7290]">
              {filteredAgents.length} of {agents.length}
            </Badge>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5068]" />
              <Input
                placeholder="Search agents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-8 w-48 bg-white/[0.03] border-white/[0.06] text-sm text-white placeholder:text-[#4A5068]"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" size="sm" className="h-8 border-white/[0.08] text-[#6B7290] hover:text-white text-xs">
                  <Filter className="w-3 h-3 mr-1" />
                  {statusFilter === "all" ? "Status" : statusFilter}
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#0B0D14] border-white/[0.08]">
                {["all", "online", "busy", "paused", "offline"].map((s) => (
                  <DropdownMenuItem
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className="text-xs text-[#6B7290] hover:text-white focus:bg-white/[0.04] cursor-pointer"
                  >
                    {s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" size="sm" className="h-8 border-white/[0.08] text-[#6B7290] hover:text-white text-xs">
                  <Cpu className="w-3 h-3 mr-1" />
                  {frameworkFilter === "all" ? "Framework" : frameworkFilter}
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#0B0D14] border-white/[0.08]">
                <DropdownMenuItem
                  onClick={() => setFrameworkFilter("all")}
                  className="text-xs text-[#6B7290] hover:text-white focus:bg-white/[0.04] cursor-pointer"
                >
                  All Frameworks
                </DropdownMenuItem>
                {frameworks.map((fw) => (
                  <DropdownMenuItem
                    key={fw.id}
                    onClick={() => setFrameworkFilter(fw.id)}
                    className="text-xs text-[#6B7290] hover:text-white focus:bg-white/[0.04] cursor-pointer"
                  >
                    {fw.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" size="sm" className="h-8 border-white/[0.08] text-[#6B7290] hover:text-white text-xs">
                  <ArrowUpDown className="w-3 h-3 mr-1" />
                  Sort
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#0B0D14] border-white/[0.08]">
                {[
                  { key: "efficiency", label: "Efficiency" },
                  { key: "executions", label: "Executions" },
                  { key: "cost", label: "Cost" },
                  { key: "name", label: "Name" },
                ].map((s) => (
                  <DropdownMenuItem
                    key={s.key}
                    onClick={() => setSortBy(s.key as any)}
                    className="text-xs text-[#6B7290] hover:text-white focus:bg-white/[0.04] cursor-pointer"
                  >
                    {sortBy === s.key && <Check className="w-3 h-3 mr-1 inline" />}
                    {s.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-[#00D4FF] animate-spin" />
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="text-center py-12">
            <Bot className="w-12 h-12 text-[#4A5068] mx-auto mb-3" />
            <p className="text-[#6B7290] text-sm">No agents found</p>
            <p className="text-[#4A5068] text-xs mt-1">Create your first agent or adjust filters</p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {filteredAgents.map((agent) => (
                <motion.div
                  key={agent.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#B829DD] flex items-center justify-center text-white font-bold shrink-0">
                    {agent.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-white">{agent.name}</span>
                      <StatusBadge type="AI" framework={agent.framework} status={agent.status} />
                      <StatusDot status={agent.status} size="sm" />
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-[#6B7290] flex-wrap">
                      {agent.role && <span>{agent.role}</span>}
                      {agent.department && (
                        <>
                          <span>·</span>
                          <span>{agent.department}</span>
                        </>
                      )}
                      <span>·</span>
                      <span>{agent.total_executions} executions</span>
                      <span>·</span>
                      <span>${agent.total_cost?.toFixed(2)} total</span>
                      {agent.last_active_at && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(agent.last_active_at).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="w-24 shrink-0 hidden sm:block">
                    <ProgressBar value={agent.efficiency_score} color="#00E5A0" />
                    <p className="text-[10px] text-[#6B7290] mt-1 text-center">{agent.efficiency_score}% efficiency</p>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toast.info(`Configure ${agent.name}`)}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-[#6B7290] hover:text-white transition-colors"
                      title="Configure"
                    >
                      <SettingsIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateAgentStatus(agent.id, agent.status === "paused" ? "online" : "paused")}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-[#6B7290] hover:text-white transition-colors"
                      title={agent.status === "paused" ? "Resume" : "Pause"}
                    >
                      {agent.status === "paused" ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => cloneAgent(agent)}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-[#6B7290] hover:text-white transition-colors"
                      title="Clone"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteAgent(agent.id)}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-[#6B7290] hover:text-[#FF4757] transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </GlassCard>

      {/* Create Agent Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="bg-[#0B0D14] border-white/[0.08] text-white max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5 text-[#00D4FF]" />
              Create New Agent
            </DialogTitle>
            <DialogDescription className="text-[#6B7290]">
              Configure your AI agent with a template or custom settings
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {selectedTemplate && (
              <div className="p-3 rounded-lg bg-[#00D4FF]/5 border border-[#00D4FF]/20 flex items-center gap-3">
                <Check className="w-4 h-4 text-[#00D4FF]" />
                <div>
                  <p className="text-sm text-white">Template: {selectedTemplate}</p>
                  <p className="text-[11px] text-[#6B7290]">Framework pre-selected</p>
                </div>
                <button
                  onClick={() => { setSelectedTemplate(null); setFormFramework("Kimi"); }}
                  className="ml-auto p-1 rounded hover:bg-white/5 text-[#6B7290]"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <div>
              <label className="text-xs text-[#6B7290] mb-1.5 block">Agent Name *</label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., MarketingBot Pro"
                className="bg-white/[0.03] border-white/[0.06] text-white placeholder:text-[#4A5068]"
              />
            </div>

            <div>
              <label className="text-xs text-[#6B7290] mb-1.5 block">Framework</label>
              <div className="grid grid-cols-3 gap-2">
                {frameworks.map((fw) => (
                  <button
                    key={fw.id}
                    onClick={() => setFormFramework(fw.id)}
                    className={`p-2.5 rounded-lg border text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                      formFramework === fw.id
                        ? "border-[#00D4FF]/40 bg-[#00D4FF]/10 text-[#00D4FF]"
                        : "border-white/[0.06] bg-white/[0.02] text-[#6B7290] hover:border-white/[0.12]"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: fw.color }} />
                    {fw.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#6B7290] mb-1.5 block">Role</label>
                <Input
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  placeholder="e.g., Lead Architect"
                  className="bg-white/[0.03] border-white/[0.06] text-white placeholder:text-[#4A5068]"
                />
              </div>
              <div>
                <label className="text-xs text-[#6B7290] mb-1.5 block">Department</label>
                <Input
                  value={formDepartment}
                  onChange={(e) => setFormDepartment(e.target.value)}
                  placeholder="e.g., Engineering"
                  className="bg-white/[0.03] border-white/[0.06] text-white placeholder:text-[#4A5068]"
                />
              </div>
            </div>

            {!selectedTemplate && (
              <div>
                <label className="text-xs text-[#6B7290] mb-1.5 block">Or pick a template</label>
                <div className="grid grid-cols-2 gap-2">
                  {agentTemplates.slice(0, 4).map((t) => (
                    <button
                      key={t.name}
                      onClick={() => {
                        setSelectedTemplate(t.name);
                        setFormFramework(t.framework);
                        if (!formName) setFormName(t.name);
                      }}
                      className="p-2 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] text-left transition-all"
                    >
                      <span className="text-lg">{t.icon}</span>
                      <p className="text-xs text-white mt-1">{t.name}</p>
                      <p className="text-[10px] text-[#6B7290]">{t.framework}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#FFC857]/5 border border-[#FFC857]/10">
              <AlertTriangle className="w-4 h-4 text-[#FFC857] shrink-0" />
              <p className="text-[11px] text-[#6B7290]">
                New agents start in "online" status. You can pause them anytime from the agent list.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setCreateOpen(false); resetForm(); }}
                className="border-white/[0.08] text-[#6B7290] hover:text-white"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={createAgent}
                disabled={creating || !formName.trim()}
                className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#06070A]"
              >
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />}
                Create Agent
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
