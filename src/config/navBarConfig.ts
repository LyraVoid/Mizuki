import type { NavBarConfig } from "../types/config";
import { LinkPreset } from "../types/config";

/**
 * 导航栏菜单配置
 *
 * ══════════════════════════════════════════════════════════════
 * 配置教程
 * ══════════════════════════════════════════════════════════════
 *
 * links 数组中的每一项可以是以下两种类型之一：
 *
 * 【类型一】预设链接（LinkPreset）
 *   直接使用 LinkPreset 枚举，自动生成对应的名称、URL 和图标。
 *   可用的预设值：
 *     LinkPreset.Home       → 首页
 *     LinkPreset.Archive    → 归档
 *     LinkPreset.About      → 关于
 *     LinkPreset.Friends    → 友链
 *     LinkPreset.Anime      → 番剧
 *     LinkPreset.Diary      → 日记
 *     LinkPreset.Albums     → 相册
 *     LinkPreset.Projects   → 项目
 *     LinkPreset.Skills     → 技能
 *     LinkPreset.Timeline   → 时间线
 *
 *   示例：
 *     links: [LinkPreset.Home, LinkPreset.Archive]
 *
 * 【类型二】自定义链接对象
 *   {
 *     name: "显示名称",           // 必填，菜单项显示的文字
 *     url: "/your-page/",        // 必填，链接地址
 *     icon: "icon-set:icon",     // 可选，Iconify 图标，格式为 "集合名:图标名"
 *     external: true,            // 可选，是否为外部链接（默认 false）
 *     children: [...]            // 可选，子菜单数组（支持多级嵌套）
 *   }
 *
 * ══════════════════════════════════════════════════════════════
 * 多级菜单配置
 * ══════════════════════════════════════════════════════════════
 *
 * 通过 children 字段实现下拉子菜单。children 中的每一项同样支持
 * LinkPreset 枚举或自定义链接对象，可以自由混合使用。
 *
 * 【单级菜单】（无 children，直接作为导航项显示）
 *   {
 *     name: "About",
 *     url: "/about/",
 *     icon: "material-symbols:info",
 *   }
 *
 * 【一级下拉菜单】（一个父级 + 多个子项）
 *   {
 *     name: "Links",
 *     url: "/links/",
 *     icon: "material-symbols:link",
 *     children: [
 *       { name: "GitHub",   url: "https://github.com", external: true, icon: "fa7-brands:github" },
 *       { name: "Bilibili", url: "https://bilibili.com", external: true, icon: "fa7-brands:bilibili" },
 *     ]
 *   }
 *
 * 【混合使用预设和自定义链接】
 *   children 中可以同时包含 LinkPreset 枚举和自定义对象：
 *   {
 *     name: "More",
 *     url: "#",
 *     icon: "material-symbols:more-horiz",
 *     children: [
 *       LinkPreset.Projects,                                    // 使用预设
 *       { name: "Skills", url: "/skills/", icon: "material-symbols:psychology" }, // 自定义
 *     ]
 *   }
 *
 * 【嵌套子菜单】（children 的 children，理论上支持无限层级）
 *   注意：当前 UI 仅渲染一级下拉。若需要更深层级，需配合前端组件改造。
 *   {
 *     name: "Resources",
 *     url: "#",
 *     icon: "material-symbols:folder",
 *     children: [
 *       {
 *         name: "文档",
 *         url: "#",
 *         icon: "material-symbols:description",
 *         children: [
 *           { name: "快速入门", url: "/docs/quick-start/", icon: "material-symbols:rocket" },
 *           { name: "API 参考", url: "/docs/api/", icon: "material-symbols:code" },
 *         ]
 *       },
 *       { name: "示例", url: "/examples/", icon: "material-symbols:sample" },
 *     ]
 *   }
 *
 * ══════════════════════════════════════════════════════════════
 * 图标说明
 * ══════════════════════════════════════════════════════════════
 *
 * icon 字段使用 Iconify 图标格式："集合名:图标名"
 * 常用图标集合：
 *   - material-symbols   → Google Material Symbols（推荐，图标丰富）
 *   - mdi                → Material Design Icons
 *   - fa7-brands         → Font Awesome 7 品牌图标（GitHub, Discord 等）
 *   - fa7-solid          → Font Awesome 7 实心图标
 *   - fa7-regular        → Font Awesome 7 线性图标
 *   - simple-icons       → Simple Icons（各种品牌 Logo）
 *
 * 浏览更多图标：https://icon-sets.iconify.design/
 *
 * ══════════════════════════════════════════════════════════════
 * external 字段说明
 * ══════════════════════════════════════════════════════════════
 *
 * - external: true  → 外部链接，点击后在新标签页打开，并显示外链图标标识
 * - external: false → 内部链接，在当前页面内导航（使用 Swup 无刷新跳转）
 * - 不设置        → 默认视为内部链接
 *
 * ══════════════════════════════════════════════════════════════
 * 注意事项
 * ══════════════════════════════════════════════════════════════
 *
 * 1. 关闭特色页面后（siteConfig.featurePages），导航栏会自动隐藏对应链接，无需手动移除。
 * 2. 内部链接 URL 格式为 "/page-name/"（以斜杠开头和结尾）。
 * 3. 外部链接 URL 必须包含完整协议前缀（如 "https://"）。
 * 4. 导航栏在移动端会自动收拢为汉堡菜单，子菜单以折叠面板形式展示。
 * 5. links 数组的顺序即为导航栏从左到右的显示顺序。
 */
export const navBarConfig: NavBarConfig = {
	links: [
		// 预设链接：首页
		LinkPreset.Home,
		// 预设链接：归档
		LinkPreset.Archive,

		// 自定义一级下拉菜单示例：外部链接集合
		{
			name: "Links",
			url: "/links/",
			icon: "material-symbols:link",
			children: [
				{
					name: "GitHub",
					url: "https://github.com/LyraVoid/Mizuki",
					external: true, // 外部链接，新标签页打开
					icon: "fa7-brands:github",
				},
				{
					name: "Bilibili",
					url: "https://space.bilibili.com/701864046",
					external: true,
					icon: "fa7-brands:bilibili",
				},
				{
					name: "Gitee",
					url: "https://gitee.com/matsuzakayuki/Mizuki",
					external: true,
					icon: "mdi:git",
				},
			],
		},

		// 自定义一级下拉菜单示例：个人内容页面
		{
			name: "My",
			url: "/content/",
			icon: "material-symbols:person",
			children: [
				{
					name: "Anime",
					url: "/anime/",
					icon: "material-symbols:movie",
				},
				{
					name: "Diary",
					url: "/diary/",
					icon: "material-symbols:book",
				},
				{
					name: "Gallery",
					url: "/albums/",
					icon: "material-symbols:photo-library",
				},
				{
					name: "Devices",
					url: "/devices/",
					icon: "material-symbols:devices",
					external: false, // 内部链接，当前页导航
				},
			],
		},

		// 自定义一级下拉菜单示例：关于相关
		{
			name: "About",
			url: "/content/",
			icon: "material-symbols:info",
			children: [
				{
					name: "About",
					url: "/about/",
					icon: "material-symbols:person",
				},
				{
					name: "Friends",
					url: "/friends/",
					icon: "material-symbols:group",
				},
			],
		},

		// 自定义一级下拉菜单示例：其他页面
		{
			name: "Others",
			url: "#", // "#" 作为占位 URL，点击不会跳转
			icon: "material-symbols:more-horiz",
			children: [
				{
					name: "Projects",
					url: "/projects/",
					icon: "material-symbols:work",
				},
				{
					name: "Skills",
					url: "/skills/",
					icon: "material-symbols:psychology",
				},
				LinkPreset.AITools,
				{
					name: "Timeline",
					url: "/timeline/",
					icon: "material-symbols:timeline",
				},
			],
		},
	],
};
