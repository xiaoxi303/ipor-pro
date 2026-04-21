"use client";

import { motion } from "framer-motion";
import { Activity, Shield, Info, Server, Network } from "lucide-react";

interface AdvancedIpDetailsProps {
  data?: any;
}

export default function AdvancedIpDetails({ data }: AdvancedIpDetailsProps) {
  // Mock calculations based on data
  const ipPrefix = data?.ip ? data.ip.split('.').slice(0, 3).join('.') : "178.xx.xx";
  const ipRange = `${ipPrefix}.0 - ${ipPrefix}.255`;
  
  const botRatio = data?.riskScore ? Math.min(Math.round(data.riskScore * 1.5), 100) : 12;
  const humanRatio = 100 - botRatio;
  
  const cfScore = data?.riskScore ? Math.floor(data.riskScore / 2) : 5;
  const iporScore = data?.riskScore ? Math.floor(data.riskScore * 0.8) : 8;

  const getAsDomain = (org?: string) => {
    if (!org) return 'xtom.com';
    const firstWord = org.split(' ')[0].toLowerCase();
    // remove some common suffixes if any
    const cleanWord = firstWord.replace(/[,.]/g, '');
    return `${cleanWord}.com`;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md mt-8"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <Activity className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">高级流量与来源特征</h2>
          <p className="text-xs text-muted-foreground">Advanced Traffic & Source Characteristics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* AS & Range */}
        <div className="space-y-4 border border-white/5 bg-black/20 rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Network className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-tight">AS 域名</span>
              </div>
              <p className="text-base font-bold text-foreground break-all">{getAsDomain(data?.asn_org)}</p>
            </div>
            <div className="sm:text-right">
              <div className="flex items-center sm:justify-end gap-2 mb-1">
                <Server className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-tight">IP 范围 (CIDR /24)</span>
              </div>
              <p className="text-sm font-mono font-bold text-primary/90">{ipRange}</p>
            </div>
          </div>
        </div>

        {/* Traffic Ratio */}
        <div className="space-y-4 border border-white/5 bg-black/20 rounded-2xl p-5">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-tight">人机流量比 (估计值)</span>
          </div>
          <div className="flex items-end justify-between gap-2">
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-primary leading-none">{humanRatio}%</span>
              <span className="text-xs text-muted-foreground font-medium uppercase">人类流量</span>
            </div>
            <div className="flex items-end gap-2 text-right">
              <span className="text-xs text-muted-foreground font-medium uppercase">恶意爬虫</span>
              <span className="text-2xl font-bold text-red-400 leading-none">{botRatio}%</span>
            </div>
          </div>
          <div className="w-full h-2.5 bg-red-400/10 rounded-full overflow-hidden flex">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${humanRatio}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.5)]" 
            />
            <div className="h-full bg-red-400" style={{ width: `${botRatio}%` }} />
          </div>
        </div>

        {/* IP Properties */}
        <div className="border border-white/5 bg-black/20 rounded-2xl p-5">
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div className="space-y-1.5">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">IP 来源</span>
              <span className="inline-flex px-2 py-0.5 rounded bg-white/10 text-[11px] font-black uppercase text-foreground border border-white/5">
                {data?.is_proxy ? "数据中心 (DC)" : "住宅网络 (ISP)"}
              </span>
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">IP 属性</span>
              <span className="inline-flex px-2 py-0.5 rounded bg-green-500/10 text-[11px] font-black uppercase text-green-400 border border-green-500/20">
                原生 IP (Native)
              </span>
            </div>
            <div className="space-y-1.5 pt-4 border-t border-white/5">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block flex items-center gap-1">
                <Shield className="h-3 w-3" /> CF 系数
              </span>
              <span className="text-sm font-black text-yellow-500">{cfScore} <span className="text-[10px] text-muted-foreground font-normal">/ 100</span></span>
            </div>
            <div className="space-y-1.5 pt-4 border-t border-white/5">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block flex items-center gap-1">
                <Info className="h-3 w-3" /> IPor 系数
              </span>
              <span className="text-sm font-black text-primary">{iporScore} <span className="text-[10px] text-muted-foreground font-normal">/ 100</span></span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
