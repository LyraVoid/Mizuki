/**
 * 配置统一导出入口
 *
 * ══════════════════════════════════════════════════════════════
 * 配置文件索引
 * ══════════════════════════════════════════════════════════════
 *
 * 导出名称                      │ 文件                       │ 说明
 * ─────────────────────────────┼────────────────────────────┼──────────────────────────────
 * siteConfig                    │ siteConfig.ts              │ 站点核心配置（标题、语言、主题色、横幅、字体、特色页面开关等）
 * SITE_LANG                     │ siteConfig.ts              │ 站点语言常量（从 siteConfig 中导出）
 * fullscreenWallpaperConfig     │ backgroundWallpaper.ts     │ 全屏壁纸模式配置（图片源、轮播、透明度、模糊）
 * navBarConfig                  │ navBarConfig.ts            │ 导航栏菜单配置（链接、多级下拉菜单）
 * profileConfig                 │ profileConfig.ts           │ 个人资料（头像、昵称、简介、社交链接）
 * licenseConfig                 │ licenseConfig.ts           │ 文章许可协议（CC 协议名称和链接）
 * permalinkConfig               │ permalinkConfig.ts         │ 固定链接配置（URL 格式模板）
 * expressiveCodeConfig          │ expressiveCodeConfig.ts    │ 代码块样式（主题、主题切换行为）
 * commentConfig                 │ commentConfig.ts           │ 评论系统（Twikoo / Giscus 配置）
 * shareConfig                   │ shareConfig.ts             │ 分享功能开关
 * announcementConfig            │ announcementConfig.ts      │ 公告栏（标题、内容、链接）
 * musicPlayerConfig             │ musicConfig.ts             │ 音乐播放器（本地 / Meting 模式）
 * footerConfig                  │ footerConfig.ts            │ 页脚自定义 HTML
 * sidebarLayoutConfig           │ sidebarConfig.ts           │ 侧边栏组件布局（排序、动画、响应式断点）
 * sakuraConfig                  │ effectsConfig.ts           │ 樱花飘落特效（数量、速度、透明度）
 * pioConfig                     │ pioConfig.ts               │ Live2D 看板娘（模型、对话、位置）
 * relatedPostsConfig            │ relatedPostsConfig.ts      │ 相关文章推荐（开关、数量）
 * randomPostsConfig             │ randomPostsConfig.ts       │ 随机文章推荐（开关、数量）
 * widgetConfigs                 │ (聚合)                     │ 侧边栏 Widget 配置聚合对象
 *
 * ══════════════════════════════════════════════════════════════
 * 类型定义
 * ══════════════════════════════════════════════════════════════
 *
 * 所有配置的 TypeScript 接口定义在 src/types/config.ts 中。
 * 修改配置结构时，请同步更新对应的接口定义。
 *
 * ══════════════════════════════════════════════════════════════
 * 使用方式
 * ══════════════════════════════════════════════════════════════
 *
 * 在 Astro 组件中：
 *   import { siteConfig, navBarConfig } from "@/config";
 *
 * 在相对路径引用中：
 *   import { siteConfig } from "../config";
 *
 * 在脚本中：
 *   import { siteConfig } from "src/config";
 *
 * 以上三种方式都会自动解析到此 index.ts 文件。
 */

export { announcementConfig } from "./announcementConfig";

// ─── 外观与壁纸 ─────────────────────────────────────────────
export { fullscreenWallpaperConfig } from "./backgroundWallpaper";
// ─── 互动功能 ───────────────────────────────────────────────
export { commentConfig } from "./commentConfig";
export { sakuraConfig } from "./effectsConfig";
// ─── 代码块 ─────────────────────────────────────────────────
export { expressiveCodeConfig } from "./expressiveCodeConfig";
export { footerConfig } from "./footerConfig";
// ─── 内容与版权 ─────────────────────────────────────────────
export { licenseConfig } from "./licenseConfig";
// ─── 多媒体 ─────────────────────────────────────────────────
export { musicPlayerConfig } from "./musicConfig";
// ─── 导航栏 ─────────────────────────────────────────────────
export { navBarConfig } from "./navBarConfig";
export { permalinkConfig } from "./permalinkConfig";
export { pioConfig } from "./pioConfig";
// ─── 个人资料 ───────────────────────────────────────────────
export { profileConfig } from "./profileConfig";
export { randomPostsConfig } from "./randomPostsConfig";
// ─── 文章推荐 ───────────────────────────────────────────────
export { relatedPostsConfig } from "./relatedPostsConfig";
export { shareConfig } from "./shareConfig";
// ─── 布局 ───────────────────────────────────────────────────
export { sidebarLayoutConfig } from "./sidebarConfig";
// ─── 站点核心 ───────────────────────────────────────────────
export { SITE_LANG, siteConfig } from "./siteConfig";

import { announcementConfig } from "./announcementConfig";
import { fullscreenWallpaperConfig } from "./backgroundWallpaper";
import { sakuraConfig } from "./effectsConfig";
import { musicPlayerConfig } from "./musicConfig";
import { pioConfig } from "./pioConfig";
// ─── Widget 配置聚合（供 Swup 等运行时使用）────────────────
import { profileConfig } from "./profileConfig";
import { randomPostsConfig } from "./randomPostsConfig";
import { relatedPostsConfig } from "./relatedPostsConfig";
import { shareConfig } from "./shareConfig";
import { sidebarLayoutConfig } from "./sidebarConfig";

export const widgetConfigs = {
	profile: profileConfig,
	announcement: announcementConfig,
	music: musicPlayerConfig,
	layout: sidebarLayoutConfig,
	sakura: sakuraConfig,
	fullscreenWallpaper: fullscreenWallpaperConfig,
	pio: pioConfig,
	share: shareConfig,
	relatedPosts: relatedPostsConfig,
	randomPosts: randomPostsConfig,
} as const;
