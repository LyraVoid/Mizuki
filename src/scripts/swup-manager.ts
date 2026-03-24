/**
 * Swup 管理器主入口
 * 协调所有子模块，提供统一的页面过渡管理
 */

import { siteConfig, widgetConfigs } from "../config";
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
	 * 显示 Banner 和初始化轮播
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

			// 处理轮播 Banner
			const carousel = document.getElementById(
				SWUP_SELECTORS.bannerCarousel.slice(1),
			);
			if (carousel) {
				this.initCarousel();
			}
		});
	}

	/**
	 * 初始化轮播图
	 */
	private initCarousel(): void {
		const carouselItems = document.querySelectorAll(".carousel-item");

		// 根据屏幕尺寸过滤有效的轮播项
		const isMobile = window.innerWidth < 768;
		const validItems = Array.from(carouselItems).filter((item) => {
			if (isMobile) {
				return item.querySelector(".block.md\\:hidden");
			} else {
				return item.querySelector(".hidden.md\\:block");
			}
		});

		if (validItems.length > 1 && siteConfig.banner.carousel?.enable) {
			let currentIndex = 0;
			const interval = siteConfig.banner.carousel?.interval || 6;
			let carouselInterval: any;
			let isPaused = false;

			// 移动端触摸手势支持
			let startX = 0;
			let startY = 0;
			let isSwiping = false;

			const carousel = document.getElementById(
				SWUP_SELECTORS.bannerCarousel.slice(1),
			);

			// 切换图片的函数
			const switchToSlide = (index: number) => {
				const currentItem = validItems[currentIndex];
				currentItem.classList.remove("opacity-100", "scale-100");
				currentItem.classList.add("opacity-0", "scale-110");

				currentIndex = index;

				const nextItem = validItems[currentIndex];
				nextItem.classList.add("opacity-100", "scale-100");
				nextItem.classList.remove("opacity-0", "scale-110");
			};

			// 初始化：隐藏所有图片，只显示第一张有效图片
			carouselItems.forEach((item) => {
				item.classList.add("opacity-0", "scale-110");
				item.classList.remove("opacity-100", "scale-100");
			});

			if (validItems.length > 0) {
				validItems[0].classList.add("opacity-100", "scale-100");
				validItems[0].classList.remove("opacity-0", "scale-110");
			}

			// 移动端触摸事件
			if (carousel && "ontouchstart" in window) {
				carousel.addEventListener(
					"touchstart",
					(e: TouchEvent) => {
						startX = e.touches[0].clientX;
						startY = e.touches[0].clientY;
						isSwiping = false;
						isPaused = true;
						clearInterval(carouselInterval);
					},
					{ passive: true },
				);

				carousel.addEventListener(
					"touchmove",
					(e: TouchEvent) => {
						if (!startX || !startY) {
							return;
						}

						const diffX = Math.abs(e.touches[0].clientX - startX);
						const diffY = Math.abs(e.touches[0].clientY - startY);

						if (diffX > diffY && diffX > 30) {
							isSwiping = true;
							e.preventDefault();
						}
					},
					{ passive: false },
				);

				carousel.addEventListener(
					"touchend",
					(e: TouchEvent) => {
						if (!startX || !startY || !isSwiping) {
							isPaused = false;
							startCarousel();
							return;
						}

						const endX = e.changedTouches[0].clientX;
						const diffX = startX - endX;

						if (Math.abs(diffX) > 50) {
							if (diffX > 0) {
								const nextIndex =
									(currentIndex + 1) % validItems.length;
								switchToSlide(nextIndex);
							} else {
								const prevIndex =
									(currentIndex - 1 + validItems.length) %
									validItems.length;
								switchToSlide(prevIndex);
							}
						}

						startX = 0;
						startY = 0;
						isSwiping = false;
						isPaused = false;
						startCarousel();
					},
					{ passive: true },
				);
			}

			// 开始轮播的函数
			const startCarousel = () => {
				clearInterval(carouselInterval);
				carouselInterval = setInterval(() => {
					if (!isPaused) {
						const nextIndex =
							(currentIndex + 1) % validItems.length;
						switchToSlide(nextIndex);
					}
				}, interval * 1000);
			};

			// 鼠标悬停暂停（桌面端）
			if (carousel) {
				carousel.addEventListener("mouseenter", () => {
					isPaused = true;
					clearInterval(carouselInterval);
				});
				carousel.addEventListener("mouseleave", () => {
					isPaused = false;
					startCarousel();
				});
			}

			// 开始自动轮播
			startCarousel();
		}
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
