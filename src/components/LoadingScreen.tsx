"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Shield, Globe, Zap, Cpu, Activity, Lock } from "lucide-react";
import { useEffect, useState } from "react";

const STEPS = [
  { icon: Cpu, label: "正在初始化核心引擎", detail: "System core initialization..." },
  { icon: Globe, label: "正在建立全球节点链路", detail: "Establishing multi-regional connections..." },
  { icon: Activity, label: "正在执行深度特征扫描", detail: "Deep packet inspection in progress..." },
  { icon: Lock, label: "正在通过 IP2Location 验证安全性", detail: "Verifying reputation scores..." },
  { icon: Shield, label: "正在生成加密分析报告", detail: "Compiling final intelligence..." },
];

export default function LoadingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const [dataStream, setDataStream] = useState<string[]>([]);

  useEffect(() => {
    setDataStream(Array(20).fill(0).map(() => 
      `PACKET_INSPECT_NODE_${Math.floor(Math.random() * 999)} :: AUTH_VERIFIED :: STATUS_OK`
    ));
    
    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1500);

    const progressTimer = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : prev));
    }, 40);

    return () => {
      clearInterval(stepTimer);
      clearInterval(progressTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030303] overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-subtle opacity-20" />
      
      {/* Dynamic Ambient Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Scanning Line Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ y: ["0%", "100%", "0%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_20px_rgba(59,130,246,0.5)]"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
        {/* Central Morphing Icon */}
        <div className="relative mb-16">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 90, 180, 270, 360]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 rounded-[2rem] border border-primary/20 bg-primary/5 backdrop-blur-2xl flex items-center justify-center relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.5, rotate: 45 }}
                transition={{ duration: 0.5 }}
              >
                {(() => {
                  const Icon = STEPS[currentStep].icon;
                  return <Icon className="w-12 h-12 text-primary" />;
                })()}
              </motion.div>
            </AnimatePresence>
            
            {/* Inner Glint */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent translate-x-[-100%] animate-[shimmer_3s_infinite]" />
          </motion.div>

          {/* Satellite Icons */}
          {[0, 120, 240].map((angle, i) => (
             <motion.div
               key={i}
               animate={{ rotate: 360 }}
               transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 pointer-events-none"
             >
                <motion.div 
                  style={{ transform: `rotate(${angle}deg) translateY(-80px)` }}
                  className="w-2 h-2 rounded-full bg-primary/40 shadow-[0_0_10px_rgba(59,130,246,0.8)]" 
                />
             </motion.div>
          ))}
        </div>

        {/* Step Text */}
        <div className="text-center mb-12 h-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-2"
            >
              <h2 className="text-2xl font-black tracking-tighter text-gradient uppercase">
                {STEPS[currentStep].label}
              </h2>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest opacity-60">
                {STEPS[currentStep].detail}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* High-End Progress Bar */}
        <div className="w-full space-y-4">
          <div className="flex justify-between items-end px-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">System Analysis</span>
            <span className="text-lg font-black text-primary tabular-nums">{progress}%</span>
          </div>
          <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
             <motion.div 
               style={{ width: `${progress}%` }}
               className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-primary to-accent"
             >
                <div className="absolute top-0 right-0 h-full w-8 bg-white/40 blur-md animate-[shimmer_1.5s_infinite]" />
             </motion.div>
          </div>
          <div className="flex justify-center gap-1">
            {STEPS.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 w-8 rounded-full transition-all duration-500 ${i <= currentStep ? 'bg-primary' : 'bg-white/10'}`} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Data Stream (Simulation) */}
      <div className="absolute bottom-8 left-0 w-full overflow-hidden whitespace-nowrap opacity-20 pointer-events-none">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="text-[10px] font-mono text-primary flex gap-12"
        >
          {dataStream.map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

