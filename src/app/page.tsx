"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Zap, Shield, BarChart3, GitBranch, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  {
    icon: Zap,
    title: "BYOK Architecture",
    description: "Bring Your Own Key. Connect any LLM provider with zero markup. Full cost transparency.",
    color: "#00D4FF",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Live cost tracking, agent performance metrics, and execution trends updating every second.",
    color: "#00E5A0",
  },
  {
    icon: GitBranch,
    title: "Swarm Orchestration",
    description: "Visual drag-and-drop canvas for multi-agent workflows with predictive simulation.",
    color: "#B829DD",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "AES-256-GCM encryption, immutable audit logs, SOC 2 compliance path, and RBAC.",
    color: "#FF6B35",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#06070A] text-white overflow-hidden">
      {/* Hero */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#B829DD] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-gradient">FuseIQ</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/staff" className="text-sm text-[#B8BED8] hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/staff">
              <Button className="neon-button border-0 text-sm">
                Launch Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
              v3.0 New Platform Edition
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              The AI Agent{" "}
              <span className="text-gradient">Command Center</span>
            </h1>
            <p className="text-xl text-[#6B7290] max-w-2xl mx-auto mb-10">
              Bring your own keys. Orchestrate your swarm. Monitor everything in real-time through a 
              cyber-luxury glassmorphism dashboard built for 2030.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/staff">
                <Button size="lg" className="neon-button border-0 text-lg px-8">
                  Enter Command Center
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white/[0.08] text-[#B8BED8] hover:text-white hover:bg-white/5 px-8">
                View Documentation
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto"
          >
            {[
              { value: "7+", label: "LLM Providers" },
              { value: "12", label: "Team Members" },
              { value: "98.7%", label: "Success Rate" },
              { value: "0.042s", label: "Avg Cost/Run" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-[#6B7290] mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Platform Capabilities</h2>
            <p className="text-[#6B7290]">Everything you need to manage AI agents at scale</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="glass-card p-6 hover:glass-card-hover transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-[#6B7290]">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-6 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Built for Scale</h2>
          <p className="text-[#6B7290] mb-12">Modern stack powering the next generation of AI orchestration</p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Next.js 15", "TypeScript", "Tailwind CSS", "shadcn/ui", "Supabase", "PostgreSQL", "Framer Motion", "Zustand"].map(
              (tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-sm text-[#B8BED8]"
                >
                  {tech}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-[#4A5068]">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>FuseIQ v3.0 — Abbasi Global Ltd</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Florida, USA</span>
            <span>·</span>
            <span>CONFIDENTIAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
