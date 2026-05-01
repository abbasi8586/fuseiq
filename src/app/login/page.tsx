"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/glass/glass-card";
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  Mail, 
  Lock, 
  ArrowLeft,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Fingerprint
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Read mode from URL
  const urlMode = searchParams.get("signup") === "1" ? "signup" : 
                  searchParams.get("mode") === "magic" ? "magic" :
                  searchParams.get("mode") === "reset" ? "reset" : "login";
  const redirectTo = searchParams.get("redirect") || "/";

  const [mode, setMode] = useState(urlMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sentConfirmation, setSentConfirmation] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Update mode when URL changes
  useEffect(() => {
    const newMode = searchParams.get("signup") === "1" ? "signup" : 
                    searchParams.get("mode") === "magic" ? "magic" :
                    searchParams.get("mode") === "reset" ? "reset" : mode;
    if (newMode !== mode) setMode(newMode);
  }, [searchParams]);

  // Password strength checker
  useEffect(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    setPasswordStrength(score);
  }, [password]);

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return "#FF4757";
    if (passwordStrength === 2) return "#FFC857";
    if (passwordStrength === 3) return "#00D4FF";
    return "#00E5A0";
  };

  const getStrengthLabel = () => {
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength === 2) return "Fair";
    if (passwordStrength === 3) return "Good";
    return "Strong";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
            data: {
              app_name: "FuseIQ",
            },
          },
        });
        if (error) throw error;
        setSentConfirmation(true);
        toast.success("Account created! Check your email to confirm.");
      } else if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Welcome back to FuseIQ!");
        router.push(redirectTo);
        router.refresh();
      } else if (mode === "magic") {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
          },
        });
        if (error) throw error;
        setSentConfirmation(true);
        toast.success("Magic link sent! Check your email.");
      } else if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
        });
        if (error) throw error;
        setSentConfirmation(true);
        toast.success("Password reset link sent! Check your email.");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
          queryParams: provider === "google" ? {
            access_type: "offline",
            prompt: "consent",
          } : undefined,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "OAuth login failed");
      setIsLoading(false);
    }
  };

  const switchMode = (newMode: string) => {
    setMode(newMode);
    setSentConfirmation(false);
    setPassword("");
    setShowPassword(false);
  };

  // Success state after sending email
  if (sentConfirmation) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00E5A0] to-[#00D4FF] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#00E5A0]/20">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Check Your Email</h3>
        <p className="text-[#6B7290] text-sm mb-6 max-w-xs mx-auto">
          We sent a {mode === "magic" ? "magic link" : mode === "reset" ? "password reset link" : "confirmation link"} to
          <br />
          <span className="text-[#00D4FF] font-medium">{email}</span>
        </p>
        <p className="text-xs text-[#4A5068] mb-6">
          Didn&apos;t receive it? Check your spam folder or{" "}
          <button
            onClick={() => setSentConfirmation(false)}
            className="text-[#00D4FF] hover:underline"
          >
            try again
          </button>
        </p>
        <Button
          onClick={() => switchMode("login")}
          variant="outline"
          className="border-white/[0.08] text-[#6B7290] hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sign In
        </Button>
      </motion.div>
    );
  }

  const titles = {
    login: { title: "Welcome Back", subtitle: "Sign in to your command center" },
    signup: { title: "Create Account", subtitle: "Join the AI agent revolution" },
    magic: { title: "Magic Link", subtitle: "Sign in without a password" },
    reset: { title: "Reset Password", subtitle: "We\'ll send you a recovery link" },
  };

  const currentTitle = titles[mode as keyof typeof titles] || titles.login;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={mode}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00D4FF] to-[#B829DD] mb-4 shadow-lg shadow-[#00D4FF]/20"
          >
            {mode === "login" ? (
              <ShieldCheck className="w-8 h-8 text-white" />
            ) : mode === "signup" ? (
              <Zap className="w-8 h-8 text-white" />
            ) : mode === "magic" ? (
              <Fingerprint className="w-8 h-8 text-white" />
            ) : (
              <Lock className="w-8 h-8 text-white" />
            )}
          </motion.div>
          <h1 className="text-2xl font-bold text-white mb-2">{currentTitle.title}</h1>
          <p className="text-[#6B7290]">{currentTitle.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-[#B8BED8]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5068]" />
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 glass-input text-white placeholder:text-[#4A5068]"
              />
            </div>
          </div>

          {mode !== "magic" && mode !== "reset" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-[#B8BED8]">
                  Password
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => switchMode("reset")}
                    className="text-xs text-[#00D4FF] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5068]" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={mode === "signup" ? 8 : 6}
                  className="pl-10 pr-10 glass-input text-white placeholder:text-[#4A5068]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7290] hover:text-[#B8BED8] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password strength indicator */}
              {mode === "signup" && password.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-1"
                >
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: passwordStrength >= level ? getStrengthColor() : "rgba(255,255,255,0.06)",
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: getStrengthColor() }}>
                    {getStrengthLabel()} — Use 8+ chars with uppercase, numbers & symbols
                  </p>
                </motion.div>
              )}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || (mode === "signup" && passwordStrength < 2)}
            className="w-full neon-button-cyan h-11"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : mode === "login" ? (
              "Sign In"
            ) : mode === "signup" ? (
              "Create Account"
            ) : mode === "magic" ? (
              "Send Magic Link"
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>

        {/* Mode switchers */}
        <div className="mt-6 space-y-3">
          {mode === "login" && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#1E2233]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#161925] px-2 text-[#6B7290]">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOAuth("google")}
                  disabled={isLoading}
                  className="glass-button h-10"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOAuth("github")}
                  disabled={isLoading}
                  className="glass-button h-10"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </Button>
              </div>

              <button
                type="button"
                onClick={() => switchMode("magic")}
                className="w-full text-center text-sm text-[#6B7290] hover:text-[#00D4FF] transition-colors flex items-center justify-center gap-2"
              >
                <Fingerprint className="w-4 h-4" />
                Sign in with Magic Link (no password)
              </button>
            </>
          )}

          <p className="text-center text-sm text-[#6B7290]">
            {mode === "login" && (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className="text-[#00D4FF] hover:underline font-medium"
                >
                  Create one
                </button>
              </>
            )}
            {mode === "signup" && (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="text-[#00D4FF] hover:underline font-medium"
                >
                  Sign in
                </button>
              </>
            )}
            {(mode === "magic" || mode === "reset") && (
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="text-[#00D4FF] hover:underline font-medium flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft className="w-3 h-3" />
                Back to Sign In
              </button>
            )}
          </p>

          {mode === "signup" && (
            <p className="text-center text-xs text-[#4A5068]">
              By creating an account, you agree to our{" "}
              <Link href="#" className="text-[#6B7290] hover:text-[#B8BED8] underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-[#6B7290] hover:text-[#B8BED8] underline">
                Privacy Policy
              </Link>
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-radial-glow p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8">
          <Suspense fallback={
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-[#00D4FF] animate-spin" />
            </div>
          }>
            <LoginForm />
          </Suspense>
        </GlassCard>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-[#4A5068] hover:text-[#6B7290] transition-colors flex items-center justify-center gap-2">
            <ArrowLeft className="w-3 h-3" />
            Back to FuseIQ
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
