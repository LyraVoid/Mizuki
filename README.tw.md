# 🌸 Mizuki

<img align='right' src='logo.png' width='200px' alt="Mizuki logo">

一個現代化、功能豐富的靜態部落格模板，基於 [Astro](https://astro.build) 構建，具有先進的功能和精美的設計。

[![Node.js >= 20](https://img.shields.io/badge/node.js-%3E%3D20-brightgreen)](https://nodejs.org/)
[![pnpm >= 11](https://img.shields.io/badge/pnpm-%3E%3D11-blue)](https://pnpm.io/)
[![Astro](https://img.shields.io/badge/Astro-7.1.3-orange)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.3-blue)](https://www.typescriptlang.org/)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg?logo=apache)](https://opensource.org/licenses/Apache-2.0)

[**🖥️ 線上演示**](https://mizuki.mysqil.com/) | [**📝 使用者文檔**](https://docs.mizuki.mysqil.com/)

🌏 **README 語言:**
[**English**](./README.md) / [**中文**](./README.zh.md) / [**日本語**](./README.ja.md) / [**繁體中文**](./README.tw.md) /

透過我們的綜合文檔快速開始。無論是自訂主題、配置功能，還是部署到生產環境，文檔涵蓋了您成功啟動部落格所需的所有內容。

[📚 閱讀完整文檔](https://docs.mizuki.mysqil.com/) →

![Mizuki Preview](./README.webp)

<table>
  <tr>
    <td><img alt="" src="docs/image/1.webp"></td>
    <td><img alt="" src="docs/image/2.webp"></td>
    <td><img alt="" src="docs/image/3.webp"></td>
  <tr>
  <tr>
    <td><img alt="" src="docs/image/4.webp"></td>
    <td><img alt="" src="docs/image/5.webp"></td>
    <td><img alt="" src="docs/image/6.webp"></td>
  <tr>
</table>

## ✨ 功能特性

### 🎨 設計與界面

- [x] 基於 [Astro](https://astro.build) 和 [Tailwind CSS](https://tailwindcss.com) 構建
- [x] 使用 [Swup](https://swup.js.org/) 實現流暢的動畫和頁面過渡
- [x] 明暗主題切換，支援系統偏好檢測
- [x] 可自定義主題色彩、橫幅輪播和全屏桌布
- [x] 可切換桌布模式，並調整透明度和模糊效果
- [x] 可配置側邊欄元件、順序和響應式佈局
- [x] 可選的寬螢幕自動頁面縮放
- [x] 全裝置響應式設計
- [x] 支援自訂或系統字體模式，包括 JetBrains Mono 和中日韓字體

### 🔍 內容與搜尋

- [x] 基於 [Pagefind](https://pagefind.app/) 的高級搜尋功能
- [x] [Markdown 和 MDX 擴展](#-markdown-擴展語法)，支援語法高亮
- [x] 互動式目錄，支援自動滾動
- [x] RSS 和 Atom 全文訂閱，複用文章頁面的 Markdown/MDX 管線
- [x] 閱讀時間估算
- [x] 文章分類、標籤、置頂、別名和自訂固定連結
- [x] 可選的密碼保護文章，並明確說明靜態網站加密的安全邊界

### 📱 特色頁面

- [x] **追番頁面** - 使用本地資料、Bangumi 或 Bilibili 追蹤動畫
- [x] **友鏈頁面** - 使用卡片和標籤展示友鏈
- [x] **日記頁面** - 分享帶有文字、圖片、位置、心情和標籤的動態
- [x] **相簿頁面** - 管理本地或外部相簿，並支援可選加密
- [x] **專案、技能、裝置和時間線頁面** - 展示結構化個人資料
- [x] **AI 工具頁面** - 維護可搜尋的工具目錄
- [x] **歸檔和關於頁面** - 瀏覽文章或發布自訂介紹

### 🛠 技術特性

- [x] **增強程式碼區塊**，基於 [Expressive Code](https://expressive-code.com/)
- [x] **數學公式**，使用 KaTeX，並支援 Mermaid 和 PlantUML 圖表
- [x] **圖片增強**，包括響應式尺寸、自動網格和 Fancybox 燈箱
- [x] **SEO 優化**，包括網站地圖、robots.txt、RSS、Atom 和可選 Open Graph 圖片
- [x] **效能優化**，懶加載和快取機制
- [x] **評論系統**，支援 Twikoo 或 Giscus
- [x] **音樂播放器**，支援本地和 Meting 模式
- [x] **Live2D 看板娘**，透過 Pio 實現

## 🚀 快速開始

### 📦 安裝

1. **克隆儲存庫：**

   ```bash
   git clone https://github.com/LyraVoid/Mizuki.git
   cd Mizuki
   ```

2. **安裝依賴：**

   ```bash
   # 啟用專案宣告的套件管理器版本
   corepack enable

   # 安裝專案依賴
   pnpm install
   ```

3. **配置部落格（可選）：**
   - 如果只使用本地內容，請在專案根目錄 `.env` 中設定 `ENABLE_CONTENT_SYNC=false`。
   - 編輯 `src/config/siteConfig.ts` 和 `src/config/` 下的其他模組自訂網站。
   - 至少將 `siteURL` 替換為部署後的公開網址。

4. **啟動開發伺服器：**
   ```bash
   pnpm dev
   ```
   部落格將在 `http://localhost:3000` 可用

### 📝 內容管理

- **建立文章：** `pnpm new-post -- <檔案名>`，支援 `.md` 和 `.mdx`。
- **編輯文章：** 修改 `src/content/posts/` 中的檔案。
- **編輯關於頁或友鏈頁內容：** 修改 `src/content/spec/` 中對應的檔案。
- **編輯結構化頁面資料：** 修改 `src/data/` 中對應的檔案。
- **添加文章本地圖片：** 將圖片放在文章旁邊，並使用 `./cover.webp` 這樣的相對路徑。
- **添加公共圖片：** 放在 `public/` 下，並使用 `/images/example.webp` 這樣的根路徑。

> **發布前注意：** 儲存庫中包含示例文章、頁面資料、相簿和圖片。部署個人網站前請刪除或替換這些示例內容。

### 🚀 部署

將部落格部署到任何靜態託管平台：

- **Vercel：** 連接 GitHub 儲存庫到 Vercel
- **Netlify：** 直接從 GitHub 部署
- **GitHub Pages：** 使用包含的 GitHub Actions 工作流
- **Cloudflare Pages：** 連接您的儲存庫

部署前，請在 `src/config/siteConfig.ts` 中更新 `siteURL`。
不要將 `.env` 或憑據提交到 Git；託管構建請在平台的環境變數設定中配置。

`.env.example` 中還包含 Bilibili 會話資料和 IndexNow 憑據等可選設定。只在需要時設定，並放在本地環境或託管平台 Secret 中，切勿提交真實值。

## 📝 內容編寫

文章使用 `src/content/posts/` 下的 `.md` 或 `.mdx` 檔案，`title` 和 `published` 是必填的 frontmatter 欄位。可選欄位支援摘要、圖片、標籤、分類、草稿、置頂、評論、別名、固定連結、署名和瀏覽器端加密。

Markdown 和 MDX 支援提示框、KaTeX 數學公式、Expressive Code、Mermaid、PlantUML、GitHub 卡片、Wiki Link、劇透、響應式圖片、圖片網格、Fancybox 燈箱和 HTML 嵌入。加密文章不會進入 RSS 和 Atom，但瀏覽器端加密不是伺服器端存取控制。

PlantUML 預設使用 `src/config/markdownConfig.ts` 中配置的公共伺服器，請勿在圖表中寫入密碼、Token 或隱私資料。

完整欄位表、寫作語法、圖片規則、圖表、影片嵌入、加密限制和發布清單請參閱[內容編寫指南](docs/CONTENT_AUTHORING.tw.md)。

## ⚡ 命令

所有命令都在專案根目錄運行：

| 命令 | 操作 |
| :--- | :--- |
| `pnpm install` | 安裝依賴。 |
| `pnpm dev` | 在 `http://localhost:3000` 啟動開發伺服器。 |
| `pnpm build` | 構建 `./dist/`、生成搜尋資料並執行構建檢查。 |
| `pnpm preview` | 在部署前預覽生產構建。 |
| `pnpm run check` | 執行 Astro 診斷。 |
| `pnpm run type-check` | 執行 TypeScript 類型檢查。 |
| `pnpm test` | 執行 Markdown、佈局、圖片、音樂和加密測試。 |
| `pnpm run format` | 使用 Biome 格式化源檔案。 |
| `pnpm run lint` | 使用 Biome 檢查並自動修復源檔案。 |
| `pnpm new-post -- <檔案名>` | 建立 Markdown 或 MDX 文章。 |
| `pnpm run sync-content` | 同步可選的外部內容儲存庫。 |
| `pnpm run init-content` | 互動式初始化外部內容同步。 |
| `pnpm astro ...` | 執行 Astro CLI 命令。 |

## 🎯 配置指南

### 🔧 基礎配置

配置已拆分到 `src/config/` 下的多個模組，`src/config/index.ts` 是統一導出入口。主要網站設定位於 `src/config/siteConfig.ts`：

```typescript
export const siteConfig: SiteConfig = {
  title: "您的部落格名稱",
  subtitle: "您的部落格描述",
  siteURL: "https://example.com/", // 保留結尾斜線
  lang: "zh_TW", // 例如 "en"、"zh_CN" 或 "ja"
  timeZone: "Asia/Taipei", // 任意有效的 IANA 時區
  themeColor: {
    hue: 210, // 0–360
    fixed: false, // 為 true 時隱藏訪客的主題色選擇器
  },
  featurePages: {
    anime: true,
    diary: true,
    friends: true,
    projects: true,
    skills: true,
    timeline: true,
    albums: true,
    devices: true,
    aiTools: true,
  },
  // 其餘欄位請保留模板預設值。
};
```

其他常用配置檔案：

- `src/config/navBarConfig.ts` — 導航連結和選單。
- `src/config/profileConfig.ts` — 頭像、名稱、簡介和社交連結。
- `src/config/sidebarConfig.ts` — 側邊欄元件、順序、位置和響應式行為。
- `src/config/backgroundWallpaper.ts` 與 `src/config/effectsConfig.ts` — 桌布和視覺特效。
- `src/config/commentConfig.ts` — Twikoo 或 Giscus 全域設定。評論預設關閉；使用前請設定 `enable: true` 並配置對應服務。
- `src/config/musicConfig.ts` — 音樂播放器模式和歌單來源。
- `src/config/markdownConfig.ts` — Wiki Link、自動圖片網格和 PlantUML。
- `src/config/permalinkConfig.ts` — 可選的全域固定連結格式。
- `src/config/expressiveCodeConfig.ts` — 程式碼區塊主題和行為。

### 📱 特色頁面內容

頁面開關由 `siteConfig.featurePages` 控制。頁面內容與頁面模板分離：

| 頁面 | 內容或資料來源 |
| :--- | :--- |
| 關於 | `src/content/spec/about.md` |
| 友鏈 | `src/content/spec/friends.md` 和 `src/data/friends.ts` |
| 追番 | `src/config/siteConfig.ts` 設定資料來源模式；本地資料在 `src/data/anime.ts` |
| 日記 | `src/data/diary.ts`，或在 `diaryApiUrl` 中配置 Memos 地址 |
| 相簿 | `public/images/albums/`；每個本地相簿使用 `info.json` |
| 專案 | `src/data/projects.ts` |
| 技能 | `src/data/skills.ts` |
| 裝置 | `src/data/devices.ts` |
| 時間線 | `src/data/timeline.ts` |
| AI 工具 | `src/data/ai-tools.ts` |

不要為了修改頁面內容而直接編輯 `src/pages/*.astro`；這些檔案負責佈局和渲染邏輯。

### 📦 代碼內容分離 (可選)

Mizuki 可以將主題程式碼和部落格內容分成兩個儲存庫，適用於私有內容、獨立版本管理或團隊協作，但這是可選功能。

**快速選擇**:

| 使用場景 | 配置方式 | 內容位置 |
| :--- | :--- | :--- |
| **本地內容** | `ENABLE_CONTENT_SYNC=false` | `src/content/`、`src/data/` 和 `public/images/` |
| **外部內容儲存庫** | `ENABLE_CONTENT_SYNC=true` 且設定 `CONTENT_REPO_URL=...` | 同步到上述路徑的獨立儲存庫 |

**一鍵啟用/禁用**:

```bash
# 本地內容模式（推薦入門使用）
# 在 .env 中明確關閉同步
ENABLE_CONTENT_SYNC=false
pnpm dev

# 外部內容儲存庫模式
# 1. 複製配置範例
cp .env.example .env

# 2. 編輯 .env
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git
# CONTENT_DIR=./content  # 可選，預設值即為此路徑

# 3. 同步內容並啟動網站
pnpm run sync-content
pnpm dev
```

外部內容儲存庫可以使用以下結構：

```text
Mizuki-Content/
├── posts/       # .md 和 .mdx 文章
├── spec/        # 關於頁、友鏈頁等 Markdown 內容
├── data/        # 專案、技能等結構化頁面資料
└── images/      # 公共圖片，包括相簿和文章資源
```

同步腳本會將這些目錄映射到 `src/content/posts/`、`src/content/spec/`、`src/data/` 和 `public/images/`。`src/data/ai-tools.ts` 屬於程式碼儲存庫，會在同步時受到保護。

> **同步警告：** 啟用 `ENABLE_CONTENT_SYNC` 後，`pnpm dev` 和 `pnpm build` 會自動執行同步鉤子。如果 `CONTENT_DIR` 已經是 Git 儲存庫，同步腳本會 fetch 並重置到遠端 `main` 或 `master` 分支；它還可能將現有執行時目錄備份為 `.backup`、建立目錄聯接或複製檔案，並在程式碼儲存庫中提交同步結果。執行前請提交或備份本地內容修改，不要直接編輯同步目標檔案。

私有儲存庫可以使用 SSH URL，或透過部署平台配置憑據。不要將 Token 寫入 `.env` 並提交，也不要將 Token 放進公開儲存庫 URL。

📖 **詳細配置：** [內容分離完整指南](docs/CONTENT_SEPARATION.md)

🔄 **遷移教程：** [從單倉庫遷移到分離模式](docs/MIGRATION_GUIDE.md)

🚀 **部署指南：** [部署指南](docs/DEPLOYMENT.md)

📚 **更多文檔：** [文檔索引](docs/README.md)

## ✏️ 貢獻

我們歡迎貢獻！請隨時提交問題和拉取請求。

1. Fork 儲存庫
2. 創建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打開拉取請求

## 📄 許可證

本專案基於 Apache 許可證 2.0 - 查看 [LICENSE](./LICENSE) 檔案了解詳情。

### 原始專案許可證

本專案基於 [Fuwari](https://github.com/saicaca/fuwari) 開發，該專案使用 MIT 許可證。根據 MIT 許可證要求，原始版權聲明和許可聲明已包含在 LICENSE.MIT 檔案中。

## 🙏 致謝

- 基於原始 [Fuwari](https://github.com/saicaca/fuwari) 模板
- 靈感來源於 [Yukina](https://github.com/WhitePaper233/yukina) - 一個美麗優雅的部落格模板
- 部分設計靈感來源於 [Firefly](https://github.com/CuteLeaf/Firefly) 和 [Twilight](https://github.com/spr-aachen/Twilight) 模板
- 使用 [Pio](https://github.com/Dreamer-Paul/Pio) 實現可愛的 Live2D 看板娘外掛程式
- 使用 [Astro](https://astro.build) 和 [Tailwind CSS](https://tailwindcss.com) 構建
- 圖標來自 [Iconify](https://iconify.design/)

### 🌸 特別感謝

- **[Fuwari](https://github.com/saicaca/fuwari)** by saicaca - 本專案所基於的原始模板。感謝您創建了如此漂亮且功能強大的模板。
- **[Yukina](https://github.com/WhitePaper233/yukina)** - 感謝提供設計靈感和創意，幫助塑造了這個專案。Yukina 是一個優雅的部落格模板，展現了出色的設計原則和使用者體驗。
- **[Firefly](https://github.com/CuteLeaf/Firefly)** - 感謝提供優秀的佈局設計思路，雙側邊欄佈局、文章雙列網格等佈局，及部分小元件的設計與實現，讓 Mizuki 的界面更加豐富。
- **[Twilight](https://github.com/spr-aachen/Twilight)** - 感謝提供靈感和技術支持。Twilight 的動態桌布模式切換系統、響應式設計和過渡效果顯著提升了 Mizuki 的使用體驗。

## 🍀 貢獻者

感謝以下貢獻者對本專案做出的貢獻，如有問題或建議，請提交 [Issue](https://github.com/LyraVoid/Mizuki/issues) 或 [Pull Request](https://github.com/LyraVoid/Mizuki/pulls)。

<a href="https://github.com/LyraVoid/Mizuki/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=LyraVoid/Mizuki" />
</a>

## ⭐ Star History

[![Star History Chart](https://star-history.dera.page/svg?repos=LyraVoid/Mizuki&type=Date)](https://star-history.dera.page/#LyraVoid/Mizuki&Date)

⭐ 如果您覺得這個專案有幫助，請考慮給它一個星標！
