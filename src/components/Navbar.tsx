"use client";

import { Shield, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.div 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "circOut" }}
      className="fixed top-6 left-0 right-0 z-50 px-4 pointer-events-none"
    >
      <nav className="mx-auto max-w-2xl pointer-events-auto rounded-full border border-white/10 bg-[#030303]/40 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] relative group">
        {/* Border Light Effect */}
        <div className="absolute inset-x-12 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group/logo cursor-pointer">
            <div className="relative">
              <Shield className="h-6 w-6 text-primary group-hover/logo:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-primary/20 blur-lg opacity-0 group-hover/logo:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">IP<span className="text-primary">or</span></span>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="hidden sm:flex items-center gap-6">
               <a href="#" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">Documentation</a>
               <a href="#" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">API</a>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-primary bg-primary/5 px-4 py-2 rounded-full border border-primary/20">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                Live Engine
              </span>
            </div>
          </div>
        </div>
      </nav>
    </motion.div>
  );
}
