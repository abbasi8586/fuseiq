"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Plug,
  CreditCard,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Check,
  ChevronRight,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { SettingsTabs } from "@/components/settings/settings-tabs";

// ── Sub-components for each tab ────────────────────────────

function GeneralTab() {
  const [workspace, setWorkspace] = useState("FuseIQ Production");
  const [timezone, setTimezone] = useState("America/New_York");
  const [theme, setTheme] = useState("dark");

  const themes = [
    { id: "dark", label: "Dark", icon: Moon },
    { id: "light", label: "Light", icon: Sun },
    { id: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="glass-card p-6 rounded-xl space-y-6">
      <div>
        <h3 className="text-text-hero font-semibold mb-1">General Settings</h3>
        <p className="text-text-muted text-sm">Manage your workspace preferences</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-body mb-2">
            Workspace Name
          </label>
          <input
            type="text"
            value={workspace}
            onChange={(e) => setWorkspace(e.target.value)}
            className="glass-input w-full px-4 py-2.5 rounded-lg text-text-hero text-sm focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-body mb-2">
            Timezone
          </label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="glass-input w-full px-4 py-2.5 rounded-lg text-text-hero text-sm focus:outline-none appearance-none cursor-pointer"
          >
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="UTC">UTC</option>
            <option value="Europe/London">London (GMT)</option>
            <option value="Asia/Tokyo">Tokyo (JST)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-body mb-3">
            Theme
          </label>
          <div className="flex gap-3">
            {themes.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                    theme === t.id
                      ? "border-primary-cyan/50 bg-primary-cyan/10 text-primary-cyan"
                      : "border-white/10 text-text-muted hover:text-text-body hover:border-white/20"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/10 flex justify-end">
        <button className="neon-button px-6 py-2.5 rounded-lg text-sm font-medium">
          Save Changes
        </button>
      </div>
    </div>
  );
}

function IntegrationsTab() {
  const [keys, setKeys] = useState({
    openai: "sk-•••••••••••••••••••••••••••••••••••••••••••",
    kimi: "kimi-••••••••••••••••••••••••••••••••••••••••••",
    anthropic: "sk-ant-••••••••••••••••••••••••••••••••••••••",
  });
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  const toggleVisible = (provider: string) => {
    setVisible((v) => ({ ...v, [provider]: !v[provider] }));
  };

  const providers = [
    { id: "openai", label: "OpenAI", placeholder: "sk-..." },
    { id: "kimi", label: "Kimi", placeholder: "kimi-..." },
    { id: "anthropic", label: "Anthropic", placeholder: "sk-ant-..." },
  ];

  return (
    <div className="glass-card p-6 rounded-xl space-y-6">
      <div>
        <h3 className="text-text-hero font-semibold mb-1">API Integrations</h3>
        <p className="text-text-muted text-sm">
          Connect your LLM provider API keys
        </p>
      </div>

      <div className="space-y-4">
        {providers.map((p) => (
          <div key={p.id}>
            <label className="block text-sm font-medium text-text-body mb-2">
              {p.label} API Key
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={visible[p.id] ? "text" : "password"}
                  value={keys[p.id as keyof typeof keys]}
                  onChange={(e) =>
                    setKeys((k) => ({ ...k, [p.id]: e.target.value }))
                  }
                  placeholder={p.placeholder}
                  className="glass-input w-full px-4 py-2.5 rounded-lg text-text-hero text-sm focus:outline-none pr-10"
                />
                <button
                  onClick={() => toggleVisible(p.id)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-body transition-colors"
                >
                  {visible[p.id] ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <button className="neon-button px-4 py-2.5 rounded-lg text-sm font-medium">
                Verify
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-lg bg-warn/10 border border-warn/20">
        <p className="text-warn text-sm">
          <strong>Security Note:</strong> API keys are encrypted at rest and never
          exposed in client-side code.
        </p>
      </div>
    </div>
  );
}

function BillingTab() {
  const plan = {
    name: "Pro",
    price: "$49",
    period: "/month",
    nextBilling: "May 15, 2026",
    usage: {
      executions: { used: 84723, limit: 100000, pct: 84.7 },
      storage: { used: 2.4, limit: 10, pct: 24 },
      agents: { used: 12, limit: 25, pct: 48 },
    },
  };

  return (
    <div className="space-y-6">
      {/* Plan Card */}
      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-text-hero font-semibold mb-1">
              Current Plan
            </h3>
            <p className="text-text-muted text-sm">
              Your subscription details
            </p>
          </div>
          <div className="px-3 py-1 rounded-full bg-primary-cyan/15 border border-primary-cyan/30 text-primary-cyan text-xs font-semibold uppercase tracking-wider">
            {plan.name}
          </div>
        </div>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-3xl font-bold text-text-hero">
            {plan.price}
          </span>
          <span className="text-text-muted text-sm">{plan.period}</span>
        </div>
        <p className="text-text-muted text-sm mb-4">
          Next billing: {plan.nextBilling}
        </p>
        <button className="neon-purple px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2">
          Upgrade to Enterprise
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Usage Stats */}
      <div className="glass-card p-6 rounded-xl space-y-4">
        <h3 className="text-text-hero font-semibold mb-1">Usage This Month</h3>

        {Object.entries(plan.usage).map(([key, stat]) => (
          <div key={key}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-text-body capitalize">{key}</span>
              <span className="text-text-muted">
                {key === "storage"
                  ? `${stat.used}GB / ${stat.limit}GB`
                  : `${stat.used.toLocaleString()} / ${stat.limit.toLocaleString()}`}
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stat.pct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  stat.pct > 90
                    ? "bg-danger"
                    : stat.pct > 70
                      ? "bg-warn"
                      : "bg-primary-cyan"
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [settings, setSettings] = useState({
    emailAlerts: true,
    emailReports: false,
    inAppAlerts: true,
    inAppMentions: true,
    pushNotifications: false,
    weeklyDigest: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((s) => ({ ...s, [key]: !s[key] }));
  };

  const items = [
    { key: "emailAlerts", label: "Email Alerts", desc: "Critical system alerts and errors" },
    { key: "emailReports", label: "Email Reports", desc: "Daily/weekly summary reports" },
    { key: "inAppAlerts", label: "In-App Alerts", desc: "Real-time notifications in dashboard" },
    { key: "inAppMentions", label: "Mentions", desc: "When someone mentions you" },
    { key: "pushNotifications", label: "Push Notifications", desc: "Browser push for critical events" },
    { key: "weeklyDigest", label: "Weekly Digest", desc: "Performance summary every Monday" },
  ] as const;

  return (
    <div className="glass-card p-6 rounded-xl space-y-6">
      <div>
        <h3 className="text-text-hero font-semibold mb-1">
          Notification Preferences
        </h3>
        <p className="text-text-muted text-sm">
          Control how and when you receive updates
        </p>
      </div>

      <div className="space-y-1">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
          >
            <div>
              <p className="text-text-body text-sm font-medium">{item.label}</p>
              <p className="text-text-muted text-xs">{item.desc}</p>
            </div>
            <button
              onClick={() => toggle(item.key)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
                settings[item.key] ? "bg-primary-cyan" : "bg-white/10"
              }`}
            >
              <motion.div
                animate={{
                  x: settings[item.key] ? 22 : 2,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 left-0 w-4 h-4 rounded-full bg-white shadow-lg"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecurityTab() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFA, setTwoFA] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <div className="glass-card p-6 rounded-xl space-y-4">
        <div>
          <h3 className="text-text-hero font-semibold mb-1">
            Change Password
          </h3>
          <p className="text-text-muted text-sm">
            Update your account password
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-text-body mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full px-4 py-2.5 rounded-lg text-text-hero text-sm focus:outline-none pr-10"
                placeholder="Enter new password"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-body"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-body mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="glass-input w-full px-4 py-2.5 rounded-lg text-text-hero text-sm focus:outline-none"
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button className="neon-button px-6 py-2.5 rounded-lg text-sm font-medium">
            Update Password
          </button>
        </div>
      </div>

      {/* Two-Factor Auth */}
      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-text-hero font-semibold mb-1">
              Two-Factor Authentication
            </h3>
            <p className="text-text-muted text-sm">
              Add an extra layer of security to your account
            </p>
          </div>
          <button
            onClick={() => setTwoFA(!twoFA)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
              twoFA ? "bg-signal" : "bg-white/10"
            }`}
          >
            <motion.div
              animate={{ x: twoFA ? 22 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-1 left-0 w-4 h-4 rounded-full bg-white shadow-lg"
            />
          </button>
        </div>

        {twoFA && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 p-4 rounded-lg bg-signal/10 border border-signal/20"
          >
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-full bg-signal/20 mt-0.5">
                <Check className="w-4 h-4 text-signal" />
              </div>
              <div>
                <p className="text-signal text-sm font-medium">
                  2FA Enabled
                </p>
                <p className="text-text-muted text-xs mt-1">
                  Authenticator app configured. Recovery codes saved.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────

export default function SettingsPage() {
  const tabs = [
    {
      id: "general",
      label: "General",
      icon: <Settings className="w-4 h-4" />,
      content: <GeneralTab />,
    },
    {
      id: "integrations",
      label: "Integrations",
      icon: <Plug className="w-4 h-4" />,
      content: <IntegrationsTab />,
    },
    {
      id: "billing",
      label: "Billing",
      icon: <CreditCard className="w-4 h-4" />,
      content: <BillingTab />,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="w-4 h-4" />,
      content: <NotificationsTab />,
    },
    {
      id: "security",
      label: "Security",
      icon: <Shield className="w-4 h-4" />,
      content: <SecurityTab />,
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-text-hero">Settings</h1>
        <p className="text-text-muted text-sm mt-1">
          Manage your workspace, integrations, and account preferences
        </p>
      </motion.div>

      <SettingsTabs tabs={tabs} />
    </div>
  );
}
