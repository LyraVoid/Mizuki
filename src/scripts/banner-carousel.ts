/**
 * Banner 轮播图管理器
 * 负责桌面端和移动端的轮播图初始化、自动播放和触摸手势支持
 */

import { siteConfig } from "../config";
import { SWUP_SELECTORS } from "./core/swup-config";

/**
 * 轮播图配置接口
 */
export interface CarouselConfig {
	enable: boolean;
	interval: number;
}

/**
 * 轮播图管理器类
 */
export class BannerCarouselManager {
	private currentIndex = 0;
	private interval: ReturnType<typeof setInterval> | null = null;
	private isPaused = false;
	private validItems: Element[] = [];

	// 移动端触摸手势支持
	private startX = 0;
	private startY = 0;
	private isSwiping = false;

	/**
	 * 初始化轮播图
	 */
	init(): void {
		const carousel = document.getElementById(
			SWUP_SELECTORS.bannerCarousel.slice(1),
		);
		if (!carousel) {
			return;
		}

		// 获取所有轮播项
		const carouselItems = document.querySelectorAll(".carousel-item");

		// 根据屏幕尺寸过滤有效的轮播项
		this.filterValidItems(carouselItems);

		// 检查是否启用轮播
		const carouselConfig: CarouselConfig = siteConfig.banner.carousel
			?.enable
			? {
					enable: siteConfig.banner.carousel.enable,
					interval: siteConfig.banner.carousel?.interval || 6,
				}
			: { enable: false, interval: 6 };

		if (this.validItems.length > 1 && carouselConfig.enable) {
			this.setupCarousel(carousel, carouselConfig);
		} else if (this.validItems.length > 0) {
			// 只有一张图片时，显示第一张
			this.showSlide(0);
		}
	}

	/**
	 * 根据屏幕尺寸过滤有效的轮播项
	 */
	private filterValidItems(carouselItems: NodeListOf<Element>): void {
		const isMobile = window.innerWidth < 768;

		this.validItems = Array.from(carouselItems).filter((item) => {
			if (isMobile) {
				return item.querySelector(".block\\.md\\:hidden");
			} else {
				return item.querySelector(".hidden\\.md\\:block");
			}
		});
	}

	/**
	 * 设置轮播图
	 */
	private setupCarousel(carousel: HTMLElement, config: CarouselConfig): void {
		// 初始化：隐藏所有图片，只显示第一张有效图片
		this.hideAllSlides();
		this.showSlide(0);

		// 移动端触摸事件
		if ("ontouchstart" in window) {
			this.setupTouchEvents(carousel);
		}

		// 鼠标悬停暂停（桌面端）
		this.setupMouseEvents(carousel);

		// 开始自动轮播
		this.startCarousel(config.interval);
	}

	/**
	 * 隐藏所有轮播项
	 */
	private hideAllSlides(): void {
		this.validItems.forEach((item) => {
			item.classList.add("opacity-0", "scale-110");
			item.classList.remove("opacity-100", "scale-100");
		});
	}

	/**
	 * 显示指定索引的轮播项
	 */
	private showSlide(index: number): void {
		const item = this.validItems[index];
		if (item) {
			item.classList.add("opacity-100", "scale-100");
			item.classList.remove("opacity-0", "scale-110");
		}
	}

	/**
	 * 切换到指定索引的幻灯片
	 */
	private switchToSlide(index: number): void {
		const currentItem = this.validItems[this.currentIndex];
		if (currentItem) {
			currentItem.classList.remove("opacity-100", "scale-100");
			currentItem.classList.add("opacity-0", "scale-110");
		}

		this.currentIndex = index;
		this.showSlide(this.currentIndex);
	}

	/**
	 * 设置触摸事件
	 */
	private setupTouchEvents(carousel: HTMLElement): void {
		carousel.addEventListener(
			"touchstart",
			(e: TouchEvent) => {
				this.startX = e.touches[0].clientX;
				this.startY = e.touches[0].clientY;
				this.isSwiping = false;
				this.isPaused = true;
				this.stopCarousel();
			},
			{ passive: true },
		);

		carousel.addEventListener(
			"touchmove",
			(e: TouchEvent) => {
				if (!this.startX || !this.startY) {
					return;
				}

				const diffX = Math.abs(e.touches[0].clientX - this.startX);
				const diffY = Math.abs(e.touches[0].clientY - this.startY);

				if (diffX > diffY && diffX > 30) {
					this.isSwiping = true;
					e.preventDefault();
				}
			},
			{ passive: false },
		);

		carousel.addEventListener(
			"touchend",
			(e: TouchEvent) => {
				if (!this.startX || !this.startY || !this.isSwiping) {
					this.isPaused = false;
					this.startCarousel(
						siteConfig.banner.carousel?.interval || 6,
					);
					return;
				}

				const endX = e.changedTouches[0].clientX;
				const diffX = this.startX - endX;

				if (Math.abs(diffX) > 50) {
					if (diffX > 0) {
						// 向左滑动，显示下一张
						const nextIndex =
							(this.currentIndex + 1) % this.validItems.length;
						this.switchToSlide(nextIndex);
					} else {
						// 向右滑动，显示上一张
						const prevIndex =
							(this.currentIndex - 1 + this.validItems.length) %
							this.validItems.length;
						this.switchToSlide(prevIndex);
					}
				}

				this.startX = 0;
				this.startY = 0;
				this.isSwiping = false;
				this.isPaused = false;
				this.startCarousel(siteConfig.banner.carousel?.interval || 6);
			},
			{ passive: true },
		);
	}

	/**
	 * 设置鼠标事件
	 */
	private setupMouseEvents(carousel: HTMLElement): void {
		carousel.addEventListener("mouseenter", () => {
			this.isPaused = true;
			this.stopCarousel();
		});

		carousel.addEventListener("mouseleave", () => {
			this.isPaused = false;
			this.startCarousel(siteConfig.banner.carousel?.interval || 6);
		});
	}

	/**
	 * 开始自动轮播
	 */
	private startCarousel(intervalSeconds: number): void {
		this.stopCarousel();

		if (!this.isPaused) {
			this.interval = setInterval(() => {
				if (!this.isPaused) {
					const nextIndex =
						(this.currentIndex + 1) % this.validItems.length;
					this.switchToSlide(nextIndex);
				}
			}, intervalSeconds * 1000);
		}
	}

	/**
	 * 停止轮播
	 */
	private stopCarousel(): void {
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = null;
		}
	}

	/**
	 * 销毁管理器
	 */
	destroy(): void {
		this.stopCarousel();
		this.validItems = [];
		this.currentIndex = 0;
		this.isPaused = false;
		this.isSwiping = false;
	}

	/**
	 * 刷新轮播项列表（窗口大小改变时调用）
	 */
	refresh(): void {
		const carouselItems = document.querySelectorAll(".carousel-item");
		const previousCount = this.validItems.length;

		this.filterValidItems(carouselItems);

		// 如果有效项数量改变，重置索引
		if (this.validItems.length !== previousCount) {
			this.currentIndex = 0;
			this.hideAllSlides();
			this.showSlide(0);
		}
	}
}

/**
 * 全局轮播图管理器实例
 */
let globalCarouselManager: BannerCarouselManager | null = null;

/**
 * 获取全局轮播图管理器实例
 */
export function getCarouselManager(): BannerCarouselManager {
	if (!globalCarouselManager) {
		globalCarouselManager = new BannerCarouselManager();
	}
	return globalCarouselManager;
}

/**
 * 初始化轮播图（便捷函数）
 */
export function initBannerCarousel(): void {
	const manager = getCarouselManager();
	manager.init();
}

/**
 * 销毁轮播图管理器
 */
export function destroyBannerCarousel(): void {
	if (globalCarouselManager) {
		globalCarouselManager.destroy();
		globalCarouselManager = null;
	}
}
