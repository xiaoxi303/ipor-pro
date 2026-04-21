"use client";

import { motion } from "framer-motion";
import { Play, Video as Youtube, Tv, MessageSquare, Globe, Loader2, Music, Gamepad2, BrainCircuit, CheckCircle2, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

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
    const rScore = riskScore || 0;
    const isCnxClean = rScore < 40;
    const isStrictClean = rScore < 20;
    const code = countryCode || "US";
    const isRestricted = ["CN", "RU", "IR", "KP"].includes(code);
    
    const regionMap: Record<string, string> = { "TW": "台湾区", "HK": "香港区", "US": "美区", "JP": "日区", "SG": "狮城", "GB": "英区", "KR": "韩区", "DE": "德区", "FR": "法区", "NL": "荷兰" };
    const region = regionMap[code] || code;

    const initialServices: ServiceItem[] = [
      { id: 'netflix', name: "Netflix", category: 'streaming', icon: Tv, status: 'idle', available: isCnxClean, statusText: isCnxClean ? "Fully Unlocked" : "Partial / Blocked", subText: isCnxClean ? `Native Unlock (${region})` : "Proxy Detected" },
      { id: 'disney', name: "Disney+", category: 'streaming', icon: Play, status: 'idle', available: isStrictClean && !isRestricted, statusText: isStrictClean && !isRestricted ? "Available" : "Restricted", subText: isStrictClean && !isRestricted ? `Support Playback` : "Geo-Restricted" },
      { id: 'youtube', name: "YouTube Premium", category: 'streaming', icon: Youtube, status: 'idle', available: !isRestricted, statusText: !isRestricted ? "Supported" : "Restricted", subText: !isRestricted ? `Global Benefits (${region})` : "Not Available" },
      { id: 'spotify', name: "Spotify", category: 'streaming', icon: Music, status: 'idle', available: !isRestricted && isCnxClean, statusText: !isRestricted && isCnxClean ? "Normal" : "Restricted", subText: !isRestricted && isCnxClean ? `Registration Ready` : "Proxy Blocked" },
      { id: 'chatgpt', name: "ChatGPT (Web)", category: 'ai', icon: MessageSquare, status: 'idle', available: !isRestricted && isCnxClean, statusText: !isRestricted && isCnxClean ? "Clean" : "Restricted", subText: !isRestricted && isCnxClean ? `High Priority Access` : "Risk Score Too High" },
      { id: 'claude', name: "Claude AI", category: 'ai', icon: BrainCircuit, status: 'idle', available: !isRestricted && isStrictClean, statusText: !isRestricted && isStrictClean ? "Unlocked" : "Strict Limit", subText: !isRestricted && isStrictClean ? `Premium Clean IP` : "Abuse Flag Detected" },
      { id: 'tiktok', name: "TikTok", category: 'gaming', icon: Play, status: 'idle', available: !isRestricted && isCnxClean, statusText: !isRestricted && isCnxClean ? "Available" : "No Load", subText: !isRestricted && isCnxClean ? `Push Region: ${region}` : "Operator Locked" },
      { id: 'steam', name: "Steam Store", category: 'gaming', icon: Gamepad2, status: 'idle', available: true, statusText: "Available", subText: `Billing Region: ${region}` },
    ];

    setServices(initialServices);
    setOverallStatus('idle');

    let isMounted = true;

    const checkServices = async () => {
      await new Promise(r => setTimeout(r, 400));
      if (!isMounted) return;

      setOverallStatus('checking');
      setServices(prev => prev.map(s => ({ ...s, status: 'checking' })));

      const promises = initialServices.map(async (service) => {
        const delay = 800 + Math.random() * 2500; 
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
      <div key={service.id} className="flex items-center justify-between py-3 border-b border-white/[0.03] last:border-0 group/service">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg transition-colors",
            service.status === 'checking' ? "bg-primary/5 text-primary animate-pulse" : "bg-white/[0.02] text-muted-foreground group-hover/service:bg-white/5 group-hover/service:text-white"
          )}>
            <service.icon className="h-3.5 w-3.5" />
          </div>
          <span className="text-[13px] font-black tracking-tight text-white/80 group-hover/service:text-white transition-colors">{service.name}</span>
        </div>
        <div className="text-right min-w-[140px] flex flex-col items-end">
          {service.status === 'checking' ? (
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] animate-pulse">Analyzing...</span>
              <Loader2 className="h-3 w-3 text-primary animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col items-end">
              <span className={cn(
                "text-[10px] font-black flex items-center gap-1.5 uppercase tracking-wider",
                service.available ? "text-emerald-400" : "text-rose-500"
              )}>
                {service.available ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                {service.statusText}
              </span>
              <p className="text-[9px] font-bold text-muted-foreground/40 mt-1 uppercase tracking-widest">{service.subText}</p>
            </div>
          )}
        </div>
      </div>
    ));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="p-8 rounded-[2rem] border border-white/10 bg-[#030303]/40 backdrop-blur-2xl flex flex-col h-full group"
    >
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-400/10 rounded-2xl border border-emerald-400/20 relative">
            <Play className="h-6 w-6 text-emerald-400" />
            {overallStatus === 'checking' && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-gradient">全球服务可用性</h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Service Access & Risk Audit</p>
          </div>
        </div>
      </div>

      <div className="space-y-8 flex-grow">
        <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 group-hover:bg-white/[0.02] transition-colors">
           <h3 className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] mb-4 border-b border-white/5 pb-3">Streaming Media</h3>
           <div className="space-y-1">
             {renderServiceList(streamingServices)}
           </div>
        </div>
        
        <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 group-hover:bg-white/[0.02] transition-colors">
           <h3 className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] mb-4 border-b border-white/5 pb-3">Intelligence & Tools</h3>
           <div className="space-y-1">
             {renderServiceList(aiServices)}
           </div>
        </div>

        <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 group-hover:bg-white/[0.02] transition-colors">
           <h3 className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] mb-4 border-b border-white/5 pb-3">Social & Gaming</h3>
           <div className="space-y-1">
             {renderServiceList(gamingServices)}
           </div>
        </div>
      </div>
    </motion.div>
  );
}
