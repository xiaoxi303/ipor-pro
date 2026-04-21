"use client";

import nextDynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import InfoCard, { InfoItem } from "@/components/InfoCard";

const Map = nextDynamic(() => import("@/components/Map"), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-white/5 rounded-3xl animate-pulse" />
});

import ServiceStatus from "@/components/ServiceStatus";
import ConnectivityChecker from "@/components/ConnectivityChecker";
import WebRTCDetector from "@/components/WebRTCDetector";
import LoadingScreen from "@/components/LoadingScreen";
import BgpDeepAnalysis from "@/components/BgpDeepAnalysis";
import ReputationAssessment from "@/components/ReputationAssessment";
import IpDatabaseVerification from "@/components/IpDatabaseVerification";
import GlobalLatency from "@/components/GlobalLatency";
import AdvancedIpDetails from "@/components/AdvancedIpDetails";
import SecurityInsights from "@/components/SecurityInsights";
import SystemFingerprint from "@/components/SystemFingerprint";
import { 
  Globe, 
  Network, 
  Cpu, 
  Loader2,
  ShieldAlert,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const dynamic = 'force-dynamic';

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (targetIp?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = targetIp ? `/api/ip?ip=${targetIp}` : '/api/ip';
      const res = await fetch(url);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
      
      if (targetIp) {
        window.history.pushState({}, '', `?ip=${targetIp}`);
      }
    } catch (err: any) {
      setError(err.message || "无法加载 IP 数据，请检查网络后重试。");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ipParam = params.get('ip');
      fetchData(ipParam || undefined);
    }
  }, []);

  const handleSearch = (ip: string) => {
    fetchData(ip);
  };

  if (loading && !data) {
    return <LoadingScreen />;
  }

  if (error && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">检测失败</h2>
        <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
        <button 
          onClick={() => fetchData()}
          className="px-6 py-2 bg-primary rounded-full font-medium hover:bg-primary/90 transition-colors"
        >
          重新尝试
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 relative">
        <AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/20 backdrop-blur-[2px] z-20 flex items-center justify-center"
            >
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        <Hero 
          ip={data?.ip || "0.0.0.0"} 
          riskScore={data?.riskScore || 0}
          city={data?.city || "未知"}
          country={data?.country_name || "未知"}
          isLoading={loading}
          onSearch={handleSearch}
        />

        <div key={data?.ip} className="space-y-12">
          {/* Main Analysis Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Identity & Infrastructure */}
            <div className="lg:col-span-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoCard title="地理位置信息" icon={Globe}>
                  <InfoItem label="国家/地区" value={data?.country_name} subValue={data?.country_code} />
                  <InfoItem label="省份/州" value={data?.region} />
                  <InfoItem label="城市" value={data?.city} />
                  <InfoItem label="时区" value={data?.timezone} />
                  <InfoItem label="当地货币" value={data?.currency || "未知"} />
                </InfoCard>

                <InfoCard title="网络服务商信息" icon={Network}>
                  <InfoItem label="运营商 (ISP)" value={data?.isp || data?.asn_org} highlight />
                  <InfoItem label="自治系统 (ASN)" value={data?.asn ? (String(data.asn).toUpperCase().startsWith('AS') ? data.asn : `AS${data.asn}`) : undefined} />
                  <WebRTCDetector />
                  <InfoItem label="组织机构" value={data?.asn_org} />
                  <InfoItem label="网络类型" value={data?.org || "未知"} />
                </InfoCard>
              </div>

              <Map latitude={data?.latitude || 0} longitude={data?.longitude || 0} />
              
              <BgpDeepAnalysis 
                asn={data?.asn} 
                asnOrg={data?.asn_org} 
                ip={data?.ip} 
              />

              <GlobalLatency />
              
              <AdvancedIpDetails data={data} />
            </div>

            {/* Right: Security & Reputation Dashboard */}
            <div className="lg:col-span-4 space-y-8">
              <ReputationAssessment riskScore={data?.riskScore} />
              
              <SecurityInsights 
                riskScore={data?.riskScore} 
                isProxy={data?.is_proxy} 
                isp={data?.isp} 
              />

              <IpDatabaseVerification 
                riskScore={data?.riskScore} 
                isProxy={data?.is_proxy} 
                isp={data?.isp} 
                ip={data?.ip}
              />
              
              <SystemFingerprint />
            </div>
          </div>

          {/* Bottom Tools Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <InfoCard title="网络连通性测试" icon={Zap}>
              <ConnectivityChecker />
            </InfoCard>
            <ServiceStatus riskScore={data?.riskScore} countryCode={data?.country_code} ip={data?.ip} />
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 py-10 text-center text-muted-foreground text-sm">
        <div className="container mx-auto px-4">
          <p>© 2026 IPor. 专业的全球 IP 深度分析引擎</p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="#" className="hover:text-primary transition-colors">隐私政策</a>
            <a href="#" className="hover:text-primary transition-colors">服务条款</a>
            <a href="#" className="hover:text-primary transition-colors">API 文档</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
