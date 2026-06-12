/**
 * Swup 管理器主入口
 * 协调所有子模块，提供统一的页面过渡管理
 */

import { widgetConfigs } from "../config";
import { initLinkPreloading } from "../utils/navigation-utils";
import { SWUP_SELECTORS } from "./core/swup-config";
import { SwupHooksManager } from "./core/swup-hooks";
import { setupSakuraOnDOMReady } from "./effects/sakura-effect";
import {
	destroyTransitionEffect,
	getTransitionEffect,
} from "./effects/transition-effect";
import type { BackToTopHandler } from "./handlers/back-to-top-handler";
import {
	getBackToTopHandler,
	initBackToTopHandler,
} from "./handlers/back-to-top-handler";
import type { FancyboxHandler } from "./handlers/fancybox-handler";
import {
	cleanupFancybox,
	getFancyboxHandler,
	initFancybox,
} from "./handlers/fancybox-handler";
import type { PanelHandler } from "./handlers/panel-handler";
import { getPanelHandler, initPanelHandler } from "./handlers/panel-handler";
import { checkKatex, initCustomScrollbar } from "./handlers/scroll-handler";

/**
 * Swup 管理器类
 * 统一管理页面过渡相关的所有功能
 */
export class SwupManager {
	private hooksManager: SwupHooksManager | null = null;
	private fancyboxHandler: FancyboxHandler;
	private backToTopHandler: BackToTopHandler;
	private panelHandler: PanelHandler;

	private bannerEnabled: boolean;
	private initialized = false;

	constructor() {
		this.bannerEnabled = !!document.getElementById(
			SWUP_SELECTORS.bannerWrapper.slice(1),
		);

		// 初始化各个处理器
		this.fancyboxHandler = getFancyboxHandler();
		this.backToTopHandler = getBackToTopHandler(this.bannerEnabled);
		this.panelHandler = getPanelHandler();
	}

	/**
	 * 初始化 Swup 管理器
	 */
	async init(): Promise<void> {
		if (this.initialized) {
			return;
		}

		const transitionEffect = getTransitionEffect();
		transitionEffect.applyConfig();

		await this.initPanelHandler();

		// 设置 Sakura 特效
		this.setupSakura();

		// 初始化 Swup 钩子
		this.initSwupHooks();

		// 初始化返回顶部处理器
		initBackToTopHandler(this.bannerEnabled);

		// 初始化 Banner
		this.initBanner();

		// 初始化链接预加载
		this.initPreloading();

		this.initialized = true;
		console.log("SwupManager: 初始化完成");
	}

	/**
	 * 初始化面板处理器
	 */
	private async initPanelHandler(): Promise<void> {
		try {
			await initPanelHandler();
		} catch (error) {
			console.error("SwupManager: 面板处理器初始化失败", error);
		}
	}

	/**
	 * 设置 Sakura 特效
	 */
	private setupSakura(): void {
		setupSakuraOnDOMReady(widgetConfigs);
	}

	/**
	 * 初始化 Swup 钩子
	 */
	private initSwupHooks(): void {
		// 创建钩子管理器
		this.hooksManager = new SwupHooksManager(this.bannerEnabled, {
			showBanner: this.showBanner.bind(this),
			initFancybox: async () => {
				await initFancybox();
			},
			cleanupFancybox: () => {
				cleanupFancybox();
			},
			initCustomScrollbar: () => {
				initCustomScrollbar();
			},
			checkKatex: () => {
				checkKatex();
			},
		});

		// 如果 Swup 已经就绪，直接设置钩子
		if (window?.swup?.hooks) {
			initFancybox();
			checkKatex();
			this.hooksManager.registerHooks();
		} else {
			// 监听 Swup 就绪事件
			document.addEventListener("swup:enable", () => {
				if (this.hooksManager) {
					this.hooksManager.registerHooks();
				}
			});

			// 监听 DOM 加载（确保首屏也能加载优化组件）
			if (document.readyState === "loading") {
				document.addEventListener("DOMContentLoaded", async () => {
					await initFancybox();
					checkKatex();
				});
			} else {
				initFancybox();
				checkKatex();
			}
		}
	}

	/**
	 * 初始化 Banner
	 */
	private initBanner(): void {
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", async () => {
				this.showBanner();
			});
		} else {
			this.showBanner();
		}
	}

	/**
	 * 初始化链接预加载
	 */
	private initPreloading(): void {
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", () => {
				initLinkPreloading();
			});
		} else {
			initLinkPreloading();
		}
	}

	/**
	 * 显示 Banner
	 * 轮播图由 Banner.astro 中的内联脚本自行初始化（data-swup-ignore-script），
	 * 此处仅处理单图模式的淡入效果。
	 */
	showBanner(): void {
		requestAnimationFrame(() => {
			// 处理单图 Banner (桌面端)
			const banner = document.getElementById(
				SWUP_SELECTORS.banner.slice(1),
			);
			if (banner) {
				banner.classList.remove("opacity-0", "scale-105");
			}

			// 处理移动端单图 Banner
			const mobileBanner = document.querySelector(
				'.block.md\\:hidden[alt="Mobile banner image of the blog"]',
			);
			if (mobileBanner && !document.getElementById("banner-carousel")) {
				mobileBanner.classList.remove("opacity-0", "scale-105");
				mobileBanner.classList.add("opacity-100");
			}
		});
	}

	/**
	 * 销毁管理器
	 */
	destroy(): void {
		this.hooksManager = null;
		this.fancyboxHandler.destroy();
		this.backToTopHandler.destroy();
		this.panelHandler.destroy();
		destroyTransitionEffect();
		this.initialized = false;
	}

	/**
	 * 获取 Banner 启用状态
	 */
	isBannerEnabled(): boolean {
		return this.bannerEnabled;
	}
}

// 创建全局实例
let globalSwupManager: SwupManager | null = null;

/**
 * 获取全局 Swup 管理器实例
 */
export function getSwupManager(): SwupManager {
	if (!globalSwupManager) {
		globalSwupManager = new SwupManager();
	}
	return globalSwupManager;
}

/**
 * 初始化 Swup 管理器（便捷函数）
 */
export async function initSwupManager(): Promise<void> {
	const manager = getSwupManager();
	await manager.init();
}
