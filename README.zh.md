# 🌸 Mizuki

<img align='right' src='logo.png' width='200px' alt="Mizuki logo">

一个现代化、功能丰富的静态博客模板，基于 [Astro](https://astro.build) 构建，具有先进的功能和精美的设计。

[![Node.js >= 20](https://img.shields.io/badge/node.js-%3E%3D20-brightgreen)](https://nodejs.org/)
[![pnpm >= 11](https://img.shields.io/badge/pnpm-%3E%3D11-blue)](https://pnpm.io/)
[![Astro](https://img.shields.io/badge/Astro-7.1.3-orange)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.3-blue)](https://www.typescriptlang.org/)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg?logo=apache)](https://opensource.org/licenses/Apache-2.0)

[**🖥️ 在线演示**](https://mizuki.mysqil.com/) | [**📝 用户文档**](https://docs.mizuki.mysqil.com/)

🌏 **README 语言:**
[**English**](./README.md) / [**中文**](./README.zh.md) / [**日本語**](./README.ja.md) / [**繁體中文**](./README.tw.md) /

通过我们的综合文档快速开始。无论是自定义主题、配置功能，还是部署到生产环境，文档涵盖了您成功启动博客所需的所有内容。

[📚 阅读完整文档](https://docs.mizuki.mysqil.com/) →

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

### 🎨 设计与界面

- [x] 基于 [Astro](https://astro.build) 和 [Tailwind CSS](https://tailwindcss.com) 构建
- [x] 使用 [Swup](https://swup.js.org/) 实现流畅的动画和页面过渡
- [x] 明暗主题切换，支持系统偏好检测
- [x] 可自定义主题色彩、横幅轮播和全屏壁纸
- [x] 可切换壁纸模式，并调整透明度和模糊效果
- [x] 可配置侧边栏组件、顺序和响应式布局
- [x] 可选的宽屏自动页面缩放
- [x] 全设备响应式设计
- [x] 支持自定义或系统字体模式，包括 JetBrains Mono 和中日韩字体

### 🔍 内容与搜索

- [x] 基于 [Pagefind](https://pagefind.app/) 的高级搜索功能
- [x] [Markdown 和 MDX 扩展](#-markdown-扩展语法)，支持语法高亮
- [x] 交互式目录，支持自动滚动
- [x] RSS 和 Atom 全文订阅，复用文章页面的 Markdown/MDX 管线
- [x] 阅读时间估算
- [x] 文章分类、标签、置顶、别名和自定义固定链接
- [x] 可选的密码保护文章，并明确静态站点加密的安全边界

### 📱 特色页面

- [x] **追番页面** - 使用本地数据、Bangumi 或 Bilibili 追踪动画
- [x] **友链页面** - 使用卡片和标签展示友链
- [x] **日记页面** - 分享带有文字、图片、位置、心情和标签的动态
- [x] **相册页面** - 管理本地或外部相册，并支持可选加密
- [x] **项目、技能、设备和时间线页面** - 展示结构化个人数据
- [x] **AI 工具页面** - 维护可筛选的工具目录
- [x] **归档和关于页面** - 浏览文章或发布自定义介绍

### 🛠 技术特性

- [x] **增强代码块**，基于 [Expressive Code](https://expressive-code.com/)
- [x] **数学公式**，使用 KaTeX，并支持 Mermaid 和 PlantUML 图表
- [x] **图片增强**，包括响应式尺寸、自动网格和 Fancybox 灯箱
- [x] **SEO 优化**，包括站点地图、robots.txt、RSS、Atom 和可选 Open Graph 图片
- [x] **性能优化**，懒加载和缓存机制
- [x] **评论系统**，支持 Twikoo 或 Giscus
- [x] **音乐播放器**，支持本地和 Meting 模式
- [x] **Live2D 看板娘**，通过 Pio 实现

## 🚀 快速开始

### 📦 安装

1. **克隆仓库：**

   ```bash
   git clone https://github.com/LyraVoid/Mizuki.git
   cd Mizuki
   ```

2. **安装依赖：**

   ```bash
   # 启用项目声明的包管理器版本
   corepack enable

   # 安装项目依赖
   pnpm install
   ```

3. **配置博客（可选）：**
   - 如果只使用本地内容，请在项目根目录 `.env` 中设置 `ENABLE_CONTENT_SYNC=false`。
   - 编辑 `src/config/siteConfig.ts` 和 `src/config/` 下的其他模块自定义站点。
   - 至少将 `siteURL` 替换为部署后的公开网址。

4. **启动开发服务器：**
   ```bash
   pnpm dev
   ```
   博客将在 `http://localhost:3000` 可用

### 📝 内容管理

- **创建文章：** `pnpm new-post -- <文件名>`，支持 `.md` 和 `.mdx`。
- **编辑文章：** 修改 `src/content/posts/` 中的文件。
- **编辑关于页或友链页内容：** 修改 `src/content/spec/` 中对应的文件。
- **编辑结构化页面数据：** 修改 `src/data/` 中对应的文件。
- **添加文章本地图片：** 将图片放在文章旁边，并使用 `./cover.webp` 这样的相对路径。
- **添加公共图片：** 放在 `public/` 下，并使用 `/images/example.webp` 这样的根路径。

> **发布前注意：** 仓库中包含示例文章、页面数据、相册和图片。部署个人站点前请删除或替换这些示例内容。

### 🚀 部署

将博客部署到任何静态托管平台：

- **Vercel：** 连接 GitHub 仓库到 Vercel
- **Netlify：** 直接从 GitHub 部署
- **GitHub Pages：** 使用包含的 GitHub Actions 工作流
- **Cloudflare Pages：** 连接您的仓库

- **环境变量配置（可选）：** 可参照 `.env.example` 来配置

部署前，请在 `src/config/siteConfig.ts` 中更新 `siteURL`。不要将 `.env` 或凭据提交到 Git；托管构建请在平台的环境变量设置中配置。

`.env.example` 中还包含 Bilibili 会话数据和 IndexNow 凭据等可选配置。只在需要时设置，并放在本地环境或托管平台 Secret 中，切勿提交真实值。

## 📝 内容编写

文章使用 `src/content/posts/` 下的 `.md` 或 `.mdx` 文件，`title` 和 `published` 是必填的 frontmatter 字段。可选字段支持摘要、图片、标签、分类、草稿、置顶、评论、别名、固定链接、署名和浏览器端加密。

Markdown 和 MDX 支持提示框、KaTeX 数学公式、Expressive Code、Mermaid、PlantUML、GitHub 卡片、Wiki Link、剧透、响应式图片、图片网格、Fancybox 灯箱和 HTML 嵌入。加密文章不会进入 RSS 和 Atom，但浏览器端加密不是服务端访问控制。

PlantUML 默认使用 `src/config/markdownConfig.ts` 中配置的公共服务器，请勿在图表中写入密码、Token 或隐私数据。

完整字段表、写作语法、图片规则、图表、视频嵌入、加密限制和发布清单请参阅[内容编写指南](docs/CONTENT_AUTHORING.zh.md)。

## ⚡ 命令

所有命令都在项目根目录运行：

| 命令 | 操作 |
| :--- | :--- |
| `pnpm install` | 安装依赖。 |
| `pnpm dev` | 在 `http://localhost:3000` 启动开发服务器。 |
| `pnpm build` | 构建 `./dist/`、生成搜索数据并执行构建检查。 |
| `pnpm preview` | 在部署前预览生产构建。 |
| `pnpm run check` | 运行 Astro 诊断。 |
| `pnpm run type-check` | 运行 TypeScript 类型检查。 |
| `pnpm test` | 运行 Markdown、布局、图片、音乐和加密测试。 |
| `pnpm run format` | 使用 Biome 格式化源文件。 |
| `pnpm run lint` | 使用 Biome 检查并自动修复源文件。 |
| `pnpm new-post -- <文件名>` | 创建 Markdown 或 MDX 文章。 |
| `pnpm run sync-content` | 同步可选的外部内容仓库。 |
| `pnpm run init-content` | 交互式初始化外部内容同步。 |
| `pnpm astro ...` | 运行 Astro CLI 命令。 |

## 🎯 配置指南

### 🔧 基础配置

配置已拆分到 `src/config/` 下的多个模块，`src/config/index.ts` 是统一导出入口。主要站点设置位于 `src/config/siteConfig.ts`：

```typescript
export const siteConfig: SiteConfig = {
  title: "您的博客名称",
  subtitle: "您的博客描述",
  siteURL: "https://example.com/", // 保留结尾斜杠
  lang: "zh_CN", // 例如 "en"、"ja" 或 "zh_TW"
  timeZone: "Asia/Shanghai", // 任意有效的 IANA 时区
  themeColor: {
    hue: 210, // 0–360
    fixed: false, // 为 true 时隐藏访客的主题色选择器
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
  // 其余字段请保留模板默认值。
};
```

其他常用配置文件：

- `src/config/navBarConfig.ts` — 导航链接和菜单。
- `src/config/profileConfig.ts` — 头像、名称、简介和社交链接。
- `src/config/sidebarConfig.ts` — 侧边栏组件、顺序、位置和响应式行为。
- `src/config/backgroundWallpaper.ts` 与 `src/config/effectsConfig.ts` — 壁纸和视觉特效。
- `src/config/commentConfig.ts` — Twikoo 或 Giscus 全局设置。评论默认关闭；使用前请设置 `enable: true` 并配置对应服务。
- `src/config/musicConfig.ts` — 音乐播放器模式和歌单来源。
- `src/config/markdownConfig.ts` — Wiki Link、自动图片网格和 PlantUML。
- `src/config/permalinkConfig.ts` — 可选的全局固定链接格式。
- `src/config/expressiveCodeConfig.ts` — 代码块主题和行为。

### 📱 特色页面内容

页面开关由 `siteConfig.featurePages` 控制。页面内容与页面模板分离：

| 页面 | 内容或数据来源 |
| :--- | :--- |
| 关于 | `src/content/spec/about.md` |
| 友链 | `src/content/spec/friends.md` 和 `src/data/friends.ts` |
| 追番 | `src/config/siteConfig.ts` 设置数据源模式；本地数据在 `src/data/anime.ts` |
| 日记 | `src/data/diary.ts`，或在 `diaryApiUrl` 中配置 Memos 地址 |
| 相册 | `public/images/albums/`；每个本地相册使用 `info.json` |
| 项目 | `src/data/projects.ts` |
| 技能 | `src/data/skills.ts` |
| 设备 | `src/data/devices.ts` |
| 时间线 | `src/data/timeline.ts` |
| AI 工具 | `src/data/ai-tools.ts` |

不要为了修改页面内容而直接编辑 `src/pages/*.astro`；这些文件负责布局和渲染逻辑。

### 📦 代码内容分离 (可选)

Mizuki 可以将主题代码和博客内容分成两个仓库，适用于私有内容、独立版本管理或团队协作，但这是可选功能。

**快速选择**:

| 使用场景 | 配置方式 | 内容位置 |
| :--- | :--- | :--- |
| **本地内容** | `ENABLE_CONTENT_SYNC=false` | `src/content/`、`src/data/` 和 `public/images/` |
| **外部内容仓库** | `ENABLE_CONTENT_SYNC=true` 且设置 `CONTENT_REPO_URL=...` | 同步到上述路径的独立仓库 |

**一键启用/禁用**:

```bash
# 本地内容模式（推荐入门使用）
# 在 .env 中显式关闭同步
ENABLE_CONTENT_SYNC=false
pnpm dev

# 外部内容仓库模式
# 1. 复制配置示例
cp .env.example .env

# 2. 编辑 .env
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git
# CONTENT_DIR=./content  # 可选，默认值即为此路径

# 3. 同步内容并启动站点
pnpm run sync-content
pnpm dev
```

外部内容仓库可以使用以下结构：

```text
Mizuki-Content/
├── posts/       # .md 和 .mdx 文章
├── spec/        # 关于页、友链页等 Markdown 内容
├── data/        # 项目、技能等结构化页面数据
└── images/      # 公共图片，包括相册和文章资源
```

同步脚本会将这些目录映射到 `src/content/posts/`、`src/content/spec/`、`src/data/` 和 `public/images/`。`src/data/ai-tools.ts` 属于代码仓库，会在同步时受到保护。

> **同步警告：** 启用 `ENABLE_CONTENT_SYNC` 后，`pnpm dev` 和 `pnpm build` 会自动执行同步钩子。如果 `CONTENT_DIR` 已经是 Git 仓库，同步脚本会 fetch 并重置到远程 `main` 或 `master` 分支；它还可能将现有运行时目录备份为 `.backup`、创建目录联接或复制文件，并在代码仓库中提交同步结果。执行前请提交或备份本地内容修改，不要直接编辑同步目标文件。

私有仓库可以使用 SSH URL，或通过部署平台配置凭据。不要将 Token 写入 `.env` 并提交，也不要将 Token 放进公开仓库 URL。

📖 **详细配置：** [内容分离完整指南](docs/CONTENT_SEPARATION.md)

🔄 **迁移教程：** [从单仓库迁移到分离模式](docs/MIGRATION_GUIDE.md)

🚀 **部署指南：** [部署指南](docs/DEPLOYMENT.md)

📚 **更多文档：** [文档索引](docs/README.md)

## ✏️ 贡献

我们欢迎贡献！请随时提交问题和拉取请求。

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开拉取请求

## 📄 许可证

本项目基于 Apache 许可证 2.0 - 查看 [LICENSE](LICENSE) 文件了解详情。

### 原始项目许可证

本项目基于 [Fuwari](https://github.com/saicaca/fuwari) 开发，该项目使用 MIT 许可证。根据 MIT 许可证要求，原始版权声明和许可声明已包含在 LICENSE.MIT 文件中。

### 第三方软件声明

Markdown 增强功能的部分实现基于 [Firefly](https://github.com/CuteLeaf/Firefly) 的 MIT 许可代码改写。原始版权声明与完整许可证文本保留在 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) 中。

## 🙏 致谢

- 基于原始 [Fuwari](https://github.com/saicaca/fuwari) 模板
- 灵感来源于 [Yukina](https://github.com/WhitePaper233/yukina) - 一个美丽优雅的博客模板
- 部分设计灵感来源于 [Firefly](https://github.com/CuteLeaf/Firefly) 和 [Twilight](https://github.com/spr-aachen/Twilight) 模板
- 使用 [Pio](https://github.com/Dreamer-Paul/Pio) 实现可爱的 Live2D 看板娘插件
- 使用 [Astro](https://astro.build) 和 [Tailwind CSS](https://tailwindcss.com) 构建
- 图标来自 [Iconify](https://iconify.design/)

### 🌸 特别感谢

- **[Fuwari](https://github.com/saicaca/fuwari)** by saicaca - 本项目所基于的原始模板。感谢您创建了如此漂亮且功能强大的模板。
- **[Yukina](https://github.com/WhitePaper233/yukina)** - 感谢提供设计灵感和创意，帮助塑造了这个项目。Yukina 是一个优雅的博客模板，展现了出色的设计原则和用户体验。
- **[Firefly](https://github.com/CuteLeaf/Firefly)** - 感谢提供优秀的布局设计思路，双侧边栏布局、文章双列网格等布局，及部分小组件的设计与实现，让 Mizuki 的界面更加丰富。
- **[Twilight](https://github.com/spr-aachen/Twilight)** - 感谢提供灵感和技术支持。Twilight 的动态壁纸模式切换系统、响应式设计和过渡效果显著提升了 Mizuki 的使用体验。

## 🍀 贡献者

感谢以下贡献者对本项目做出的贡献，如有问题或建议，请提交 [Issue](https://github.com/LyraVoid/Mizuki/issues) 或 [Pull Request](https://github.com/LyraVoid/Mizuki/pulls)。

<a href="https://github.com/LyraVoid/Mizuki/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=LyraVoid/Mizuki" />
</a>

## ⭐ Star History

## [![Star History Chart](https://star-history.dera.page/svg?repos=LyraVoid/Mizuki&type=Date)](https://star-history.dera.page/#LyraVoid/Mizuki&Date)

⭐ 如果您觉得这个项目有帮助，请考虑给它一个星标!
