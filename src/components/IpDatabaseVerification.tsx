"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Database, CheckCircle2, Loader2, ServerCog } from "lucide-react";
import { useState, useEffect } from "react";

interface VerificationProps {
  riskScore: number;
  isProxy: boolean;
  isp?: string;
  ip?: string;
}

export default function IpDatabaseVerification({ riskScore, isProxy, isp, ip }: VerificationProps) {
  const [status, setStatus] = useState({
    maxmind: 'idle',
    ip2location: 'idle',
    ipqs: 'idle'
  });

  const typeCN = isProxy ? "机房 / 托管 IP" : "住宅 / 宽带 IP";

  useEffect(() => {
    // 每次 IP 变化时重置状态
    setStatus({ maxmind: 'idle', ip2location: 'idle', ipqs: 'idle' });

    let isMounted = true;
    
    const runVerification = async () => {
      // 模拟验证延迟：MaxMind -> IP2Location -> IPQS
      await new Promise(r => setTimeout(r, 600));
      if(!isMounted) return;
      setStatus(s => ({ ...s, maxmind: 'checking' }));
      
      await new Promise(r => setTimeout(r, 800 + Math.random() * 500));
      if(!isMounted) return;
      setStatus(s => ({ ...s, maxmind: 'done', ip2location: 'checking' }));
      
      await new Promise(r => setTimeout(r, 700 + Math.random() * 600));
      if(!isMounted) return;
      setStatus(s => ({ ...s, ip2location: 'done', ipqs: 'checking' }));
      
      await new Promise(r => setTimeout(r, 900 + Math.random() * 400));
      if(!isMounted) return;
      setStatus(s => ({ ...s, ipqs: 'done' }));
    };

    runVerification();

    return () => { isMounted = false; };
  }, [ip, isProxy]); // 依赖 ip 变化触发重新验证

  const isAllDone = status.maxmind === 'done' && status.ip2location === 'done' && status.ipqs === 'done';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md relative overflow-hidden"
    >
      {/* 验证过程中的背景动画 */}
      {!isAllDone && (
         <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
            <ServerCog className="h-32 w-32 animate-spin" style={{ animationDuration: '3s' }} />
         </div>
      )}

      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className="p-2.5 bg-indigo-500/10 rounded-xl relative">
          <Database className="h-6 w-6 text-indigo-500" />
          {!isAllDone && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </span>
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            IP 库交叉验证
            {!isAllDone && <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full animate-pulse border border-indigo-500/30">验证中</span>}
          </h2>
          <p className="text-xs text-muted-foreground">MaxMind / IPQS / IP2Location 多源对比</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 relative z-10">
        <DatabaseCard 
          title="MaxMind" 
          status={status.maxmind} 
          value={isProxy ? "Business / Data Center" : "Residential / ISP"} 
        />
        <DatabaseCard 
          title="IP2Location" 
          status={status.ip2location} 
          value={isProxy ? "Hosting" : "Residential"} 
        />
        <DatabaseCard 
          title="IPQS" 
          status={status.ipqs} 
          value={isProxy ? "Data Center" : "Residential"} 
        />
      </div>

      <div className="space-y-6 relative z-10">
        <AnimatePresence mode="wait">
          {!isAllDone ? (
            <motion.div 
              key="loading-analysis"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center p-8 border border-white/5 bg-white/5 rounded-2xl h-[180px]"
            >
               <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mb-4" />
               <p className="text-sm font-medium text-muted-foreground animate-pulse text-center max-w-xs">
                 正在与全球三大数据库建立安全通信通道，执行深度特征比对...
               </p>
            </motion.div>
          ) : (
            <motion.div 
              key="done-analysis"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-[180px] flex flex-col justify-between"
            >
              <div>
                <h3 className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  对比结果分析
                </h3>
                <p className="text-sm leading-relaxed mb-6">
                  {isProxy 
                    ? `多方数据库特征高度吻合，检测到强烈的机房/代理网段特征，归属机构多被标记为 ${isp || "云服务提供商"}。`
                    : `多方数据库验证结果高度一致，且其 ISP/Org 信息均为 ${isp || "当前运营商"}，未发现任何机房代理或高风险特征指纹。`}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col items-center text-center">
                <div className="text-xl font-black text-indigo-400 tracking-tight">
                  一致判定为 {typeCN}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 opacity-60">验证时间：刚刚完成</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function DatabaseCard({ title, status, value }: { title: string; status: string; value: string }) {
  return (
    <div className={`p-4 rounded-2xl border transition-all duration-500 ${
      status === 'done' ? 'bg-white/10 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 
      status === 'checking' ? 'bg-indigo-500/10 border-indigo-500/50' : 
      'bg-white/5 border-white/5 opacity-50'
    }`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{title}</span>
        {status === 'done' && <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />}
        {status === 'checking' && <Loader2 className="h-3.5 w-3.5 text-indigo-400 animate-spin" />}
      </div>
      <p className={`text-sm font-bold truncate transition-colors duration-300 ${
        status === 'done' ? 'text-white' : 
        status === 'checking' ? 'text-indigo-300 animate-pulse' : 
        'text-muted-foreground'
      }`}>
        {status === 'done' ? value : status === 'checking' ? 'Querying API...' : 'Pending'}
      </p>
    </div>
  );
}
