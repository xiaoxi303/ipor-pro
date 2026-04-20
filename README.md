<div align="center">

# 🛡️ IPor - Professional Network Intelligence Suite

**全球领先的 IP 深度检测与网络纯净度分析引擎**

[![Next.js](https://img.shields.io/badge/Framework-Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20v4-38b2ac?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=for-the-badge)](LICENSE)

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
-   **部署架构**: OpenNext + Cloudflare Pages / Workers

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

## ☁️ Cloudflare 部署指南 (OpenNext 架构)

本项目采用 **OpenNext** 架构，旨在将 Next.js 15 的全栈特性（如 SSR 和 API 路由）完美运行在 Cloudflare 的边缘网络上。

> [!WARNING]
> **部署架构避坑指南**：
> 很多人误以为本项目是部署在 Cloudflare Pages 上的静态网站。实际上，由于使用了 OpenNext，当你在 Cloudflare Pages 触发构建时，它会在后台**打包并部署一个独立的 Cloudflare Worker**（例如 `ipor-pro`）来运行你的 API 和服务端渲染代码。

### 部署步骤：

1. **连接 GitHub**：在 Cloudflare Dashboard 中选择 **Workers 和 Pages** -> **创建应用程序** -> **Pages** -> **连接到 Git**。
2. **选择仓库**：选择你 Fork 或 Push 的 `ipor-pro` 仓库。
3. **构建设置**：
   - 框架预设：选择 `None` 
   - 构建命令：`npm run deploy` （此命令内部会自动执行 OpenNext 的打包和 Wrangler 部署）
   - 输出目录：无需关心，OpenNext 会自动接管。
4. **配置环境变量（关键！）**：
   在首次构建前，在 Pages 的环境变量设置中添加你的 API Key：
   - 变量名：`IP2LOCATION_API_KEY`
   - 值：`你的_API_KEY`
5. **点击部署**。

> [!IMPORTANT]
> **关于环境变量被清空的终极解决方案**：
> 按照常规逻辑，如果你手动在部署好的 Worker 中添加了环境变量，下次通过 Pages 触发 CI 自动构建时，旧的环境变量**会被 Wrangler 清空覆盖**。
> 
> 为了解决这个问题，本项目已经在 `package.json` 的打包命令中强制启用了 `--keep-vars`：
> `"deploy": "opennextjs-cloudflare build && npx wrangler deploy --keep-vars"`
> 
> **你只需做一次操作**：在首次部署成功后，进入 Cloudflare 面板的 **Workers 和 Pages**，找到由代码自动生成的那个 **Worker**（注意是 Worker，不是 Pages 项目），在它的 **设置 -> 变量和机密** 中，把 `IP2LOCATION_API_KEY` 填上去并保存。从此以后，无论你怎么自动更新代码，环境变量都永远不会掉线！

---

## 🤝 贡献与反馈

如果您有任何想法、建议或发现了 Bug，欢迎通过以下方式与我们联系：

-   提交 **Pull Requests**
-   发起 **Issues**
-   给项目点一个 **Star** ⭐

---

## 📄 开源协议 (License)

本项目基于 **Apache License 2.0** 协议开源。详细信息请参阅 [LICENSE](LICENSE) 文件。

---

<div align="center">

**IPor - 让每一组 IP 地址都拥有清晰的面孔**

© 2026 IPor Team. Built with ❤️ for the Modern Web.

</div>
