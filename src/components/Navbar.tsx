"use client";

import { Shield, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Navbar() {
  const navItems = [
    { name: "IP检测", href: "/" },
    { name: "出口检测", href: "/outbound" },
    { name: "泄漏检测", href: "/dns-leak" },
    { name: "指纹识别", href: "/fingerprint" },
    { name: "邻居查询", href: "/neighbors" }
  ];

  return (
    <motion.div 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "circOut" }}
      className="fixed top-6 left-0 right-0 z-50 px-4 pointer-events-none"
    >
      <nav className="mx-auto max-w-4xl pointer-events-auto rounded-full border border-white/10 bg-[#030303]/40 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] relative group">
        {/* Border Light Effect */}
        <div className="absolute inset-x-24 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group/logo cursor-pointer">
            <div className="relative">
              <Shield className="h-6 w-6 text-primary group-hover/logo:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-primary/20 blur-lg opacity-0 group-hover/logo:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">IP<span className="text-primary">or</span></span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-6">
               {navItems.map((item) => (
                 <a 
                   key={item.name} 
                   href={item.href} 
                   className="text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-colors relative group/item"
                 >
                   {item.name}
                   <div className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover/item:w-full" />
                 </a>
               ))}
            </div>
            
            <div className="h-4 w-px bg-white/10 mx-2 hidden lg:block" />
            
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                实时节点
              </span>
            </div>
          </div>
        </div>
      </nav>
    </motion.div>
  );
}
