/**
 * Swup 配置模块
 * 提供页面过渡动画的配置常量和类型定义
 */

import type { FancyboxOptions } from "@fancyapps/ui";

// Banner 高度常量
export const BANNER_HEIGHT = 35;
export const BANNER_HEIGHT_EXTEND = 30;
export const BANNER_HEIGHT_HOME = BANNER_HEIGHT + BANNER_HEIGHT_EXTEND;

// 选择器配置
export const SWUP_SELECTORS = {
	// 内容容器
	contentContainer: "#content-wrapper",

	// 动画元素
	animationScope: "#main-grid",

	// 需要持久化的元素
	persistElements: [
		"#navbar-wrapper",
		"#sidebar",
		".music-player",
	],

	// Banner 相关
	bannerWrapper: "#banner-wrapper",
	banner: "#banner",
	bannerTextOverlay: ".banner-text-overlay",

	// 导航相关
	navbar: "#navbar",
	navbarWrapper: "#navbar-wrapper",

	// TOC 相关
	tocWrapper: "#toc-wrapper",
	tableOfContents: "table-of-contents",

	// 其他
	contentWrapper: "#content-wrapper",
	pageHeightExtend: "#page-height-extend",
	backToTopBtn: "#back-to-top-btn",
} as const;

// 过渡动画配置类型
export interface TransitionConfig {
	duration: number;
	easing: string;
	easingOut: string;
	translateDistance: string;
	staggerDelay: number;
}

// 过渡动画默认配置 - 灵感来自 Firefly 主题的快速流畅体验
export const TRANSITION_CONFIG: TransitionConfig = {
	duration: 120,
	easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
	easingOut: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
	translateDistance: "1.5rem",
	staggerDelay: 35,
} as const;

// 动画配置
export const ANIMATION_CONFIG = {
	// 页面进入动画时长 (ms)
	pageEnterDuration: TRANSITION_CONFIG.duration,

	// 页面离开动画时长 (ms)
	pageLeaveDuration: 150,

	// 页面高度扩展延迟 (ms)
	heightExtendDelay: 150,

	// TOC 就绪延迟 (ms)
	tocReadyDelay: 80,

	// 评论系统初始化延迟 (ms)
	commentInitDelay: 250,

	// 移动端 banner 动画延迟 (ms)
	mobileBannerDelay: 80,
	mobileContentDelay: 120,
} as const;

// 主题配置
export const THEME_CONFIG = {
	// 主题存储键
	themeStorageKey: "theme",
	hueStorageKey: "hue",

	// 主题值
	lightMode: "light",
	darkMode: "dark",

	// Expressive Code 主题映射
	lightExpressiveTheme: "github-light",
	darkExpressiveTheme: "github-dark",
} as const;

// 滚动配置
export const SCROLL_CONFIG = {
	// 节流间隔 (ms)
	throttleInterval: 16, // 约60fps

	// 返回顶部显示阈值偏移量 (像素)
	backToTopOffset: 100,

	// Navbar 隐藏阈值偏移量 (像素)
	navbarHideOffset: 88,
} as const;

// 性能模式配置
export type PerformanceMode = "high" | "medium" | "low" | "auto";

export interface PerformanceConfig {
	// 是否启用 wave 动画
	waveAnimation: {
		enabled: boolean;
		layers: number; // 桌面端波浪层数
		layersMobile: number; // 移动端波浪层数
	};
	// 樱花效果配置
	sakuraEffect: {
		enabled: boolean;
		maxParticles: number; // 桌面端最大粒子数
		maxParticlesMobile: number; // 移动端最大粒子数
	};
	// Live2D/Pio 配置
	live2D: {
		enabled: boolean;
		hideOnMobile: boolean;
	};
	// 打字机效果
	typewriter: {
		enabled: boolean;
		hideOnMobile: boolean;
	};
}

export const PERFORMANCE_CONFIG: PerformanceConfig = {
	waveAnimation: {
		enabled: true,
		layers: 4,
		layersMobile: 2,
	},
	sakuraEffect: {
		enabled: true,
		maxParticles: 60,
		maxParticlesMobile: 25,
	},
	live2D: {
		enabled: true,
		hideOnMobile: true,
	},
	typewriter: {
		enabled: true,
		hideOnMobile: true,
	},
};

// 轮播配置类型
export interface CarouselConfig {
	enable: boolean;
	interval: number;
}

// Fancybox 配置类型
export type FancyboxConfig = Partial<FancyboxOptions>;

// 默认 Fancybox 配置
export const getDefaultFancyboxConfig = (): FancyboxConfig => ({
	Carousel: {
		infinite: true,
		Lazyload: { preload: 3 },
		Thumbs: { showOnStart: true },
		Toolbar: {
			display: {
				left: ["counter"],
				middle: [
					"zoomIn",
					"zoomOut",
					"toggle1to1",
					"rotateCCW",
					"rotateCW",
					"flipX",
					"flipY",
					"reset",
				],
				right: ["autoplay", "fullscreen", "thumbs", "close"],
			},
		},
		Zoomable: {
			Panzoom: { maxScale: 3, minScale: 1 },
		},
	},
	dragToClose: true,
	keyboard: {
		Escape: "close",
		Delete: "close",
		Backspace: "close",
		PageUp: "next",
		PageDown: "prev",
		ArrowUp: "next",
		ArrowDown: "prev",
		ArrowRight: "next",
		ArrowLeft: "prev",
	},
});

// Fancybox 选择器
export const FANCYBOX_SELECTORS = {
	// 相册/文章图片
	albumImages: ".custom-md img, #post-cover img, .moment-images img",

	// 相册链接
	albumLinks: ".moment-images a[data-fancybox]",

	// 单独的 fancybox 图片
	singleFancybox: "[data-fancybox]:not(.moment-images a)",
} as const;
