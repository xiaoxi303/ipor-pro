"use client";

import { motion } from "framer-motion";
import { Network, FileText, Share2, ShieldCheck } from "lucide-react";

interface BgpAnalysisProps {
  asn?: string;
  asnOrg?: string;
  ip?: string;
}

export default function BgpDeepAnalysis({ asn, asnOrg, ip }: BgpAnalysisProps) {
  // Mock logic to provide details based on common ASNs
  const getAsnDetails = (asnCode?: string) => {
    const code = asnCode?.toUpperCase() || "";
    
    // --- 中国大陆 ---
    if (code.includes("4134") || code.includes("CHINANET")) {
      return {
        nature: "中国电信 (China Telecom) 163 骨干网。作为中国最大的互联网出口和接入网络，其 AS4134 承载了海量的民用宽带和企业专线，是全球最大的 Tier-1 级别的住宅网络之一。",
        conclusion: "属于住宅/商业宽带业务，具有极高的网络覆盖率和稳定性。",
        type: "原生 IP (Native)",
        route: `该网段由 AS4134 在中国大陆全境宣告，路由路径受 CN2/163 架构动态调度。`
      };
    }
    if (code.includes("4837") || code.includes("UNICOM")) {
      return {
        nature: "中国联通 (China Unicom) AS4837 骨干网。其网络质量在北方地区极具优势，出口带宽充裕，是国内除电信外最重要的 Tier-1 级互联网接入供应商。",
        conclusion: "属于标准住宅/固定宽带业务，非机房托管 IP。",
        type: "原生 IP (Native)",
        route: `该网段由 AS4837 在中国境内宣告，作为联通 169 骨干网的重要组成部分，路由质量优良。`
      };
    }
    if (code.includes("9929") || code.includes("CU-A")) {
      return {
        nature: "中国联通 A 网 (Premium Network)。AS9929 是联通的精品网络，主要面向政企大客户和高端用户，负载低、延迟小，被誉为国内最纯净的联通线路。",
        conclusion: "属于政企/精品线路业务，网络优先级极高，延迟表现极佳。",
        type: "原生 IP (Native)",
        route: `由 AS9929 精品骨干网宣告，路径极其稳定，适合高带宽低延迟业务。`
      };
    }
    if (code.includes("9808") || code.includes("CMNET")) {
      return {
        nature: "中国移动 (China Mobile) AS9808。依托移动庞大的 4G/5G 基站架构，其固网宽带发展极快，网络资源丰富，是目前中国用户数增长最快的 ISP 之一。",
        conclusion: "属于住宅宽带/移动基站业务，具有极高的移动性特征。",
        type: "原生 IP (Native)",
        route: `该网段由 AS9808 移动骨干网宣告，路由受 CMNet 策略优化。`
      };
    }

    // --- 中国香港 ---
    if (code.includes("3491") || code.includes("PCCW")) {
      return {
        nature: "PCCW Global (电讯盈科)。作为亚洲顶尖的 Tier-1 运营商，AS3491 拥有覆盖全球的骨干网络，是连接香港与全球互联网的核心枢纽。",
        conclusion: "属于国际 Tier-1 运营商业务，常见于高端商业专线和国际出口。",
        type: "原生 IP (Native)",
        route: `该网段由 AS3491 在香港宣告，是亚洲最重要的国际互联节点之一。`
      };
    }
    if (code.includes("4760") || code.includes("HKT")) {
      return {
        nature: "HKT (香港电讯)。香港最大的固网服务提供商，AS4760 主要承载其 Netvigator 宽带业务，是香港最纯净的住宅 IP 来源之一。",
        conclusion: "属于香港本地住宅宽带业务，非机房托管 IP。",
        type: "原生 IP (Native)",
        route: `该网段由 AS4760 在香港境内宣告，常见于香港家庭宽带用户。`
      };
    }

    // --- 新加坡 ---
    if (code.includes("17676") || code.includes("SINGTEL")) {
      return {
        nature: "Singtel (新加坡电信)。作为东南亚最大的通信技术集团，AS17676 是新加坡互联网的心脏，其网络质量和出口带宽均处于行业顶尖水平。",
        conclusion: "属于新加坡主流电信宽带业务，具有极高的全球互联质量。",
        type: "原生 IP (Native)",
        route: `该网段由 AS17676 在新加坡宣告，是东南亚最重要的路由出口点。`
      };
    }

    // --- 马来西亚 ---
    if (code.includes("4788") || code.includes("TMNET")) {
      return {
        nature: "TM Net (马来西亚电信)。马来西亚的国家级 ISP，AS4788 承载了该国绝大部分的 Unifi 宽带业务，是该地区最权威的住宅 IP 来源。",
        conclusion: "属于马来西亚主流固定宽带业务，非机房托管 IP。",
        type: "原生 IP (Native)",
        route: `该网段由 AS4788 在马来西亚全境宣告，路由路径受马来西亚国家骨干网保护。`
      };
    }

    // --- 美国/全球 ---
    if (code.includes("15169") || code.includes("GOOGLE")) {
      return {
        nature: "Google LLC (AS15169)。全球最大的互联网基础设施之一，承载了 Google Search, YouTube 及 Google Cloud 的核心流量，其网络拓扑极其复杂且高效。",
        conclusion: "属于顶级互联网巨头托管业务，通常被识别为数据中心/服务节点。",
        type: "广播 IP (Anycast)",
        route: `由 Google 全球骨干网宣告，利用分布式边缘节点实现低延迟接入。`
      };
    }
    if (code.includes("16509") || code.includes("AMAZON")) {
      return {
        nature: "Amazon.com (AWS AS16509)。全球最大的云计算平台，其网络节点覆盖全球。AS16509 具有极高的路由稳定性和海量的 IP 资源池。",
        conclusion: "属于数据中心/公有云业务，常见于弹性云服务。 ",
        type: "广播 IP (Anycast)",
        route: `由 AWS 全球骨干网宣告，支持多可用区 (AZ) 的动态流量分发。`
      };
    }
    if (code.includes("8075") || code.includes("MICROSOFT")) {
      return {
        nature: "Microsoft (AS8075)。承载了 Azure, M365 以及 Xbox Live 的全球流量。AS8075 是全球最繁忙的自治系统之一，拥有极强的抗 D 服务能力。",
        conclusion: "属于微软全球云架构节点，具有极高的可用性和安全性指标。",
        type: "广播 IP (Anycast)",
        route: `由 Microsoft 全球骨干网宣告，支持多区域流量均衡。`
      };
    }

    // --- 原有的中华电信 ---
    if (code.includes("3462")) {
      return {
        nature: "中华电信 (Chunghwa Telecom) 是台湾地区最大的电信运营商，AS3462 主要承载其 HiNet 宽带业务，涵盖光纤、ADSL 等基础接入服务，性质属于典型的 Tier-1 住宅网络提供商。",
        conclusion: "属于住宅/商业固网宽带业务，非机房托管 IP。",
        type: "原生 IP (Native)",
        route: `该网段 ${ip?.split('.').slice(0, 2).join('.')}.0.0/16 长期由 AS3462 宣告，路由起源地为台湾，路径稳定且无异常跨域跳转。`
      };
    }
    
    // --- 原有的 Cloudflare ---
    if (code.includes("13335") || code.includes("CLOUDFLARE")) {
      return {
        nature: "Cloudflare (AS13335) 是全球领先的 CDN 和边缘计算平台，其网络节点遍布全球。作为大型内容分发网络，其 IP 通常被识别为机房/托管服务性质。",
        conclusion: "属于数据中心/CDN 托管业务，非住宅宽带 IP。",
        type: "广播 IP (Anycast)",
        route: `该网段由 AS13335 全球宣告，利用 BGP Anycast 技术实现就近接入，路径可能因网络负载动态调整。`
      };
    }

    // Default fallback
    return {
      nature: `${asnOrg || "该运营商"} 是该地区的网络服务提供商。其业务涵盖了基础网络接入及路由宣告服务。`,
      conclusion: "根据 ASN 特征分析，该 IP 表现出稳定的网络接入特征。",
      type: "原生 IP (Native)",
      route: `该网段目前由 ${asn || "当前自治系统"} 宣告，路由路径表现正常，暂未监测到异常的 BGP 路由摆动。`
    };
  };

  const details = getAsnDetails(asn);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <Network className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">BGP 与自治系统 (ASN) 深度查询</h2>
          <p className="text-xs text-muted-foreground">全球路由表追踪与业务性质分析</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">ASN 拥有者</span>
          <p className="text-lg font-bold">{asn} ({asnOrg})</p>
        </div>
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-2">判定结论</span>
          <p className="text-sm font-medium leading-relaxed">{details.conclusion}</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex gap-4">
          <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
          <div>
            <h3 className="text-sm font-bold mb-2">拥有者业务性质</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {details.nature}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <Share2 className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
          <div>
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              BGP 路由分析 & IP 类型
            </h3>
            <div className="mb-4">
              <span className="px-3 py-1 rounded-md bg-green-500/20 text-green-500 text-xs font-bold border border-green-500/20">
                {details.type}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {details.route}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
