"use client";

import { motion } from "framer-motion";
import { Share2, Network } from "lucide-react";

interface TopologyProps {
  bgpPath: string[];
}

export default function NetworkIntelligence({ bgpPath }: TopologyProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md h-full"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-blue-500/10 rounded-xl">
          <Share2 className="h-6 w-6 text-blue-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold">BGP 宣告路径与拓扑可视化</h2>
          <p className="text-xs text-muted-foreground">真实上游运营商与路由中转路径分析</p>
        </div>
      </div>

      <div className="relative flex flex-col items-center py-6">
        {bgpPath.map((node, index) => (
          <div key={index} className="flex flex-col items-center w-full">
            <div className={`px-6 py-3 rounded-xl border ${index === 0 ? 'bg-primary/20 border-primary/40' : 'bg-white/5 border-white/10'} min-w-[200px] text-center relative z-10`}>
              <span className="text-xs font-mono font-bold">{node}</span>
            </div>
            {index < bgpPath.length - 1 && (
              <div className="h-10 w-[2px] bg-gradient-to-b from-primary/40 to-white/10 my-1 relative">
                <motion.div 
                  animate={{ top: ["0%", "100%"] }} 
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute w-2 h-2 bg-primary rounded-full -left-[3px] shadow-[0_0_8px_#6366f1]" 
                />
              </div>
            )}
          </div>
        ))}
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <Network className="h-32 w-32" />
        </div>
      </div>
    </motion.div>
  );
}
