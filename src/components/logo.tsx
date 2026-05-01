"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  showText?: boolean;
  textClassName?: string;
  dark?: boolean;
}

const sizes = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
  xl: "w-12 h-12",
  "2xl": "w-16 h-16",
};

export function Logo({ className, size = "md", showText = false, textClassName, dark = false }: LogoProps) {
  const sizeClass = sizes[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn("relative rounded-lg overflow-hidden shrink-0 bg-white", sizeClass)}>
        <Image
          src="/logo.jpg"
          alt="FuseIQ"
          fill
          className="object-contain p-0.5"
          priority
        />
      </div>
      {showText && (
        <span
          className={cn(
            "font-bold tracking-tight whitespace-nowrap",
            dark ? "text-white" : "text-gradient",
            textClassName
          )}
        >
          FuseIQ
        </span>
      )}
    </div>
  );
}

export function LogoIcon({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" | "xl" | "2xl" }) {
  const sizeClass = sizes[size];
  return (
    <div className={cn("relative rounded-lg overflow-hidden shrink-0 bg-white", sizeClass, className)}>
      <Image
        src="/logo.jpg"
        alt="FuseIQ"
        fill
        className="object-contain p-0.5"
        priority
      />
    </div>
  );
}
