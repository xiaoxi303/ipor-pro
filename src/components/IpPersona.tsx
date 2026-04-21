"use client";

import { motion } from "framer-motion";
import { UserSearch, ShieldCheck, Activity, Terminal } from "lucide-react";

interface PersonaProps {
  usageType: string;
  persona: string;
  riskScore: number;
}

export default function IpPersona({ usageType, persona, riskScore }: PersonaProps) {
  const isHighRisk = riskScore > 50;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-amber-500/10 rounded-xl">
          <UserSearch className="h-6 w-6 text-amber-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold">IP 场景画像分析</h2>
          <p className="text-xs text-muted-foreground">基于行为特征与网段指纹的深度建模</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
          <Terminal className="h-5 w-5 text-amber-500 shrink-0 mt-1" />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">当前场景识别</span>
            <p className="text-lg font-bold text-amber-500">{usageType}</p>
          </div>
        </div>

        <div className="relative p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className={`h-4 w-4 ${isHighRisk ? 'text-red-400' : 'text-green-400'}`} />
            <span className="text-xs font-bold uppercase">行为画像评估</span>
          </div>
          <p className="text-sm leading-relaxed text-foreground/90 font-medium italic">
            "{persona}"
          </p>
          
          {/* 装饰性动效 */}
          <div className="absolute top-2 right-2 flex gap-1">
             <span className="h-1.5 w-1.5 rounded-full bg-amber-500/40 animate-pulse" />
             <span className="h-1.5 w-1.5 rounded-full bg-amber-500/20 animate-pulse delay-75" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
              <span className="text-[10px] text-muted-foreground block uppercase">业务准入建议</span>
              <span className={`text-xs font-bold ${isHighRisk ? 'text-red-400' : 'text-green-400'}`}>
                {isHighRisk ? "需二次验证" : "允许直接访问"}
              </span>
           </div>
           <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
              <span className="text-[10px] text-muted-foreground block uppercase">代理隐匿度</span>
              <span className="text-xs font-bold text-foreground">
                {isHighRisk ? "高 (透明代理解析)" : "低 (原生接入)"}
              </span>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
