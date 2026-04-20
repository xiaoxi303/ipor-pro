"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, ShieldX, Copy, Check, RefreshCw, FileText } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface HeroProps {
  ip: string;
  riskScore: number;
  city: string;
  country: string;
  isLoading: boolean;
  onSearch: (ip: string) => void;
}

export default function Hero({ ip, riskScore, city, country, isLoading, onSearch }: HeroProps) {
  const [copied, setCopied] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const getRiskInfo = (score: number) => {
    if (score < 20) return { label: "纯净", color: "text-green-500", bg: "bg-green-500/10", icon: ShieldCheck };
    if (score < 60) return { label: "中风险", color: "text-yellow-500", bg: "bg-yellow-500/10", icon: ShieldAlert };
    return { label: "高风险", color: "text-red-500", bg: "bg-red-500/10", icon: ShieldX };
  };

  const risk = getRiskInfo(riskScore);

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
    <div className="py-12 md:py-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
          实时 IP 深度分析
        </span>
        
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8 relative group">
          <input 
            type="text" 
            placeholder="输入 IP 地址进行查询..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            disabled={isLoading}
            className="w-full h-14 md:h-16 px-6 rounded-2xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none text-xl font-medium transition-all group-hover:bg-white/10 disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={isLoading || !searchInput.trim()}
            className="absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:bg-primary/50 disabled:shadow-none flex items-center gap-2"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="h-5 w-5" />
              </motion.div>
            ) : "立即检测"}
          </button>
        </form>

        <div className="flex items-center justify-center gap-4 mb-8">
          <button 
            onClick={() => window.print()}
            className="group flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
          >
            <div className="p-1 rounded-md bg-primary/20 text-primary group-hover:scale-110 transition-transform">
              <FileText className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground">导出专业分析报告</span>
          </button>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 flex items-center justify-center gap-4">
          {ip}
          <button 
            onClick={copyToClipboard}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            title="复制 IP"
          >
            {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5 text-muted-foreground" />}
          </button>
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <div className={cn("flex items-center gap-2 px-4 py-2 rounded-full border border-white/10", risk.bg)}>
            <risk.icon className={cn("h-5 w-5", risk.color)} />
            <span className={cn("font-bold", risk.color)}>网络纯净度：{risk.label}</span>
            <span className="text-muted-foreground ml-1">({riskScore})</span>
          </div>
        </div>
        
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          连接来源于 <span className="text-foreground font-medium">{city}, {country}</span>。
          当前网络状态表现为 <span className={risk.color}>{risk.label}</span>。
        </p>
      </motion.div>
    </div>
  );
}
