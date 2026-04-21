"use client";

import { useEffect, useState, useCallback } from "react";
import { Zap, Check, X, Clock, RefreshCw, Activity } from "lucide-react";

const SERVICES = [
  { id: "google", name: "Google", url: "https://www.google.com/favicon.ico", icon: "🌐" },
  { id: "cloudflare", name: "Cloudflare", url: "https://1.1.1.1/favicon.ico", icon: "☁️" },
  { id: "github", name: "GitHub", url: "https://github.com/favicon.ico", icon: "🐙" },
  { id: "youtube", name: "YouTube", url: "https://www.youtube.com/favicon.ico", icon: "📺" },
  { id: "apple", name: "Apple", url: "https://www.apple.com/favicon.ico", icon: "🍎" },
  { id: "microsoft", name: "Microsoft", url: "https://www.microsoft.com/favicon.ico", icon: "💻" },
];

interface PingResult {
  latency: number | null;
  status: "idle" | "testing" | "success" | "error";
  jitter?: number;
  packetsSent: number;
  packetsReceived: number;
}

export default function ConnectivityChecker() {
  const [results, setResults] = useState<Record<string, PingResult>>(
    SERVICES.reduce((acc, s) => ({ ...acc, [s.id]: { latency: null, status: "idle", packetsSent: 0, packetsReceived: 0 } }), {})
  );
  const [isAllTesting, setIsAllTesting] = useState(false);

  const testLatency = async (serviceId: string, url: string) => {
    setResults(prev => ({ ...prev, [serviceId]: { ...prev[serviceId], status: "testing", packetsSent: 0, packetsReceived: 0, latency: null } }));
    
    // 我们将执行 3 次 Ping，模拟真实的 ICMP/TCP 发包并计算抖动 (Jitter)
    const pings: number[] = [];
    const NUM_PINGS = 3;
    let isMounted = true;

    for (let i = 0; i < NUM_PINGS; i++) {
      if (!isMounted) break;
      setResults(prev => ({ ...prev, [serviceId]: { ...prev[serviceId], packetsSent: i + 1 } }));
      
      const start = performance.now();
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s 超时
        
        // 加入随机数防止浏览器缓存命中，强制真实发包
        await fetch(`${url}?t=${Date.now()}-${Math.random()}`, { 
          mode: "no-cors", 
          cache: "no-store",
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        const latency = Math.round(performance.now() - start);
        pings.push(latency);
        
        if (isMounted) {
          setResults(prev => ({ 
            ...prev, 
            [serviceId]: { 
              ...prev[serviceId], 
              packetsReceived: i + 1,
              latency: Math.round(pings.reduce((a, b) => a + b, 0) / pings.length) // 计算当前平均延迟
            } 
          }));
        }

      } catch (e) {
        // 请求失败（超时或被拦截）
      }
      
      // 每次发包之间的模拟间隔
      if (i < NUM_PINGS - 1 && isMounted) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    if (isMounted) {
      setResults(prev => {
        const avgLatency = pings.length > 0 ? Math.round(pings.reduce((a, b) => a + b, 0) / pings.length) : null;
        
        // 计算网络抖动
        let jitter = 0;
        if (pings.length > 1) {
          let diffs = 0;
          for (let i = 1; i < pings.length; i++) {
            diffs += Math.abs(pings[i] - pings[i-1]);
          }
          jitter = Math.round(diffs / (pings.length - 1));
        }

        return {
          ...prev,
          [serviceId]: {
            ...prev[serviceId],
            status: pings.length > 0 ? "success" : "error",
            latency: avgLatency,
            jitter: jitter
          }
        };
      });
    }

    return () => { isMounted = false; };
  };

  const startAllTests = useCallback(async () => {
    setIsAllTesting(true);
    // 重置状态
    setResults(SERVICES.reduce((acc, s) => ({ ...acc, [s.id]: { latency: null, status: "idle", packetsSent: 0, packetsReceived: 0 } }), {}));
    
    // 并发测试所有服务
    const promises = SERVICES.map(s => testLatency(s.id, s.url));
    await Promise.all(promises);
    
    setIsAllTesting(false);
  }, []);

  useEffect(() => {
    startAllTests();
  }, [startAllTests]);

  return (
    <div className="flex flex-col h-full -mx-2 -mb-2 mt-2">
      <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3 px-2">
         <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 uppercase tracking-widest font-bold">
           <Activity className="h-3 w-3" />
           ICMP/TCP 连通性诊断 (发包: 3/次)
         </div>
         <button 
           onClick={startAllTests} 
           disabled={isAllTesting}
           className={`p-1.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors border border-white/5 ${isAllTesting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
         >
           <RefreshCw className={`h-3 w-3 text-foreground ${isAllTesting ? 'animate-spin' : ''}`} />
         </button>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {SERVICES.map((s) => {
          const res = results[s.id];
          const isDone = res?.status === "success" || res?.status === "error";
          const lossRate = res?.packetsSent > 0 ? Math.round(((res.packetsSent - res.packetsReceived) / res.packetsSent) * 100) : 0;
          
          return (
            <div key={s.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-base opacity-80">{s.icon}</span>
                <span className="text-sm font-bold text-foreground/80">{s.name}</span>
              </div>
              
              <div className="flex items-center gap-4 text-right">
                {/* 丢包与抖动参数 */}
                {isDone && res.status === "success" && (
                   <div className="hidden sm:flex items-center gap-3 text-[10px] text-muted-foreground mr-2 font-mono">
                     <span title="丢包率" className={lossRate > 0 ? "text-yellow-500" : ""}>Loss: {lossRate}%</span>
                     <span title="网络抖动">Jitter: {res.jitter}ms</span>
                   </div>
                )}

                {/* 核心状态展示 */}
                <div className="w-20 flex justify-end">
                  {res?.status === "idle" ? (
                    <span className="text-xs text-muted-foreground opacity-50 font-medium">等待中...</span>
                  ) : res?.status === "testing" ? (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 font-mono">
                      <Clock className="h-3 w-3 animate-spin" />
                      <span>{res.packetsReceived}/{res.packetsSent}</span>
                    </div>
                  ) : res?.status === "error" ? (
                    <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 uppercase tracking-widest">
                      <X className="h-3 w-3" /> 超时
                    </span>
                  ) : (
                    <span className={`text-sm font-black font-mono flex items-center gap-1 ${res.latency! < 100 ? 'text-green-500' : res.latency! < 250 ? 'text-yellow-500' : 'text-orange-500'}`}>
                      {res.latency} <span className="text-[10px] opacity-60">ms</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
