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
    <div className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-yellow-500/10 rounded-xl">
          <Lightbulb className="h-6 w-6 text-yellow-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold">深度安全建议</h2>
          <p className="text-xs text-muted-foreground">Professional Security Insights</p>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all"
          >
            <div className={`mt-1 p-1.5 rounded-lg h-fit ${
              item.type === 'success' ? 'bg-green-500/10 text-green-500' :
              item.type === 'warning' ? 'bg-yellow-500/10 text-yellow-500' :
              item.type === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
            }`}>
              <item.icon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold mb-1 flex items-center gap-2">
                {item.title}
                <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
