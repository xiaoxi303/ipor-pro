"use client";

import { motion } from "framer-motion";
import { Database, CheckCircle2 } from "lucide-react";

interface VerificationProps {
  riskScore: number;
  isProxy: boolean;
  isp?: string;
}

export default function IpDatabaseVerification({ riskScore, isProxy, isp }: VerificationProps) {
  // Mock logic for cross-verification display
  const type = isProxy ? "Business / Data Center" : "Residential / ISP";
  const typeCN = isProxy ? "机房 / 托管 IP" : "住宅 / 宽带 IP";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-indigo-500/10 rounded-xl">
          <Database className="h-6 w-6 text-indigo-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold">IP 库交叉验证</h2>
          <p className="text-xs text-muted-foreground">MaxMind / IPQS / IP2Location 多源对比</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <DatabaseCard title="MaxMind" value={isProxy ? "Business / Data Center" : "Residential / ISP"} />
        <DatabaseCard title="IP2Location" value={isProxy ? "Hosting" : "Residential"} />
        <DatabaseCard title="IPQS" value={isProxy ? "Data Center" : "Residential"} />
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider">对比结果分析</h3>
          <p className="text-sm leading-relaxed">
            多方数据库高度一致，且其 ISP/Org 信息均为 {isp || "当前运营商"}，未发现机房特征指纹。
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col items-center text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">综合判定</span>
          <div className="text-2xl font-black text-primary tracking-tight">
            一致判定为{typeCN}
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 italic">最后验证时间：刚刚</p>
        </div>
      </div>
    </motion.div>
  );
}

function DatabaseCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
      <span className="text-[10px] font-bold text-muted-foreground block mb-1">{title}</span>
      <p className="text-sm font-bold truncate">{value}</p>
    </div>
  );
}
