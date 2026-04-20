"use client";

import { useEffect, useState } from "react";
import { Zap, Check, X, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const SERVICES = [
  { name: "Google", url: "https://www.google.com/favicon.ico", icon: "🌐" },
  { name: "Cloudflare", url: "https://1.1.1.1/favicon.ico", icon: "☁️" },
  { name: "GitHub", url: "https://github.com/favicon.ico", icon: "🐙" },
  { name: "ChatGPT", url: "https://chat.openai.com/favicon.ico", icon: "🤖" },
  { name: "YouTube", url: "https://www.youtube.com/favicon.ico", icon: "📺" },
  { name: "Wikipedia", url: "https://wikipedia.org/favicon.ico", icon: "📖" },
  { name: "Twitter", url: "https://twitter.com/favicon.ico", icon: "🐦" },
  { name: "Facebook", url: "https://www.facebook.com/favicon.ico", icon: "👥" },
  { name: "Microsoft", url: "https://www.microsoft.com/favicon.ico", icon: "💻" },
  { name: "AWS", url: "https://aws.amazon.com/favicon.ico", icon: "📦" },
  { name: "Apple", url: "https://www.apple.com/favicon.ico", icon: "🍎" },
  { name: "Baidu", url: "https://www.baidu.com/favicon.ico", icon: "🐾" },
];

export default function ConnectivityChecker() {
  const [results, setResults] = useState<Record<string, number | "error" | "testing">>({});

  const testLatency = async (name: string, url: string) => {
    setResults(prev => ({ ...prev, [name]: "testing" }));
    const start = Date.now();
    try {
      await fetch(url, { mode: "no-cors", cache: "no-store" });
      const latency = Date.now() - start;
      setResults(prev => ({ ...prev, [name]: latency }));
    } catch (e) {
      setResults(prev => ({ ...prev, [name]: "error" }));
    }
  };

  useEffect(() => {
    SERVICES.forEach(s => testLatency(s.name, s.url));
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3">
      {SERVICES.map((s) => (
        <div key={s.name} className="p-3 rounded-lg bg-white/5 border border-white/5 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-2">
              <span>{s.icon}</span>
              {s.name}
            </span>
            {results[s.name] === "testing" ? (
              <Clock className="h-3 w-3 text-muted-foreground animate-spin" />
            ) : results[s.name] === "error" ? (
              <X className="h-3 w-3 text-red-500" />
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            )}
          </div>
          <div className="text-xs font-mono text-muted-foreground">
            {results[s.name] === "testing" ? "测试中..." : 
             results[s.name] === "error" ? "连接超时" : 
             `${results[s.name]} ms`}
          </div>
        </div>
      ))}
    </div>
  );
}
