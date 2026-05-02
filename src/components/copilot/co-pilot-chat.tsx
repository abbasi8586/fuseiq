"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/glass/glass-card";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  Copy,
  Check,
  AlertTriangle,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isError?: boolean;
  isRateLimited?: boolean;
}

export function CoPilotChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 I'm FuseIQ Co-Pilot. I can help you:\n\n• Deploy and manage agents\n• Run workflows and monitor executions\n• Analyze performance and costs\n• Answer questions about your workspace\n\nWhat would you like to do?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: userMessage.content },
          ],
        }),
      });

      const data = await res.json();

      if (data.error) {
        const isRateLimited = data.rateLimited || data.error?.includes("rate limit") || data.error?.includes("quota");
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.error,
          timestamp: new Date(),
          isError: true,
          isRateLimited: isRateLimited,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        if (isRateLimited) {
          toast.error("DeepSeek Free Tier limit reached", {
            description: "Switch to BYOK for unlimited access.",
            action: {
              label: "Settings",
              onClick: () => window.location.href = "/settings",
            },
          });
        }
      } else if (data.message?.content) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message.content,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error("Empty response");
      }
    } catch (err: any) {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again in a moment, or check your API key in Settings → Integrations.",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <GlassCard className="flex flex-col h-[calc(100vh-220px)] min-h-[400px] max-h-[800px]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#B829DD] flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">Co-Pilot</p>
          <p className="text-xs text-[#6B7290]">DeepSeek-powered</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#00E5A0]/10 border border-[#00E5A0]/20">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00E5A0] animate-pulse" />
            <span className="text-[10px] text-[#00E5A0] font-medium hidden sm:inline">Online</span>
          </div>
          <Link
            href="/settings"
            className="p-1.5 rounded-lg hover:bg-white/5 text-[#6B7290] hover:text-white transition-colors"
            title="API Key Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                msg.role === "user"
                  ? "bg-[#B829DD]/20 text-[#B829DD]"
                  : msg.isError
                  ? "bg-[#FF6B35]/20 text-[#FF6B35]"
                  : "bg-[#00D4FF]/20 text-[#00D4FF]"
              }`}
            >
              {msg.role === "user" ? (
                <User className="w-3.5 h-3.5" />
              ) : msg.isRateLimited ? (
                <AlertTriangle className="w-3.5 h-3.5" />
              ) : (
                <Bot className="w-3.5 h-3.5" />
              )}
            </div>
            <div
              className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#B829DD]/10 text-white rounded-br-md"
                  : msg.isError
                  ? "bg-[#FF6B35]/5 text-[#B8BED8] border border-[#FF6B35]/20 rounded-bl-md"
                  : "bg-white/[0.03] text-[#B8BED8] rounded-bl-md"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {/* Rate limit CTA */}
              {msg.isRateLimited && (
                <div className="mt-2 pt-2 border-t border-white/[0.06]">
                  <Link
                    href="/settings"
                    className="inline-flex items-center gap-1.5 text-xs text-[#00D4FF] hover:text-[#00E5A0] transition-colors"
                  >
                    <Settings className="w-3 h-3" />
                    Add BYOK key in Settings → Integrations
                  </Link>
                </div>
              )}

              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[10px] text-[#4A5068]">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {msg.role === "assistant" && !msg.isError && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="text-[#4A5068] hover:text-[#B8BED8] transition-colors"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#00D4FF]/20 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-[#00D4FF]" />
            </div>
            <div className="bg-white/[0.03] rounded-2xl rounded-bl-md px-3.5 py-2.5">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-[#00D4FF] animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-[#00D4FF] animate-bounce [animation-delay:0.1s]" />
                <div className="w-2 h-2 rounded-full bg-[#00D4FF] animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/[0.06] shrink-0">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask Co-Pilot anything about FuseIQ..."
            className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-[#4A5068] outline-none focus:border-[#00D4FF]/30 transition-colors"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="h-10 w-10 p-0 rounded-xl bg-[#00D4FF]/20 hover:bg-[#00D4FF]/30 text-[#00D4FF] border border-[#00D4FF]/20 disabled:opacity-30 shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-[10px] text-[#4A5068] mt-1.5 text-center">
          Co-Pilot answers FuseIQ platform questions only. Powered by DeepSeek Free Tier.
          <Link href="/settings" className="text-[#00D4FF] hover:underline ml-1">Add BYOK key →</Link>
        </p>
      </div>
    </GlassCard>
  );
}
