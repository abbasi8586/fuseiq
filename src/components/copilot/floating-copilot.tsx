"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function FloatingCopilot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: "Hi! I'm FuseIQ Co-Pilot. Ask me to deploy agents, run workflows, or check your dashboard." },
  ]);

  const quickActions = [
    "Deploy Kimi agent for code review",
    "Show me pending approvals",
    "Run marketing workflow",
    "What are my costs this month?",
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setLoading(true);
    setInput("");

    setTimeout(() => {
      setLoading(false);
      const response = getSimulatedResponse(input);
      setMessages((prev) => [...prev, { role: "assistant", text: response }]);
    }, 1500);
  };

  const getSimulatedResponse = (q: string) => {
    const lower = q.toLowerCase();
    if (lower.includes("deploy") || lower.includes("agent")) {
      return "I can help you deploy that agent. Head to Agent Forge → New Agent, or I can pre-fill a template for you. Want me to open it?";
    }
    if (lower.includes("approval") || lower.includes("pending")) {
      return "You have 3 pending approvals: 1 high-risk (SalesScout campaign), 2 medium-risk. View them in the Approvals tab.";
    }
    if (lower.includes("cost") || lower.includes("billing") || lower.includes("spend")) {
      return "This month: $12.47 spent of $50 budget. You're 25% under budget. Top spender: MarketingBot Pro at $4.20.";
    }
    if (lower.includes("workflow") || lower.includes("run")) {
      return "Opening Swarm Canvas for you. You have 2 saved workflows: 'Email Campaign' and 'Code Review Pipeline'.";
    }
    return "I can help with that. Try asking about agents, approvals, workflows, or costs. Or press ⌘K for quick commands.";
  };

  return (
    <>
      {/* Floating trigger — compact 48×48 icon on all screens, pill on desktop via hover */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-[60] w-12 h-12 md:w-auto md:h-auto md:px-4 md:py-3 rounded-full md:rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#FFC857] text-[#06070A] font-semibold shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/50 transition-shadow flex items-center justify-center gap-0 md:gap-2"
            aria-label="Ask Co-Pilot"
          >
            <Sparkles className="w-5 h-5" />
            <span className="hidden md:inline text-sm">Ask Co-Pilot</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-20 right-6 z-[60] w-[92vw] max-w-[360px] max-h-[70vh] glass-card border border-white/[0.08] shadow-2xl flex flex-col overflow-hidden rounded-2xl"
            style={{ position: 'fixed' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#FFC857] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#06070A]" />
                </div>
                <span className="text-sm font-semibold text-white">Co-Pilot</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded hover:bg-white/5 text-[#6B7290] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#D4AF37] to-[#FFC857] flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3 h-3 text-[#06070A]" />
                    </div>
                  )}
                  <div
                    className={`px-3 py-2 rounded-xl text-xs max-w-[80%] ${
                      msg.role === "user"
                        ? "bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/20"
                        : "bg-white/[0.03] text-[#B8BED8] border border-white/[0.06]"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#D4AF37] to-[#FFC857] flex items-center justify-center shrink-0">
                    <Sparkles className="w-3 h-3 text-[#06070A]" />
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <Loader2 className="w-3 h-3 text-[#D4AF37] animate-spin" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div className="px-4 py-2 flex flex-wrap gap-1.5">
              {quickActions.map((action) => (
                <button
                  key={action}
                  onClick={() => {
                    setInput(action);
                    setMessages((prev) => [...prev, { role: "user", text: action }]);
                    setLoading(true);
                    setTimeout(() => {
                      setLoading(false);
                      setMessages((prev) => [...prev, { role: "assistant", text: getSimulatedResponse(action) }]);
                    }, 1200);
                  }}
                  className="text-[10px] px-2 py-1 rounded-lg bg-white/[0.03] text-[#6B7290] border border-white/[0.06] hover:text-[#B8BED8] hover:border-[#00D4FF]/20 transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-white/[0.06]">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask Co-Pilot..."
                className="flex-1 bg-transparent text-white text-sm placeholder:text-[#4A5068] outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="p-1.5 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] hover:bg-[#D4AF37]/25 disabled:opacity-30 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
