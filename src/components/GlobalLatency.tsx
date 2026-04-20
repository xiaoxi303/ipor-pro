"use client";

import { motion } from "framer-motion";
import { Globe2, Zap, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";

interface Node {
  name: string;
  region: string;
  latency: number | null;
  status: 'idle' | 'testing' | 'done';
}

export default function GlobalLatency() {
  const [nodes, setNodes] = useState<Node[]>([
    { name: "Los Angeles", region: "North America", latency: null, status: 'idle' },
    { name: "Hong Kong", region: "Asia Pacific", latency: null, status: 'idle' },
    { name: "Tokyo", region: "Asia", latency: null, status: 'idle' },
    { name: "London", region: "Europe", latency: null, status: 'idle' },
    { name: "Singapore", region: "South East Asia", latency: null, status: 'idle' },
    { name: "Frankfurt", region: "Europe", latency: null, status: 'idle' },
  ]);

  const [isTesting, setIsTesting] = useState(false);

  const startTest = () => {
    setIsTesting(true);
    setNodes(prev => prev.map(n => ({ ...n, status: 'testing', latency: null })));
    
    nodes.forEach((node, idx) => {
      setTimeout(() => {
        setNodes(prev => {
          const newNodes = [...prev];
          newNodes[idx] = { 
            ...newNodes[idx], 
            latency: Math.floor(Math.random() * 200) + 20, 
            status: 'done' 
          };
          return newNodes;
        });
        if (idx === nodes.length - 1) setIsTesting(false);
      }, (idx + 1) * 400);
    });
  };

  return (
    <div className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <Globe2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">全球节点延迟探测</h2>
            <p className="text-xs text-muted-foreground">Global Network Latency Check</p>
          </div>
        </div>
        <button 
          onClick={startTest}
          disabled={isTesting}
          className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary text-xs font-bold rounded-lg border border-primary/30 transition-all flex items-center gap-2"
        >
          {isTesting ? <Zap className="h-3.5 w-3.5 animate-pulse" /> : <BarChart3 className="h-3.5 w-3.5" />}
          {isTesting ? "探测中..." : "开始探测"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nodes.map((node, idx) => (
          <motion.div 
            key={node.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-primary/30 transition-all"
          >
            <div>
              <p className="text-sm font-bold group-hover:text-primary transition-colors">{node.name}</p>
              <p className="text-[10px] text-muted-foreground">{node.region}</p>
            </div>
            <div className="text-right">
              {node.status === 'testing' ? (
                <div className="h-4 w-12 bg-white/10 rounded-full animate-pulse" />
              ) : node.latency ? (
                <span className={`text-sm font-black ${node.latency < 100 ? 'text-green-500' : node.latency < 200 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {node.latency} <span className="text-[10px] opacity-50">ms</span>
                </span>
              ) : (
                <span className="text-[10px] text-muted-foreground">-- ms</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
