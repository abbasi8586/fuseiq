import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "FuseIQ — AI Agent Command Center",
  description: "The AI agent command center that puts you in control",
};

import { CommandPalette } from "@/components/copilot/command-palette";

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
