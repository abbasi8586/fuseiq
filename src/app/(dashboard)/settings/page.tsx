"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Key,
  Shield,
  Bell,
  Users,
  CreditCard,
  Globe,
  Save,
  Loader2,
  Check,
  AlertTriangle,
  Plus,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const tabs = [
  { id: "providers", label: "Providers", icon: Key },
  { id: "workspace", label: "Workspace", icon: Globe },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "team", label: "Team", icon: Users },
];

const providersList = [
  { id: "openai", name: "OpenAI", models: ["gpt-4", "gpt-3.5-turbo"], costInput: 0.03, costOutput: 0.06, active: true },
  { id: "anthropic", name: "Anthropic", models: ["claude-3-opus", "claude-3-sonnet"], costInput: 0.015, costOutput: 0.075, active: true },
  { id: "kimi", name: "Kimi", models: ["k2.5", "k2.0"], costInput: 0.008, costOutput: 0.032, active: true },
  { id: "google", name: "Google", models: ["gemini-pro", "gemini-ultra"], costInput: 0.005, costOutput: 0.015, active: false },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("providers");
  const [saving, setSaving] = useState(false);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [newProvider, setNewProvider] = useState({ name: "", key: "" });
  const [addingProvider, setAddingProvider] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Settings saved successfully");
    setSaving(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#00D4FF]" />
            Settings
          </h1>
          <p className="text-sm text-[#6B7290] mt-1">Configure your workspace and integrations</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="neon-button border-0 bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#06070A]">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="flex gap-4">
        {/* Sidebar */}
        <div className="w-48 shrink-0 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20"
                    : "text-[#6B7290] hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {activeTab === "providers" && (
            <>
              <GlassCard>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Key className="w-5 h-5 text-[#00D4FF]" />
                      AI Provider Keys
                    </h3>
                    <p className="text-xs text-[#6B7290] mt-0.5">Manage your API keys for each provider</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setAddingProvider(!addingProvider)}
                    className="bg-[#00D4FF]/10 text-[#00D4FF] hover:bg-[#00D4FF]/20 border border-[#00D4FF]/30"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Provider
                  </Button>
                </div>

                {addingProvider && (
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] mb-3 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Provider name"
                        value={newProvider.name}
                        onChange={(e) => setNewProvider((p) => ({ ...p, name: e.target.value }))}
                        className="bg-white/[0.03] border-white/[0.06] text-white placeholder:text-[#4A5068] h-8 text-sm"
                      />
                      <div className="relative">
                        <Input
                          type={showKey["new"] ? "text" : "password"}
                          placeholder="API key"
                          value={newProvider.key}
                          onChange={(e) => setNewProvider((p) => ({ ...p, key: e.target.value }))}
                          className="bg-white/[0.03] border-white/[0.06] text-white placeholder:text-[#4A5068] h-8 text-sm pr-8"
                        />
                        <button
                          onClick={() => setShowKey((s) => ({ ...s, new: !s["new"] }))}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-[#4A5068]"
                        >
                          {showKey["new"] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setAddingProvider(false)}
                        className="h-7 border-white/[0.08] text-[#6B7290] hover:text-white text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          toast.success(`Provider "${newProvider.name}" added`);
                          setAddingProvider(false);
                          setNewProvider({ name: "", key: "" });
                        }}
                        className="h-7 bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#06070A] text-xs"
                      >
                        Add Provider
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {providersList.map((provider) => (
                    <div
                      key={provider.id}
                      className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#B829DD] flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {provider.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">{provider.name}</span>
                          <Badge
                            variant="outline"
                            className="text-[10px] h-5"
                            style={{
                              borderColor: provider.active ? "#00E5A040" : "#FF475740",
                              color: provider.active ? "#00E5A0" : "#FF4757",
                              backgroundColor: provider.active ? "#00E5A010" : "#FF475710",
                            }}
                          >
                            {provider.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-[#6B7290]">
                          <span>{provider.models.join(", ")}</span>
                          <span>·</span>
                          <span>${provider.costInput}/1K in · ${provider.costOutput}/1K out</span>
                        </div>
                      </div>
                      <div className="relative w-48 shrink-0">
                        <Input
                          type={showKey[provider.id] ? "text" : "password"}
                          defaultValue="sk-••••••••••••••••••••••••••••••"
                          readOnly
                          className="bg-white/[0.03] border-white/[0.06] text-white h-8 text-xs"
                        />
                        <button
                          onClick={() => setShowKey((s) => ({ ...s, [provider.id]: !s[provider.id] }))}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-[#4A5068] hover:text-white"
                        >
                          {showKey[provider.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <Switch checked={provider.active} />
                      <button className="p-1.5 rounded-lg hover:bg-white/5 text-[#6B7290] hover:text-[#FF4757] transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-[#00E5A0]" />
                  Security
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
                    <div>
                      <p className="text-sm text-white">Encrypt API keys at rest</p>
                      <p className="text-xs text-[#6B7290]">AES-256 encryption for all stored keys</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
                    <div>
                      <p className="text-sm text-white">Rotate keys automatically</p>
                      <p className="text-xs text-[#6B7290]">Rotate every 90 days</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
                    <div>
                      <p className="text-sm text-white">Key access logging</p>
                      <p className="text-xs text-[#6B7290]">Log all key usage to audit trail</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </GlassCard>
            </>
          )}

          {activeTab === "workspace" && (
            <GlassCard>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-[#B829DD]" />
                Workspace Configuration
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-[#6B7290] mb-1.5 block">Workspace Name</label>
                  <Input defaultValue="Abbasi Global LLC" className="bg-white/[0.03] border-white/[0.06] text-white" />
                </div>
                <div>
                  <label className="text-xs text-[#6B7290] mb-1.5 block">Slug</label>
                  <Input defaultValue="abbasi-global" className="bg-white/[0.03] border-white/[0.06] text-white" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#6B7290] mb-1.5 block">Timezone</label>
                    <Input defaultValue="America/New_York" className="bg-white/[0.03] border-white/[0.06] text-white" />
                  </div>
                  <div>
                    <label className="text-xs text-[#6B7290] mb-1.5 block">Plan</label>
                    <Input defaultValue="Professional" readOnly className="bg-white/[0.03] border-white/[0.06] text-[#00D4FF]" />
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#FFC857]/5 border border-[#FFC857]/10 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#FFC857] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#6B7290]">Changing workspace slug will update all shared URLs. This action cannot be undone.</p>
                </div>
              </div>
            </GlassCard>
          )}

          {activeTab === "notifications" && (
            <GlassCard>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-[#FF6B35]" />
                Notification Preferences
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Agent execution failures", desc: "Get notified when an agent fails", checked: true },
                  { label: "High-risk approvals", desc: "Alert for critical risk level actions", checked: true },
                  { label: "Cost threshold alerts", desc: "When daily cost exceeds $50", checked: true },
                  { label: "New agent deployments", desc: "When a new agent is deployed", checked: false },
                  { label: "Weekly summary", desc: "Every Monday with workspace stats", checked: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
                    <div>
                      <p className="text-sm text-white">{item.label}</p>
                      <p className="text-xs text-[#6B7290]">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.checked} />
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {activeTab === "billing" && (
            <GlassCard>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-[#00E5A0]" />
                Billing & Usage
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-[#00D4FF]/5 to-[#B829DD]/5 border border-[#00D4FF]/10">
                  <p className="text-xs text-[#6B7290] mb-1">Current Plan</p>
                  <p className="text-xl font-bold text-white">Professional</p>
                  <p className="text-xs text-[#6B7290] mt-1">$99/month · Renews on May 15, 2024</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Agent Limit", value: "25", used: "6" },
                    { label: "API Calls", value: "100K", used: "23K" },
                    { label: "Storage", value: "50GB", used: "12GB" },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-lg bg-white/[0.02] text-center">
                      <p className="text-xs text-[#6B7290] mb-1">{item.label}</p>
                      <p className="text-lg font-bold text-white">{item.used} <span className="text-sm text-[#6B7290]">/ {item.value}</span></p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
                  <div>
                    <p className="text-sm text-white">Auto-top up</p>
                    <p className="text-xs text-[#6B7290]">Add $50 when balance falls below $10</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </GlassCard>
          )}

          {activeTab === "team" && (
            <GlassCard>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-[#00D4FF]" />
                Team Members
              </h3>
              <div className="space-y-2">
                {[
                  { name: "Awais Abbasi", role: "Director", email: "awais@abbasi.global", status: "online" },
                  { name: "Rook AI", role: "Agent", email: "rook@fuseiq.ai", status: "online", type: "AI" },
                  { name: "Sarah Chen", role: "Manager", email: "sarah@abbasi.global", status: "away" },
                ].map((member) => (
                  <div key={member.name} className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#B829DD] flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{member.name}</span>
                        <Badge
                          variant="outline"
                          className="text-[10px] h-5"
                          style={{
                            borderColor: member.type === "AI" ? "#00D4FF40" : "#00E5A040",
                            color: member.type === "AI" ? "#00D4FF" : "#00E5A0",
                            backgroundColor: member.type === "AI" ? "#00D4FF10" : "#00E5A010",
                          }}
                        >
                          {member.role}
                        </Badge>
                      </div>
                      <p className="text-xs text-[#6B7290]">{member.email}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: member.status === "online" ? "#00E5A0" : member.status === "away" ? "#FFC857" : "#FF4757",
                        }}
                      />
                      <span className="text-xs text-[#6B7290] capitalize">{member.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </motion.div>
  );
}
