"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import { LogoIcon } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-radial-glow p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="flex items-center justify-center mx-auto mb-6">
          <LogoIcon size="2xl" />
        </div>
        <h1 className="text-6xl font-bold text-white mb-2">404</h1>
        <p className="text-xl text-[#6B7290] mb-2">Page Not Found</p>
        <p className="text-sm text-[#4A5068] mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/">
            <Button className="neon-button-cyan">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="border-white/[0.08] text-[#6B7290] hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
