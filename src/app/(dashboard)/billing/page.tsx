"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Check,
  Loader2,
  Zap,
  Shield,
  Users,
  Database,
  Activity,
  ArrowRight,
  Sparkles,
  Crown,
  Rocket,
} from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    description: "Perfect for trying out FuseIQ",
    icon: Rocket,
    color: "#6B7280",
    agents: 3,
    apiCalls: "10K",
    storage: "5GB",
    features: [
      "3 AI agents",
      "10K API calls/month",
      "5GB storage",
      "Basic analytics",
      "Community support",
      "Standard frameworks",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    id: "professional",
    name: "Professional",
    price: 99,
    description: "For growing teams and businesses",
    icon: Zap,
    color: "#00D4FF",
    agents: 25,
    apiCalls: "100K",
    storage: "50GB",
    features: [
      "25 AI agents",
      "100K API calls/month",
      "50GB storage",
      "Advanced analytics",
      "Priority support",
      "BYOK (Bring Your Own Keys)",
      "Custom workflows",
      "Team collaboration",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 499,
    description: "For organizations at scale",
    icon: Crown,
    color: "#B829DD",
    agents: "Unlimited",
    apiCalls: "1M",
    storage: "500GB",
    features: [
      "Unlimited agents",
      "1M API calls/month",
      "500GB storage",
      "SSO / SAML",
      "SOC 2 compliance",
      "Dedicated infrastructure",
      "White-label option",
      "SLA guarantee",
      "24/7 phone support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState("starter");
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    try {
      const res = await fetch("/api/billing/checkout");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setCurrentPlan(data.plan?.id || "starter");
    } catch {
      setCurrentPlan("starter");
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const handleCheckout = async (planId: string) => {
    if (planId === "starter") {
      toast.info("Starter plan is free!");
      return;
    }
    if (planId === "enterprise") {
      toast.info("Enterprise plan requires custom setup. Contact sales.");
      return;
    }

    setCheckoutLoading(planId);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          returnUrl: window.location.href,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Checkout failed");
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.success("Checkout session created (demo mode)");
      }
    } catch (err: any) {
      toast.error(err.message || "Checkout failed");
    } finally {
      setCheckoutLoading(null);
    }
  };

  const usage = {
    agents: { used: 6, limit: currentPlan === "starter" ? 3 : currentPlan === "professional" ? 25 : 100 },
    apiCalls: { used: 23400, limit: currentPlan === "starter" ? 10000 : currentPlan === "professional" ? 100000 : 1000000 },
    storage: { used: 12, limit: currentPlan === "starter" ? 5 : currentPlan === "professional" ? 50 : 500 },
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#00D4FF]" />
            Billing & Plans
          </h1>
          <p className="text-sm text-[#6B7290] mt-1">Manage your subscription and usage</p>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] border-[#00D4FF]/30 text-[#00D4FF]"
        >
          Current: {plans.find((p) => p.id === currentPlan)?.name}
        </Badge>
      </div>

      {/* Usage Overview */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-white mb-4">Usage This Month</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Agents", used: usage.agents.used, limit: usage.agents.limit, icon: Users, color: "#00D4FF" },
            { label: "API Calls", used: usage.apiCalls.used, limit: usage.apiCalls.limit, icon: Activity, color: "#00E5A0" },
            { label: "Storage (GB)", used: usage.storage.used, limit: usage.storage.limit, icon: Database, color: "#B829DD" },
          ].map((item) => {
            const percentage = (item.used / item.limit) * 100;
            const Icon = item.icon;
            return (
              <div key={item.label} className="p-3 rounded-lg bg-white/[0.02]">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4" style={{ color: item.color }} />
                  <span className="text-xs text-[#6B7290]">{item.label}</span>
                </div>
                <p className="text-lg font-bold text-white">
                  {item.used.toLocaleString()}{" "}
                  <span className="text-sm text-[#6B7290]">/ {item.limit.toLocaleString()}</span>
                </p>
                <div className="w-full h-1.5 rounded-full bg-white/[0.04] mt-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
                <p className="text-[10px] text-[#4A5068] mt-1">{percentage.toFixed(1)}% used</p>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = currentPlan === plan.id;
          return (
            <motion.div
              key={plan.id}
              whileHover={{ y: -4, scale: 1.01 }}
              className={`relative rounded-xl border p-5 transition-all ${
                plan.popular
                  ? "border-[#00D4FF]/30 bg-[#00D4FF]/5"
                  : "border-white/[0.06] bg-white/[0.02]"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#00D4FF] text-[#06070A] text-[10px]">
                  Most Popular
                </Badge>
              )}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${plan.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: plan.color }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-[#6B7290]">{plan.description}</p>
                </div>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-white">${plan.price}</span>
                <span className="text-sm text-[#6B7290]">/month</span>
              </div>
              <ul className="space-y-2 mb-5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-xs text-[#B8BED8]">
                    <Check className="w-3.5 h-3.5 text-[#00E5A0] shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleCheckout(plan.id)}
                disabled={isCurrent || !!checkoutLoading}
                className={`w-full ${
                  isCurrent
                    ? "bg-white/[0.04] text-[#6B7290] cursor-default"
                    : plan.popular
                    ? "bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#06070A]"
                    : "bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08]"
                }`}
              >
                {checkoutLoading === plan.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isCurrent ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Current Plan
                  </>
                ) : (
                  <>
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Enterprise CTA */}
      <GlassCard holographic className="text-center py-8">
        <Shield className="w-10 h-10 text-[#B829DD] mx-auto mb-3" />
        <h3 className="text-xl font-bold text-white mb-2">Need a Custom Solution?</h3>
        <p className="text-sm text-[#6B7290] max-w-md mx-auto mb-4">
          Enterprise plans include dedicated infrastructure, custom integrations, and a dedicated success manager.
        </p>
        <Button
          onClick={() => toast.info("Contact: enterprise@fuseiq.ai")}
          className="bg-[#B829DD]/10 text-[#B829DD] hover:bg-[#B829DD]/20 border border-[#B829DD]/30"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Contact Sales
        </Button>
      </GlassCard>
    </motion.div>
  );
}
