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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* AS & Range */}
        <div className="space-y-4 col-span-1 lg:col-span-1 border border-white/5 bg-black/20 rounded-2xl p-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Network className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">AS 域名</span>
            </div>
            <p className="text-lg font-bold truncate" title={getAsDomain(data?.asn_org)}>{getAsDomain(data?.asn_org)}</p>
          </div>
          <div className="pt-2 border-t border-white/5 mt-auto">
            <div className="flex items-center gap-2 mb-1">
              <Server className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">IP 范围 (CIDR /24)</span>
            </div>
            <p className="text-sm font-medium font-mono bg-white/5 px-2 py-1 rounded inline-block text-primary/90">{ipRange}</p>
          </div>
        </div>

        {/* Traffic Ratio */}
        <div className="space-y-4 col-span-1 lg:col-span-1 border border-white/5 bg-black/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">人机流量比 (估计值)</span>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-black text-primary">{humanRatio}%</span>
            <span className="text-sm text-muted-foreground pb-1">人类</span>
            <span className="text-xl font-bold text-red-400 ml-auto">{botRatio}%</span>
            <span className="text-sm text-muted-foreground pb-1">爬虫</span>
          </div>
          <div className="w-full h-2 bg-red-400/20 rounded-full overflow-hidden flex">
            <div className="h-full bg-primary" style={{ width: `${humanRatio}%` }} />
            <div className="h-full bg-red-400" style={{ width: `${botRatio}%` }} />
          </div>
        </div>

        {/* IP Properties */}
        <div className="space-y-4 col-span-1 lg:col-span-1 border border-white/5 bg-black/20 rounded-2xl p-5">
          <div className="grid grid-cols-2 gap-4 h-full">
            <div>
              <span className="text-xs text-muted-foreground block mb-1">IP 来源</span>
              <span className="px-2.5 py-1 rounded-md bg-white/10 text-xs font-bold block w-fit">
                {data?.is_proxy ? "数据中心 (DC)" : "住宅网络 (ISP)"}
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block mb-1">IP 属性</span>
              <span className="px-2.5 py-1 rounded-md bg-green-500/20 text-green-500 text-xs font-bold block w-fit">
                原生 IP (Native)
              </span>
            </div>
            <div className="pt-2 border-t border-white/5">
              <span className="text-[10px] text-muted-foreground uppercase block mb-1 flex items-center gap-1">
                <Shield className="h-3 w-3" /> Cloudflare 系数
              </span>
              <span className="text-sm font-bold text-yellow-500">{cfScore} / 100</span>
            </div>
            <div className="pt-2 border-t border-white/5">
              <span className="text-[10px] text-muted-foreground uppercase block mb-1 flex items-center gap-1">
                <Info className="h-3 w-3" /> IPor 系数
              </span>
              <span className="text-sm font-bold text-primary">{iporScore} / 100</span>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
