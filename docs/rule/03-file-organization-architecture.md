# 文件组织架构规范

## 概述

本文档定义了 Mizuki 项目的文件组织架构，确保代码结构清晰、模块化、易于维护。

## 核心原则

### 1. 按功能分层

目录应该按照功能和职责进行分层，而非按技术类型。

**❌ 错误示例**：
```
src/
├── astro/              # 按 .astro 文件分组
├── svelte/            # 按 .svelte 文件分组
└── typescript/         # 按 .ts 文件分组
```

**✅ 正确示例**：
```
src/
├── components/         # 按 UI 功能分组
├── utils/              # 按工具功能分组
├── types/              # 按类型定义分组
└── layouts/            # 按布局功能分组
```

### 2. 按职责分离

每个目录应该有明确的职责范围，避免职责重叠。

**❌ 错误示例**：
```
src/
├── components/
│   ├── widgets/      # Widget 组件
│   └── misc/        # 杂项组件（职责不明确）
└── helpers/            # 工具函数
    └── widget/      # Widget 工具（职责重复）
```

**✅ 正确示例**：
```
src/
├── components/
│   ├── atoms/        # 原子 UI 组件
│   ├── molecules/     # 分子 UI 组件
│   ├── organisms/     # 有机体 UI 组件
│   ├── widgets/       # 侧边栏小部件
│   └── features/      # 功能性组件
└── utils/              # 工具函数（统一定义）
```

### 3. 扁平化结构

避免过深的嵌套层级，保持结构扁平化。

**❌ 错误示例**：
```
src/components/widgets/sidebar/primary/left/
```

**✅ 正确示例**：
```
src/components/widgets/
```

### 4. 一致性

使用统一的命名和组织模式。

**示例**：
- 所有组件目录都包含 `atoms/`、`molecules/`、`organisms/`
- 所有复杂组件都包含 `hooks/`、`types.ts`
- 所有工具函数都按功能分类

## 目录结构规范

### 完整的目录树

```
Mizuki/
├── src/                           # 源代码目录
│   ├── components/              # 组件目录
│   │   ├── atoms/            # 原子组件（基础 UI 元素）
│   │   │   ├── Button.astro
│   │   │   ├── Card.astro
│   │   │   ├── Input.astro
│   │   │   ├── Badge.astro
│   │   │   ├── Chip.astro
│   │   │   ├── Avatar.astro
│   │   │   ├── Icon.astro
│   │   │   ├── Modal.astro
│   │   │   └── Tabs.astro
│   │   │
│   │   ├── molecules/         # 分子组件（由原子组件组合）
│   │   │   ├── SearchBar.astro
│   │   │   ├── Pagination.astro
│   │   │   ├── DropdownMenu.astro
│   │   │   ├── FormItem.astro
│   │   │   └── ChipCloud.astro
│   │   │
│   │   ├── organisms/         # 有机体组件（复杂业务组件）
│   │   │   ├── Navbar.astro
│   │   │   ├── Sidebar.astro
│   │   │   ├── Footer.astro
│   │   │   ├── MusicPlayer/       # 复杂组件的子目录
│   │   │   │   ├── MusicPlayer.astro
│   │   │   │   ├── MiniPlayer.svelte
│   │   │   │   ├── ExpandedPlayer.svelte
│   │   │   │   ├── controls/
│   │   │   │   ├── hooks/
│   │   │   │   └── types.ts
│   │   │   ├── Calendar/          # 复杂组件的子目录
│   │   │   │   ├── Calendar.astro
│   │   │   │   ├── CalendarGrid.svelte
│   │   │   │   ├── CalendarHeader.svelte
│   │   │   │   ├── hooks/
│   │   │   │   └── utils/
│   │   │   └── TOC/
│   │   │
│   │   ├── widgets/           # 侧边栏小部件
│   │   │   ├── Profile.astro
│   │   │   ├── Calendar.astro
│   │   │   ├── Categories.astro
│   │   │   ├── Tags.astro
│   │   │   ├── SiteStats.astro
│   │   │   ├── Announcement.astro
│   │   │   └── common/          # 通用小部件组件
│   │   │       ├── WidgetLayout.astro
│   │   │       └── WidgetHeader.astro
│   │   │
│   │   ├── features/          # 功能性组件
│   │   │   ├── comment/          # 评论功能
│   │   │   ├── search/           # 搜索功能
│   │   │   ├── protection/       # 密码保护
│   │   │   └── media/            # 媒体相关
│   │   │
│   │   ├── layouts/          # 布局组件
│   │   │   ├── MainLayout.astro
│   │   │   ├── PostLayout.astro
│   │   │   └── PageLayout.astro
│   │   │
│   │   └── misc/             # 杂项组件（待整理）
│   │
│   ├── layouts/               # 页面布局
│   │   ├── Layout.astro
│   │   └── BlogPost.astro
│   │
│   ├── pages/                # 页面路由
│   │   ├── index.astro
│   │   ├── posts/
│   │   │   ├── [slug].astro
│   │   │   └── index.astro
│   │   ├── albums/
│   │   ├── friends/
│   │   ├── projects/
│   │   ├── skills/
│   │   └── api/
│   │
│   ├── utils/                # 工具函数
│   │   ├── content-utils.ts
│   │   ├── date-utils.ts
│   │   ├── url-utils.ts
│   │   ├── string-utils.ts
│   │   └── widgetManager.ts
│   │
│   ├── types/                # 类型定义
│   │   ├── config.ts
│   │   └── api.ts
│   │
│   ├── constants/            # 常量
│   │   ├── index.ts
│   │   ├── theme.ts
│   │   └── routes.ts
│   │
│   ├── assets/               # 静态资源
│   │   ├── images/
│   │   │   ├── home/
│   │   │   └── icons/
│   │   ├── fonts/
│   │   └── styles/
│   │
│   ├── styles/               # 全局样式
│   │   ├── global.css
│   │   ├── theme.css
│   │   └── components.css
│   │
│   ├── i18n/                # 国际化
│   │   ├── i18nKey.ts
│   │   ├── translation.ts
│   │   └── languages/
│   │       ├── zh-CN.ts
│   │       ├── en.ts
│   │       └── ja.ts
│   │
│   ├── data/                # 数据文件
│   │   ├── friends.ts
│   │   └── projects.ts
│   │
│   ├── scripts/              # 脚本文件
│   │   ├── build.ts
│   │   └── deploy.ts
│   │
│   ├── plugins/              # Astro 插件
│   │   └── expressive-code/
│   │
│   ├── config.ts             # 主配置文件
│   ├── content.config.ts    # 内容集合配置
│   ├── env.d.ts             # 环境类型定义
│   └── global.d.ts          # 全局类型定义
│
├── public/                       # 公共静态文件
│   ├── assets/              # 静态资源
│   │   ├── images/
│   │   ├── fonts/
│   │   └── icons/
│   ├── favicon.ico
│   └── robots.txt
│
├── docs/                         # 项目文档
│   ├── README.md
│   ├── rule/               # 开发规范
│   │   ├── README.md
│   │   ├── 01-component-architecture.md
│   │   ├── 02-component-split-guide.md
│   │   ├── 03-file-organization-architecture.md
│   │   └── IMPLEMENTATION_SUMMARY.md
│   └── image/              # 文档图片
│
├── demo/                         # 参考示例
│   └── Aruma/             # Aruma 主题参考
│
├── scripts/                      # 构建和部署脚本
│   ├── build.sh
│   └── deploy.sh
│
├── .vscode/                      # VS Code 配置
│   └── settings.json
│
├── .github/                      # GitHub 配置
│   └── workflows/
│       └── ci.yml
│
├── astro.config.mjs             # Astro 配置
├── tailwind.config.cjs           # Tailwind 配置
├── tsconfig.json                # TypeScript 配置
├── svelte.config.js             # Svelte 配置
├── package.json                 # 依赖管理
├── pnpm-lock.yaml              # 依赖锁定
├── pnpm-workspace.yaml        # PNPM 工作区
├── .env.example                 # 环境变量示例
├── .gitignore                   # Git 忽略文件
├── .prettierrc                 # Prettier 配置
├── .prettierignore              # Prettier 忽略文件
├── README.md                    # 项目说明
├── LICENSE                      # 许可证
└── _frontmatter.json            # Frontmatter 默认值
```

## 目录职责说明

### src/components/ - 组件目录

#### atoms/ - 原子组件

**职责**：提供基础的、不可再分的 UI 元素。

**特点**：
- 职责单一
- 无业务逻辑
- 高度可复用
- 状态简单（< 3 个变量）

**包含文件**：
- `Button.astro` - 按钮
- `Card.astro` - 卡片容器
- `Input.astro` - 输入框
- `Badge.astro` - 徽章
- `Chip.astro` - Chip 标签
- `Avatar.astro` - 头像
- `Icon.astro` - 图标
- `Modal.astro` - 模态框
- `Tabs.astro` - 标签页

**使用场景**：
```astro
---
import Button from '../atoms/Button.astro'
import Input from '../atoms/Input.astro'
---

<form>
  <Input name="username" placeholder="用户名" />
  <Button variant="primary">提交</Button>
</form>
```

#### molecules/ - 分子组件

**职责**：由多个原子组件组合而成的小型功能组件。

**特点**：
- 包含 2-5 个原子组件
- 有简单的交互逻辑
- 仍然保持高度可复用性

**包含文件**：
- `SearchBar.astro` - 搜索栏（Input + Button）
- `Pagination.astro` - 分页（多个 Button）
- `DropdownMenu.astro` - 下拉菜单（Button + Card）
- `FormItem.astro` - 表单项（Label + Input + Error）
- `ChipCloud.astro` - 标签云（多个 Chip）

**使用场景**：
```astro
---
import SearchBar from '../molecules/SearchBar.astro'
---

<SearchBar
  placeholder="搜索文章..."
  onSearch={(query) => navigate(`/search?q=${query}`)}
/>
```

#### organisms/ - 有机体组件

**职责**：复杂的业务组件，由多个分子组件和原子组件组合。

**特点**：
- 包含复杂的业务逻辑
- 可能有多个子组件
- 专门用于特定的页面或功能
- 可能需要拆分为子目录

**包含文件**：
- `Navbar.astro` - 导航栏
- `Sidebar.astro` - 侧边栏
- `Footer.astro` - 页脚
- `MusicPlayer/` - 音乐播放器（复杂组件）
- `Calendar/` - 日历（复杂组件）
- `TOC/` - 目录

**复杂组件的子目录结构**：
```
MusicPlayer/
├── MusicPlayer.astro        # 主容器（组合层）
├── MiniPlayer.svelte        # 迷你播放器 UI
├── ExpandedPlayer.svelte    # 展开播放器 UI
├── PlaylistPanel.svelte      # 播放列表 UI
├── controls/               # 控制组件
│   ├── PlayControls.svelte
│   ├── ProgressBar.svelte
│   └── VolumeControl.svelte
├── hooks/                 # 相关 Hooks
│   ├── useAudio.ts
│   ├── usePlaylist.ts
│   └── useVolume.ts
├── types.ts               # 类型定义
└── utils/                 # 工具函数
```

#### widgets/ - 侧边栏小部件

**职责**：侧边栏的小功能模块。

**特点**：
- 相对独立的功能模块
- 可配置的显示位置
- 统一的 UI 风格
- 使用通用容器组件

**包含文件**：
- `Profile.astro` - 个人资料
- `Calendar.astro` - 日历
- `Categories.astro` - 分类
- `Tags.astro` - 标签
- `SiteStats.astro` - 站点统计
- `Announcement.astro` - 公告
- `common/` - 通用小部件组件
  - `WidgetLayout.astro` - 通用小部件容器
  - `WidgetHeader.astro` - 通用小部件头部

**使用场景**：
```astro
---
import WidgetLayout from './common/WidgetLayout.astro'
import ChipCloud from '../molecules/ChipCloud.astro'

const categories = await getCategories()
---

<WidgetLayout name="分类" icon="material-symbols:category">
  <ChipCloud items={categories} hrefPrefix="/category/" />
</WidgetLayout>
```

#### features/ - 功能性组件

**职责**：特定功能的组件集合。

**子目录**：
- `comment/` - 评论相关
  - `Twikoo.astro`
  - `index.astro`
- `search/` - 搜索相关
  - `Search.svelte`
  - `SearchModal.astro`
- `protection/` - 密码保护
  - `PasswordProtection.astro`
  - `EncryptionService.ts`
- `media/` - 媒体相关
  - `MusicPlayer.svelte`
  - `ImageGallery.astro`

#### layouts/ - 布局组件

**职责**：页面级别的布局组件。

**包含文件**：
- `MainLayout.astro` - 主布局
- `PostLayout.astro` - 文章布局
- `PageLayout.astro` - 页面布局

#### misc/ - 杂项组件

**职责**：不符合上述分类的临时组件。

**说明**：此目录用于存放待整理的组件，应该逐步迁移到合适的分类。

**包含文件**：
- `AnimationTest.astro`
- `FullscreenWallpaper.astro`
- `ImageWrapper.astro`
- `Markdown.astro`
- `SharePoster.svelte`

**迁移目标**：
- `AnimationTest.astro` → 删除或移到 `organisms/`
- `FullscreenWallpaper.astro` → `features/media/`
- `ImageWrapper.astro` → `atoms/`
- `Markdown.astro` → `organisms/` 或 `features/media/`
- `SharePoster.svelte` → `features/media/`

### src/layouts/ - 页面布局

**职责**：定义页面的整体结构。

**包含文件**：
- `Layout.astro` - 主布局（所有页面共享）
- `BlogPost.astro` - 文章页面布局

**使用场景**：
```astro
---
import MainLayout from '../layouts/Layout.astro'
---

<MainLayout title="文章标题">
  <article>
    <!-- 文章内容 -->
  </article>
</MainLayout>
```

### src/pages/ - 页面路由

**职责**：定义页面的路由结构。

**组织方式**：
- 按功能分组（posts、albums、friends 等）
- 使用 `[slug]` 等动态路由
- `api/` 子目录用于 API 路由

**目录结构**：
```
pages/
├── index.astro              # 首页
├── posts/                  # 文章页面
│   ├── index.astro         # 文章列表
│   └── [slug].astro       # 文章详情（动态路由）
├── albums/                 # 相册页面
│   ├── index.astro         # 相册列表
│   └── [id].astro          # 相册详情
├── friends/                # 友链页面
│   └── index.astro
├── projects/               # 项目页面
│   └── index.astro
├── skills/                 # 技能页面
│   └── index.astro
├── api/                    # API 路由
│   ├── search.ts
│   └── sitemap.xml.ts
└── [...slug].astro          # 404 页面
```

### src/utils/ - 工具函数

**职责**：提供可复用的工具函数。

**包含文件**：
- `content-utils.ts` - 内容相关工具
- `date-utils.ts` - 日期相关工具
- `url-utils.ts` - URL 相关工具
- `string-utils.ts` - 字符串相关工具
- `widgetManager.ts` - Widget 管理器

**命名规范**：
- 按功能分类（content、date、url 等）
- 使用 `*-utils.ts` 后缀
- 导出时使用命名空间避免冲突

**示例**：
```typescript
// content-utils.ts
export async function getCategories() { }
export async function getTags() { }
export async function getPosts() { }

// 使用时
import { getCategories, getTags, getPosts } from '@/utils/content-utils'
```

### src/types/ - 类型定义

**职责**：集中管理 TypeScript 类型定义。

**包含文件**：
- `config.ts` - 配置类型
- `api.ts` - API 类型
- `components.ts` - 组件 Props 类型（可选）

**示例**：
```typescript
// types/config.ts
export interface SiteConfig {
  title: string
  subtitle: string
  siteURL: string
  themeColor: ThemeColorConfig
  // ...
}

export interface ThemeColorConfig {
  hue: number
  fixed: boolean
}
```

### src/constants/ - 常量

**职责**：集中管理常量。

**包含文件**：
- `index.ts` - 主常量导出
- `theme.ts` - 主题相关常量
- `routes.ts` - 路由常量

**示例**：
```typescript
// constants/routes.ts
export const ROUTES = {
  HOME: '/',
  POSTS: '/posts',
  ALBUMS: '/albums',
  FRIENDS: '/friends',
} as const

// 使用时
import { ROUTES } from '@/constants/routes'
navigate(ROUTES.POSTS)
```

### src/assets/ - 静态资源

**职责**：存放源代码中的静态资源。

**子目录**：
- `images/` - 图片
  - `home/` - 首页图片
  - `icons/` - 图标
- `fonts/` - 字体文件
- `styles/` - 样式文件（如全局 CSS）

**注意**：构建时会复制到 `public/` 目录。

### src/styles/ - 全局样式

**职责**：定义全局样式和主题。

**包含文件**：
- `global.css` - 全局样式
- `theme.css` - 主题样式
- `components.css` - 组件样式（可选）

**使用场景**：
```astro
---
import '../styles/global.css'
import '../styles/theme.css'
---

<html>
  <head>
    <link rel="stylesheet" href="/styles/theme.css" />
  </head>
</html>
```

### src/i18n/ - 国际化

**职责**：管理多语言支持。

**包含文件**：
- `i18nKey.ts` - i18n 键定义
- `translation.ts` - i18n 核心函数
- `languages/` - 语言文件
  - `zh-CN.ts` - 简体中文
  - `en.ts` - 英文
  - `ja.ts` - 日文

**使用场景**：
```typescript
import { i18n } from '@/i18n/translation'
import I18nKey from '@/i18n/i18nKey'

const title = i18n(I18nKey.homePage)
```

### src/data/ - 数据文件

**职责**：存放静态数据文件。

**包含文件**：
- `friends.ts` - 友链数据
- `projects.ts` - 项目数据
- `skills.ts` - 技能数据

**示例**：
```typescript
// data/friends.ts
export interface Friend {
  name: string
  url: string
  avatar: string
  description: string
}

export const friends: Friend[] = [
  {
    name: 'Friend Name',
    url: 'https://example.com',
    avatar: '/assets/friends/avatar.png',
    description: 'Description'
  }
]
```

## 文件命名规范

### 组件文件

#### Astro 组件

**格式**：`PascalCase.astro`

**示例**：
- `Button.astro`
- `SearchBar.astro`
- `MusicPlayer.astro`

**功能模块后缀**：
- `SearchModule.astro` - 搜索功能模块
- `QRCodeModule.astro` - 二维码功能模块

**容器组件后缀**：
- `SidebarContainer.astro` - 侧边栏容器
- `WidgetContainer.astro` - Widget 容器

#### Svelte 组件

**格式**：`PascalCase.svelte`

**示例**：
- `MusicPlayer.svelte`
- `ChipCloud.svelte`
- `ProfileCard.svelte`

### 工具函数文件

**格式**：`[功能]-utils.ts`

**示例**：
- `content-utils.ts`
- `date-utils.ts`
- `url-utils.ts`
- `string-utils.ts`

### 类型定义文件

**格式**：`[主题].ts`

**示例**：
- `config.ts` - 配置类型
- `api.ts` - API 类型
- `components.ts` - 组件类型

### 常量文件

**格式**：`[主题].ts`

**示例**：
- `theme.ts` - 主题常量
- `routes.ts` - 路由常量
- `api.ts` - API 端点常量

### 页面文件

#### 静态路由

**格式**：`[name].astro`

**示例**：
- `index.astro` - 首页
- `about.astro` - 关于页面
- `contact.astro` - 联系页面

#### 动态路由

**格式**：`[param].astro`

**示例**：
- `[slug].astro` - 文章详情
- `[id].astro` - 相册详情

#### 集合路由

**格式**：`[...catch-all].astro`

**示例**：
- `[...slug].astro` - 404 页面
- `[...path].astro` - 动态路径匹配

### 样式文件

**格式**：`[主题].css`

**示例**：
- `global.css` - 全局样式
- `theme.css` - 主题样式
- `components.css` - 组件样式

### 脚本文件

**格式**：`[功能].[ext]`

**示例**：
- `build.ts` - 构建脚本
- `deploy.sh` - 部署脚本
- `setup.ts` - 初始化脚本

### 文档文件

**格式**：`[主题].md`

**示例**：
- `README.md` - 项目说明
- `CONTRIBUTING.md` - 贡献指南
- `ARCHITECTURE.md` - 架构文档

### 配置文件

**格式**：`[工具].config.[ext]`

**示例**：
- `astro.config.mjs` - Astro 配置
- `tailwind.config.cjs` - Tailwind 配置
- `tsconfig.json` - TypeScript 配置

## 模块化组织原则

### 1. 单一职责

每个模块（文件或目录）应该只有一个明确的职责。

**示例**：

✅ **正确**：
```typescript
// content-utils.ts - 只负责内容相关工具
export function getPosts() { }
export function getCategories() { }
export function getTags() { }
```

❌ **错误**：
```typescript
// utils.ts - 职责过多
export function getPosts() { }        // 内容相关
export function formatDate() { }        // 日期相关
export function buildUrl() { }          // URL 相关
export function validateEmail() { }      // 验证相关
```

### 2. 按功能分组

相关的功能应该组织在同一个目录下。

**示例**：

✅ **正确**：
```
src/components/features/
├── comment/              # 评论功能
│   ├── Twikoo.astro
│   └── index.astro
├── search/               # 搜索功能
│   ├── Search.svelte
│   └── SearchModal.astro
└── protection/           # 保护功能
    ├── PasswordProtection.astro
    └── EncryptionService.ts
```

❌ **错误**：
```
src/components/
├── Twikoo.astro          # 评论组件
├── Search.svelte          # 搜索组件
├── PasswordProtection.astro # 保护组件
└── EncryptionService.ts   # 服务
```

### 3. 避免循环依赖

模块之间应该避免循环依赖。

**示例**：

❌ **错误**：
```typescript
// ModuleA.ts
import { something } from './ModuleB'

// ModuleB.ts
import { somethingElse } from './ModuleA'
```

✅ **正确**：
```typescript
// ModuleA.ts
import { Shared } from './Shared'

// ModuleB.ts
import { Shared } from './Shared'
```

### 4. 清晰的导出接口

模块应该提供清晰的导出接口。

**示例**：

✅ **正确**：
```typescript
// content-utils.ts
export interface Post {
  id: string
  title: string
  slug: string
}

export async function getPosts(): Promise<Post[]> { }
export async function getPost(id: string): Promise<Post> { }
```

✅ **正确（默认导出）**：
```typescript
// widgetManager.ts
export default class WidgetManager { }
export { WidgetManager }
```

### 5. 命名空间组织

避免命名冲突，使用命名空间。

**示例**：

✅ **正确**：
```typescript
// content-utils.ts
export const getPosts = () => { }

// date-utils.ts
export const formatDate = () => { }

// 使用
import { getPosts } from '@/utils/content-utils'
import { formatDate } from '@/utils/date-utils'
```

❌ **错误**：
```typescript
// utils.ts
export const getPosts = () => { }        // 冲突
export const formatDate = () => { }      // 冲突
export const formatUrl = () => { }        // 冲突
```

## 文件依赖管理

### 1. 使用绝对路径导入

推荐使用绝对路径（@ 别名）导入，提高可维护性。

**tsconfig.json 配置**：
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@utils/*": ["./src/utils/*"],
      "@types/*": ["./src/types/*"],
      "@constants/*": ["./src/constants/*"]
    }
  }
}
```

**使用示例**：
```astro
---
// ✅ 正确：使用绝对路径
import Button from '@components/atoms/Button.astro'
import { getPosts } from '@utils/content-utils'
import { ROUTES } from '@constants/routes'
---

// ❌ 错误：使用相对路径
import Button from '../../components/atoms/Button.astro'
import { getPosts } from '../utils/content-utils'
import { ROUTES } from '../constants/routes'
---
```

### 2. 按层次导入

按照依赖层次导入，避免混乱。

**导入顺序**：
1. 外部库
2. 内部库
3. 组件
4. 工具函数
5. 类型
6. 常量

**示例**：
```astro
---
// 1. 外部库
import { getCollection } from 'astro:content'
import { Icon } from 'astro-icon/components'

// 2. 内部库
import I18nKey from '@i18n/i18nKey'
import { i18n } from '@i18n/translation'

// 3. 组件
import Button from '@components/atoms/Button.astro'
import Card from '@components/atoms/Card.astro'

// 4. 工具函数
import { getPosts } from '@utils/content-utils'
import { formatDate } from '@utils/date-utils'

// 5. 类型
import type { Post } from '@types/config'

// 6. 常量
import { ROUTES } from '@constants/routes'
---
```

### 3. 避免深度嵌套导入

导入路径不应过深。

**示例**：

❌ **错误**：
```astro
---
import Button from '../../../components/atoms/Button.astro'
import { getPosts } from '../../utils/content-utils'
---
```

✅ **正确**：
```astro
---
import Button from '@components/atoms/Button.astro'
import { getPosts } from '@utils/content-utils'
---
```

## 复杂组件的文件组织

### 超大型组件的子目录结构

当组件超过 300 行或包含多个子功能时，应该创建子目录。

**结构模板**：
```
ComponentName/
├── ComponentName.astro      # 主组件（组合层）
├── SubComponent1.svelte      # 子组件 1
├── SubComponent2.svelte      # 子组件 2
├── SubComponent3.svelte      # 子组件 3
├── controls/                 # 控制组件
│   ├── Control1.svelte
│   └── Control2.svelte
├── hooks/                   # 相关 Hooks
│   ├── useFeature1.ts
│   ├── useFeature2.ts
│   └── useFeature3.ts
├── utils/                   # 工具函数
│   └── helper.ts
├── types.ts                 # 类型定义
└── README.md                # 组件说明（可选）
```

### 实例：MusicPlayer

**目录结构**：
```
MusicPlayer/
├── MusicPlayer.astro          # 主容器（< 50 行）
├── MiniPlayer.svelte          # 迷你播放器（~150 行）
├── ExpandedPlayer.svelte      # 展开播放器（~200 行）
├── PlaylistPanel.svelte      # 播放列表（~120 行）
├── controls/                # 控制组件
│   ├── PlayControls.svelte    # 播放控制（~80 行）
│   ├── ProgressBar.svelte     # 进度条（~100 行）
│   └── VolumeControl.svelte  # 音量控制（~60 行）
├── hooks/                  # 相关 Hooks
│   ├── useAudio.ts           # 音频播放逻辑（~80 行）
│   ├── usePlaylist.ts        # 播放列表管理（~90 行）
│   └── useVolume.ts         # 音量控制逻辑（~50 行）
├── types.ts                # 类型定义（~40 行）
└── README.md               # 组件说明
```

**使用方式**：
```astro
---
import MusicPlayer from './MusicPlayer.astro'
---

<MusicPlayer client:visible />
```

### 实例：Calendar

**目录结构**：
```
Calendar/
├── Calendar.astro            # 主容器（< 50 行）
├── CalendarHeader.svelte     # 头部导航（~80 行）
├── CalendarGrid.svelte      # 日历网格（~150 行）
├── PostList.astro          # 文章列表（~100 行）
├── hooks/                  # 相关 Hooks
│   └── useCalendar.ts      # 日历逻辑（~120 行）
├── utils/                  # 工具函数
│   └── calendarUtils.ts    # 日期计算（~80 行）
├── types.ts                # 类型定义（~40 行）
└── README.md               # 组件说明
```

## 公共文件管理

### 1. 索引文件

使用 `index.ts` 作为公共导出接口。

**示例**：
```typescript
// components/atoms/index.ts
export { default as Button } from './Button.astro'
export { default as Card } from './Card.astro'
export { default as Input } from './Input.astro'

// 使用
import { Button, Card, Input } from '@components/atoms'
```

### 2. README 文件

为复杂目录添加 README 文件。

**示例**：
```markdown
# MusicPlayer 组件

音乐播放器组件，支持播放列表、音量控制、进度管理。

## 使用方法

```astro
<MusicPlayer
  playlist={playlist}
  autoplay={false}
/>
```

## Props

- `playlist`: 播放列表
- `autoplay`: 是否自动播放
```

### 3. 类型定义文件

为复杂组件集中定义类型。

**示例**：
```typescript
// MusicPlayer/types.ts
export interface Song {
  id: string
  title: string
  artist: string
  url: string
  duration: number
}

export interface Playlist {
  id: string
  name: string
  songs: Song[]
}

export interface MusicPlayerProps {
  playlist: Playlist
  autoplay?: boolean
}
```

## 与 Aruma 的对比

### 文件组织对比

| 方面 | Mizuki | Aruma | 改进建议 |
|------|--------|-------|----------|
| **组件分层** | ✅ 已实现 | ✅ 完整 | 继续完善 |
| **目录结构** | ⚠️ 混乱 | ✅ 清晰 | 重组目录 |
| **复杂组件** | ⚠️ 单文件 | ✅ 子目录 | 拆分超大型组件 |
| **工具函数** | ⚠️ 分散 | ✅ 统一 | 合并工具函数 |
| **类型定义** | ⚠️ 分散 | ✅ 集中 | 统一类型定义 |
| **文档** | ✅ 完善 | ✅ 完善 | 保持优势 |

### Aruma 的优秀实践

1. **清晰的组件分层**
   ```
   components/
   ├── admin/              # 管理后台
   ├── cards/              # 卡片组件
   ├── comment/            # 评论组件
   ├── layouts/            # 布局组件
   ├── svelte/             # Svelte 组件
   └── ui/                # UI 组件
   ```

2. **复杂组件的子目录**
   ```
   MusicPlayer.svelte → 
   MusicPlayer/
   ├── MusicPlayer.svelte
   ├── controls/
   ├── hooks/
   └── types.ts
   ```

3. **统一的工具函数**
   ```
   lib/
   ├── utils/
   └── types/
   ```

## 迁移指南

### 从当前结构迁移到新结构

#### 步骤 1：创建新目录

```bash
# 创建新的分层目录
mkdir -p src/components/{atoms,molecules,organisms}
mkdir -p src/components/widgets/common
mkdir -p src/components/features/{comment,search,protection,media}
mkdir -p src/components/layouts
```

#### 步骤 2：移动文件

```bash
# 移动原子组件
mv src/components/Button.astro src/components/atoms/
mv src/components/Card.astro src/components/atoms/
mv src/components/Input.astro src/components/atoms/

# 移动小部件
mv src/components/widget/* src/components/widgets/
mv src/components/widget/common src/components/widgets/common

# 移动功能组件
mv src/components/comment src/components/features/
mv src/components/control src/components/molecules/
```

#### 步骤 3：更新导入路径

```bash
# 查找所有导入
grep -r "from.*components" src/pages src/layouts

# 批量更新路径
# 使用编辑器或脚本批量替换
```

#### 步骤 4：测试

```bash
# 运行构建检查错误
pnpm run build

# 运行开发服务器测试
pnpm run dev

# 检查 Lint
pnpm run lint

# 检查类型
pnpm run typecheck
```

### 重构 Checklist

- [ ] 创建新的目录结构
- [ ] 移动文件到对应的分类
- [ ] 更新所有导入路径
- [ ] 重命名文件以符合命名规范
- [ ] 拆分超大型组件
- [ ] 合并重复的工具函数
- [ ] 统一类型定义
- [ ] 添加 README 文件
- [ ] 更新文档
- [ ] 运行测试验证

## 最佳实践

### 1. 定期整理

定期检查和整理文件结构，保持清晰。

**检查项**：
- 是否有过时的文件？
- 是否有重复的代码？
- 是否有职责不清的目录？
- 是否需要拆分大型组件？

### 2. 使用工具

使用工具辅助文件管理。

**推荐工具**：
- **目录树**：`tree src/`
- **文件搜索**：`find src/ -name "*.astro"`
- **代码统计**：`wc -l src/components/*.astro`
- **重复检测**：使用 IDE 插件

### 3. 文档同步

文件结构变更后及时更新文档。

**更新内容**：
- 目录结构图
- 使用示例
- 迁移指南

### 4. 代码审查

在代码审查时检查文件组织。

**审查要点**：
- [ ] 文件放在正确的目录
- [ ] 文件名符合命名规范
- [ ] 导入路径正确
- [ ] 没有循环依赖

## 常见问题

### Q1: 如何处理临时文件？

**A**：使用临时目录或添加 TODO 注释。

**示例**：
```typescript
// TODO: 迁移到 atoms/
// TODO: 拆分为子组件
```

### Q2: 何时拆分为子目录？

**A**：当组件满足以下条件时：
- 组件 > 300 行
- 有 3+ 个子功能
- 需要多个辅助文件

### Q3: 如何处理共享的组件？

**A**：使用公共目录或提取到更高层次。

**示例**：
```
src/components/
├── atoms/              # 共享的原子组件
├── widgets/common/      # 共享的 Widget 组件
└── organisms/          # 使用共享组件
```

### Q4: 如何命名相似功能的文件？

**A**：使用统一的前缀或后缀。

**示例**：
- `Calendar.astro` - 主组件
- `CalendarHeader.svelte` - 头部
- `CalendarGrid.svelte` - 网格
- `CalendarUtils.ts` - 工具函数

## 总结

良好的文件组织架构是项目成功的关键：

✅ **清晰的职责分离** - 每个目录有明确的职责
✅ **统一的命名规范** - 易于理解和导航
✅ **合理的依赖管理** - 避免循环依赖
✅ **模块化的组织** - 易于维护和扩展

遵循本规范可以：
1. 提高代码可读性
2. 减少维护成本
3. 提升开发效率
4. 降低新手上手难度

---

**最后更新**: 2026-03-17
**维护者**: Mizuki 开发团队

## 参考资源

- [组件架构设计规范](./01-component-architecture.md)
- [组件拆分指南](./02-component-split-guide.md)
- [Aruma 文件组织](../../demo/Aruma/docs/)
- [Astro 项目结构](https://docs.astro.build/zh-cn/core-concepts/project-structure/)
