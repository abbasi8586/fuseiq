"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Key, Bell, Shield, Users, CreditCard, Globe, Trash2, Save } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const providers = [
  { name: "Kimi", keyType: "Kimi API Key", models: ["Kimi K2", "Kimi K1.5", "Kimi Lite"], connected: true, color: "#00D4FF" },
  { name: "OpenAI", keyType: "OpenAI API Key", models: ["GPT-5", "GPT-4o", "GPT-4o-mini"], connected: true, color: "#00E5A0" },
  { name: "Anthropic", keyType: "Anthropic API Key", models: ["Claude 3.5 Sonnet", "Claude 3 Opus"], connected: true, color: "#B829DD" },
  { name: "Google", keyType: "Google AI API Key", models: ["Gemini 2.0 Pro", "Gemini 2.0 Flash"], connected: false, color: "#FF6B35" },
  { name: "xAI Grok", keyType: "xAI API Key", models: ["Grok-2", "Grok-2 Mini"], connected: false, color: "#FFC857" },
];

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [costAlerts, setCostAlerts] = useState(true);
  const [dailyLimit, setDailyLimit] = useState("50");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#00D4FF]" />
          Settings
        </h1>
        <p className="text-sm text-[#6B7290] mt-1">Manage your workspace, API keys, and preferences</p>
      </div>

      <Tabs defaultValue="providers" className="space-y-6">
        <TabsList className="bg-[#0F111A] border border-white/[0.06]">
          <TabsTrigger value="providers" className="data-[state=active]:bg-[#00D4FF]/15 data-[state=active]:text-[#00D4FF]">
            <Key className="w-4 h-4 mr-2" />
            Providers
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-[#00D4FF]/15 data-[state=active]:text-[#00D4FF]">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-[#00D4FF]/15 data-[state=active]:text-[#00D4FF]">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-[#00D4FF]/15 data-[state=active]:text-[#00D4FF]">
            <CreditCard className="w-4 h-4 mr-2" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-4">
          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-1">BYOK Providers</h3>
            <p className="text-sm text-[#6B7290] mb-4">Connect your own API keys. We never mark up costs.</p>
            <div className="space-y-3">
              {providers.map((provider) => (
                <div key={provider.name} className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${provider.color}15` }}>
                      <Key className="w-5 h-5" style={{ color: provider.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{provider.name}</p>
                      <p className="text-xs text-[#6B7290]">{provider.models.join(" · ")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: provider.connected ? "rgba(0,229,160,0.08)" : "rgba(255,71,87,0.08)",
                        color: provider.connected ? "#00E5A0" : "#FF4757",
                      }}
                    >
                      {provider.connected ? "Connected" : "Not Connected"}
                    </span>
                    <Button size="sm" variant="outline" className="border-white/[0.08] text-[#B8BED8]">
                      {provider.connected ? "Manage" : "Connect"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
                <div>
                  <p className="text-sm text-white">Email Notifications</p>
                  <p className="text-xs text-[#6B7290]">Receive updates via email</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
                <div>
                  <p className="text-sm text-white">Push Notifications</p>
                  <p className="text-xs text-[#6B7290]">Browser and mobile push alerts</p>
                </div>
                <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
                <div>
                  <p className="text-sm text-white">Cost Alerts</p>
                  <p className="text-xs text-[#6B7290]">Warn when approaching spend limits</p>
                </div>
                <Switch checked={costAlerts} onCheckedChange={setCostAlerts} />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm text-white">Daily Spend Limit</p>
                  <p className="text-xs text-[#6B7290]">Maximum daily AI spend</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#6B7290]">$</span>
                  <Input
                    value={dailyLimit}
                    onChange={(e) => setDailyLimit(e.target.value)}
                    className="w-20 h-8 bg-white/[0.03] border-white/[0.06] text-sm text-white"
                  />
                </div>
              </div>
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-[#00E5A0]/5 border border-[#00E5A0]/20">
                <p className="text-sm font-medium text-[#00E5A0]">Encryption Active</p>
                <p className="text-xs text-[#6B7290] mt-1">All API keys encrypted with AES-256-GCM</p>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
                <div>
                  <p className="text-sm text-white">Two-Factor Authentication</p>
                  <p className="text-xs text-[#6B7290]">Require 2FA for all admin actions</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm text-white">Audit Log Retention</p>
                  <p className="text-xs text-[#6B7290]">Keep immutable logs for 7 years</p>
                </div>
                <span className="text-xs text-[#00E5A0]">Enabled</span>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="border-[#FF4757]/20">
            <h3 className="text-lg font-semibold text-[#FF4757] mb-2">Danger Zone</h3>
            <p className="text-sm text-[#6B7290] mb-4">Destructive actions that cannot be undone.</p>
            <Button variant="outline" className="border-[#FF4757]/30 text-[#FF4757] hover:bg-[#FF4757]/10">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Workspace
            </Button>
          </GlassCard>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-4">Current Plan</h3>
            <div className="p-4 rounded-lg bg-gradient-to-r from-[#00D4FF]/10 to-[#B829DD]/10 border border-[#00D4FF]/20">
              <div className="flex items-center justify-between mb-2">
                <p className="text-lg font-bold text-white">Professional</p>
                <span className="text-xs px-2 py-1 rounded-full bg-[#00D4FF]/20 text-[#00D4FF]">Current</span>
              </div>
              <p className="text-sm text-[#B8BED8]">$99/month · 25 agents · 10 users · 50K executions</p>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7290]">Agents used</span>
                <span className="text-white">6 / 25</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.06]">
                <div className="h-full rounded-full bg-[#00D4FF]" style={{ width: "24%" }} />
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-[#6B7290]">Users</span>
                <span className="text-white">3 / 10</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.06]">
                <div className="h-full rounded-full bg-[#B829DD]" style={{ width: "30%" }} />
              </div>
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
