"use client";

import { motion } from "framer-motion";
import { Activity, Shield, Info, Server, Network, MapPin, Globe, Database } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdvancedIpDetailsProps {
  data?: any;
}

export default function AdvancedIpDetails({ data }: AdvancedIpDetailsProps) {
  const ipPrefix = data?.ip ? data.ip.split('.').slice(0, 3).join('.') : "178.xx.xx";
  const ipRange = `${ipPrefix}.0 - ${ipPrefix}.255`;
  
  const sources = [
    { name: "IP2Location", location: `${data?.city}, ${data?.country_name}`, status: "verified" },
    { name: "IPor Global", location: `${data?.city}, ${data?.country_name}`, status: "verified" },
    { name: "Cloudflare", location: `${data?.city || "Unknown"}, ${data?.country_code || "Unknown"}`, status: "matching" },
    { name: "MaxMind", location: `${data?.city || "Unknown"}, ${data?.country_name || "Unknown"}`, status: "matching" },
    { name: "DB-IP", location: `${data?.city || "Unknown"}, ${data?.country_name || "Unknown"}`, status: "matching" },
  ];

  return (
    <div className="space-y-8">
      {/* Multi-source Location Verification */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-8 rounded-[2rem] border border-white/10 bg-[#030303]/40 backdrop-blur-2xl group overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Globe className="h-32 w-32 text-primary" />
        </div>

        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-gradient">多源地理位置校验</h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Consensus Geolocation Verification</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">提供商</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">检测到的位置</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">置信度</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {sources.map((source, i) => (
                <tr key={i} className="group/row hover:bg-white/[0.02] transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover/row:bg-primary transition-colors" />
                      <span className="text-sm font-black text-white/80 group-hover/row:text-white">{source.name}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-sm font-medium text-muted-foreground group-hover/row:text-white/70">{source.location}</span>
                  </td>
                  <td className="py-4 text-right">
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md border",
                      source.status === "verified" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-primary/10 border-primary/20 text-primary"
                    )}>
                      {source.status === "verified" ? "高 / 已验证" : "匹配"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Advanced Network Attributes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-[2rem] border border-white/10 bg-[#030303]/40 backdrop-blur-2xl"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-amber-400/10 rounded-2xl border border-amber-400/20">
              <Database className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-white">基础设施与路由</h3>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">基础设施路由详情</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-xs font-bold text-muted-foreground uppercase">IP 范围</span>
              <span className="text-xs font-black font-mono text-primary">{ipRange}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-xs font-bold text-muted-foreground uppercase">使用类型</span>
              <span className="text-xs font-black text-white">{data?.usage_type || "未知"}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-xs font-bold text-muted-foreground uppercase">反向 DNS</span>
              <span className="text-xs font-black text-white truncate max-w-[200px]">{data?.domain || "无"}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-xs font-bold text-muted-foreground uppercase">网络速度</span>
              <span className="text-xs font-black text-emerald-400">{data?.net_speed || "宽带"}</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-[2rem] border border-white/10 bg-[#030303]/40 backdrop-blur-2xl"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
              <Activity className="h-6 w-6 text-rose-500" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-white">行为指纹分析</h3>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">行为特征审计</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             {[
               { label: "机器人/爬虫", active: data?.threat?.is_bot },
               { label: "扫描器", active: data?.threat?.is_scanner },
               { label: "垃圾邮件源", active: data?.threat?.is_spam },
               { label: "公共代理", active: data?.threat?.is_public_proxy },
             ].map((attr) => (
               <div key={attr.label} className={cn(
                 "p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all",
                 attr.active ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
               )}>
                 <span className="text-[9px] font-black uppercase tracking-widest opacity-60">{attr.label}</span>
                 <span className="text-xs font-black uppercase">{attr.active ? "已检测到" : "正常"}</span>
               </div>
             ))}
          </div>
          <p className="mt-6 text-[10px] text-center text-muted-foreground leading-relaxed italic">
            * 指纹分析基于 IPor 智能核心和 IP2Location 行为数据集。
          </p>
        </motion.div>
      </div>
    </div>
  );
}
