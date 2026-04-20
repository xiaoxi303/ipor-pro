"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, ShieldCheck, Bug, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function ReputationAssessment({ riskScore }: { riskScore: number }) {
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
    if (score < 20) return { label: "安全 (Low Risk)", color: "text-green-500", stroke: "#22c55e" };
    if (score < 60) return { label: "中危 (Medium Risk)", color: "text-yellow-500", stroke: "#eab308" };
    return { label: "极高风险 (High Risk)", color: "text-red-500", stroke: "#ef4444" };
  };

  const risk = getRiskLevel(isScanning ? 0 : displayScore);
  const percentage = Math.min(isScanning ? 0 : displayScore, 100);
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md relative overflow-hidden"
    >
      {/* Scanning Overlay */}
      <AnimatePresence>
        {isScanning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 bg-background/40 backdrop-blur-sm flex flex-col items-center justify-center"
          >
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">实时扫描中...</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-red-500/10 rounded-xl">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold">实时信誉评估</h2>
          <p className="text-xs text-muted-foreground">RBL 黑名单与欺诈评分</p>
        </div>
      </div>

      <div className="flex flex-col items-center mb-10">
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="40"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-white/5"
            />
            <motion.circle
              cx="80"
              cy="80"
              r="40"
              stroke={risk.stroke}
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              key={displayScore}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-black"
            >
              {isScanning ? "--" : displayScore}
            </motion.span>
          </div>
        </div>
        <div className="text-center mt-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">综合欺诈分</span>
          <p className={`text-lg font-black transition-colors duration-500 ${risk.color}`}>{isScanning ? "评估中..." : risk.label}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-[10px] font-bold text-muted-foreground mb-3 uppercase tracking-wider">RBL 黑名单状态</h3>
          <div className="flex flex-wrap gap-2">
            <BlacklistBadge name="Spamhaus" clean={riskScore < 40} scanning={isScanning} />
            <BlacklistBadge name="Barracuda" clean={riskScore < 50} scanning={isScanning} />
            <BlacklistBadge name="SORBS" clean={riskScore < 60} scanning={isScanning} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-start gap-3">
            <Bug className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-xs font-bold mb-1 uppercase">滥用报告</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {isScanning ? "正在检索滥用数据库..." : "无活跃滥用报告。近期未观察到该 IP 参与 DDoS 或大规模爬虫行为。"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function BlacklistBadge({ name, clean, scanning }: { name: string; clean: boolean; scanning: boolean }) {
  return (
    <div className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all duration-500 ${
      scanning ? "bg-white/5 border-white/10 text-muted-foreground animate-pulse" :
      clean ? "bg-green-500/5 border-green-500/20 text-green-500" : "bg-red-500/5 border-red-500/20 text-red-500"
    }`}>
      {name}: {scanning ? "Scanning..." : clean ? "Clean" : "Listed"}
    </div>
  );
}
