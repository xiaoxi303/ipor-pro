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
  Command,
  Activity
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import PurityMeter from "./PurityMeter";

interface HeroProps {
  ip: string;
  riskScore: number;
  purityScore?: number;
  fraudScore?: number;
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

export default function Hero({ ip, riskScore, purityScore, fraudScore, city, country, isLoading, onSearch, isProxy, threat }: HeroProps) {
  const [copied, setCopied] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const getRiskInfo = (score: number) => {
    if (score < 20) return { label: "CLEAN", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", icon: ShieldCheck };
    if (score < 60) return { label: "MODERATE", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", icon: ShieldAlert };
    return { label: "RISKY", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20", icon: ShieldX };
  };

  const risk = getRiskInfo(riskScore);
  const effectivePurity = purityScore ?? (100 - riskScore);

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
    <div className="py-12 md:py-20 relative">
      {/* Background Hero Glow */}
      <div className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[160px] opacity-10 pointer-events-none transition-colors duration-1000",
        riskScore < 20 ? "bg-emerald-500" : riskScore < 60 ? "bg-amber-500" : "bg-rose-500"
      )} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Content: Search & IP Display */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="lg:col-span-7 space-y-10"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md group cursor-default"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(59,130,246,1)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/70 group-hover:text-foreground transition-colors">
              IPor 智能核心
            </span>
          </motion.div>

          <div className="space-y-4">
            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-muted-foreground opacity-50">当前网络标识</h2>
            <div className="relative inline-block group">
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white drop-shadow-2xl selection:bg-primary/30 break-all leading-none">
                {ip}
              </h1>
              <button 
                onClick={copyToClipboard}
                className="absolute -right-12 top-0 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-95 group/copy"
                title="复制 IP"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
              </button>
            </div>
          </div>

          <form onSubmit={handleSearch} className="max-w-xl relative group">
            <div className="absolute inset-0 bg-primary/5 blur-3xl group-focus-within:bg-primary/10 transition-colors" />
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="查询任意 IP 地址..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                disabled={isLoading}
                className="w-full h-16 md:h-20 pl-16 pr-32 rounded-3xl bg-white/[0.03] border border-white/10 focus:border-primary/50 focus:bg-white/[0.05] focus:outline-none text-lg font-medium transition-all backdrop-blur-xl"
              />
              <button 
                type="submit"
                className="absolute right-3 top-3 bottom-3 px-6 rounded-2xl bg-primary text-white font-black uppercase tracking-widest hover:bg-primary/90 transition-all text-xs"
              >
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "立即查询"}
              </button>
            </div>
          </form>

          <div className="flex flex-wrap gap-4">
            <div className={cn(
              "flex items-center gap-3 px-6 py-4 rounded-[1.5rem] border backdrop-blur-md",
              risk.bg, risk.border
            )}>
              <risk.icon className={cn("h-6 w-6", risk.color)} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none mb-1">信誉状态</p>
                <p className={cn("font-black text-lg leading-none tracking-tight", risk.color)}>{risk.label === "CLEAN" ? "纯净" : risk.label === "MODERATE" ? "中等风险" : "高风险"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-6 py-4 rounded-[1.5rem] border border-white/10 bg-white/5 backdrop-blur-md">
              <Activity className="h-6 w-6 text-primary" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none mb-1">地理位置</p>
                <p className="font-black text-lg leading-none tracking-tight text-white/90">{city || "未知"}</p>
              </div>
            </div>
            
            <button className="flex items-center gap-3 px-6 py-4 rounded-[1.5rem] border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">导出报告</span>
            </button>
          </div>
        </motion.div>

        {/* Right Content: Purity Meter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="lg:col-span-5 flex justify-center lg:justify-end"
        >
          <div className="bg-[#0A0A0A]/60 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] shadow-2xl relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
              <Activity className="h-20 w-20 text-primary" />
            </div>
            <PurityMeter score={effectivePurity} isLoading={isLoading} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
