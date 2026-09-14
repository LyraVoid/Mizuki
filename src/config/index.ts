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
 * SITE_LANG                     │ (派生)                     │ 站点语言常量（取合并后的 siteConfig.lang）
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
 * rainyDayConfig                │ rainyDayConfig.ts          │ 雨滴窗口特效（总开关、效果参数）
 * widgetConfigs                 │ (聚合)                     │ 侧边栏 Widget 配置聚合对象
 *
 * ══════════════════════════════════════════════════════════════
 * 配置覆盖（可选）
 * ══════════════════════════════════════════════════════════════
 *
 * 各配置文件保存上游默认值，本文件在导出前把 src/config/overrides/ 下的同名
 * 覆盖文件深合并进来：
 *
 *   最终配置 = deepMerge(上游默认配置, overrides/<导出名>.ts 的 default 导出)
 *
 * 覆盖目录由 sync-content 从内容仓库的 overrides/ 同步，不存在时所有配置等同
 * 于上游默认值。详见 docs/CONTENT_SEPARATION.md。
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
 * 请始终从本入口读取配置，直接 import 某个配置文件会绕过覆盖合并。
 */

import { announcementConfig as announcementDefaults } from "./announcementConfig";
import { fullscreenWallpaperConfig as fullscreenWallpaperDefaults } from "./backgroundWallpaper";
import { commentConfig as commentDefaults } from "./commentConfig";
import { sakuraConfig as sakuraDefaults } from "./effectsConfig";
import { expressiveCodeConfig as expressiveCodeDefaults } from "./expressiveCodeConfig";
import { footerConfig as footerDefaults } from "./footerConfig";
import { licenseConfig as licenseDefaults } from "./licenseConfig";
import { markdownConfig as markdownDefaults } from "./markdownConfig";
import { musicPlayerConfig as musicPlayerDefaults } from "./musicConfig";
import { navBarConfig as navBarDefaults } from "./navBarConfig";
import { withOverride } from "./overrideLoader";
import { permalinkConfig as permalinkDefaults } from "./permalinkConfig";
import { pioConfig as pioDefaults } from "./pioConfig";
import { profileConfig as profileDefaults } from "./profileConfig";
import { rainyDayConfig as rainyDayDefaults } from "./rainyDayConfig";
import { randomPostsConfig as randomPostsDefaults } from "./randomPostsConfig";
import { relatedPostsConfig as relatedPostsDefaults } from "./relatedPostsConfig";
import { shareConfig as shareDefaults } from "./shareConfig";
import { sidebarLayoutConfig as sidebarLayoutDefaults } from "./sidebarConfig";
import { siteConfig as siteDefaults } from "./siteConfig";

// ─── 站点核心 ───────────────────────────────────────────────
export const siteConfig = withOverride("siteConfig", siteDefaults);

// SITE_LANG 从合并后的站点配置派生，覆盖 siteConfig.lang 后会一并生效。
// 注意：commentConfig.ts 在模块顶层引用了 siteConfig.ts 里的同名常量填充评论
// 语言，若覆盖了 siteConfig.lang，需要同时覆盖 commentConfig 的对应字段。
export const SITE_LANG = siteConfig.lang;

// ─── 外观与壁纸 ─────────────────────────────────────────────
export const fullscreenWallpaperConfig = withOverride(
	"fullscreenWallpaperConfig",
	fullscreenWallpaperDefaults,
);

// ─── 互动功能 ───────────────────────────────────────────────
export const commentConfig = withOverride("commentConfig", commentDefaults);
export const sakuraConfig = withOverride("sakuraConfig", sakuraDefaults);

// ─── 代码块 ─────────────────────────────────────────────────
export const expressiveCodeConfig = withOverride(
	"expressiveCodeConfig",
	expressiveCodeDefaults,
);

export const footerConfig = withOverride("footerConfig", footerDefaults);

// ─── 内容与版权 ─────────────────────────────────────────────
export const licenseConfig = withOverride("licenseConfig", licenseDefaults);
export const markdownConfig = withOverride("markdownConfig", markdownDefaults);

// ─── 多媒体 ─────────────────────────────────────────────────
export const musicPlayerConfig = withOverride(
	"musicPlayerConfig",
	musicPlayerDefaults,
);

// ─── 导航栏 ─────────────────────────────────────────────────
export const navBarConfig = withOverride("navBarConfig", navBarDefaults);
export const permalinkConfig = withOverride(
	"permalinkConfig",
	permalinkDefaults,
);
export const pioConfig = withOverride("pioConfig", pioDefaults);

// ─── 个人资料 ───────────────────────────────────────────────
export const profileConfig = withOverride("profileConfig", profileDefaults);
export const randomPostsConfig = withOverride(
	"randomPostsConfig",
	randomPostsDefaults,
);

// ─── 特效 ───────────────────────────────────────────────────
export const rainyDayConfig = withOverride("rainyDayConfig", rainyDayDefaults);

// ─── 文章推荐 ───────────────────────────────────────────────
export const relatedPostsConfig = withOverride(
	"relatedPostsConfig",
	relatedPostsDefaults,
);
export const shareConfig = withOverride("shareConfig", shareDefaults);

// ─── 布局 ───────────────────────────────────────────────────
export const sidebarLayoutConfig = withOverride(
	"sidebarLayoutConfig",
	sidebarLayoutDefaults,
);

export const announcementConfig = withOverride(
	"announcementConfig",
	announcementDefaults,
);

// ─── Widget 配置聚合（供 Swup 等运行时使用）────────────────
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
