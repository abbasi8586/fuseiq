"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
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
  ChevronDown,
  AlertTriangle,
} from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const frameworks = [
  { id: "kimi", name: "Kimi K2.5", icon: "🌙", color: "#00D4FF" },
  { id: "openai", name: "GPT-4", icon: "🧠", color: "#10A37F" },
  { id: "anthropic", name: "Claude 3", icon: "🤖", color: "#CC785C" },
];

interface SimulationResult {
  status: "success" | "error" | "timeout";
  output: string;
  latency: number;
  tokens: number;
  cost: number;
  timestamp: string;
}

export default function SimulatorPage() {
  const [selectedFramework, setSelectedFramework] = useState("kimi");
  const [prompt, setPrompt] = useState("");
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [history, setHistory] = useState<string[]>([
    "Generate a marketing email for a new SaaS product",
    "Review this code for security vulnerabilities",
    "Summarize the last 100 customer support tickets",
  ]);

  const runSimulation = async () => {
    if (!prompt.trim()) {
      toast.error("Enter a prompt to simulate");
      return;
    }

    setRunning(true);
    const startTime = Date.now();

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 2000));

    const latency = Date.now() - startTime;
    const tokens = Math.floor(Math.random() * 500) + 100;
    const cost = (tokens / 1000) * 0.02;

    const result: SimulationResult = {
      status: Math.random() > 0.1 ? "success" : "error",
      output:
        Math.random() > 0.1
          ? `Successfully processed request. Generated response with ${tokens} tokens using ${
              frameworks.find((f) => f.id === selectedFramework)?.name
            }.`
          : "Error: API rate limit exceeded. Please try again in 60 seconds.",
      latency,
      tokens,
      cost,
      timestamp: new Date().toISOString(),
    };

    setResults((prev) => [result, ...prev]);
    setRunning(false);
    toast.success("Simulation completed");
  };

  const clearResults = () => {
    setResults([]);
    toast.info("Results cleared");
  };

  const fw = frameworks.find((f) => f.id === selectedFramework);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Terminal className="w-6 h-6 text-[#00D4FF]" />
          Agent Simulator
        </h1>
        <p className="text-sm text-[#6B7290] mt-1">
          Test agents before deployment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Input Panel */}
        <div className="lg:col-span-2 space-y-4">
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-4 h-4 text-[#6B7290]" />
              <span className="text-sm text-[#6B7290]">Configuration</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {frameworks.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFramework(f.id)}
                  className={`p-3 rounded-lg border text-sm transition-all ${
                    selectedFramework === f.id
                      ? "border-[#00D4FF]/40 bg-[#00D4FF]/10 text-[#00D4FF]"
                      : "border-white/[0.06] bg-white/[0.02] text-[#6B7290] hover:border-white/[0.12]"
                  }`}
                >
                  <span className="text-lg mr-2">{f.icon}</span>
                  {f.name}
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
                {running ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                Run Simulation
              </Button>
              <Button
                variant="outline"
                onClick={clearResults}
                className="border-white/[0.08] text-[#6B7290] hover:text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </GlassCard>

          {/* Results */}
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
                          borderColor:
                            result.status === "success"
                              ? "#00E5A040"
                              : "#FF475740",
                          color:
                            result.status === "success"
                              ? "#00E5A0"
                              : "#FF4757",
                          backgroundColor:
                            result.status === "success"
                              ? "#00E5A010"
                              : "#FF475710",
                        }}
                      >
                        {result.status}
                      </Badge>
                      <span className="text-[10px] text-[#4A5068]">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-[#B8BED8] mb-2">{result.output}</p>
                    <div className="flex items-center gap-4 text-[10px] text-[#4A5068]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {result.latency}ms
                      </span>
                      <span className="flex items-center gap-1">
                        <Cpu className="w-3 h-3" />
                        {result.tokens} tokens
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        ${result.cost.toFixed(4)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <GlassCard>
            <h3 className="text-sm font-semibold text-white mb-3">
              Quick Prompts
            </h3>
            <div className="space-y-2">
              {history.map((item, i) => (
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
              <AlertTriangle className="w-4 h-4 text-[#FFC857]" />
              Estimates
            </h3>
            <div className="space-y-2 text-xs text-[#6B7290]">
              <div className="flex justify-between">
                <span>Framework</span>
                <span className="text-white">{fw?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Latency</span>
                <span className="text-white">~400ms</span>
              </div>
              <div className="flex justify-between">
                <span>Cost/1K tokens</span>
                <span className="text-white">$0.02</span>
              </div>
              <div className="flex justify-between">
                <span>Success Rate</span>
                <span className="text-[#00E5A0]">96.5%</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
