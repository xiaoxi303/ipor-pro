"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Play, Video as Youtube, Tv, MessageSquare, Globe } from "lucide-react";

interface ServiceProps {
  name: string;
  available: boolean;
  statusText?: string;
  subText?: string;
  icon?: any;
}

function Service({ name, available, statusText, subText, icon: Icon }: ServiceProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 group">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />}
        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{name}</span>
      </div>
      <div className="text-right">
        <span className={`text-xs font-bold ${available ? "text-green-500" : "text-red-500"}`}>
          {statusText || (available ? "可用" : "受限")}
        </span>
        {subText && (
          <p className="text-[10px] text-muted-foreground mt-0.5">{subText}</p>
        )}
      </div>
    </div>
  );
}

export default function ServiceStatus({ riskScore, countryCode }: { riskScore: number; countryCode: string }) {
  const isCnxClean = riskScore < 40;
  const isRestricted = ["CN", "RU", "IR", "KP"].includes(countryCode);
  const region = countryCode === "TW" ? "台湾区" : countryCode === "HK" ? "香港区" : "当前地区";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-red-500/10 rounded-xl">
          <Play className="h-6 w-6 text-red-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold">流媒体与服务可用性</h2>
          <p className="text-xs text-muted-foreground">基于当前 IP 的服务准入评估</p>
        </div>
      </div>

      <div className="space-y-1">
        <Service 
          name="Google / YouTube" 
          available={!isRestricted} 
          statusText={!isRestricted ? `可用 (${region}内容)` : "受限"}
          icon={Youtube}
        />
        <Service 
          name="Netflix" 
          available={isCnxClean} 
          statusText={isCnxClean ? "解锁原生" : "受限"}
          subText={isCnxClean ? `(支持${region}内容库)` : "检测到代理"}
          icon={Tv}
        />
        <Service 
          name="TikTok" 
          available={!isRestricted && isCnxClean} 
          statusText={!isRestricted && isCnxClean ? "流畅" : "无法访问"}
          subText={!isRestricted && isCnxClean ? `(${region}版本)` : "地域或环境限制"}
          icon={Play}
        />
        <Service 
          name="ChatGPT / Gemini" 
          available={!isRestricted && isCnxClean} 
          statusText={!isRestricted && isCnxClean ? "可用" : "受限"}
          subText={!isRestricted && isCnxClean ? `(支持${region}访问)` : "环境被屏蔽"}
          icon={MessageSquare}
        />
      </div>
    </motion.div>
  );
}
