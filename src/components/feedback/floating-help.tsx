"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  X,
  Send,
  Loader2,
  MessageSquare,
  Mail,
  Zap,
  Play,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

type View = "menu" | "contact" | "feedback" | "quick-help";

export function FloatingHelp() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("menu");
  const [loading, setLoading] = useState(false);

  // Contact form
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSent, setContactSent] = useState(false);

  // Feedback form
  const [feedbackType, setFeedbackType] = useState("suggestion");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Quick help
  const [helpInput, setHelpInput] = useState("");
  const [helpMessages, setHelpMessages] = useState<
    { role: "user" | "assistant"; text: string; isError?: boolean; isRateLimited?: boolean }[]
  >([
    {
      role: "assistant" as const,
      text:
        "Hi! I'm FuseIQ Help. Ask me anything about using the platform — agents, workflows, billing, or troubleshooting.",
    },
  ]);
  const helpScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (helpScrollRef.current) {
      helpScrollRef.current.scrollTop = helpScrollRef.current.scrollHeight;
    }
  }, [helpMessages, loading]);

  const resetForms = () => {
    setContactName("");
    setContactEmail("");
    setContactMessage("");
    setContactSent(false);
    setFeedbackType("suggestion");
    setFeedbackText("");
    setFeedbackSent(false);
    setHelpInput("");
    setHelpMessages([
      {
        role: "assistant",
        text:
          "Hi! I'm FuseIQ Help. Ask me anything about using the platform — agents, workflows, billing, or troubleshooting.",
      },
    ]);
  };

  const handleOpen = () => {
    setOpen(true);
    setView("menu");
    resetForms();
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(resetForms, 300);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail.trim() || !contactMessage.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: contactMessage,
        }),
      });
      if (res.ok) {
        setContactSent(true);
        toast.success("Message sent! We'll get back to you soon.");
      } else {
        toast.error("Failed to send. Please try again.");
      }
    } catch {
      toast.error("Failed to send. Please try again.");
    }
    setLoading(false);
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      toast.error("Please enter your feedback");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: feedbackType, message: feedbackText }),
      });
      if (res.ok) {
        setFeedbackSent(true);
        toast.success("Thank you for your feedback!");
      } else {
        toast.error("Failed to send feedback. Please try again.");
      }
    } catch {
      toast.error("Failed to send feedback. Please try again.");
    }
    setLoading(false);
  };

  const handleHelpSend = async () => {
    if (!helpInput.trim()) return;
    const userMsg = helpInput.trim();
    setHelpMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setHelpInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMsg }),
      });
      const data = await res.json();

      if (data.error || !data.answer) {
        const isRateLimited =
          data.rateLimited ||
          data.error?.includes("rate limit") ||
          data.error?.includes("quota");

        setHelpMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: data.error || "I'm having trouble connecting right now. Try again shortly.",
            isError: true,
            isRateLimited: isRateLimited,
          },
        ]);

        if (isRateLimited) {
          toast.error("DeepSeek Free Tier limit reached", {
            description: "Add your own API key in Settings for unlimited access.",
          });
        }
      } else {
        setHelpMessages((prev) => [
          ...prev,
          { role: "assistant", text: data.answer },
        ]);
      }
    } catch {
      setHelpMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Connection error. Please try again or contact support directly.",
          isError: true,
        },
      ]);
    }
    setLoading(false);
  };

  const menuItems = [
    {
      key: "contact" as View,
      icon: Mail,
      label: "Contact Us",
      desc: "Send us an email directly",
      color: "#00D4FF",
    },
    {
      key: "feedback" as View,
      icon: MessageSquare,
      label: "Send Feedback",
      desc: "Report bugs or suggest features",
      color: "#B829DD",
    },
    {
      key: "quick-help" as View,
      icon: Zap,
      label: "Quick Help",
      desc: "AI-powered instant answers",
      color: "#00E5A0",
    },
    {
      key: "simulator" as View,
      icon: Play,
      label: "Run Simulator",
      desc: "Test agents in the sandbox",
      color: "#FF6B35",
      href: "/simulator",
    },
  ];

  return (
    <>
      {/* Floating trigger */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpen}
            className="fixed bottom-6 left-6 z-[60] w-12 h-12 rounded-full bg-gradient-to-r from-[#00D4FF] to-[#00E5A0] text-[#06070A] font-semibold shadow-lg shadow-[#00D4FF]/30 hover:shadow-xl hover:shadow-[#00D4FF]/50 transition-shadow flex items-center justify-center"
            aria-label="Help"
          >
            <HelpCircle className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center sm:p-4"
            onClick={handleClose}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full sm:w-[420px] max-w-[100vw] max-h-[85vh] glass-card border border-white/[0.08] shadow-2xl flex flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] shrink-0">
                <div className="flex items-center gap-3">
                  {view !== "menu" && (
                    <button
                      onClick={() => setView("menu")}
                      className="p-1 rounded hover:bg-white/5 text-[#6B7290] hover:text-white transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  )}
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#00E5A0] flex items-center justify-center">
                    <HelpCircle className="w-4 h-4 text-[#06070A]" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white block leading-tight">
                      {view === "menu" && "Help & Feedback"}
                      {view === "contact" && "Contact Us"}
                      {view === "feedback" && "Send Feedback"}
                      {view === "quick-help" && "Quick Help"}
                    </span>
                    {view === "menu" && (
                      <span className="text-[10px] text-[#6B7290]">
                        How can we help?
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {view === "quick-help" && (
                    <Link
                      href="/settings"
                      onClick={handleClose}
                      className="p-1.5 rounded hover:bg-white/5 text-[#6B7290] hover:text-white transition-colors"
                      title="API Key Settings"
                    >
                      <Settings className="w-4 h-4" />
                    </Link>
                  )}
                  <button
                    onClick={handleClose}
                    className="p-1.5 rounded hover:bg-white/5 text-[#6B7290] hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-5">
                {/* MENU VIEW */}
                {view === "menu" && (
                  <div className="grid grid-cols-1 gap-2.5">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      if (item.href) {
                        return (
                          <Link
                            key={item.key}
                            href={item.href}
                            onClick={handleClose}
                            className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.12] transition-all group"
                          >
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                              style={{ background: `${item.color}15` }}
                            >
                              <Icon className="w-5 h-5" style={{ color: item.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-white group-hover:text-[#B8BED8] transition-colors">
                                {item.label}
                              </div>
                              <div className="text-xs text-[#6B7290]">{item.desc}</div>
                            </div>
                            <ChevronLeft className="w-4 h-4 text-[#4A5068] rotate-180 shrink-0" />
                          </Link>
                        );
                      }
                      return (
                        <button
                          key={item.key}
                          onClick={() => setView(item.key)}
                          className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.12] transition-all group text-left w-full"
                        >
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: `${item.color}15` }}
                          >
                            <Icon className="w-5 h-5" style={{ color: item.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white group-hover:text-[#B8BED8] transition-colors">
                              {item.label}
                            </div>
                            <div className="text-xs text-[#6B7290]">{item.desc}</div>
                          </div>
                          <ChevronLeft className="w-4 h-4 text-[#4A5068] rotate-180 shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* CONTACT VIEW */}
                {view === "contact" && (
                  <div>
                    {contactSent ? (
                      <div className="text-center py-8">
                        <div className="w-14 h-14 rounded-full bg-[#00E5A0]/15 flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 className="w-7 h-7 text-[#00E5A0]" />
                        </div>
                        <h3 className="text-base font-semibold text-white mb-1">
                          Message Sent!
                        </h3>
                        <p className="text-sm text-[#6B7290]">
                          We'll get back to you within 24 hours.
                        </p>
                        <button
                          onClick={() => {
                            setContactSent(false);
                            setContactName("");
                            setContactEmail("");
                            setContactMessage("");
                          }}
                          className="mt-4 text-sm text-[#00D4FF] hover:underline"
                        >
                          Send another message
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleContactSubmit} className="space-y-3.5">
                        <div>
                          <label className="text-xs font-medium text-[#B8BED8] block mb-1.5">
                            Name
                          </label>
                          <input
                            type="text"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder="Your name"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder:text-[#4A5068] outline-none focus:border-[#00D4FF]/40 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-[#B8BED8] block mb-1.5">
                            Email <span className="text-[#FF6B35]">*</span>
                          </label>
                          <input
                            type="email"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="you@company.com"
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder:text-[#4A5068] outline-none focus:border-[#00D4FF]/40 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-[#B8BED8] block mb-1.5">
                            Message <span className="text-[#FF6B35]">*</span>
                          </label>
                          <textarea
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            placeholder="How can we help you?"
                            required
                            rows={4}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder:text-[#4A5068] outline-none focus:border-[#00D4FF]/40 transition-colors resize-none"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#00E5A0] text-[#06070A] font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Send Message
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* FEEDBACK VIEW */}
                {view === "feedback" && (
                  <div>
                    {feedbackSent ? (
                      <div className="text-center py-8">
                        <div className="w-14 h-14 rounded-full bg-[#00E5A0]/15 flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 className="w-7 h-7 text-[#00E5A0]" />
                        </div>
                        <h3 className="text-base font-semibold text-white mb-1">
                          Thank You!
                        </h3>
                        <p className="text-sm text-[#6B7290]">
                          Your feedback helps us improve FuseIQ.
                        </p>
                        <button
                          onClick={() => {
                            setFeedbackSent(false);
                            setFeedbackText("");
                            setFeedbackType("suggestion");
                          }}
                          className="mt-4 text-sm text-[#00D4FF] hover:underline"
                        >
                          Send more feedback
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleFeedbackSubmit} className="space-y-3.5">
                        <div>
                          <label className="text-xs font-medium text-[#B8BED8] block mb-1.5">
                            Feedback Type
                          </label>
                          <div className="flex gap-2 flex-wrap">
                            {["suggestion", "bug", "praise"].map((type) => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => setFeedbackType(type)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                  feedbackType === type
                                    ? "border-[#00D4FF]/40 bg-[#00D4FF]/10 text-[#00D4FF]"
                                    : "border-white/[0.08] bg-white/[0.02] text-[#6B7290] hover:text-[#B8BED8]"
                                }`}
                              >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-[#B8BED8] block mb-1.5">
                            Your Feedback <span className="text-[#FF6B35]">*</span>
                          </label>
                          <textarea
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="Tell us what you think..."
                            required
                            rows={5}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder:text-[#4A5068] outline-none focus:border-[#00D4FF]/40 transition-colors resize-none"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#B829DD] to-[#FF6B35] text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Submit Feedback
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* QUICK HELP VIEW */}
                {view === "quick-help" && (
                  <div className="flex flex-col h-full min-h-[320px]">
                    <div
                      ref={helpScrollRef}
                      className="flex-1 overflow-y-auto space-y-3 min-h-[200px] max-h-[360px] pr-1"
                    >
                      {helpMessages.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex gap-2 ${
                            msg.role === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          {msg.role === "assistant" && (
                            <div
                              className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                                msg.isError
                                  ? "bg-[#FF6B35]/20"
                                  : "bg-gradient-to-br from-[#00D4FF] to-[#00E5A0]"
                              }`}
                            >
                              {msg.isRateLimited ? (
                                <AlertTriangle className="w-3 h-3 text-[#FF6B35]" />
                              ) : (
                                <Zap className="w-3 h-3 text-[#06070A]" />
                              )}
                            </div>
                          )}
                          <div
                            className={`px-3 py-2 rounded-xl text-xs max-w-[85%] leading-relaxed ${
                              msg.role === "user"
                                ? "bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/20"
                                : msg.isError
                                ? "bg-[#FF6B35]/5 text-[#B8BED8] border border-[#FF6B35]/20"
                                : "bg-white/[0.03] text-[#B8BED8] border border-white/[0.06]"
                            }`}
                          >
                            {msg.text}
                            {msg.isRateLimited && (
                              <div className="mt-2 pt-2 border-t border-white/[0.06]">
                                <Link
                                  href="/settings"
                                  onClick={handleClose}
                                  className="text-[10px] text-[#00D4FF] hover:text-[#00E5A0] transition-colors inline-flex items-center gap-1"
                                >
                                  <Settings className="w-3 h-3" />
                                  Add BYOK key →
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {loading && (
                        <div className="flex gap-2">
                          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00D4FF] to-[#00E5A0] flex items-center justify-center shrink-0">
                            <Zap className="w-3 h-3 text-[#06070A]" />
                          </div>
                          <div className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                            <Loader2 className="w-3 h-3 text-[#00D4FF] animate-spin" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-3 mt-2 border-t border-white/[0.06]">
                      <input
                        value={helpInput}
                        onChange={(e) => setHelpInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !loading && handleHelpSend()}
                        placeholder="Ask about FuseIQ..."
                        className="flex-1 bg-transparent text-white text-sm placeholder:text-[#4A5068] outline-none"
                      />
                      <button
                        onClick={handleHelpSend}
                        disabled={!helpInput.trim() || loading}
                        className="p-1.5 rounded-lg bg-[#00D4FF]/15 text-[#00D4FF] hover:bg-[#00D4FF]/25 disabled:opacity-30 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
