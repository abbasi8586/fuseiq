"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Bot,
  Zap,
  CheckCircle,
  DollarSign,
  ArrowRight,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Cpu,
  Shield,
  Clock,
  Users,
  Activity,
  Sparkles,
  GitBranch,
  Play,
  Loader2,
  Flame,
  Star,
  Quote,
  Menu,
  X,
} from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { StatusDot } from "@/components/glass/status-badge";
import { ProgressBar } from "@/components/glass/progress-bar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const DEMO_WORKSPACE_ID = "00000000-0000-0000-0000-000000000001";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/* ── TYPO-FREE, CURATED DEMO DATA ───────────────────────── */

const demoAgents = [
  { id: "1", name: "Rook AI", framework: "Custom", status: "online", type: "AI", role: "CEO Operator", department: "Executive", efficiency: 99, executions: 523, costToday: 12.40, timezone: "America/New_York", lastActive: new Date().toISOString() },
  { id: "2", name: "MarketingBot Pro", framework: "CrewAI", status: "online", type: "AI", role: "Marketing Specialist", department: "Marketing", efficiency: 94, executions: 128, costToday: 4.20, timezone: "America/New_York", lastActive: new Date(Date.now() - 120000).toISOString() },
  { id: "3", name: "SupportAI", framework: "OpenAI", status: "online", type: "AI", role: "Support Agent", department: "Support", efficiency: 96, executions: 342, costToday: 8.50, timezone: "UTC", lastActive: new Date(Date.now() - 300000).toISOString() },
  { id: "4", name: "CodeReview Bot", framework: "Kimi", status: "busy", type: "AI", role: "Code Reviewer", department: "Engineering", efficiency: 92, executions: 89, costToday: 2.10, timezone: "America/Los_Angeles", lastActive: new Date(Date.now() - 60000).toISOString() },
  { id: "5", name: "SalesScout", framework: "Anthropic", status: "online", type: "AI", role: "Sales Researcher", department: "Sales", efficiency: 89, executions: 56, costToday: 3.80, timezone: "Europe/London", lastActive: new Date(Date.now() - 180000).toISOString() },
  { id: "6", name: "DataSync Master", framework: "LangGraph", status: "offline", type: "AI", role: "Data Engineer", department: "Data", efficiency: 88, executions: 45, costToday: 1.20, timezone: "Asia/Tokyo", lastActive: new Date(Date.now() - 3600000).toISOString() },
  { id: "7", name: "ContentForge", framework: "CrewAI", status: "online", type: "AI", role: "Content Writer", department: "Marketing", efficiency: 91, executions: 234, costToday: 3.15, timezone: "America/New_York", lastActive: new Date(Date.now() - 90000).toISOString() },
  { id: "8", name: "DevOps Sentinel", framework: "OpenAI", status: "online", type: "AI", role: "DevOps Monitor", department: "Engineering", efficiency: 95, executions: 178, costToday: 5.60, timezone: "America/Chicago", lastActive: new Date(Date.now() - 240000).toISOString() },
  { id: "9", name: "Finance Analyst", framework: "Kimi", status: "away", type: "AI", role: "Financial Analyst", department: "Finance", efficiency: 93, executions: 67, costToday: 2.85, timezone: "Asia/Singapore", lastActive: new Date(Date.now() - 7200000).toISOString() },
  { id: "10", name: "Demo Heartbeat Agent", framework: "Custom", status: "online", type: "AI", role: "Health Monitor", department: "Engineering", efficiency: 82, executions: 12, costToday: 0.45, timezone: "UTC", lastActive: new Date(Date.now() - 45000).toISOString() },
];

const demoTasks = [
  { id: "1", title: "Design new landing page", status: "in_progress", priority: "high", progress: 60, assignee: "MarketingBot Pro", type: "AI" },
  { id: "2", title: "Implement OAuth flow", status: "todo", priority: "urgent", progress: 0, assignee: "DevOps Sentinel", type: "AI" },
  { id: "3", title: "Write API documentation", status: "review", priority: "medium", progress: 90, assignee: "ContentForge", type: "AI" },
  { id: "4", title: "Optimize database queries", status: "done", priority: "high", progress: 100, assignee: "CodeReview Bot", type: "AI" },
  { id: "5", title: "Set up CI/CD pipeline", status: "in_progress", priority: "medium", progress: 35, assignee: "DevOps Sentinel", type: "AI" },
  { id: "6", title: "Create marketing assets", status: "todo", priority: "low", progress: 10, assignee: "ContentForge", type: "AI" },
];

const executionData = [
  { day: "Mon", executions: 145, cost: 12.5 },
  { day: "Tue", executions: 198, cost: 18.3 },
  { day: "Wed", executions: 167, cost: 15.2 },
  { day: "Thu", executions: 234, cost: 22.1 },
  { day: "Fri", executions: 201, cost: 19.8 },
  { day: "Sat", executions: 89, cost: 8.4 },
  { day: "Sun", executions: 67, cost: 6.2 },
];

const costByAgent = [
  { name: "Rook AI", value: 12.40, color: "#00D4FF" },
  { name: "SupportAI", value: 8.50, color: "#B829DD" },
  { name: "DevOps Sentinel", value: 5.60, color: "#00E5A0" },
  { name: "MarketingBot Pro", value: 4.20, color: "#FF6B35" },
  { name: "ContentForge", value: 3.15, color: "#FFC857" },
  { name: "SalesScout", value: 3.80, color: "#CC785C" },
  { name: "Others", value: 7.42, color: "#4A5068" },
];

const efficiencyData = [
  { name: "Rook AI", current: 99, average: 94 },
  { name: "SupportAI", current: 96, average: 91 },
  { name: "DevOps Sentinel", current: 95, average: 90 },
  { name: "CodeReview Bot", current: 92, average: 88 },
  { name: "Finance Analyst", current: 93, average: 87 },
];

const activityEvents = [
  { text: "MarketingBot Pro completed email campaign — $0.42", time: 120 },
  { text: "SalesScout generated 47 qualified leads — $1.20", time: 240 },
  { text: "CodeReview Bot approved 12 PRs — $0.85", time: 360 },
  { text: "SupportAI resolved 89 tickets — $2.10", time: 480 },
  { text: "Rook AI updated quarterly forecast — $0.12", time: 600 },
  { text: "DevOps Sentinel deployed 3 services — $1.80", time: 720 },
  { text: "ContentForge published blog post — $0.35", time: 900 },
  { text: "DataSync Master synced 2.4M records — $0.90", time: 1080 },
];

const approvalsDemo = [
  { id: "1", action: "Send 5,000 marketing emails", risk: "low", cost: 12.50, requester: "MarketingBot Pro", status: "pending" },
  { id: "2", action: "Deploy production infrastructure changes", risk: "high", cost: 0, requester: "DevOps Sentinel", status: "pending" },
];

const testimonials = [
  { quote: "FuseIQ cut our AI operational costs by 40% in the first month. The real-time cost tracking is a game changer.", author: "AI Team Lead", company: "Tech Startup", role: "Head of Engineering" },
  { quote: "We went from 3 disconnected AI tools to one command center. Our agents actually collaborate now.", author: "CTO", company: "SaaS Company", role: "Chief Technology Officer" },
  { quote: "The approval workflow saved us from a $50K mistake. Human-in-the-loop isn't optional — it's essential.", author: "Director of Ops", company: "Fintech Firm", role: "Operations Director" },
];

/* ── UTILS ──────────────────────────────────────────────── */

function timeAgo(ms: number) {
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function useRelativeTime(timestamp: string) {
  const [label, setLabel] = useState("");
  useEffect(() => {
    const update = () => setLabel(timeAgo(Date.now() - new Date(timestamp).getTime()));
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [timestamp]);
  return label;
}

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── PARTICLE BACKGROUND ───────────────────────────────── */

function ParticleBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0 bg-[#06070A]" />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Floating orbs */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: 200 + i * 80,
            height: 200 + i * 80,
            background: i % 2 === 0 ? "rgba(0,212,255,0.04)" : "rgba(184,41,221,0.03)",
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
          }}
          transition={{
            duration: 15 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ── STICKY NAV ─────────────────────────────────────────── */

function StickyNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-panel border-b border-white/[0.06]" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#B829DD] flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg text-gradient">FuseIQ</span>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm text-[#B8BED8] hover:text-white transition-colors">
            Sign In
          </Link>
          <Link
            href="/login?signup=1"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFC857] text-[#06070A] text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Get Started
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden glass-panel border-t border-white/[0.06] px-6 py-4 space-y-3"
        >
          <Link href="/login" className="block text-sm text-[#B8BED8]">Sign In</Link>
          <Link href="/login?signup=1" className="block text-sm text-[#D4AF37] font-semibold">Get Started</Link>
        </motion.div>
      )}
    </motion.nav>
  );
}

/* ── LIVE ACTIVITY TICKER ───────────────────────────────── */

function ActivityTicker() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % activityEvents.length), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] max-w-lg mx-auto">
      <div className="w-2 h-2 rounded-full bg-[#00E5A0] animate-pulse shrink-0" />
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-xs text-[#B8BED8] truncate"
        >
          {activityEvents[index].text} — {timeAgo(activityEvents[index].time * 1000)}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/* ── HERO KPI COUNTER ───────────────────────────────────── */

function AnimatedCounter({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let current = 0;
    const step = Math.ceil(target / 60);
    const id = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(id);
      }
      setCount(current);
    }, 30);
    return () => clearInterval(id);
  }, [target]);
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

/* ── MAIN PAGE ──────────────────────────────────────────── */

export default function DemoPage() {
  const [loading, setLoading] = useState(true);
  const [agents] = useState(demoAgents);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen bg-[#06070A] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#6B7290]">Loading FuseIQ Demo...</p>
        </div>
      </div>
    );
  }

  const onlineCount = agents.filter((a) => a.status === "online").length;
  const totalExecutions = agents.reduce((sum, a) => sum + a.executions, 0);
  const totalCost = agents.reduce((sum, a) => sum + a.costToday, 0);
  const avgEfficiency = Math.round(agents.reduce((sum, a) => sum + a.efficiency, 0) / agents.length);

  return (
    <div className="min-h-screen bg-[#06070A] text-white relative">
      <ParticleBackground />
      <StickyNav />

      <div className="relative z-10">
        {/* ════════════════════════════════════════════
            SECTION 1: HERO & LIVE PULSE
        ════════════════════════════════════════════ */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Live Demo — No Account Required
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Your AI Workforce,
                <br />
                <span className="text-gradient">Under Command</span>
              </h1>
              <p className="text-xl text-[#6B7290] max-w-2xl mx-auto mb-10">
                Real-time visibility, cost tracking, and human-in-the-loop control —
                all from one dashboard.
              </p>

              <div className="flex items-center justify-center gap-4 mb-12">
                <Link href="/login">
                  <Button size="lg" variant="outline" className="border-white/[0.08] text-[#B8BED8] hover:text-white px-8 h-12">
                    Sign In
                  </Button>
                </Link>
                <Link href="/login?signup=1">
                  <Button size="lg" className="bg-gradient-to-r from-[#D4AF37] to-[#FFC857] text-[#06070A] font-semibold px-8 h-12 hover:opacity-90">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Live KPIs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8"
            >
              <GlassCard glow="signal" className="text-left">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-[#00E5A0] animate-pulse" />
                  <span className="text-xs text-[#6B7290]">Active Now</span>
                </div>
                <p className="text-3xl font-bold text-white">
                  <AnimatedCounter target={onlineCount} />
                </p>
                <p className="text-xs text-[#4A5068] mt-1">agents online</p>
              </GlassCard>

              <GlassCard glow="cyan" className="text-left">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-[#00D4FF]" />
                  <span className="text-xs text-[#6B7290]">Executions Today</span>
                </div>
                <p className="text-3xl font-bold text-white">
                  <AnimatedCounter target={totalExecutions} />
                </p>
                <p className="text-xs text-[#4A5068] mt-1">+12% vs yesterday</p>
              </GlassCard>

              <GlassCard glow="ember" className="text-left">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-[#FF6B35]" />
                  <span className="text-xs text-[#6B7290]">Cost Today</span>
                </div>
                <p className="text-3xl font-bold text-white">
                  <AnimatedCounter target={Math.round(totalCost * 100)} prefix="$" suffix="" />
                  <span className="text-lg">.{Math.round((totalCost % 1) * 100).toString().padStart(2, "0")}</span>
                </p>
                <p className="text-xs text-[#4A5068] mt-1">$50/day budget</p>
              </GlassCard>
            </motion.div>

            {/* Activity Ticker */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <ActivityTicker />
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            SECTION 2: COMMAND CENTER DASHBOARD
        ════════════════════════════════════════════ */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Monitor Every Agent, Every Execution
              </h2>
              <p className="text-[#6B7290] max-w-xl mx-auto">
                A professional ops dashboard built for AI-native teams. See status, efficiency, and activity in real time.
              </p>
            </AnimatedSection>

            {/* Agent Status Row */}
            <AnimatedSection className="mb-8">
              <h3 className="text-sm font-semibold text-[#6B7290] uppercase tracking-wider mb-4">Live Agent Status</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {agents.slice(0, 5).map((agent, i) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <GlassCard hover className="h-full">
                      <div className="flex items-start justify-between mb-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#B829DD] flex items-center justify-center text-white font-bold text-sm">
                            {agent.name.charAt(0)}
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5">
                            <StatusDot status={agent.status} size="sm" />
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          agent.status === "online" ? "bg-[#00E5A0]/10 text-[#00E5A0]" :
                          agent.status === "busy" ? "bg-[#FF6B35]/10 text-[#FF6B35]" :
                          "bg-[#4A5068]/10 text-[#4A5068]"
                        }`}>
                          {agent.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-white">{agent.name}</p>
                      <p className="text-xs text-[#6B7290]">{agent.role}</p>
                      <div className="mt-3">
                        <div className="flex justify-between text-[10px] text-[#6B7290] mb-1">
                          <span>Efficiency</span>
                          <span className={agent.efficiency >= 90 ? "text-[#00E5A0]" : "text-[#FFC857]"}>{agent.efficiency}%</span>
                        </div>
                        <ProgressBar value={agent.efficiency} color={agent.efficiency >= 90 ? "#00E5A0" : "#FFC857"} height={4} />
                      </div>
                      <p className="text-[10px] text-[#4A5068] mt-2">
                        <Clock className="w-3 h-3 inline mr-1" />
                        <AgentTimeAgo timestamp={agent.lastActive} />
                      </p>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>

            {/* Tasks + Chart Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatedSection>
                <h3 className="text-sm font-semibold text-[#6B7290] uppercase tracking-wider mb-4">Active Tasks</h3>
                <GlassCard>
                  <div className="space-y-3">
                    {demoTasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                        <div className={`w-2 h-2 rounded-full ${
                          task.status === "done" ? "bg-[#00E5A0]" :
                          task.status === "in_progress" ? "bg-[#00D4FF]" :
                          task.status === "review" ? "bg-[#B829DD]" :
                          "bg-[#6B7290]"
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{task.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                              task.priority === "urgent" ? "bg-[#FF4757]/10 text-[#FF4757]" :
                              task.priority === "high" ? "bg-[#FFC857]/10 text-[#FFC857]" :
                              "bg-[#4A5068]/10 text-[#4A5068]"
                            }`}>{task.priority}</span>
                            <span className="text-[10px] text-[#4A5068]">{task.assignee}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-[#6B7290]">{task.progress}%</span>
                          <div className="w-16 h-1 rounded-full bg-white/[0.04] mt-1">
                            <div className="h-full rounded-full bg-[#00D4FF]" style={{ width: `${task.progress}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </AnimatedSection>

              <AnimatedSection>
                <h3 className="text-sm font-semibold text-[#6B7290] uppercase tracking-wider mb-4">Executions Over Time</h3>
                <GlassCard className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={executionData}>
                      <defs>
                        <linearGradient id="execGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="day" stroke="#4A5068" fontSize={12} />
                      <YAxis stroke="#4A5068" fontSize={12} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#0B0D14", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#fff" }}
                      />
                      <Area type="monotone" dataKey="executions" stroke="#00D4FF" fill="url(#execGradient)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </GlassCard>
              </AnimatedSection>

              <AnimatedSection className="mt-6">
                <h3 className="text-sm font-semibold text-[#6B7290] uppercase tracking-wider mb-4">Cost Breakdown by Agent (Today)</h3>
                <GlassCard>
                  <div className="space-y-3">
                    {costByAgent.filter(a => a.name !== "Others").sort((a, b) => b.value - a.value).map((agent) => (
                      <div key={agent.name} className="flex items-center gap-3">
                        <span className="text-xs text-[#B8BED8] w-32 truncate shrink-0">{agent.name}</span>
                        <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(agent.value / 12.4) * 100}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            viewport={{ once: true }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: agent.color }}
                          />
                        </div>
                        <span className="text-xs text-white font-medium w-14 text-right">${agent.value.toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-3 pt-2 border-t border-white/[0.04]">
                      <span className="text-xs text-[#6B7290] w-32 truncate shrink-0">Total Today</span>
                      <div className="flex-1" />
                      <span className="text-xs text-[#D4AF37] font-semibold w-14 text-right">${costByAgent.reduce((s, a) => s + a.value, 0).toFixed(2)}</span>
                    </div>
                  </div>
                </GlassCard>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            SECTION 3: COST & EFFICIENCY
        ════════════════════════════════════════════ */}
        <section className="py-20 px-6 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Know Exactly What Your AI Costs
              </h2>
              <p className="text-[#6B7290] max-w-xl mx-auto">
                Real-time cost attribution per agent. No surprise bills. Full transparency on every execution.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cost Pie Chart */}
              <AnimatedSection className="lg:col-span-1">
                <GlassCard className="h-full">
                  <h3 className="text-sm font-semibold text-white mb-4">Cost by Agent (Today)</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={costByAgent}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {costByAgent.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: any) => `$${Number(value).toFixed(2)}`}
                          contentStyle={{ backgroundColor: "#0B0D14", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#fff" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {costByAgent.map((item) => (
                      <div key={item.name} className="flex items-center gap-1.5 text-[10px]">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-[#6B7290]">{item.name}</span>
                        <span className="text-white font-medium">${item.value.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </AnimatedSection>

              {/* Efficiency Bar Chart */}
              <AnimatedSection className="lg:col-span-2">
                <GlassCard className="h-full">
                  <h3 className="text-sm font-semibold text-white mb-4">Efficiency Comparison</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={efficiencyData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis type="number" domain={[0, 100]} stroke="#4A5068" fontSize={12} />
                        <YAxis dataKey="name" type="category" stroke="#4A5068" fontSize={12} width={100} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#0B0D14", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#fff" }}
                        />
                        <Bar dataKey="current" fill="#00D4FF" radius={[0, 4, 4, 0]} name="Current" />
                        <Bar dataKey="average" fill="#4A5068" radius={[0, 4, 4, 0]} name="Average" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>
              </AnimatedSection>
            </div>

            {/* Cost KPIs */}
            <AnimatedSection className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GlassCard>
                  <p className="text-xs text-[#6B7290] mb-1">Avg. Cost per Execution</p>
                  <p className="text-2xl font-bold text-white">$0.007</p>
                  <p className="text-[10px] text-[#4A5068] mt-1">Industry avg: $0.012</p>
                </GlassCard>
                <GlassCard>
                  <p className="text-xs text-[#6B7290] mb-1">Projected Monthly</p>
                  <p className="text-2xl font-bold text-white">$457</p>
                  <p className="text-[10px] text-[#4A5068] mt-1">Based on current rate</p>
                </GlassCard>
                <GlassCard>
                  <p className="text-xs text-[#6B7290] mb-1">Cost Efficiency</p>
                  <p className="text-2xl font-bold text-[#00E5A0]">{avgEfficiency}%</p>
                  <p className="text-[10px] text-[#4A5068] mt-1">Top quartile performance</p>
                </GlassCard>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            SECTION 4: HUMAN-IN-THE-LOOP
        ════════════════════════════════════════════ */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                You Stay in Control
              </h2>
              <p className="text-[#6B7290] max-w-xl mx-auto">
                Every critical action can require human approval. No black boxes. Complete immutable audit trail.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {approvalsDemo.map((approval) => (
                <AnimatedSection key={approval.id}>
                  <GlassCard className={`h-full ${approval.risk === "high" ? "border-[#FF4757]/20" : "border-[#00E5A0]/20"}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          approval.risk === "high" ? "bg-[#FF4757]/10" : "bg-[#00E5A0]/10"
                        }`}>
                          <Shield className={`w-5 h-5 ${approval.risk === "high" ? "text-[#FF4757]" : "text-[#00E5A0]"}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{approval.action}</p>
                          <p className="text-xs text-[#6B7290]">Requested by {approval.requester}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-1 rounded-lg font-bold uppercase ${
                        approval.risk === "high"
                          ? "bg-[#FF4757]/10 text-[#FF4757] border border-[#FF4757]/20"
                          : "bg-[#00E5A0]/10 text-[#00E5A0] border border-[#00E5A0]/20"
                      }`}>
                        {approval.risk} risk
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#6B7290]">
                      <span>Est. cost: ${approval.cost.toFixed(2)}</span>
                      <span className="text-[#FFC857]">Requires approval</span>
                    </div>
                  </GlassCard>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection className="mt-8">
              <GlassCard className="border-l-2 border-l-[#D4AF37]">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#00E5A0] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-[#B8BED8]">
                      <span className="text-white font-medium">Approved by Awais Abbasi</span> — 2 min ago — Production Deploy — Risk: High
                    </p>
                    <p className="text-[10px] text-[#4A5068] mt-1">
                      Hash: a3f7d2e9...b8c1 | Immutable audit record
                    </p>
                  </div>
                </div>
              </GlassCard>
            </AnimatedSection>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            SECTION 5: MULTI-AGENT WORKFLOWS
        ════════════════════════════════════════════ */}
        <section className="py-20 px-6 bg-white/[0.01]">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Orchestrate Swarms, Not Just Single Agents
              </h2>
              <p className="text-[#6B7290] max-w-xl mx-auto">
                Design multi-step workflows visually. Simulate before you deploy. Run complex campaigns with one click.
              </p>
            </AnimatedSection>

            <AnimatedSection>
              <GlassCard className="relative overflow-hidden">
                {/* Workflow visualization */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-8">
                  {[
                    { label: "Research", icon: Bot, color: "#00D4FF" },
                    { label: "Draft", icon: Sparkles, color: "#B829DD" },
                    { label: "Review", icon: Shield, color: "#FFC857" },
                    { label: "Send", icon: Zap, color: "#00E5A0" },
                  ].map((step, i, arr) => (
                    <div key={step.label} className="flex items-center gap-4">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.15 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center gap-2"
                      >
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                          style={{ backgroundColor: `${step.color}15`, boxShadow: `0 0 20px ${step.color}20` }}
                        >
                          <step.icon className="w-7 h-7" style={{ color: step.color }} />
                        </div>
                        <span className="text-xs text-[#B8BED8] font-medium">{step.label}</span>
                      </motion.div>
                      {i < arr.length - 1 && (
                        <div className="hidden md:flex items-center">
                          <ArrowRight className="w-5 h-5 text-[#4A5068]" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-center text-xs text-[#6B7290] mt-4">
                  Email Campaign workflow — 4 agents, 12 executions today, $4.20 total cost
                </p>

                <div className="flex justify-center mt-6">
                  <Button
                    onClick={() => {
                      setSimulating(true);
                      setTimeout(() => {
                        setSimulating(false);
                        toast.success("Simulation complete: 4s predicted, $0.42 estimated cost");
                      }, 2500);
                    }}
                    disabled={simulating}
                    className="bg-gradient-to-r from-[#D4AF37] to-[#FFC857] text-[#06070A] font-semibold"
                  >
                    {simulating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {simulating ? "Simulating..." : "Run Simulation"}
                  </Button>
                </div>
              </GlassCard>
            </AnimatedSection>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            SECTION 6: SOCIAL PROOF & FINAL CTA
        ════════════════════════════════════════════ */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Join the Command Center Era
              </h2>
              <p className="text-[#6B7290] max-w-xl mx-auto">
                Teams building with FuseIQ today are the ones that will scale AI tomorrow.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {testimonials.map((t, i) => (
                <AnimatedSection key={i}>
                  <GlassCard hover className="h-full">
                    <Quote className="w-6 h-6 text-[#D4AF37] mb-3" />
                    <p className="text-sm text-[#B8BED8] mb-4 leading-relaxed">"{t.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#B829DD] flex items-center justify-center text-white text-xs font-bold">
                        {t.author.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs text-white font-medium">{t.author}</p>
                        <p className="text-[10px] text-[#6B7290]">{t.role}, {t.company}</p>
                      </div>
                    </div>
                  </GlassCard>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection className="text-center">
              <GlassCard holographic className="py-12 px-8">
                <h3 className="text-2xl font-bold text-white mb-3">
                  Start Your Free Trial
                </h3>
                <p className="text-sm text-[#6B7290] mb-6">
                  No credit card required. Get 3 AI agents, 1,000 executions/month, and full dashboard access.
                </p>
                <Link href="/login?signup=1">
                  <Button size="lg" className="bg-gradient-to-r from-[#D4AF37] to-[#FFC857] text-[#06070A] font-semibold px-10 h-12 text-base hover:opacity-90">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <p className="text-[10px] text-[#4A5068] mt-4">
                  Upgrade anytime. Cancel anytime. Your data stays yours.
                </p>
              </GlassCard>
            </AnimatedSection>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-[#00D4FF] to-[#B829DD] flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-semibold text-white">FuseIQ</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-[#4A5068]">
              <Link href="/login" className="hover:text-[#6B7290] transition-colors">Sign In</Link>
              <a href="https://github.com/abbasi8586/fuseiq" target="_blank" rel="noopener" className="hover:text-[#6B7290] transition-colors">GitHub</a>
              <span>© 2026 Abbasi Global LLC</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* ── Agent Time Ago Helper ──────────────────────────────── */

function AgentTimeAgo({ timestamp }: { timestamp: string }) {
  const label = useRelativeTime(timestamp);
  return <>{label}</>;
}
