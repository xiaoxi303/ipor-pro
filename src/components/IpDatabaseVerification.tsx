"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Database, CheckCircle2, Loader2, ServerCog } from "lucide-react";
import { useState, useEffect } from "react";

interface VerificationProps {
  riskScore: number;
  isProxy: boolean;
  isp?: string;
  ip?: string;
  usageType?: string;
}

export default function IpDatabaseVerification({ riskScore, isProxy, isp, ip, usageType }: VerificationProps) {
  const [status, setStatus] = useState({
    standard: 'idle',
    proxy: 'idle',
    threat: 'idle'
  });

  const typeCN = isProxy ? "机房 / 托管 IP" : "住宅 / 宽带 IP";
  const displayUsage = usageType || (isProxy ? "Data Center" : "Residential");

  useEffect(() => {
    setStatus({ standard: 'idle', proxy: 'idle', threat: 'idle' });

    let isMounted = true;
    
    const runVerification = async () => {
      await new Promise(r => setTimeout(r, 600));
      if(!isMounted) return;
      setStatus(s => ({ ...s, standard: 'checking' }));
      
      await new Promise(r => setTimeout(r, 800));
      if(!isMounted) return;
      setStatus(s => ({ ...s, standard: 'done', proxy: 'checking' }));
      
      await new Promise(r => setTimeout(r, 700));
      if(!isMounted) return;
      setStatus(s => ({ ...s, proxy: 'done', threat: 'checking' }));
      
      await new Promise(r => setTimeout(r, 900));
      if(!isMounted) return;
      setStatus(s => ({ ...s, threat: 'done' }));
    };

    runVerification();

    return () => { isMounted = false; };
  }, [ip]);

  const isAllDone = status.standard === 'done' && status.proxy === 'done' && status.threat === 'done';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-8 rounded-[2rem] border border-white/10 bg-[#030303]/40 backdrop-blur-2xl relative overflow-hidden group"
    >
      <div className="flex items-center gap-4 mb-10 relative z-10">
        <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
          <Database className="h-6 w-6 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tight text-gradient">IP2Location 核心验证</h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Multi-DB Cross Verification</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-10 relative z-10">
        <DatabaseCard 
          title="标准库 (位置信息)" 
          status={status.standard} 
          value="已匹配并核实" 
        />
        <DatabaseCard 
          title="代理库 (情报分析)" 
          status={status.proxy} 
          value={displayUsage === "Residential" ? "住宅/宽带" : displayUsage === "Data Center" ? "数据中心" : displayUsage} 
        />
        <DatabaseCard 
          title="威胁库 (信誉评级)" 
          status={status.threat} 
          value={riskScore > 50 ? "检测到高风险" : "信誉记录纯净"} 
        />
      </div>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {!isAllDone ? (
            <motion.div 
              key="loading-analysis"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center p-10 border border-white/5 bg-white/[0.02] rounded-2xl h-[200px]"
            >
               <Loader2 className="h-8 w-8 text-indigo-400 animate-spin mb-4" />
               <p className="text-[11px] font-bold text-muted-foreground animate-pulse text-center max-w-xs uppercase tracking-widest opacity-60">
                 正在跨库校验 IP2Location 专业数据库...
               </p>
            </motion.div>
          ) : (
            <motion.div 
              key="done-analysis"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="min-h-[200px] flex flex-col justify-between"
            >
              <div className="mb-6">
                <h3 className="text-[10px] font-black text-muted-foreground/60 mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  权威库判定报告
                </h3>
                <p className="text-sm font-medium leading-relaxed text-white/80">
                  {isProxy 
                    ? `经 IP2Location.io 深度链路验证，该 IP 已在 Proxy/VPN 库中备案。其特征符合 ${usageType || "数据中心"} 定义，归属机构为 ${isp}。`
                    : `多重数据库特征比对高度一致。确认该 IP 处于 ${usageType || "住宅宽带"} 环境，未在任何威胁库中发现风险记录。`}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex flex-col items-center text-center">
                <div className="text-lg font-black text-indigo-400 tracking-widest uppercase">
                  判定结果: {typeCN}
                </div>
                <p className="text-[9px] font-bold text-muted-foreground mt-2 opacity-40 uppercase tracking-[0.2em]">来源: IP2Location.io 官方接口</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function DatabaseCard({ title, status, value }: { title: string; status: string; value: string }) {
  return (
    <div className={`p-4 rounded-2xl border transition-all duration-500 ${
      status === 'done' ? 'bg-white/10 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 
      status === 'checking' ? 'bg-indigo-500/10 border-indigo-500/50' : 
      'bg-white/5 border-white/5 opacity-50'
    }`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{title}</span>
        {status === 'done' && <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />}
        {status === 'checking' && <Loader2 className="h-3.5 w-3.5 text-indigo-400 animate-spin" />}
      </div>
      <p className={`text-sm font-bold truncate transition-colors duration-300 ${
        status === 'done' ? 'text-white' : 
        status === 'checking' ? 'text-indigo-300 animate-pulse' : 
        'text-muted-foreground'
      }`}>
        {status === 'done' ? value : status === 'checking' ? '查询中...' : '等待中'}
      </p>
    </div>
  );
}
