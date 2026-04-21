"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, ShieldX, Lightbulb, ArrowRight } from "lucide-react";

interface SecurityInsightsProps {
  riskScore: number;
  isProxy: boolean;
  isp: string;
}

export default function SecurityInsights({ riskScore, isProxy, isp }: SecurityInsightsProps) {
  const getInsights = () => {
    const insights = [];
    
    if (riskScore < 20 && !isProxy) {
      insights.push({
        title: "高质量住宅环境",
        desc: "该 IP 表现为高度纯净的家庭/宽带属性，适合进行高价值业务操作。",
        type: "success",
        icon: ShieldCheck
      });
    } else if (isProxy) {
      insights.push({
        title: "检测到代理/机房属性",
        desc: "当前环境可能被识别为 VPN 或数据中心，建议避免在此环境下进行敏感支付。",
        type: "warning",
        icon: ShieldAlert
      });
    }

    if (riskScore > 60) {
      insights.push({
        title: "信誉评分偏低",
        desc: "该 IP 可能存在滥用历史，部分严格的平台可能会触发人机验证或封禁。",
        type: "danger",
        icon: ShieldX
      });
    }

    insights.push({
      title: "隐私保护建议",
      desc: "建议定期更换 WebRTC 泄露防护设置，以确保真实局域网 IP 不被泄露。",
      type: "info",
      icon: Lightbulb
    });

    return insights;
  };

  const insights = getInsights();

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="p-8 rounded-[2rem] border border-white/10 bg-[#030303]/40 backdrop-blur-2xl relative overflow-hidden group"
    >
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-amber-400/10 rounded-2xl border border-amber-400/20">
          <Lightbulb className="h-6 w-6 text-amber-400" />
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tight text-gradient">深度安全建议</h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">专业安全情报分析</p>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group/insight flex gap-5 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500"
          >
            <div className={`mt-1 p-2 rounded-xl h-fit border shrink-0 transition-transform duration-500 group-hover/insight:scale-110 ${
              item.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
              item.type === 'warning' ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' :
              item.type === 'danger' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            }`}>
              <item.icon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-[13px] font-black mb-1.5 flex items-center gap-2 tracking-tight group-hover/insight:text-primary transition-colors">
                {item.title}
                <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover/insight:opacity-100 transition-all -translate-x-3 group-hover/insight:translate-x-0" />
              </h3>
              <p className="text-[11px] text-muted-foreground/80 leading-relaxed font-medium">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
