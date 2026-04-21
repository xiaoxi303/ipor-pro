"use client";

import { motion } from "framer-motion";
import { Activity, Shield, Info, Server, Network } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdvancedIpDetailsProps {
  data?: any;
}

export default function AdvancedIpDetails({ data }: AdvancedIpDetailsProps) {
  const ipPrefix = data?.ip ? data.ip.split('.').slice(0, 3).join('.') : "178.xx.xx";
  const ipRange = `${ipPrefix}.0 - ${ipPrefix}.255`;
  
  const displayDomain = data?.domain && data.domain !== "Unknown" ? data.domain : "N/A";
  const usageTypeLabel = data?.usage_type || (data?.is_proxy ? "Data Center" : "Residential");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-8 rounded-[2rem] border border-white/10 bg-[#030303]/40 backdrop-blur-2xl mt-12 group"
    >
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
          <Activity className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tight text-gradient">高级流量与来源特征</h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Authentic IP2Location Intelligence</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* AS & Range */}
        <div className="space-y-6 col-span-1 lg:col-span-1 border border-white/5 bg-white/[0.02] rounded-2xl p-6 group-hover:bg-white/[0.04] transition-colors">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Network className="h-4 w-4 text-primary/60" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">关联域名 (Domain)</span>
            </div>
            <p className="text-lg font-black truncate text-white" title={displayDomain}>{displayDomain}</p>
          </div>
          <div className="pt-4 border-t border-white/5">
            <div className="flex items-center gap-3 mb-2">
              <Server className="h-4 w-4 text-primary/60" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">IP 范围 (CIDR /24)</span>
            </div>
            <p className="text-sm font-black font-mono bg-white/5 px-3 py-2 rounded-xl inline-block text-primary/80 border border-primary/10">{ipRange}</p>
          </div>
        </div>

        {/* Real-time Bot/Scanner Status */}
        <div className="space-y-6 col-span-1 lg:col-span-1 border border-white/5 bg-white/[0.02] rounded-2xl p-6 group-hover:bg-white/[0.04] transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="h-4 w-4 text-primary/60" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">自动化行为检测</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className={cn(
              "p-4 rounded-xl border flex flex-col items-center justify-center gap-2",
              data?.threat?.is_bot ? "bg-rose-500/5 border-rose-500/20 text-rose-500" : "bg-emerald-500/5 border-emerald-500/10 text-emerald-400"
            )}>
              <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Robot/Bot</span>
              <span className="text-sm font-black">{data?.threat?.is_bot ? "DETECTED" : "NONE"}</span>
            </div>
            <div className={cn(
              "p-4 rounded-xl border flex flex-col items-center justify-center gap-2",
              data?.threat?.is_scanner ? "bg-rose-500/5 border-rose-500/20 text-rose-500" : "bg-emerald-500/5 border-emerald-500/10 text-emerald-400"
            )}>
              <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Scanner</span>
              <span className="text-sm font-black">{data?.threat?.is_scanner ? "DETECTED" : "NONE"}</span>
            </div>
          </div>
          
          <p className="text-[10px] text-muted-foreground/60 text-center font-medium">
            基于 IP2Location 数据库实时行为指纹比对
          </p>
        </div>

        {/* IP Properties */}
        <div className="space-y-4 col-span-1 lg:col-span-1 border border-white/5 bg-white/[0.02] rounded-2xl p-6 group-hover:bg-white/[0.04] transition-colors">
          <div className="grid grid-cols-1 gap-6">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">使用类型 (Usage)</span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-[10px] font-black text-white border border-white/10">
                {usageTypeLabel}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">连接速度 (Speed)</span>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-[10px] font-black text-primary border border-primary/20">
                {data?.net_speed || "N/A"}
              </span>
            </div>
            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Shield className="h-3 w-3" /> 风险状态
              </span>
              <span className={cn(
                "text-sm font-black",
                data?.riskScore < 20 ? "text-emerald-400" : data?.riskScore < 60 ? "text-amber-400" : "text-rose-500"
              )}>
                {data?.riskScore < 20 ? "SECURE" : data?.riskScore < 60 ? "WARNING" : "CRITICAL"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
