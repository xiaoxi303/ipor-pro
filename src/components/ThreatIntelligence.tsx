"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Cpu } from "lucide-react";

interface ThreatProps {
  attackLogs: any[];
}

export default function ThreatIntelligence({ attackLogs }: ThreatProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden h-full"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-red-500/10 rounded-xl">
          <ShieldAlert className="h-6 w-6 text-red-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold">实时威胁情报流</h2>
          <p className="text-xs text-muted-foreground">基于 AbuseIPDB 与 GreyNoise 的节点历史行为</p>
        </div>
      </div>

      <div className="space-y-4">
        {attackLogs.length > 0 && attackLogs[0].type !== "None Detected" ? (
          attackLogs.map((log, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/10 group hover:border-red-500/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="text-[10px] font-mono text-muted-foreground bg-white/5 px-2 py-1 rounded">
                  {log.time}
                </div>
                <div>
                   <p className="text-sm font-bold">{log.type}</p>
                   <p className="text-[10px] text-muted-foreground uppercase">Threat Detected from this Subnet</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded text-[10px] font-black uppercase ${log.severity === 'High' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                {log.severity}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 border border-dashed border-white/10 rounded-2xl h-full">
             <Cpu className="h-12 w-12 text-muted-foreground/20 mb-3" />
             <p className="text-sm text-muted-foreground font-medium">该网段暂无近期恶意活动记录报告</p>
             <p className="text-[10px] text-muted-foreground/60 mt-1">Clean reputation profile detected</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
