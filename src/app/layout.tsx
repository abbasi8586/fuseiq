import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "FuseIQ — AI Agent Command Center",
    template: "%s — FuseIQ",
  },
  description: "Monitor, orchestrate, and approve every AI agent from one unified dashboard. BYOK architecture, real-time cost tracking, and human-in-the-loop control.",
  keywords: ["AI agents", "agent orchestration", "LLM management", "AI workforce", "multi-agent systems", "BYOK"],
  authors: [{ name: "Abbasi Global LLC" }],
  creator: "FuseIQ",
  publisher: "Abbasi Global LLC",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fuseiq.io",
    siteName: "FuseIQ",
    title: "FuseIQ — AI Agent Command Center",
    description: "Monitor, orchestrate, and approve every AI agent from one unified dashboard.",
    images: [{
      url: "https://fuseiq.io/logo-512.png",
      width: 512,
      height: 512,
      alt: "FuseIQ Logo",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FuseIQ — AI Agent Command Center",
    description: "Monitor, orchestrate, and approve every AI agent from one unified dashboard.",
    images: ["https://fuseiq.io/logo-512.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

import { CommandPalette } from "@/components/copilot/command-palette";
import { FloatingCopilot } from "@/components/copilot/floating-copilot";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-[#06070A] text-white min-h-screen`}>
        <TooltipProvider>
          {children}
          <CommandPalette />
          <FloatingCopilot />
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(22, 25, 37, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#fff',
                borderRadius: '12px',
              },
            }}
          />
        </TooltipProvider>
      </body>
    </html>
  );
}
