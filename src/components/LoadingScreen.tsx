"use client";

import { motion } from "framer-motion";
import { Shield, Globe, Zap, Search } from "lucide-react";
import { useEffect, useState } from "react";

const MESSAGES = [
  "正在初始化全球节点连接...",
  "正在通过 IP2Location 检索数据库...",
  "正在分析您的网络路由路径...",
  "正在评估您的连接安全性...",
  "正在深度分析您的网络环境...",
];

export default function LoadingScreen() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      
      {/* Central Animation */}
      <div className="relative mb-12">
        {/* Pulsing Rings */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeOut",
            }}
            className="absolute inset-0 border border-primary/30 rounded-full"
          />
        ))}
        
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="relative z-10 p-8 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl"
        >
          <Shield className="h-16 w-16 text-primary" />
        </motion.div>

        {/* Floating Icons */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            x: [0, 5, 0]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-4 -right-4 p-2 rounded-lg bg-white/5 border border-white/10"
        >
          <Globe className="h-4 w-4 text-primary" />
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, 10, 0],
            x: [0, -5, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-4 -left-4 p-2 rounded-lg bg-white/5 border border-white/10"
        >
          <Zap className="h-4 w-4 text-yellow-500" />
        </motion.div>
      </div>

      {/* Text Animation */}
      <div className="text-center relative z-10 px-6">
        <motion.h2
          key={msgIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-2xl font-bold mb-3 tracking-tight"
        >
          {MESSAGES[msgIndex]}
        </motion.h2>
        <div className="flex items-center justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
          ))}
        </div>
      </div>

      {/* Loading Bar */}
      <div className="mt-12 w-64 h-1 bg-white/5 rounded-full overflow-hidden relative">
        <motion.div
          initial={{ left: "-100%" }}
          animate={{ left: "100%" }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent"
        />
      </div>
    </div>
  );
}
