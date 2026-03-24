/**
 * Swup 钩子模块
 * 处理页面过渡过程中的各种钩子事件
 */

import { pathsEqual, url } from "../../utils/url-utils";
import type { FancyboxHandler } from "../handlers/fancybox-handler";
import type { ScrollHandler } from "../handlers/scroll-handler";
import {
	ANIMATION_CONFIG,
	BANNER_HEIGHT,
	SWUP_SELECTORS,
	THEME_CONFIG,
} from "./swup-config";

// 钩子处理器接口
export interface SwupHookHandlers {
	fancyboxHandler?: FancyboxHandler;
	scrollHandler?: ScrollHandler;
	showBanner?: () => void;
	initFancybox?: () => void;
	cleanupFancybox?: () => void;
	initCustomScrollbar?: () => void;
	checkKatex?: () => void;
}

// 访问对象类型
interface VisitObject {
	to: {
		url: string;
	};
}

/**
 * Swup 钩子管理器
 * 负责注册和管理所有 Swup 页面过渡钩子
 */
export class SwupHooksManager {
	private bannerEnabled: boolean;
	private handlers: SwupHookHandlers;

	private cachedElements: Map<string, Element | null> = new Map();

	constructor(bannerEnabled: boolean, handlers: SwupHookHandlers = {}) {
		this.bannerEnabled = bannerEnabled;
		this.handlers = handlers;
	}

	private getCachedElement(selector: string): Element | null {
		if (!this.cachedElements.has(selector)) {
			const id = selector.startsWith("#") ? selector.slice(1) : selector;
			if (selector.startsWith("#")) {
				this.cachedElements.set(selector, document.getElementById(id));
			} else {
				this.cachedElements.set(
					selector,
					document.querySelector(selector),
				);
			}
		}
		return this.cachedElements.get(selector) ?? null;
	}

	private clearCache(): void {
		this.cachedElements.clear();
	}

	/**
	 * 注册所有 Swup 钩子
	 */
	registerHooks(): void {
		if (!window.swup) {
			return;
		}
		this.registerLinkClickHook();
		this.registerContentReplaceHook();
		this.registerVisitStartHook();
		this.registerPageViewHook();
		this.registerVisitEndHook();
	}

	/**
	 * link:click 钩子
	 * 处理链接点击时的初始状态
	 */
	private registerLinkClickHook(): void {
		window.swup!.hooks.on("link:click", () => {
			// 移除首次页面加载的延迟
			document.documentElement.style.setProperty(
				"--content-delay",
				"0ms",
			);

			// 处理 navbar 隐藏
			if (this.bannerEnabled) {
				this.handleNavbarHideOnLinkClick();
			}
		});
	}

	/**
	 * content:replace 钩子
	 * 处理内容替换后的初始化
	 */
	private registerContentReplaceHook(): void {
		window.swup!.hooks.on("content:replace", () => {
			this.clearCache();

			// 初始化新页面的图片、公式、滚动条和 TOC
			this.handlers.initFancybox?.();
			this.handlers.checkKatex?.();
			this.handlers.initCustomScrollbar?.();

			// 处理 TOC 重新初始化
			this.handleTOCReinit();

			// 重新初始化 semifull 模式滚动检测
			this.reinitSemifullScrollDetection();
		});
	}

	/**
	 * visit:start 钩子
	 * 处理页面访问开始时的状态
	 */
	private registerVisitStartHook(): void {
		window.swup!.hooks.on("visit:start", (visit: VisitObject) => {
			// 清理上一页的 Fancybox
			this.handlers.cleanupFancybox?.();

			// 处理页面状态
			const isHomePage = pathsEqual(visit.to.url, url("/"));
			this.handleBodyClass(isHomePage);
			this.handleBannerTextVisibility(isHomePage);
			this.handleNavbarState(isHomePage);
			this.handleMobileBannerVisibility(isHomePage);

			// 扩展页面高度防止滚动动画跳跃
			this.extendPageHeight(false);

			// 隐藏 TOC
			this.hideTOC();
		});
	}

	/**
	 * page:view 钩子
	 * 处理页面视图显示
	 */
	private registerPageViewHook(): void {
		window.swup!.hooks.on("page:view", () => {
			// 扩展页面高度
			this.extendPageHeight(false);

			// 滚动到页面顶部
			window.scrollTo({
				top: 0,
				behavior: "instant",
			});

			// 同步主题状态
			this.syncThemeState();

			// 触发页面加载完成事件
			this.dispatchPageLoadedEvent();
		});
	}

	/**
	 * visit:end 钩子
	 * 处理页面访问结束时的清理
	 */
	private registerVisitEndHook(): void {
		window.swup!.hooks.on("visit:end", (_visit: VisitObject) => {
			setTimeout(() => {
				// 隐藏高度扩展元素
				this.extendPageHeight(true);

				// 显示 TOC
				this.showTOC();
			}, ANIMATION_CONFIG.heightExtendDelay);
		});
	}

	// ==================== 私有辅助方法 ====================

	/**
	 * 处理链接点击时的 navbar 隐藏
	 */
	private handleNavbarHideOnLinkClick(): void {
		const navbar = this.getCachedElement(SWUP_SELECTORS.navbarWrapper);
		if (navbar && document.body.classList.contains("lg:is-home")) {
			const threshold = window.innerHeight * (BANNER_HEIGHT / 100) - 88;
			if (document.documentElement.scrollTop >= threshold) {
				navbar.classList.add("navbar-hidden");
			}
		}
	}

	/**
	 * 处理 TOC 重新初始化
	 */
	private handleTOCReinit(): void {
		const tocWrapper = this.getCachedElement(SWUP_SELECTORS.tocWrapper);
		const isArticlePage = tocWrapper !== null;

		if (isArticlePage) {
			const tocElement = this.getCachedElement(
				SWUP_SELECTORS.tableOfContents,
			);
			const hasDesktopTOC =
				tocElement && typeof (tocElement as any).init === "function";
			const hasMobileTOC =
				typeof (window as any).mobileTOCInit === "function";

			if (hasDesktopTOC || hasMobileTOC) {
				setTimeout(() => {
					if (hasDesktopTOC) {
						(tocElement as any).init();
					}
					if (hasMobileTOC) {
						(window as any).mobileTOCInit();
					}
				}, ANIMATION_CONFIG.tocReadyDelay);
			}
		}
	}

	/**
	 * 重新初始化 semifull 模式滚动检测
	 */
	private reinitSemifullScrollDetection(): void {
		const navbar = this.getCachedElement(SWUP_SELECTORS.navbar);
		if (navbar) {
			const transparentMode = navbar.getAttribute(
				"data-transparent-mode",
			);
			if (transparentMode === "semifull") {
				if (
					typeof (window as any).initSemifullScrollDetection ===
					"function"
				) {
					(window as any).initSemifullScrollDetection();
				}
			}
		}
	}

	/**
	 * 处理 body class
	 */
	private handleBodyClass(isHomePage: boolean): void {
		const bodyElement = this.getCachedElement("body");
		if (bodyElement) {
			if (isHomePage) {
				bodyElement.classList.add("lg:is-home");
			} else {
				bodyElement.classList.remove("lg:is-home");
			}
		}
	}

	/**
	 * 处理 Banner 文字可见性
	 */
	private handleBannerTextVisibility(isHomePage: boolean): void {
		const bannerTextOverlay = this.getCachedElement(
			SWUP_SELECTORS.bannerTextOverlay,
		);
		if (bannerTextOverlay) {
			if (isHomePage) {
				bannerTextOverlay.classList.remove("hidden");
			} else {
				bannerTextOverlay.classList.add("hidden");
			}
		}
	}

	/**
	 * 处理 Navbar 状态
	 */
	private handleNavbarState(isHomePage: boolean): void {
		const navbar = this.getCachedElement(SWUP_SELECTORS.navbar);
		if (navbar) {
			navbar.setAttribute("data-is-home", isHomePage.toString());

			// 重新初始化 semifull 模式滚动检测
			const transparentMode = navbar.getAttribute(
				"data-transparent-mode",
			);
			if (transparentMode === "semifull") {
				if (
					typeof (window as any).initSemifullScrollDetection ===
					"function"
				) {
					(window as any).initSemifullScrollDetection();
				}
			}
		}
	}

	/**
	 * 处理移动端 Banner 可见性
	 */
	private handleMobileBannerVisibility(isHomePage: boolean): void {
		const bannerWrapper = this.getCachedElement(
			SWUP_SELECTORS.bannerWrapper,
		);
		const mainContentWrapper = this.getCachedElement(
			".absolute.w-full.z-30",
		);

		if (bannerWrapper && mainContentWrapper) {
			if (isHomePage) {
				// 首页：延迟移除隐藏类
				setTimeout(() => {
					bannerWrapper.classList.remove("mobile-hide-banner");
				}, ANIMATION_CONFIG.mobileBannerDelay);
				setTimeout(() => {
					mainContentWrapper.classList.remove(
						"mobile-main-no-banner",
					);
				}, ANIMATION_CONFIG.mobileContentDelay);
			} else {
				// 非首页：分阶段隐藏
				bannerWrapper.classList.add("mobile-hide-banner");
				setTimeout(() => {
					mainContentWrapper.classList.add("mobile-main-no-banner");
				}, ANIMATION_CONFIG.mobileBannerDelay);
			}
		}
	}

	/**
	 * 扩展/隐藏页面高度
	 */
	private extendPageHeight(hide: boolean): void {
		const heightExtend = this.getCachedElement(
			SWUP_SELECTORS.pageHeightExtend,
		);
		if (!heightExtend) {
			return;
		}

		// 只在 Banner 模式下启用高度扩展
		// fullscreen/none 模式内容往往不足一屏，如果强行扩展高度，
		// 会导致滚动条在页面过渡期间闪现，引发布局左右抖动
		const isBannerMode = document.body.classList.contains("enable-banner");
		if (!isBannerMode) {
			return;
		}

		if (hide) {
			heightExtend.classList.add("hidden");
		} else {
			heightExtend.classList.remove("hidden");
		}
	}

	/**
	 * 隐藏 TOC
	 */
	private hideTOC(): void {
		const toc = this.getCachedElement(SWUP_SELECTORS.tocWrapper);
		if (toc) {
			toc.classList.add("toc-not-ready");
		}
	}

	/**
	 * 显示 TOC
	 */
	private showTOC(): void {
		const toc = this.getCachedElement(SWUP_SELECTORS.tocWrapper);
		if (toc) {
			toc.classList.remove("toc-not-ready");
		}
	}

	/**
	 * 同步主题状态
	 * 解决从首页进入文章页面时代码块渲染问题
	 */
	private syncThemeState(): void {
		const storedTheme =
			localStorage.getItem(THEME_CONFIG.themeStorageKey) ||
			THEME_CONFIG.lightMode;
		const isDark = storedTheme === THEME_CONFIG.darkMode;
		const expectedTheme = isDark
			? THEME_CONFIG.darkExpressiveTheme
			: THEME_CONFIG.lightExpressiveTheme;

		const currentTheme =
			document.documentElement.getAttribute("data-theme");
		const hasDarkClass =
			document.documentElement.classList.contains("dark");

		// 如果主题不匹配，使用批量更新减少重绘
		if (currentTheme !== expectedTheme || hasDarkClass !== isDark) {
			requestAnimationFrame(() => {
				// 同步 data-theme 属性
				if (currentTheme !== expectedTheme) {
					document.documentElement.setAttribute(
						"data-theme",
						expectedTheme,
					);
				}
				// 同步 dark class
				if (hasDarkClass !== isDark) {
					if (isDark) {
						document.documentElement.classList.add("dark");
					} else {
						document.documentElement.classList.remove("dark");
					}
				}
			});
		}
	}

	/**
	 * 触发页面加载完成事件
	 * 用于初始化评论系统
	 */
	private dispatchPageLoadedEvent(): void {
		setTimeout(() => {
			if (
				document.getElementById("tcomment") ||
				document.getElementById("giscus-container")
			) {
				const pageLoadedEvent = new CustomEvent("mizuki:page:loaded", {
					detail: {
						path: window.location.pathname,
						timestamp: Date.now(),
					},
				});
				document.dispatchEvent(pageLoadedEvent);
				console.log(
					"Layout: 触发 mizuki:page:loaded 事件，路径:",
					window.location.pathname,
				);
			}
		}, ANIMATION_CONFIG.commentInitDelay);
	}

	/**
	 * 更新处理器
	 */
	updateHandlers(handlers: Partial<SwupHookHandlers>): void {
		this.handlers = { ...this.handlers, ...handlers };
	}
}
