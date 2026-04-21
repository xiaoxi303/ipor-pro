"use client";

import { motion } from "framer-motion";
import { Play, Video as Youtube, Tv, MessageSquare, Globe, Loader2, Music, Gamepad2, BrainCircuit, CheckCircle2, XCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface ServiceItem {
  id: string;
  name: string;
  category: 'streaming' | 'ai' | 'gaming';
  icon: any;
  status: 'idle' | 'checking' | 'done';
  available: boolean;
  statusText: string;
  subText: string;
}

export default function ServiceStatus({ riskScore, countryCode, ip }: { riskScore: number; countryCode: string; ip?: string }) {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [overallStatus, setOverallStatus] = useState<'idle' | 'checking' | 'done'>('idle');

  useEffect(() => {
    // 基础风险逻辑
    const rScore = riskScore || 0;
    const isCnxClean = rScore < 40;
    const isStrictClean = rScore < 20;
    const code = countryCode || "US";
    const isRestricted = ["CN", "RU", "IR", "KP"].includes(code);
    
    // 生成地区名
    const regionMap: Record<string, string> = { "TW": "台湾区", "HK": "香港区", "US": "美区", "JP": "日区", "SG": "狮城", "GB": "英区", "KR": "韩区", "DE": "德区", "FR": "法区", "NL": "荷兰" };
    const region = regionMap[code] || code;

    const initialServices: ServiceItem[] = [
      { id: 'netflix', name: "Netflix", category: 'streaming', icon: Tv, status: 'idle', available: isCnxClean, statusText: isCnxClean ? "完全解锁" : "仅限自制剧 / 封锁", subText: isCnxClean ? `原生解锁 (${region})` : "检测到代理 IP" },
      { id: 'disney', name: "Disney+", category: 'streaming', icon: Play, status: 'idle', available: isStrictClean && !isRestricted, statusText: isStrictClean && !isRestricted ? "可用" : "受限", subText: isStrictClean && !isRestricted ? `支持播放` : "地理位置异常或代理解析" },
      { id: 'youtube', name: "YouTube Premium", category: 'streaming', icon: Youtube, status: 'idle', available: !isRestricted, statusText: !isRestricted ? "支持" : "受限", subText: !isRestricted ? `无广告权益 (${region})` : "不在服务区" },
      { id: 'spotify', name: "Spotify", category: 'streaming', icon: Music, status: 'idle', available: !isRestricted && isCnxClean, statusText: !isRestricted && isCnxClean ? "正常" : "受限", subText: !isRestricted && isCnxClean ? `支持注册与收听` : "限制代理解析" },
      { id: 'chatgpt', name: "ChatGPT (Web)", category: 'ai', icon: MessageSquare, status: 'idle', available: !isRestricted && isCnxClean, statusText: !isRestricted && isCnxClean ? "畅通" : "访问受限", subText: !isRestricted && isCnxClean ? `支持无障碍对话` : "IP 风控等级过高" },
      { id: 'claude', name: "Claude AI", category: 'ai', icon: BrainCircuit, status: 'idle', available: !isRestricted && isStrictClean, statusText: !isRestricted && isStrictClean ? "解锁" : "严格限制", subText: !isRestricted && isStrictClean ? `防风控级洁净` : "IP 被标记滥用或代理" },
      { id: 'tiktok', name: "TikTok", category: 'gaming', icon: Play, status: 'idle', available: !isRestricted && isCnxClean, statusText: !isRestricted && isCnxClean ? "可用" : "无法加载", subText: !isRestricted && isCnxClean ? `推送区域: ${region}` : "运营商或地区锁" },
      { id: 'steam', name: "Steam Store", category: 'gaming', icon: Gamepad2, status: 'idle', available: true, statusText: "可用", subText: `当前结算区: ${region}` },
    ];

    setServices(initialServices);
    setOverallStatus('idle');

    let isMounted = true;

    const checkServices = async () => {
      // 模拟启动延迟
      await new Promise(r => setTimeout(r, 400));
      if (!isMounted) return;

      setOverallStatus('checking');

      // 将所有服务设置为 checking 状态
      setServices(prev => prev.map(s => ({ ...s, status: 'checking' })));

      // 为每个服务创建独立的探针请求延迟（模拟真实的并发 API 请求）
      const promises = initialServices.map(async (service) => {
        const delay = 800 + Math.random() * 2500; // 随机 0.8s 到 3.3s 探测时间
        await new Promise(r => setTimeout(r, delay));
        if (!isMounted) return;
        setServices(prev => prev.map(s => s.id === service.id ? { ...s, status: 'done' } : s));
      });

      await Promise.all(promises);
      if (isMounted) {
        setOverallStatus('done');
      }
    };

    checkServices();

    return () => { isMounted = false; };
  }, [riskScore, countryCode, ip]);

  const streamingServices = services.filter(s => s.category === 'streaming');
  const aiServices = services.filter(s => s.category === 'ai');
  const gamingServices = services.filter(s => s.category === 'gaming');

  const renderServiceList = (list: ServiceItem[]) => {
    return list.map((service) => (
      <div key={service.id} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0 group">
        <div className="flex items-center gap-3">
          <service.icon className={`h-4 w-4 transition-colors ${service.status === 'checking' ? 'text-indigo-400 animate-pulse' : 'text-muted-foreground group-hover:text-primary'}`} />
          <span className="text-sm font-medium text-foreground/80">{service.name}</span>
        </div>
        <div className="text-right min-w-[120px] flex flex-col items-end">
          {service.status === 'checking' ? (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest animate-pulse">Testing...</span>
              <Loader2 className="h-3.5 w-3.5 text-indigo-400 animate-spin" />
            </div>
          ) : (
            <>
              <span className={`text-xs font-bold flex items-center gap-1 ${service.available ? "text-green-500" : "text-red-500"}`}>
                {service.available ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                {service.statusText}
              </span>
              <p className="text-[10px] text-muted-foreground mt-0.5">{service.subText}</p>
            </>
          )}
        </div>
      </div>
    ));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-500/10 rounded-xl relative">
            <Play className="h-6 w-6 text-red-500" />
            {overallStatus === 'checking' && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              流媒体与服务可用性
              {overallStatus === 'checking' && <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full animate-pulse border border-indigo-500/30">探测中</span>}
            </h2>
            <p className="text-xs text-muted-foreground">基于当前 IP 的服务准入与风控评估</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 flex-grow">
        <div>
           <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 border-b border-white/5 pb-2">流媒体与音视频 (Streaming)</h3>
           <div className="space-y-1">
             {renderServiceList(streamingServices)}
           </div>
        </div>
        
        <div>
           <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 border-b border-white/5 pb-2">AI 模型与开发者服务 (AI & Tools)</h3>
           <div className="space-y-1">
             {renderServiceList(aiServices)}
           </div>
        </div>

        <div>
           <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 border-b border-white/5 pb-2">游戏与社交网络 (Gaming & Social)</h3>
           <div className="space-y-1">
             {renderServiceList(gamingServices)}
           </div>
        </div>
      </div>
    </motion.div>
  );
}
