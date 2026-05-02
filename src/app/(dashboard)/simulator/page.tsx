"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  RotateCcw,
  Terminal,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Cpu,
  Settings,
  Send,
  Loader2,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";

const frameworks = [
  { id: "deepseek", name: "FuseIQ (Default)", icon: "⚡", color: "#B829DD", pricePer1K: 0.000, isFree: true },
  { id: "kimi", name: "Kimi K2.5", icon: "🌙", color: "#00D4FF", pricePer1K: 0.008, isFree: false },
  { id: "openai", name: "GPT-4o", icon: "🧠", color: "#10A37F", pricePer1K: 0.005, isFree: false },
  { id: "anthropic", name: "Claude 3.5", icon: "🤖", color: "#CC785C", pricePer1K: 0.003, isFree: false },
];

interface SimulationResult {
  status: "success" | "error" | "timeout";
  output: string;
  latency: number;
  tokens: { prompt: number; completion: number; total: number };
  cost: number;
  timestamp: string;
  framework: string;
}

export default function SimulatorPage() {
  const [selectedFramework, setSelectedFramework] = useState("kimi");
  const [prompt, setPrompt] = useState("");
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [apiConfigured, setApiConfigured] = useState(true); // Assume configured for demo

  const runSimulation = async () => {
    if (!prompt.trim()) {
      toast.error("Enter a prompt to simulate");
      return;
    }

    setRunning(true);
    const startTime = Date.now();
    const fw = frameworks.find((f) => f.id === selectedFramework)!;

    try {
      const res = await fetch("/api/simulator/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedFramework,
          prompt: prompt,
          useDeepSeek: selectedFramework === "deepseek",
        }),
      });

      const latency = Date.now() - startTime;
      const data = await res.json();

      if (!res.ok || data.error) {
        const isRateLimited = data.rateLimited || data.error?.includes("rate limit") || data.error?.includes("quota");
        const result: SimulationResult = {
          status: "error",
          output: data.error || `API Error: ${res.statusText}`,
          latency,
          tokens: { prompt: Math.floor(prompt.length / 4), completion: 0, total: Math.floor(prompt.length / 4) },
          cost: 0,
          timestamp: new Date().toISOString(),
          framework: fw.name,
        };
        setResults((prev) => [result, ...prev]);

        if (isRateLimited) {
          toast.error("Platform default limit reached", {
            description: "Switch to a BYOK model (Kimi, OpenAI, Claude) or add your own key.",
            action: {
              label: "Settings",
              onClick: () => window.location.href = "/settings",
            },
          });
        } else {
          toast.error("Simulation failed — check API configuration");
        }
        setRunning(false);
        return;
      }

      const completionText = data.choices?.[0]?.message?.content || data.output || "No response";
      const promptTokens = data.usage?.prompt_tokens || Math.floor(prompt.length / 4);
      const completionTokens = data.usage?.completion_tokens || Math.floor(completionText.length / 4);
      const totalTokens = data.usage?.total_tokens || promptTokens + completionTokens;
      const cost = fw.isFree ? 0 : (totalTokens / 1000) * fw.pricePer1K;

      const result: SimulationResult = {
        status: "success",
        output: completionText,
        latency,
        tokens: { prompt: promptTokens, completion: completionTokens, total: totalTokens },
        cost,
        timestamp: new Date().toISOString(),
        framework: fw.name,
      };

      setResults((prev) => [result, ...prev]);
      toast.success(`Simulation complete — ${totalTokens.toLocaleString()} tokens, ${latency}ms`);
    } catch (err: any) {
      const latency = Date.now() - startTime;
      const result: SimulationResult = {
        status: "error",
        output: `Network Error: ${err.message || "Could not reach API endpoint"}. \n\nEnsure your API keys are configured in Settings.`,
        latency,
        tokens: { prompt: Math.floor(prompt.length / 4), completion: 0, total: Math.floor(prompt.length / 4) },
        cost: 0,
        timestamp: new Date().toISOString(),
        framework: fw.name,
      };
      setResults((prev) => [result, ...prev]);
      toast.error("Network error — check API configuration");
    } finally {
      setRunning(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    toast.info("Results cleared");
  };

  const quickPrompts = [
    "Generate a marketing email for a new SaaS product",
    "Review this code for security vulnerabilities: function auth() { return true; }",
    "Summarize the key benefits of AI agent orchestration in 3 bullet points",
    "Write a Python function that fetches data from an API with retry logic",
  ];

  const fw = frameworks.find((f) => f.id === selectedFramework)!;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Terminal className="w-6 h-6 text-[#00D4FF]" />
          Agent Simulator
        </h1>
        <p className="text-sm text-[#6B7290] mt-1">Test agents with real LLM responses before deployment</p>
      </div>

      {!apiConfigured && (
        <GlassCard className="border-[#FF6B35]/20 bg-[#FF6B35]/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#FF6B35] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#FF6B35]">API Keys Not Configured</p>
              <p className="text-xs text-[#6B7290] mt-1">
                FuseIQ default is active and works without setup. To use additional models (Kimi, OpenAI, Claude), add your API keys in{" "}
                <Link href="/settings" className="text-[#00D4FF] hover:underline">Settings → Integrations</Link>.
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Input Panel */}
        <div className="lg:col-span-2 space-y-4">
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-4 h-4 text-[#6B7290]" />
              <span className="text-sm text-[#6B7290]">Configuration</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {frameworks.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFramework(f.id)}
                  className={`p-3 rounded-lg border text-xs sm:text-sm transition-all text-left ${
                    selectedFramework === f.id
                      ? "border-[#00D4FF]/40 bg-[#00D4FF]/10 text-[#00D4FF]"
                      : "border-white/[0.06] bg-white/[0.02] text-[#6B7290] hover:border-white/[0.12]"
                  }`}
                >
                  <span className="text-lg mr-1">{f.icon}</span>
                  <span className="font-medium">{f.name}</span>
                  {f.isFree && (
                    <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-[#00E5A0]/20 text-[#00E5A0] font-bold">FREE</span>
                  )}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <label className="text-xs text-[#6B7290]">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter a prompt to test the agent..."
                rows={4}
                className="w-full rounded-lg bg-white/[0.03] border border-white/[0.06] text-white placeholder:text-[#4A5068] text-sm p-3 resize-none focus:outline-none focus:ring-1 focus:ring-[#00D4FF]/30"
              />
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Button
                onClick={runSimulation}
                disabled={running || !prompt.trim()}
                className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#06070A]"
              >
                {running ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                Run Simulation
              </Button>
              <Button variant="outline" onClick={clearResults} className="border-white/[0.08] text-[#6B7290] hover:text-white">
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </GlassCard>

          {/* Results */}
          <AnimatePresence>
            {results.length > 0 && (
              <GlassCard>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white">Results</h3>
                  <Badge variant="outline" className="text-[10px] border-white/[0.08] text-[#6B7290]">
                    {results.length} runs
                  </Badge>
                </div>
                <div className="space-y-3">
                  {results.map((result, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg border ${
                        result.status === "success"
                          ? "bg-[#00E5A0]/5 border-[#00E5A0]/20"
                          : "bg-[#FF4757]/5 border-[#FF4757]/20"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {result.status === "success" ? (
                          <CheckCircle2 className="w-4 h-4 text-[#00E5A0]" />
                        ) : (
                          <XCircle className="w-4 h-4 text-[#FF4757]" />
                        )}
                        <Badge
                          variant="outline"
                          className="text-[10px] h-5"
                          style={{
                            borderColor: result.status === "success" ? "#00E5A040" : "#FF475740",
                            color: result.status === "success" ? "#00E5A0" : "#FF4757",
                            backgroundColor: result.status === "success" ? "#00E5A010" : "#FF475710",
                          }}
                        >
                          {result.status}
                        </Badge>
                        <span className="text-[10px] text-[#4A5068]">{new Date(result.timestamp).toLocaleTimeString()}</span>
                        <Badge variant="outline" className="text-[10px] h-5 border-white/[0.06] text-[#6B7290]">
                          {result.framework}
                        </Badge>
                      </div>
                      <div className="bg-[#06070A]/50 rounded-lg p-3 mb-2 max-h-40 overflow-y-auto">
                        <p className="text-sm text-[#B8BED8] whitespace-pre-wrap font-mono text-xs leading-relaxed">
                          {result.output}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-[#4A5068]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {result.latency}ms
                        </span>
                        <span className="flex items-center gap-1">
                          <Cpu className="w-3 h-3" />
                          {result.tokens.total.toLocaleString()} tokens
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          ${result.cost.toFixed(4)}
                        </span>
                        <span className="text-[#6B7290]">
                          Prompt: {result.tokens.prompt} · Completion: {result.tokens.completion}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <GlassCard>
            <h3 className="text-sm font-semibold text-white mb-3">Quick Prompts</h3>
            <div className="space-y-2">
              {quickPrompts.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(item)}
                  className="w-full text-left p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] text-xs text-[#B8BED8] transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#D4AF37]" />
              Cost Estimate
            </h3>
            <div className="space-y-2 text-xs text-[#6B7290]">
              <div className="flex justify-between">
                <span>Framework</span>
                <span className="text-white">{fw?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Price / 1K tokens</span>
                <span className="text-white">{fw?.isFree ? "$0.000 (Free)" : `$${fw?.pricePer1K.toFixed(3)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Latency</span>
                <span className="text-white">~400ms</span>
              </div>
              <div className="flex justify-between">
                <span>Context Window</span>
                <span className="text-white">128K</span>
              </div>
              <div className="h-px bg-white/[0.06] my-2" />
              <div className="flex justify-between">
                <span className="text-[#B8BED8]">Est. cost for 1K prompt</span>
                <span className="text-[#00E5A0] font-mono">{fw?.isFree ? "$0.000" : `$${fw?.pricePer1K.toFixed(3)}`}</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-sm font-semibold text-white mb-3">Last Run</h3>
            {results.length > 0 ? (
              <div className="space-y-1.5 text-xs text-[#6B7290]">
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className={results[0].status === "success" ? "text-[#00E5A0]" : "text-[#FF4757]"}>
                    {results[0].status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tokens</span>
                  <span className="text-white">{results[0].tokens.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Latency</span>
                  <span className="text-white">{results[0].latency}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Cost</span>
                  <span className="text-[#D4AF37] font-mono">${results[0].cost.toFixed(4)}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#4A5068]">No runs yet</p>
            )}
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
