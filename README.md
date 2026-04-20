<div align="center">

# 🛡️ IPor - Professional Network Intelligence Suite

**全球领先的 IP 深度检测与网络纯净度分析引擎**

[![Next.js](https://img.shields.io/badge/Framework-Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20v4-38b2ac?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[✨ 立即体验](http://localhost:3000) · [🛠️ 核心功能](#-核心功能) · [🚀 快速开始](#-快速开始)

---

</div>

## 📖 项目简介

**IPor** 是一款专为开发者、安全专家及网络管理员打造的高端 IP 分析终端。它不仅提供基础的地理位置查询，更通过深度扫描算法，为您提供包括 BGP 路由分析、实时欺诈风险评估、全球节点延迟探测在内的全方位网络情报。

我们深知每一比特数据的价值，IPor 致力于将复杂的网络协议转化为直观、优美且极具洞察力的视觉报告。

---

## 🌟 核心功能

### 🔍 深度 IP 检测 (Deep Detection)
*   **精准定位**：集成 IP2Location.io 与 MaxMind 双重验证，精确到城市级的经纬度定位。
*   **运营商识别**：智能解析 ASN 组织机构，解决 ISP 信息缺失问题。
*   **动态地图**：基于 CartoDB Dark Matter 的暗黑专业地图，实时追踪地理脉络。

### 🛡️ 实时信誉评估 (Reputation Engine)
*   **欺诈评分**：基于动态算法的 Fraud Score，直观展示 IP 风险等级。
*   **RBL 黑名单检测**：实时检索 Spamhaus, Barracuda, SORBS 等全球主流黑名单。
*   **安全建议**：根据检测结果，系统自动生成针对性的隐私与安全操作建议。

### 🌐 全球网络分析 (Network Intelligence)
*   **BGP 深度查询**：完整解析自治系统属性、广播 IP 类型及所有者背景。
*   **延迟探测**：一键检测从当前 IP 到全球核心机房（洛杉矶、香港、东京、伦敦等）的实时延迟。
*   **业务可用性**：实时检测 Google, Netflix, TikTok, ChatGPT 等主流服务的区域访问权限。

### 📊 专业报告导出 (Pro Reports)
*   **一键导出**：优化的打印排版系统，支持将全栈分析结果一键保存为专业 PDF 报告。

---

## 🎨 界面美学

IPor 采用了最前沿的 **Glassmorphism (毛玻璃)** 设计语言：

-   **动态流光背景**：随时间浮动的 Mesh Gradient，打造沉浸式的数字氛围。
-   **暗黑专业风格**：深邃的蓝黑配色，配合高对比度的状态标识。
-   **响应式布局**：完美适配移动端、平板与桌面 4K 显示器。

---

## 🛠️ 技术栈

-   **核心框架**: Next.js 15 (App Router)
-   **动画引擎**: Framer Motion
-   **图标库**: Lucide React
-   **样式方案**: Tailwind CSS v4 + Vanilla CSS
-   **地图驱动**: Leaflet.js
-   **数据源**: IP2Location.io / IP-API / Custom Heuristics

---

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/your-username/ipor-pro.git
cd ipor-pro
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境
在根目录创建 `.env.local` 文件：
```env
# 获取 API Key: https://www.ip2location.io
IP2LOCATION_API_KEY=your_api_key_here
```

### 4. 启动开发服务器
```bash
npm run dev
```
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

---

## 🤝 贡献与反馈

如果您有任何想法、建议或发现了 Bug，欢迎通过以下方式与我们联系：

-   提交 **Pull Requests**
-   发起 **Issues**
-   给项目点一个 **Star** ⭐

---

<div align="center">

**IPor - 让每一组 IP 地址都拥有清晰的面孔**

© 2026 IPor Team. Built with ❤️ for the Modern Web.

</div>
