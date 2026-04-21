"use client";

import { useEffect, useState, useCallback } from "react";
import { Zap, Check, X, Clock, RefreshCw, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

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
    
    const pings: number[] = [];
    const NUM_PINGS = 3;
    let isMounted = true;

    for (let i = 0; i < NUM_PINGS; i++) {
      if (!isMounted) break;
      setResults(prev => ({ ...prev, [serviceId]: { ...prev[serviceId], packetsSent: i + 1 } }));
      
      const start = performance.now();
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); 
        
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
              latency: Math.round(pings.reduce((a, b) => a + b, 0) / pings.length) 
            } 
          }));
        }

      } catch (e) {
        // Request failed
      }
      
      if (i < NUM_PINGS - 1 && isMounted) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    if (isMounted) {
      setResults(prev => {
        const avgLatency = pings.length > 0 ? Math.round(pings.reduce((a, b) => a + b, 0) / pings.length) : null;
        
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
    setResults(SERVICES.reduce((acc, s) => ({ ...acc, [s.id]: { latency: null, status: "idle", packetsSent: 0, packetsReceived: 0 } }), {}));
    
    const promises = SERVICES.map(s => testLatency(s.id, s.url));
    await Promise.all(promises);
    
    setIsAllTesting(false);
  }, []);

  useEffect(() => {
    startAllTests();
  }, [startAllTests]);

  return (
    <div className="flex flex-col h-full -mx-2 -mb-2 mt-2">
      <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4 px-2">
         <div className="text-[10px] text-muted-foreground/60 flex items-center gap-2 uppercase tracking-[0.2em] font-black">
           <Activity className="h-3 w-3 text-primary" />
           Connectivity Analysis (3 Packets/Node)
         </div>
         <button 
           onClick={startAllTests} 
           disabled={isAllTesting}
           className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 group"
         >
           <RefreshCw className={`h-3.5 w-3.5 text-foreground transition-transform duration-700 ${isAllTesting ? 'animate-spin' : 'group-hover:rotate-180'}`} />
         </button>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {SERVICES.map((s) => {
          const res = results[s.id];
          const isDone = res?.status === "success" || res?.status === "error";
          const lossRate = res?.packetsSent > 0 ? Math.round(((res.packetsSent - res.packetsReceived) / res.packetsSent) * 100) : 0;
          
          return (
            <div key={s.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group/service hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500">
              <div className="flex items-center gap-4">
                <span className="text-xl transition-transform duration-500 group-hover/service:scale-110">{s.icon}</span>
                <span className="text-sm font-black tracking-tight text-white/90">{s.name}</span>
              </div>
              
              <div className="flex items-center gap-6 text-right">
                {isDone && res.status === "success" && (
                   <div className="hidden sm:flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
                     <span className={cn(lossRate > 0 ? "text-amber-400" : "opacity-40")}>LOSS: {lossRate}%</span>
                     <span className="opacity-40">JTR: {res.jitter}ms</span>
                   </div>
                 )}

                <div className="w-24 flex justify-end">
                  {res?.status === "idle" ? (
                    <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest">Idle</span>
                  ) : res?.status === "testing" ? (
                    <div className="flex items-center gap-2 text-[10px] font-black text-primary font-mono tracking-tighter">
                      <Clock className="h-3 w-3 animate-spin" />
                      <span>{res.packetsReceived}/{res.packetsSent}</span>
                    </div>
                  ) : res?.status === "error" ? (
                    <span className="text-[10px] font-black text-rose-500 flex items-center gap-1.5 uppercase tracking-widest">
                      <X className="h-3.5 w-3.5" /> Timeout
                    </span>
                  ) : (
                    <span className={cn(
                      "text-sm font-black font-mono flex items-center gap-1 tracking-tighter",
                      res.latency! < 100 ? 'text-emerald-400' : res.latency! < 250 ? 'text-amber-400' : 'text-orange-500'
                    )}>
                      {res.latency} <span className="text-[9px] opacity-40 font-bold uppercase tracking-widest ml-1">ms</span>
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
