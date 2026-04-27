"use client";

import { motion } from "framer-motion";
import { MessageSquare, Hash, Pin, Send, Paperclip, Smile } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const channels = [
  { name: "All Team", unread: 0, active: true },
  { name: "All Agents", unread: 3, active: false },
  { name: "Engineering", unread: 0, active: false },
  { name: "Marketing", unread: 12, active: false },
  { name: "Operations", unread: 0, active: false },
  { name: "Executive", unread: 1, active: false },
  { name: "Announcements", unread: 0, active: false },
  { name: "Agent Commands", unread: 0, active: false },
];

const messages = [
  { id: "1", author: "Agent Forge Lead", type: "AI", content: "Security audit completed for all repositories. 0 critical issues found. 3 warnings flagged for review.", time: "10 min ago" },
  { id: "2", author: "Sarah Chen", type: "Human", content: "Great work! Can we schedule a review of the warnings tomorrow at 9 AM UTC?", time: "8 min ago" },
  { id: "3", author: "MarketingBot Pro", type: "AI", content: "Email campaign draft ready for review. Subject: 'FuseIQ v3.0 Launch - The Future of AI Orchestration'. Open rate prediction: 34%.", time: "5 min ago" },
  { id: "4", author: "Awais Abbasi", type: "Human", content: "Approve the campaign. Let's ship it.", time: "2 min ago" },
];

const onlineMembers = [
  { name: "Agent Forge Lead", type: "AI", status: "online" },
  { name: "Sarah Chen", type: "Human", status: "online" },
  { name: "SupportAI", type: "AI", status: "online" },
  { name: "Elena Rodriguez", type: "Human", status: "online" },
  { name: "CodeReview Bot", type: "AI", status: "busy" },
];

export default function CommunicationsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[calc(100vh-7rem)] -m-6 flex"
    >
      {/* Channel Sidebar */}
      <div className="w-60 border-r border-white/[0.06] p-4 space-y-1 overflow-y-auto"
      >
        <div className="flex items-center gap-2 mb-4 px-2"
        >
          <MessageSquare className="w-5 h-5 text-[#00D4FF]" />
          <h2 className="font-semibold text-white"
          >Channels</h2>
        </div>
        {channels.map((channel) => (
          <button
            key={channel.name}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              channel.active
                ? "bg-[#00D4FF]/10 text-[#00D4FF]"
                : "text-[#6B7290] hover:text-white hover:bg-white/5"
            }`}
          >
            <Hash className="w-4 h-4" />
            <span className="flex-1 text-left"
            >{channel.name}</span>
            {channel.unread > 0 && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-[#FF4757]/20 text-[#FF4757]"
              >
                {channel.unread}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Message Area */}
      <div className="flex-1 flex flex-col"
      >
        {/* Channel Header */}
        <div className="h-12 border-b border-white/[0.06] flex items-center px-4 justify-between"
        >
          <div className="flex items-center gap-2"
          >
            <Hash className="w-4 h-4 text-[#4A5068]" />
            <span className="font-medium text-white"
            >All Team</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#4A5068]"
          >
            <span>5 online</span>
            <Pin className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages.map((msg) => (
            <div key={msg.id} className="flex gap-3"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                msg.type === "AI"
                  ? "bg-gradient-to-br from-[#00D4FF] to-[#B829DD] text-white"
                  : "bg-white/10 text-[#B8BED8]"
              }`}
              >
                {msg.author.charAt(0)}
              </div>
              <div className="flex-1"
              >
                <div className="flex items-center gap-2 mb-0.5"
                >
                  <span className="text-sm font-medium text-white"
                  >{msg.author}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.05] text-[#4A5068]"
                  >
                    {msg.type}
                  </span>
                  <span className="text-xs text-[#4A5068]"
                  >{msg.time}</span>
                </div>
                <p className="text-sm text-[#B8BED8] leading-relaxed"
                >{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/[0.06]"
        >
          <div className="flex items-center gap-2"
          >
            <button className="p-2 rounded-lg hover:bg-white/5 text-[#4A5068] hover:text-white transition-colors"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <Input
              placeholder="Message #All Team..."
              className="flex-1 h-10 bg-white/[0.03] border-white/[0.06]"
            />
            <button className="p-2 rounded-lg hover:bg-white/5 text-[#4A5068] hover:text-white transition-colors"
            >
              <Smile className="w-4 h-4" />
            </button>
            <Button size="sm" className="neon-button border-0 h-10"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Members Panel */}
      <div className="w-56 border-l border-white/[0.06] p-4 hidden lg:block"
      >
        <h3 className="text-xs font-medium text-[#4A5068] uppercase tracking-wider mb-3"
        >Online — {onlineMembers.length}</h3>
        <div className="space-y-2"
        >
          {onlineMembers.map((member) => (
            <div key={member.name} className="flex items-center gap-2"
            >
              <div className="relative"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#B829DD] flex items-center justify-center text-white text-xs font-bold"
                >
                  {member.name.charAt(0)}
                </div>
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-[#0A0B10]"
                  style={{
                    backgroundColor:
                      member.status === "online" ? "#00E5A0" : "#FF6B35"
                  }}
                />
              </div>
              <span className="text-sm text-[#B8BED8]"
              >{member.name}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
