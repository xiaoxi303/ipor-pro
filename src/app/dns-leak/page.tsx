"use client";

import Navbar from "@/components/Navbar";
import { ShieldAlert, Zap, Server, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function DnsLeakPage() {
  const [isTesting, setIsTesting] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">DNS 泄露检测</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              检测您的 DNS 请求是否通过您的 ISP 泄露，保护您的上网隐私。
            </p>
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="p-8 md:p-12 rounded-3xl border border-primary/20 bg-primary/5 text-center mb-12">
            <ShieldAlert className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">准备好开始检测了吗？</h2>
            <p className="text-muted-foreground mb-8">我们将分析您的浏览器发出的所有 DNS 请求，以确定是否存在潜在泄露。</p>
            <button 
              onClick={() => setIsTesting(true)}
              className="px-12 py-4 rounded-full bg-primary text-white font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-primary/20"
            >
              {isTesting ? "正在检测中..." : "开始标准检测"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Zap className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="font-bold text-lg">为什么要检测 DNS 泄露？</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                即使您使用了 VPN，如果您的 DNS 请求直接发送到了您的 ISP 服务器，您的真实位置和浏览历史依然会被追踪。
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> 防止 ISP 监控您的活动
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> 确保 VPN 隧道完整性
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Server className="h-5 w-5 text-purple-500" />
                </div>
                <h3 className="font-bold text-lg">当前 DNS 环境</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-sm text-muted-foreground">默认解析服务器</span>
                  <span className="text-sm font-mono">1.1.1.1 (Cloudflare)</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-sm text-muted-foreground">加密状态</span>
                  <span className="text-sm text-green-500 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="h-3 w-3" /> 已加密 (DoH)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 py-10 text-center text-muted-foreground text-sm">
        <p>© 2026 IPor. 专业网络隐私保护工具</p>
      </footer>
    </div>
  );
}
