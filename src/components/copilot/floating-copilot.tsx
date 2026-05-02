"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Loader2, AlertTriangle, Settings } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  isError?: boolean;
  isRateLimited?: boolean;
}

export function FloatingCopilot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hi! I'm FuseIQ Co-Pilot. Ask me about deploying agents, running workflows, checking costs, or managing your team.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  const quickActions = [
    "Deploy an agent",
    "Show pending approvals",
    "Run marketing workflow",
    "What are my costs?",
  ];

  const sendToApi = async (text: string, currentMessages: ChatMessage[]) => {
    const history = currentMessages.map((m) => ({
      role: m.role,
      content: m.text,
    }));

    const res = await fetch("/api/copilot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [...history, { role: "user", content: text }],
      }),
    });

    const data = await res.json();

    if (data.error) {
      const isRateLimited =
        data.rateLimited ||
        data.error?.includes("rate limit") ||
        data.error?.includes("quota");

      return {
        text: data.error,
        isError: true,
        isRateLimited,
      };
    }

    return { text: data.message?.content || "No response", isError: false };
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);

    const result = await sendToApi(userText, messages);
    setLoading(false);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        text: result.text,
        isError: result.isError,
        isRateLimited: result.isRateLimited,
      },
    ]);

    if (result.isRateLimited) {
      toast.error("Platform default limit reached", {
        description: "Add your own API key in Settings for unlimited access.",
      });
    }
  };

  const handleQuickAction = async (action: string) => {
    setMessages((prev) => [...prev, { role: "user", text: action }]);
    setLoading(true);

    const result = await sendToApi(action, messages);
    setLoading(false);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        text: result.text,
        isError: result.isError,
        isRateLimited: result.isRateLimited,
      },
    ]);
  };

  return (
    <>
      {/* Floating trigger */}
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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-4 sm:right-6 z-[60] w-[calc(100vw-2rem)] sm:w-[380px] max-w-[420px] max-h-[70vh] glass-card border border-white/[0.08] shadow-2xl flex flex-col overflow-hidden rounded-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#FFC857] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#06070A]" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-white block leading-tight">Co-Pilot</span>
                  <span className="text-[10px] text-[#6B7290]">FuseIQ AI</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href="/settings"
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded hover:bg-white/5 text-[#6B7290] hover:text-white transition-colors"
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded hover:bg-white/5 text-[#6B7290] hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[180px]">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                        msg.isError ? "bg-[#FF6B35]/20" : "bg-gradient-to-br from-[#D4AF37] to-[#FFC857]"
                      }`}
                    >
                      {msg.isRateLimited ? (
                        <AlertTriangle className="w-3 h-3 text-[#FF6B35]" />
                      ) : (
                        <Sparkles className="w-3 h-3 text-[#06070A]" />
                      )}
                    </div>
                  )}
                  <div
                    className={`px-3 py-2 rounded-xl text-xs max-w-[85%] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/20"
                        : msg.isError
                        ? "bg-[#FF6B35]/5 text-[#B8BED8] border border-[#FF6B35]/20"
                        : "bg-white/[0.03] text-[#B8BED8] border border-white/[0.06]"
                    }`}
                  >
                    {msg.text}
                    {msg.isRateLimited && (
                      <div className="mt-2 pt-2 border-t border-white/[0.06]">
                        <Link
                          href="/settings"
                          onClick={() => setOpen(false)}
                          className="text-[10px] text-[#00D4FF] hover:text-[#00E5A0] transition-colors inline-flex items-center gap-1"
                        >
                          <Settings className="w-3 h-3" />
                          Add BYOK key →
                        </Link>
                      </div>
                    )}
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
            <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t border-white/[0.04]">
              {quickActions.map((action) => (
                <button
                  key={action}
                  onClick={() => handleQuickAction(action)}
                  disabled={loading}
                  className="text-[10px] px-2 py-1 rounded-lg bg-white/[0.03] text-[#6B7290] border border-white/[0.06] hover:text-[#B8BED8] hover:border-[#00D4FF]/20 transition-colors disabled:opacity-40"
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
                onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
                placeholder="Ask about FuseIQ..."
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
