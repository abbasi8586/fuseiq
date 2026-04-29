"use client";

import { motion } from "framer-motion";
import { CoPilotChat } from "@/components/copilot/co-pilot-chat";
import { MessageSquare, X } from "lucide-react";
import { useState } from "react";

export default function CoPilotPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-full flex">
      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#B829DD] flex items-center justify-center shadow-lg shadow-[#00D4FF]/20">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-gradient">Co-Pilot</span>
          </h1>
          <p className="text-sm text-[#6B7290] mt-2">
            Your AI assistant for managing agents, workflows, and operations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <CoPilotChat />
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-4"
            >
              <h3 className="text-sm font-medium text-white mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-[#00D4FF]/10 text-[#00D4FF] text-sm hover:bg-[#00D4FF]/20 transition-colors text-left">
                  Deploy New Agent
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-[#B829DD]/10 text-[#B829DD] text-sm hover:bg-[#B829DD]/20 transition-colors text-left">
                  Run Workflow
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-[#00E5A0]/10 text-[#00E5A0] text-sm hover:bg-[#00E5A0]/20 transition-colors text-left">
                  View Analytics
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FF6B35]/10 text-[#FF6B35] text-sm hover:bg-[#FF6B35]/20 transition-colors text-left">
                  Request Approval
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-4"
            >
              <h3 className="text-sm font-medium text-white mb-3">
                Recent Commands
              </h3>
              <div className="space-y-2 text-sm text-[#6B7290]">
                <p>• "Deploy Kimi agent for code review"</p>
                <p>• "Show cost breakdown"</p>
                <p>• "Run content workflow"</p>
                <p>• "Approve production deploy"</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
