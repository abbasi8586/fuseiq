"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SettingsTabsProps {
  tabs: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    content: React.ReactNode;
  }>;
}

export function SettingsTabs({ tabs }: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar Tabs */}
      <div className="lg:w-64 flex-shrink-0">
        <div className="glass-card p-2 rounded-xl space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-primary-cyan/15 text-primary-cyan border border-primary-cyan/30"
                  : "text-text-muted hover:text-text-body hover:bg-white/5"
              }`}
            >
              <span className="flex-shrink-0">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {tabs.find((t) => t.id === activeTab)?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
