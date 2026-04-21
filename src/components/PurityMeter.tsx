"use client";

import { motion } from "framer-motion";
import { User, Bot, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface PurityMeterProps {
  score: number; // 0-100 (100 is best)
  isLoading?: boolean;
}

export default function PurityMeter({ score, isLoading }: PurityMeterProps) {
  const percentage = score;
  const strokeDasharray = 2 * Math.PI * 45;
  const strokeDashoffset = strokeDasharray * (1 - percentage / 100);

  const getStatusColor = (s: number) => {
    if (s >= 80) return "text-emerald-400";
    if (s >= 50) return "text-amber-400";
    return "text-rose-500";
  };

  const getStatusBg = (s: number) => {
    if (s >= 80) return "bg-emerald-400/10";
    if (s >= 50) return "bg-amber-400/10";
    return "bg-rose-500/10";
  };

  const getStatusBorder = (s: number) => {
    if (s >= 80) return "border-emerald-400/20";
    if (s >= 50) return "border-amber-400/20";
    return "border-rose-500/20";
  };

  const statusColor = getStatusColor(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48 mb-6">
        {/* Background Circle */}
        <svg className="w-full h-full -rotate-90 transform">
          <circle
            cx="96"
            cy="96"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-white/5"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="96"
            cy="96"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: strokeDasharray }}
            animate={{ strokeDashoffset: isLoading ? strokeDasharray : strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={cn(statusColor, "drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]")}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">纯净度</span>
          <span className={cn("text-4xl font-black tracking-tighter", statusColor)}>
            {isLoading ? "--" : score}
          </span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">检测系数</span>
        </div>
      </div>

      {/* Human/Bot Ratio Simulation based on score */}
      <div className="w-full space-y-4">
        <div className="flex justify-between items-end mb-1">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-bold text-white/70">真人访问概率</span>
          </div>
          <span className="text-xs font-black text-emerald-400">{score}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: isLoading ? 0 : `${score}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
          />
        </div>

        <div className="flex justify-between items-end mb-1 mt-4">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-rose-500" />
            <span className="text-xs font-bold text-white/70">机器人/风险概率</span>
          </div>
          <span className="text-xs font-black text-rose-500">{100 - score}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: isLoading ? 0 : `${100 - score}%` }}
            transition={{ duration: 1, delay: 0.7 }}
            className="h-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
          />
        </div>
      </div>

      <div className={cn(
        "mt-8 p-4 rounded-2xl border flex items-start gap-3 transition-colors",
        getStatusBg(score), getStatusBorder(score)
      )}>
        <Info className={cn("h-4 w-4 mt-0.5", statusColor)} />
        <p className="text-[11px] leading-relaxed font-medium text-white/70">
          {score >= 80 
            ? "该 IP 地址非常纯净，风险极低。非常适合进行安全交易和模拟真实住宅用户行为。" 
            : score >= 50 
            ? "风险水平中等。在某些平台上可能会触发额外的验证（如验证码）。" 
            : "高风险标识。该 IP 可能与 VPN、Tor 或自动化流量模式相关联。"}
        </p>
      </div>
    </div>
  );
}
