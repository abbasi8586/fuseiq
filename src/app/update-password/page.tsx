"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/glass/glass-card";
import { Eye, EyeOff, Loader2, Lock, CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Password strength checker
  const checkStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    setPasswordStrength(score);
    return score;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      if (error) throw error;
      setSuccess(true);
      toast.success("Password updated successfully!");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return "#FF4757";
    if (passwordStrength === 2) return "#FFC857";
    if (passwordStrength === 3) return "#00D4FF";
    return "#00E5A0";
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-radial-glow p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <GlassCard className="p-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00E5A0] to-[#00D4FF] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#00E5A0]/20">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Password Updated!</h3>
            <p className="text-[#6B7290] text-sm mb-6">
              Your password has been successfully reset. Redirecting to login...
            </p>
            <Link href="/login">
              <Button className="neon-button-cyan">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go to Sign In
              </Button>
            </Link>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-radial-glow p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00D4FF] to-[#B829DD] mb-4 shadow-lg shadow-[#00D4FF]/20">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Set New Password</h1>
            <p className="text-[#6B7290]">Enter your new password below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#B8BED8]">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5068]" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    checkStrength(e.target.value);
                  }}
                  required
                  minLength={8}
                  className="pl-10 pr-10 glass-input text-white placeholder:text-[#4A5068]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7290] hover:text-[#B8BED8]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {password.length > 0 && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className="h-1 flex-1 rounded-full transition-all"
                        style={{
                          backgroundColor: passwordStrength >= level ? getStrengthColor() : "rgba(255,255,255,0.06)",
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: getStrengthColor() }}>
                    {passwordStrength <= 1 ? "Weak" : passwordStrength === 2 ? "Fair" : passwordStrength === 3 ? "Good" : "Strong"}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#B8BED8]">Confirm Password</label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="glass-input text-white placeholder:text-[#4A5068]"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || passwordStrength < 2 || password !== confirmPassword}
              className="w-full neon-button-cyan h-11"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
            </Button>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}
