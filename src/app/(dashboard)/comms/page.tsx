"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Send,
  Hash,
  Bell,
  Pin,
  AtSign,
  Search,
  Plus,
  MoreHorizontal,
  Smile,
  Paperclip,
  Loader2,
  Bot,
  User,
  ChevronDown,
} from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const defaultChannels = [
  { id: "general", name: "general", type: "team", unread: 3, description: "General team discussions" },
  { id: "agents", name: "agent-commands", type: "agent", unread: 0, description: "Direct agent commands" },
  { id: "ops", name: "operations", type: "team", unread: 1, description: "Operations coordination" },
  { id: "approvals", name: "approvals", type: "team", unread: 0, description: "Approval notifications" },
  { id: "random", name: "random", type: "team", unread: 0, description: "Off-topic conversations" },
  { id: "engineering", name: "engineering", type: "department", unread: 5, description: "Engineering team" },
  { id: "marketing", name: "marketing", type: "department", unread: 0, description: "Marketing team" },
  { id: "announcements", name: "announcements", type: "announcement", unread: 0, description: "Important updates", pinned: true },
];

const defaultMembers = [
  { id: "1", name: "Awais Abbasi", role: "Director", status: "online", type: "Human" },
  { id: "2", name: "Rook AI", role: "Agent", status: "online", type: "AI" },
  { id: "3", name: "MarketingBot", role: "Agent", status: "busy", type: "AI" },
  { id: "4", name: "SupportAI", role: "Agent", status: "online", type: "AI" },
  { id: "5", name: "Sarah Chen", role: "Manager", status: "away", type: "Human" },
];

interface Message {
  id: string;
  channelId: string;
  authorId: string;
  authorName: string;
  authorType: "AI" | "Human";
  content: string;
  timestamp: string;
  isPinned?: boolean;
  reactions?: { emoji: string; count: number }[];
}

export default function CommsPage() {
  const [channels] = useState(defaultChannels);
  const [activeChannel, setActiveChannel] = useState("general");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = useCallback((channelId: string) => {
    // Demo messages
    const demoMessages: Record<string, Message[]> = {
      general: [
        { id: "1", channelId: "general", authorId: "2", authorName: "Rook AI", authorType: "AI", content: "Good morning team! Agent Forge processed 127 executions overnight with 94% efficiency.", timestamp: "2024-01-15T09:00:00Z" },
        { id: "2", channelId: "general", authorId: "1", authorName: "Awais Abbasi", authorType: "Human", content: "Excellent work. Can we get a cost breakdown for yesterday?", timestamp: "2024-01-15T09:05:00Z" },
        { id: "3", channelId: "general", authorId: "2", authorName: "Rook AI", authorType: "AI", content: "Yesterday's cost: $12.85. MarketingBot ($4.12), SupportAI ($1.87), Agent Forge ($2.34), CodeReview ($0.94), SalesScout ($3.45), DataSync ($0.23).", timestamp: "2024-01-15T09:06:00Z", reactions: [{ emoji: "👍", count: 2 }] },
      ],
      "agent-commands": [
        { id: "4", channelId: "agents", authorId: "1", authorName: "Awais Abbasi", authorType: "Human", content: "@MarketingBot Generate 10 email templates for the Q2 campaign", timestamp: "2024-01-15T10:00:00Z" },
        { id: "5", channelId: "agents", authorId: "3", authorName: "MarketingBot", authorType: "AI", content: "Generating email templates... ✅ Done! All 10 templates are ready in the workspace. Estimated cost: $0.45.", timestamp: "2024-01-15T10:02:00Z" },
      ],
      operations: [
        { id: "6", channelId: "ops", authorId: "2", authorName: "Rook AI", authorType: "AI", content: "Task 'Implement OAuth' moved from Todo → In Progress by CodeReview Bot", timestamp: "2024-01-15T11:00:00Z" },
        { id: "7", channelId: "ops", authorId: "5", authorName: "Sarah Chen", authorType: "Human", content: "@Rook Can we prioritize the security audit this week?", timestamp: "2024-01-15T11:30:00Z" },
      ],
    };
    setMessages(demoMessages[channelId] || []);
  }, []);

  useEffect(() => {
    loadMessages(activeChannel);
  }, [activeChannel, loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage: Message = {
      id: crypto.randomUUID(),
      channelId: activeChannel,
      authorId: "1",
      authorName: "Awais Abbasi",
      authorType: "Human",
      content: input,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Simulate AI response for agent-commands channel
    if (activeChannel === "agent-commands" && input.includes("@")) {
      setLoading(true);
      setTimeout(() => {
        const aiResponse: Message = {
          id: crypto.randomUUID(),
          channelId: activeChannel,
          authorId: "2",
          authorName: "Rook AI",
          authorType: "AI",
          content: `Command received. Processing your request... ✅ Task completed successfully.`,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiResponse]);
        setLoading(false);
      }, 1500);
    }
  };

  const activeChannelData = channels.find((c) => c.id === activeChannel);
  const activeMembers = defaultMembers;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[calc(100vh-8rem)] flex gap-4"
    >
      {/* Channel List */}
      <div className="w-56 shrink-0 flex flex-col gap-1"
      >
        <div className="flex items-center justify-between mb-2"
        >
          <h3 className="text-xs font-semibold text-[#6B7290] uppercase tracking-wider"
          >Channels</h3
          >
          <button onClick={() => toast.info("Create channel coming soon")} className="p-1 rounded hover:bg-white/5 text-[#6B7290]"
          >
            <Plus className="w-3.5 h-3.5" />
          </button
          >
        </div
        >
        {channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => setActiveChannel(channel.id)}
            className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm transition-all ${
              activeChannel === channel.id
                ? "bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20"
                : "text-[#6B7290] hover:text-white hover:bg-white/[0.03]"
            }`}
          >
            {channel.type === "announcement" ? (
              <Bell className="w-3.5 h-3.5" />
            ) : (
              <Hash className="w-3.5 h-3.5" />
            )}
            <span className="truncate flex-1 text-left">{channel.name}</span>
            {channel.unread > 0 && (
              <Badge className="h-4 min-w-4 px-1 bg-[#FF6B35] text-white text-[10px]"
              >
                {channel.unread}
              </Badge
              >
            )}
            {channel.pinned && <Pin className="w-3 h-3 text-[#FFC857]" />}
          </button
          >
        ))}
      </div
      >

      {/* Messages Area */}
      <GlassCard className="flex-1 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]"
        >
          <div className="flex items-center gap-2"
          >
            <Hash className="w-4 h-4 text-[#00D4FF]" />
            <h2 className="text-sm font-semibold text-white"
            >{activeChannelData?.name}</h2
            >
            <span className="text-xs text-[#6B7290]"
            >{activeChannelData?.description}</span
            >
          </div
          >
          <div className="flex items-center gap-2"
          >
            <button className="p-1.5 rounded hover:bg-white/5 text-[#6B7290]"
            >
              <Search className="w-4 h-4" />
            </button
            >
            <button className="p-1.5 rounded hover:bg-white/5 text-[#6B7290]"
            >
              <AtSign className="w-4 h-4" />
            </button
            >
            <button className="p-1.5 rounded hover:bg-white/5 text-[#6B7290]"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button
            >
          </div
          >
        </div
        >

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3"
        >
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 group"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                    message.authorType === "AI"
                      ? "bg-gradient-to-br from-[#00D4FF] to-[#B829DD]"
                      : "bg-gradient-to-br from-[#00E5A0] to-[#00D4FF]"
                  }`}
                >
                  {message.authorName.charAt(0)}
                </div
                >
                <div className="flex-1 min-w-0"
                >
                  <div className="flex items-center gap-2"
                  >
                    <span className="text-sm font-medium text-white"
                    >{message.authorName}</span
                    >
                    <Badge
                      variant="outline"
                      className="text-[10px] h-4"
                      style={{
                        borderColor: message.authorType === "AI" ? "#00D4FF40" : "#00E5A040",
                        color: message.authorType === "AI" ? "#00D4FF" : "#00E5A0",
                        backgroundColor: message.authorType === "AI" ? "#00D4FF10" : "#00E5A010",
                      }}
                    >
                      {message.authorType}
                    </Badge
                    >
                    <span className="text-[10px] text-[#4A5068]"
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span
                    >
                  </div
                  >
                  <p className="text-sm text-[#B8BED8] mt-0.5"
                  >{message.content}</p
                  >
                  {message.reactions && (
                    <div className="flex items-center gap-1 mt-1"
                    >
                      {message.reactions.map((r, i) => (
                        <span key={i} className="text-xs bg-white/[0.04] px-1.5 py-0.5 rounded-full text-[#6B7290]"
                        >
                          {r.emoji} {r.count}
                        </span
                        >
                      ))}
                    </div
                    >
                  )}
                </div
                >
              </motion.div
              >
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex items-center gap-2 text-[#6B7290]"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs">Agent is typing...</span
              >
            </div
            >
          )}
          <div ref={messagesEndRef} />
        </div
        >

        {/* Input */}
        <div className="px-4 py-3 border-t border-white/[0.04]"
        >
          <div className="flex items-center gap-2"
          >
            <button className="p-2 rounded-lg hover:bg-white/5 text-[#6B7290]"
            >
              <Paperclip className="w-4 h-4" />
            </button
            >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder={`Message #${activeChannelData?.name}`}
              className="flex-1 bg-white/[0.03] border-white/[0.06] text-white placeholder:text-[#4A5068]"
            />
            <button className="p-2 rounded-lg hover:bg-white/5 text-[#6B7290]"
            >
              <Smile className="w-4 h-4" />
            </button
            >
            <Button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#06070A]"
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button
            >
          </div
          >
        </div
        >
      </GlassCard
      >

      {/* Members */}
      <div className="w-48 shrink-0"
      >
        <h3 className="text-xs font-semibold text-[#6B7290] uppercase tracking-wider mb-2"
        >Members</h3
        >
        <div className="space-y-1"
        >
          {activeMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm text-[#6B7290] hover:text-white hover:bg-white/[0.03] cursor-pointer transition-colors"
            >
              <div className="relative"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    member.type === "AI"
                      ? "bg-gradient-to-br from-[#00D4FF] to-[#B829DD]"
                      : "bg-gradient-to-br from-[#00E5A0] to-[#00D4FF]"
                  }`}
                >
                  {member.name.charAt(0)}
                </div
                >
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#06070A]"
                  style={{
                    backgroundColor:
                      member.status === "online" ? "#00E5A0" : member.status === "busy" ? "#FF6B35" : "#FFC857",
                  }}
                />
              </div
              >
              <div className="flex-1 min-w-0"
              >
                <p className="text-sm truncate"
                >{member.name}</p
                >
                <p className="text-[10px] text-[#4A5068]"
                >{member.role}</p
                >
              </div
              >
            </div
            >
          ))}
        </div
        >
      </div
      >
    </motion.div
    >
  );
}
