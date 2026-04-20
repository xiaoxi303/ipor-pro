"use client";

import Navbar from "@/components/Navbar";
import { AlertCircle, ShieldX, ListFilter, CheckCircle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function BlacklistPage() {
  const [ip, setIp] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">IP 黑名单扫描</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              在全球 100+ 个主流反垃圾邮件和安全黑名单库中检查您的 IP 状态。
            </p>
          </motion.div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative group mb-12">
            <input 
              type="text" 
              placeholder="输入 IP 地址进行扫描 (例如: 8.8.8.8)..."
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className="w-full h-16 px-6 rounded-2xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none text-xl transition-all group-hover:bg-white/10"
            />
            <button className="absolute right-2 top-2 bottom-2 px-8 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all">
              立即扫描
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5">
              <div className="flex items-center gap-3 mb-4">
                <ShieldX className="h-6 w-6 text-red-500" />
                <h3 className="font-bold text-lg">黑名单库统计</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">我们集成了全球最权威的安全数据库：</p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-white/5">Spamhaus</div>
                <div className="p-2 rounded bg-white/5">Barracuda</div>
                <div className="p-2 rounded bg-white/5">SORBS</div>
                <div className="p-2 rounded bg-white/5">SURBL</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-green-500/20 bg-green-500/5">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <h3 className="font-bold text-lg">如何移除黑名单？</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                如果您发现 IP 被列入黑名单，通常需要联系列表维护者并提交申诉，或者清理您的网络环境。
              </p>
            </div>
          </div>

          <div className="space-y-4">
             <h3 className="text-lg font-bold flex items-center gap-2">
                <ListFilter className="h-5 w-5 text-primary" />
                扫描规则说明
             </h3>
             <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
                <div className="space-y-4 text-sm text-muted-foreground">
                   <p>1. 本工具会对指定的 IP 进行实时的 DNSBL 查询。</p>
                   <p>2. 查询结果包含垃圾邮件列表、恶意软件分发点和开放代理检测。</p>
                   <p>3. 检测结果仅供参考，具体以各名单库官网为准。</p>
                </div>
             </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 py-10 text-center text-muted-foreground text-sm">
        <p>© 2026 IPor. 全球安全信誉评估工具</p>
      </footer>
    </div>
  );
}
