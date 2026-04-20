"use client";

import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  return (
    <div className="fixed top-6 left-0 right-0 z-50 px-4 pointer-events-none">
      <nav className="mx-auto max-w-2xl pointer-events-auto rounded-full border border-white/10 bg-background/60 backdrop-blur-xl shadow-2xl shadow-black/50">
        <div className="px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold tracking-tight">IP<span className="text-primary">or</span></span>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              Real-time Engine
            </span>
          </div>
        </div>
      </nav>
    </div>
  );
}
