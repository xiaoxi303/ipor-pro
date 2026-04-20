"use client";

import { useEffect, useState } from "react";
import { InfoItem } from "./InfoCard";

export default function WebRTCDetector() {
  const [localIp, setLocalIp] = useState<string>("正在获取...");

  useEffect(() => {
    try {
      // 填入公共 STUN 服务器，触发 ICE candidate 收集
      const pc = new RTCPeerConnection({ 
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] 
      });
      pc.createDataChannel("");
      pc.createOffer().then(offer => pc.setLocalDescription(offer));
      
      pc.onicecandidate = (ice) => {
        if (ice && ice.candidate && ice.candidate.candidate) {
          const candidateStr = ice.candidate.candidate;
          // 匹配普通 IP (IPv4/IPv6)
          const ipMatch = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(candidateStr);
          // 匹配 mDNS (现代浏览器用来隐藏真实内网 IP 的保护机制)
          const mdnsMatch = /([a-f0-9\-]+\.local)/.exec(candidateStr);

          if (ipMatch) {
            setLocalIp(ipMatch[1]);
            pc.onicecandidate = null;
          } else if (mdnsMatch) {
            setLocalIp(`隐藏 (mDNS: ${mdnsMatch[1]})`);
            pc.onicecandidate = null;
          }
        }
      };
      
      setTimeout(() => {
        setLocalIp(prev => prev === "正在获取..." ? "获取失败 (可能被浏览器插件拦截)" : prev);
      }, 5000);
    } catch (e) {
      setLocalIp("被浏览器拦截");
    }
  }, []);

  return <InfoItem label="本地 / WebRTC IP" value={localIp} />;
}
