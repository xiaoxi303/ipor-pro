"use client";

import { Cpu, Fingerprint, MonitorSmartphone, Globe2 } from "lucide-react";
import { useState, useEffect } from "react";
import InfoCard, { InfoItem } from "./InfoCard";

export default function SystemFingerprint() {
  const [fingerprint, setFingerprint] = useState({
    browser: "检测中...",
    os: "检测中...",
    language: "检测中...",
    screen: "检测中...",
    timezone: "检测中..."
  });

  useEffect(() => {
    // 浏览器检测
    const getBrowser = () => {
      const userAgent = navigator.userAgent;
      if (userAgent.match(/chrome|chromium|crios/i)) return "Chrome / Chromium";
      if (userAgent.match(/firefox|fxios/i)) return "Firefox";
      if (userAgent.match(/safari/i)) return "Safari";
      if (userAgent.match(/opr\//i)) return "Opera";
      if (userAgent.match(/edg/i)) return "Edge";
      return "未知浏览器";
    };

    // 操作系统检测
    const getOS = () => {
      const userAgent = navigator.userAgent;
      const platform = navigator.platform;
      const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
      const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
      const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
      let os = "未知操作系统";

      if (macosPlatforms.indexOf(platform) !== -1) {
        os = 'macOS';
      } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = 'iOS';
      } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'Windows';
      } else if (/Android/.test(userAgent)) {
        os = 'Android';
      } else if (!os && /Linux/.test(platform)) {
        os = 'Linux';
      }
      return os;
    };

    setFingerprint({
      browser: getBrowser(),
      os: getOS(),
      language: navigator.language || "未知语言",
      screen: `${window.screen.width}x${window.screen.height} (${window.devicePixelRatio}x DPR)`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
  }, []);

  return (
    <InfoCard title="客户端环境指纹" icon={Fingerprint}>
      <InfoItem label="浏览器引擎" value={fingerprint.browser} />
      <InfoItem label="操作系统" value={fingerprint.os} />
      <InfoItem label="系统语言" value={fingerprint.language} />
      <InfoItem label="屏幕分辨率" value={fingerprint.screen} />
      <InfoItem label="本地时区" value={fingerprint.timezone} />
    </InfoCard>
  );
}
