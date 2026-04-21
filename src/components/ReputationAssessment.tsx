"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, ShieldCheck, Bug, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ReputationProps {
  riskScore: number;
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

export default function ReputationAssessment({ riskScore, threat }: ReputationProps) {
  const [isScanning, setIsScanning] = useState(true);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    setIsScanning(true);
    const timer = setTimeout(() => {
      setIsScanning(false);
      setDisplayScore(riskScore);
    }, 1500);
    return () => clearTimeout(timer);
  }, [riskScore]);

  const getRiskLevel = (score: number) => {
    if (score < 20) return { label: "SAFE", color: "text-emerald-400", stroke: "#10b981" };
    if (score < 60) return { label: "MEDIUM", color: "text-amber-400", stroke: "#f59e0b" };
    return { label: "HIGH RISK", color: "text-rose-500", stroke: "#f43f5e" };
  };

  const risk = getRiskLevel(isScanning ? 0 : displayScore);
  const percentage = Math.min(isScanning ? 0 : displayScore, 100);
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="p-8 rounded-[2rem] border border-white/10 bg-[#030303]/40 backdrop-blur-2xl relative overflow-hidden group"
    >
      {/* Scanning Overlay */}
      <AnimatePresence>
        {isScanning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-[#030303]/60 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary animate-pulse">Running Reputation Scan</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
          <AlertTriangle className="h-6 w-6 text-rose-500" />
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tight text-gradient">实时信誉评估</h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">IP2Location Threat Analysis</p>
        </div>
      </div>

      <div className="flex flex-col items-center mb-12 relative">
        <div className="relative w-44 h-44 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90 scale-110">
            <circle
              cx="80"
              cy="80"
              r="40"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-white/5"
            />
            <motion.circle
              cx="80"
              cy="80"
              r="40"
              stroke={risk.stroke}
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "circOut" }}
              strokeLinecap="round"
              className="drop-shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.5)]"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              key={displayScore}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl font-black tracking-tighter"
            >
              {isScanning ? "--" : displayScore}
            </motion.span>
          </div>
        </div>
        <div className="text-center mt-6">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 block mb-2">综合欺诈分</span>
          <p className={cn("text-xl font-black tracking-widest transition-colors duration-500 uppercase", risk.color)}>
            {isScanning ? "SCANNING..." : risk.label}
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-[10px] font-black text-muted-foreground/60 mb-4 uppercase tracking-[0.2em]">威胁标签 (Real-time Flags)</h3>
          <div className="grid grid-cols-1 gap-2">
            <ThreatBadge name="VPN Detector" active={threat?.is_vpn} scanning={isScanning} />
            <ThreatBadge name="TOR Exit Node" active={threat?.is_tor} scanning={isScanning} />
            <ThreatBadge name="Spam Source" active={threat?.is_spam} scanning={isScanning} />
            <ThreatBadge name="Public Proxy" active={threat?.is_public_proxy} scanning={isScanning} />
            <ThreatBadge name="Data Center" active={threat?.is_data_center} scanning={isScanning} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.04] transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white/5 rounded-lg mt-0.5">
              <Bug className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <h4 className="text-xs font-black mb-1 uppercase tracking-wider">滥用分析</h4>
              <p className="text-[11px] text-muted-foreground/70 leading-relaxed font-medium">
                {isScanning ? "正在检索全球滥用数据库..." : (
                  threat?.is_spam 
                  ? "警告：该 IP 在 IP2Location 数据库中被标记为活跃垃圾邮件或滥用来源。" 
                  : "当前无活跃滥用报告。IP2Location 未观察到该 IP 参与 DDoS 或大规模爬虫行为。"
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ThreatBadge({ name, active, scanning }: { name: string; active?: boolean; scanning: boolean }) {
  return (
    <div className={cn(
      "flex justify-between items-center px-4 py-3 rounded-xl border transition-all duration-700",
      scanning ? "bg-white/5 border-white/5 text-muted-foreground animate-pulse" :
      active ? "bg-rose-500/5 border-rose-500/10 text-rose-500" : "bg-emerald-500/5 border-emerald-500/10 text-emerald-400"
    )}>
      <span className="text-[10px] font-black uppercase tracking-widest">{name}</span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold">{scanning ? "Checking" : active ? "DETECTED" : "CLEAN"}</span>
        {!scanning && (active ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />)}
      </div>
    </div>
  );
}

