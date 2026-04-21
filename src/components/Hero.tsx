"use client";

import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX, 
  Copy, 
  Check, 
  RefreshCw, 
  FileText,
  Search,
  Command
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface HeroProps {
  ip: string;
  riskScore: number;
  city: string;
  country: string;
  isLoading: boolean;
  onSearch: (ip: string) => void;
  isProxy?: boolean;
  threat?: {
    is_vpn?: boolean;
    is_tor?: boolean;
    is_data_center?: boolean;
    is_public_proxy?: boolean;
    is_web_proxy?: boolean;
    is_residential?: boolean;
    is_spam?: boolean;
  };
}

export default function Hero({ ip, riskScore, city, country, isLoading, onSearch, isProxy, threat }: HeroProps) {
  const [copied, setCopied] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const getRiskInfo = (score: number) => {
    if (score < 20) return { label: "SAFE", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", icon: ShieldCheck };
    if (score < 60) return { label: "MEDIUM", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", icon: ShieldAlert };
    return { label: "RISKY", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20", icon: ShieldX };
  };

  const risk = getRiskInfo(riskScore);

  const getSummaryText = () => {
    if (isLoading) return "Analyzing network perimeter...";
    
    let parts = [];
    if (threat?.is_vpn) parts.push("VPN");
    if (threat?.is_tor) parts.push("TOR");
    if (threat?.is_data_center) parts.push("DCH");
    if (threat?.is_public_proxy) parts.push("PUB");
    if (threat?.is_web_proxy) parts.push("WEB");
    
    const typeLabel = parts.length > 0 ? parts.join(" • ") : (threat?.is_residential ? "RESIDENTIAL" : "ISP");
    
    return (
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-mono tracking-[0.2em] text-muted-foreground uppercase opacity-60">Session Intelligence</span>
        <div className="flex items-center gap-3">
           <span className="text-foreground/90 font-medium">{city}, {country}</span>
           <span className="w-1 h-1 rounded-full bg-white/20" />
           <span className="text-primary font-black tracking-widest">{typeLabel}</span>
        </div>
      </div>
    );
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  return (
    <div className="py-20 md:py-28 relative">
      {/* Background Hero Glow */}
      <div className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] opacity-20 pointer-events-none transition-colors duration-1000",
        riskScore < 20 ? "bg-emerald-500" : riskScore < 60 ? "bg-amber-500" : "bg-rose-500"
      )} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="relative z-10 text-center"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-10 group cursor-default"
        >
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(59,130,246,1)]" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/70 group-hover:text-foreground transition-colors">
            IP2Location Intelligence Live
          </span>
        </motion.div>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-16 relative group">
          <div className="absolute inset-0 bg-primary/5 blur-3xl group-focus-within:bg-primary/10 transition-colors" />
          <div className="relative">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
              <Search className="h-5 w-5" />
            </div>
            <input 
              type="text" 
              placeholder="Query any IP address..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              disabled={isLoading}
              className="w-full h-16 md:h-20 pl-16 pr-44 rounded-3xl bg-white/[0.03] border border-white/10 focus:border-primary/50 focus:bg-white/[0.05] focus:outline-none text-lg md:text-xl font-medium transition-all backdrop-blur-xl placeholder:text-muted-foreground/40"
            />
            <div className="absolute right-3 top-3 bottom-3 flex gap-2">
              <div className="hidden md:flex items-center gap-1.5 px-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-muted-foreground">
                <Command className="h-3 w-3" />
                <span>K</span>
              </div>
              <button 
                type="submit"
                disabled={isLoading || !searchInput.trim()}
                className="px-6 md:px-8 rounded-2xl bg-primary text-white font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:shadow-none flex items-center gap-3 text-xs md:text-sm overflow-hidden relative group/btn"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span>Inspect</span>
                    <RefreshCw className="h-4 w-4 opacity-40 group-hover/btn:rotate-180 transition-transform duration-500" />
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
              </button>
            </div>
          </div>
        </form>

        <div className="space-y-6">
          <div className="relative inline-block">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-4 text-white drop-shadow-2xl selection:bg-primary/30 break-all px-4">
              {ip}
            </h1>
            <button 
              onClick={copyToClipboard}
              className="absolute -right-4 -top-4 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-95 group/copy"
              title="Copy Identifier"
            >
              {copied ? (
                <Check className="h-5 w-5 text-emerald-400" />
              ) : (
                <Copy className="h-5 w-5 text-muted-foreground group-hover/copy:text-foreground transition-colors" />
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
            <div className={cn(
              "flex items-center gap-3 px-6 py-3 rounded-2xl border backdrop-blur-md transition-all duration-500",
              risk.bg, risk.border
            )}>
              <risk.icon className={cn("h-6 w-6", risk.color)} />
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none mb-1">Reputation</p>
                <p className={cn("font-black text-lg leading-none tracking-tight", risk.color)}>{risk.label}</p>
              </div>
              <div className="w-px h-8 bg-white/10 mx-2" />
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none mb-1">Score</p>
                <p className="text-foreground font-black text-lg leading-none tabular-nums">{riskScore}</p>
              </div>
            </div>

            <button 
              onClick={() => typeof window !== 'undefined' && window.print()}
              className="group flex items-center gap-3 px-6 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all backdrop-blur-md"
            >
              <FileText className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none mb-1">Export</p>
                <p className="font-bold text-sm leading-none">Security Report</p>
              </div>
            </button>
          </div>
          
          <div className="max-w-2xl mx-auto min-h-[4rem]">
            {getSummaryText()}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
