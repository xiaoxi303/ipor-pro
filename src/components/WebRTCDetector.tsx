"use client";

import { useEffect, useState } from "react";
import { InfoItem } from "./InfoCard";

export default function WebRTCDetector() {
  const [localIp, setLocalIp] = useState<string>("正在获取...");

  useEffect(() => {
    try {
      const pc = new RTCPeerConnection({ iceServers: [] });
      pc.createDataChannel("");
      pc.createOffer().then(offer => pc.setLocalDescription(offer));
      pc.onicecandidate = (ice) => {
        if (ice && ice.candidate && ice.candidate.candidate) {
          const myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)?.[1];
          if (myIP) setLocalIp(myIP);
          pc.onicecandidate = null;
        }
      };
      setTimeout(() => {
        if (localIp === "正在获取...") setLocalIp("获取失败");
      }, 5000);
    } catch (e) {
      setLocalIp("被浏览器拦截");
    }
  }, []);

  return <InfoItem label="本地 / WebRTC IP" value={localIp} />;
}
