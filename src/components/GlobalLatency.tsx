"use client";

import { motion } from "framer-motion";
import { Globe2, Zap, BarChart3, Wifi, WifiOff, Clock } from "lucide-react";
import { useState, useCallback } from "react";

interface Node {
  id: string;
  name: string;
  region: string;
  endpoints: string[]; // 改为数组，支持备用地址
  latency: number | null;
  status: 'idle' | 'testing' | 'done' | 'error';
}

const GLOBAL_NODES: Node[] = [
  { 
    id: 'la', name: "Los Angeles", region: "North America", 
    endpoints: ["https://speed.cloudflare.com/favicon.ico", "https://www.google.com/favicon.ico"], 
    latency: null, status: 'idle' 
  },
  { 
    id: 'hk', name: "Hong Kong", region: "Asia Pacific", 
    endpoints: ["https://www.google.com.hk/favicon.ico", "https://pccw.com/favicon.ico"], 
    latency: null, status: 'idle' 
  },
  { 
    id: 'tk', name: "Tokyo", region: "Asia", 
    endpoints: ["https://www.google.co.jp/favicon.ico", "https://www.yahoo.co.jp/favicon.ico"], 
    latency: null, status: 'idle' 
  },
  { 
    id: 'ld', name: "London", region: "Europe", 
    endpoints: ["https://www.google.co.uk/favicon.ico", "https://www.bbc.co.uk/favicon.ico"], 
    latency: null, status: 'idle' 
  },
  { 
    id: 'sg', name: "Singapore", region: "South East Asia", 
    endpoints: ["https://www.google.com.sg/favicon.ico", "https://www.singtel.com/favicon.ico"], 
    latency: null, status: 'idle' 
  },
  { 
    id: 'fk', name: "Frankfurt", region: "Europe", 
    endpoints: ["https://www.google.de/favicon.ico", "https://www.telekom.com/favicon.ico"], 
    latency: null, status: 'idle' 
  },
];

export default function GlobalLatency() {
  const [nodes, setNodes] = useState<Node[]>(GLOBAL_NODES);
  const [isTesting, setIsTesting] = useState(false);

  const pingEndpoint = async (url: string): Promise<number> => {
    const start = performance.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      await fetch(`${url}?cache_bust=${Date.now()}`, {
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return Math.round(performance.now() - start);
    } catch (e) {
      clearTimeout(timeoutId);
      throw e;
    }
  };

  const testNode = async (node: Node) => {
    // 尝试多个备用地址，直到一个成功
    for (const url of node.endpoints) {
      try {
        const latency = await pingEndpoint(url);
        setNodes(prev => prev.map(n => 
          n.id === node.id ? { ...n, latency, status: 'done' } : n
        ));
        return; // 成功后跳出
      } catch (err) {
        console.warn(`Ping failed for ${node.name} using ${url}`);
      }
    }
    
    // 如果所有地址都失败
    setNodes(prev => prev.map(n => 
      n.id === node.id ? { ...n, status: 'error' } : n
    ));
  };

  const startTest = useCallback(async () => {
    setIsTesting(true);
    setNodes(GLOBAL_NODES.map(n => ({ ...n, status: 'testing' })));

    const promises = GLOBAL_NODES.map(async (node, index) => {
      await new Promise(r => setTimeout(r, index * 200));
      return testNode(node);
    });

    await Promise.all(promises);
    setIsTesting(false);
  }, []);

  return (
    <div className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md relative overflow-hidden">
      {isTesting && (
        <motion.div 
          initial={{ top: "-10%" }}
          animate={{ top: "110%" }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent z-0"
        />
      )}

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <Globe2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">全球节点延迟探测</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> 智能备用链路测试 (HTTP-Check)
            </p>
          </div>
        </div>
        <button 
          onClick={startTest}
          disabled={isTesting}
          className="px-5 py-2.5 bg-primary/20 hover:bg-primary/30 text-primary text-xs font-bold rounded-xl border border-primary/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isTesting ? <Zap className="h-4 w-4 animate-pulse" /> : <BarChart3 className="h-4 w-4 group-hover:scale-110 transition-transform" />}
          {isTesting ? "扫描中..." : "全网深度探测"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
        {nodes.map((node, idx) => (
          <motion.div 
            key={node.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className={`p-4 rounded-2xl border transition-all duration-500 ${
              node.status === 'done' ? 'bg-white/5 border-white/10 hover:border-primary/40' :
              node.status === 'testing' ? 'bg-primary/5 border-primary/20' :
              node.status === 'error' ? 'bg-red-500/5 border-red-500/20' :
              'bg-white/5 border-white/5 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-bold flex items-center gap-2">
                  {node.name}
                  {node.status === 'done' && <Wifi className="h-3 w-3 text-green-500" />}
                  {node.status === 'error' && <WifiOff className="h-3 w-3 text-red-500" />}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{node.region}</p>
              </div>
              <div className="text-right">
                {node.status === 'testing' ? (
                  <div className="flex flex-col items-end gap-1">
                    <div className="h-4 w-12 bg-primary/20 rounded animate-pulse" />
                    <span className="text-[8px] text-primary/60 font-mono animate-pulse uppercase">Pinging</span>
                  </div>
                ) : node.status === 'done' ? (
                  <div className="flex flex-col items-end">
                    <span className={`text-base font-black font-mono leading-none ${
                      node.latency! < 100 ? 'text-green-500' : 
                      node.latency! < 250 ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {node.latency} <span className="text-[10px] opacity-50 font-sans">ms</span>
                    </span>
                    <span className="text-[8px] text-muted-foreground mt-1 uppercase">Response</span>
                  </div>
                ) : node.status === 'error' ? (
                  <span className="text-xs font-bold text-red-500 uppercase">Timeout</span>
                ) : (
                  <span className="text-[10px] text-muted-foreground font-mono">READY</span>
                )}
              </div>
            </div>
            
            {node.status === 'testing' && (
              <div className="mt-3 w-full h-[1px] bg-white/5 overflow-hidden">
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-1/2 h-full bg-primary/40"
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
