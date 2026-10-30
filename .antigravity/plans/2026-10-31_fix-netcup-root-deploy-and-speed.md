# Plan: 修复 Vueltacole 线上未更新与打开缓慢问题 + 视频去字幕版同步

> **日期**: 2026-10-31
> **依据规范**: `GEMINI.md` + `REBUILD_SOP.md` + `CLOUD_MEDIA_SOP.md` + `netcup-auto-sync`

---

## 1. 根因诊断（Evidence-Based Root Cause Analysis）

1. **为什么网页没看到更新？**
   - 经查 GitHub Webhook (`gh api repos/nicolas9366/vueltacole/hooks`)，`nicolas9366/vueltacole` 绑定了 **Netcup Plesk 自动同步** (`https://ae9f9.netcup.net:8443/modules/git/public/web-hook.php?uuid=5beb5597-bf10-20e0-b16d-1bd1d76f1a01`)。
   - Netcup Plesk 拉取 `main` 分支后，由 Nginx 直接托管**仓库根目录**下的静态文件（`index.html`、`assets/`），**不会在服务器上执行 `npm run build`**。
   - 上一次提交中，根目录的 `index.html` 是 Vite 源码模板（`<script type="module" src="/src/main.tsx"></script>`），而编译产物在被 `.gitignore` 忽略的 `dist/` 中，导致线上 Nginx 无法直接渲染新版组件。

2. **为什么网页打开很慢？**
   - **原因 A（首屏加载了 1.05 MB 的地图引擎）**：`src/App.tsx` 在顶部静态导入了 `MapApp.tsx`（含 `maplibre-gl` 1,055 KB），导致用户仅打开主页或圣诞子页面时，浏览器也必须先下载并解析 1.34 MB 的 JS。
   - **原因 B（Google Drive 新建文件默认私有导致 3 次 302 重定向耗时 1.4s/张）**：本地挂载盘自动同步至 Google Drive 的文件默认权限为 `Restricted`，未登录 `mr.dengyu@gmail.com` 的浏览器请求 `lh3.googleusercontent.com/d/<ID>` 会经历 3 次跨域 302 跳转至 `accounts.google.com`，且首屏同步加载了 Google Drive `<iframe>` 播放器脚本。

---

## 2. 原子执行步骤（Atomic Execution Steps）

### Step 1: 云端高速 CDN 分发层（0 字节占用主分支与 Netcup 服务器）
- 将 21 张 100% 原始未去水印高清产品图转换为高清 WebP（单张仅 ~45 KB），连同全景海报及流媒体版无字幕导购视频，推送至独立的孤立云端分支 `origin/cloud-assets`（不在 `main` 分支中，因此 Netcup 服务器拉取 `main` 分支时**零空间占用**）。
- 通过全球免费的 **jsDelivr Cloud CDN (`https://cdn.jsdelivr.net/gh/nicolas9366/vueltacole@cloud-assets/navidad2026/...`)** 提供毫秒级（`<30ms`）免登录公网直连，同时在 `christmas2026DB.ts` 中保留 Google Drive File ID 作为云盘备份源。

### Step 2: 前端首屏极速优化（Code Splitting + 原生云端流媒体播放）
- 修改 `src/App.tsx`：对 `MapApp` 与 `Redemption` 组件使用 `React.lazy()` 动态按需加载，使主页与圣诞子页面首屏 JS 体积从 `1,340 KB` 降至 `~190 KB`（Gzip 后仅 `~60 KB`）。
- 修改 `src/components/NavidadPromo.tsx`：
  - 产品卡片默认加载高速 Cloud CDN WebP 图（带 `loading="lazy"` 与 `decoding="async"`），若失败自动回退 Google Drive URL。
  - 视频展播厅默认采用云端原生 HTML5 `<video preload="metadata" controls playsInline>` 播放无字幕完整版北京口音大片（秒开不卡顿），并提供一键切换 Google Drive Preview / YouTube / TikTok / Instagram 标签。

### Step 3: 根目录直出构建产物（兼容 Netcup Plesk 自动同步）
- 编写构建发布脚本 `scripts/build_for_netcup.mjs`：
  1. 使用源码模板编译生产包至 `dist/`；
  2. 将编译后的 `dist/index.html`、`dist/assets/*` 直接同步到仓库根目录（`index.html`、`navidad.html`、`assets/`），确保 Netcup Plesk Git Webhook 拉取 `main` 分支后无需任何构建即可直接由 Nginx 秒级响应 `/`、`/?page=navidad` 与 `/navidad.html`。
- 提交并 `git push origin main`，验证 GitHub Webhook 返回 `204 OK`。
