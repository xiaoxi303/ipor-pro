"use client";

import Navbar from "@/components/Navbar";
import { Search, Globe, History, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function WhoisPage() {
  const [domain, setDomain] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">WHOIS 信息查询</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              查询域名的注册信息、到期时间、DNS 服务器以及注册商详情。
            </p>
          </motion.div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative group mb-12">
            <input 
              type="text" 
              placeholder="输入域名 (例如: google.com)..."
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full h-16 px-6 rounded-2xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none text-xl transition-all group-hover:bg-white/10"
            />
            <button className="absolute right-2 top-2 bottom-2 px-8 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all">
              查询
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Globe} 
              title="全球数据" 
              desc="支持超过 1000 个顶级域名的实时 WHOIS 数据检索。" 
            />
            <FeatureCard 
              icon={History} 
              title="历史记录" 
              desc="查看域名的历史所有权变更和注册记录。" 
            />
            <FeatureCard 
              icon={ShieldCheck} 
              title="隐私保护" 
              desc="检测域名是否开启了 WHOIS 隐私保护服务。" 
            />
          </div>

          <div className="mt-12 p-8 rounded-2xl border border-white/10 bg-white/5 text-center">
            <p className="text-muted-foreground italic">请输入上方域名开始查询...</p>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 py-10 text-center text-muted-foreground text-sm">
        <p>© 2026 IPor. 专业域名与网络深度分析工具</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all">
      <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
