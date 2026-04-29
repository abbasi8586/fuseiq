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
} from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
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

    // Simulate AI response - replace with actual AI integration
    setTimeout(() => {
      const responses: Record<string, string> = {
        deploy:
          "I'll help you deploy a new agent. Navigate to **Agent Forge** and click 'New Agent'. You can choose from:\n\n• **Kimi** — Best for coding tasks\n• **GPT-4** — General purpose reasoning\n• **Claude** — Analysis and documentation\n• **CrewAI** — Multi-agent orchestration",
        workflow:
          "To run a workflow, go to **Swarm Canvas** and select a saved workflow. Currently available workflows:\n\n• **Code Review Pipeline** — Auto-review PRs\n• **Content Generation** — Blog + social posts\n• **Data Analysis** — Process CSVs and generate insights",
        analytics:
          "Your current metrics:\n\n• **Active Agents:** 3 online\n• **Executions Today:** 247\n• **Success Rate:** 94.2%\n• **Cost Today:** $12.47\n\nView full analytics at **/analytics**",
        cost:
          "Today's cost breakdown:\n\n• **OpenAI GPT-4:** $7.23 (58%)\n• **Kimi:** $3.12 (25%)\n• **Anthropic Claude:** $2.12 (17%)\n\nYou're **$37.53 under budget** today.",
        help:
          "I can help you with:\n\n1. **Agent Management** — Deploy, configure, monitor\n2. **Workflow Execution** — Run multi-agent pipelines\n3. **Performance Analysis** — Metrics, costs, efficiency\n4. **Team Operations** — Tasks, approvals, communications\n\nTry asking: 'Deploy an agent', 'Run workflow', or 'Show costs'",
      };

      const lowerInput = input.toLowerCase();
      let responseContent =
        responses[Object.keys(responses).find((k) => lowerInput.includes(k)) || ""];

      if (!responseContent) {
        responseContent =
          "I understand you're asking about **" +
          input +
          "**. I can help with that. Here are some options:\n\n• Use the **Command Palette** (⌘K) for quick actions\n• Check the **documentation** for detailed guides\n• Or rephrase your question with keywords like 'deploy', 'workflow', 'analytics', or 'cost'";
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  }, [input, isLoading]);

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <GlassCard className="flex flex-col h-[600px] max-h-[80vh]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#B829DD] flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">Co-Pilot</p>
          <p className="text-xs text-[#6B7290]">AI Assistant</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#00E5A0]/10 border border-[#00E5A0]/20">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00E5A0] animate-pulse" />
          <span className="text-[10px] text-[#00E5A0] font-medium">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${
              msg.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                msg.role === "user"
                  ? "bg-[#B829DD]/20 text-[#B829DD]"
                  : "bg-[#00D4FF]/20 text-[#00D4FF]"
              }`}
            >
              {msg.role === "user" ? (
                <User className="w-3.5 h-3.5" />
              ) : (
                <Bot className="w-3.5 h-3.5" />
              )}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#B829DD]/10 text-white rounded-br-md"
                  : "bg-white/[0.03] text-[#B8BED8] rounded-bl-md"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[10px] text-[#4A5068]">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {msg.role === "assistant" && (
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
      <div className="px-4 py-3 border-t border-white/[0.06]">
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
            placeholder="Ask Co-Pilot anything..."
            className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-[#4A5068] outline-none focus:border-[#00D4FF]/30 transition-colors"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="h-10 w-10 p-0 rounded-xl bg-[#00D4FF]/20 hover:bg-[#00D4FF]/30 text-[#00D4FF] border border-[#00D4FF]/20 disabled:opacity-30"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-[10px] text-[#4A5068] mt-1.5 text-center">
          Co-Pilot can make mistakes. Verify important actions.
        </p>
      </div>
    </GlassCard>
  );
}
