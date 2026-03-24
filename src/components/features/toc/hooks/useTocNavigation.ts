/**
 * useTocNavigation - TOC 导航逻辑 hook
 * 处理标题提取、滚动导航等核心功能
 */

import type { HeadingData, TOCScrollOptions } from "../types/toc";

/**
 * 从 DOM 中提取标题数据
 */
export function extractHeadingsFromDOM(
	containerSelector = "#post-container",
): HeadingData[] {
	const container = document.querySelector(containerSelector);
	if (!container) {
		return [];
	}

	const headings = container.querySelectorAll(
		"h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]",
	);
	return Array.from(headings).map((h) => ({
		id: h.id,
		text: (h.textContent || "").replace(/#+\s*$/, ""),
		level: parseInt(h.tagName[1], 10),
	}));
}

/**
 * 滚动到指定标题
 */
export function scrollToHeading(
	id: string,
	options: TOCScrollOptions = {},
): void {
	const { offset = 80, behavior = "smooth" } = options;
	const element = document.getElementById(id);
	if (!element) {
		return;
	}

	const targetTop =
		element.getBoundingClientRect().top + window.scrollY - offset;
	window.scrollTo({ top: targetTop, behavior });
}

/**
 * 创建标题点击处理器
 */
export function createHeadingClickHandler(
	getConfig?: () => { offset?: number; behavior?: ScrollBehavior },
): (event: Event) => void {
	return (event: Event) => {
		const anchor = (event.composedPath() as EventTarget[]).find(
			(el) => el instanceof HTMLAnchorElement,
		) as HTMLAnchorElement | undefined;

		if (!anchor?.hash) {
			return;
		}

		event.preventDefault();
		const id = decodeURIComponent(anchor.hash.substring(1));
		const config = getConfig?.() || {};
		scrollToHeading(id, {
			offset: config.offset,
			behavior: config.behavior,
		});
	};
}

/**
 * 获取 TOC 配置
 */
export function getTOCConfig(): {
	depth: number;
	useJapaneseBadge: boolean;
} {
	const siteConfig = (
		window as unknown as {
			siteConfig?: {
				toc?: { depth?: number; useJapaneseBadge?: boolean };
			};
		}
	).siteConfig;
	return {
		depth: siteConfig?.toc?.depth ?? 3,
		useJapaneseBadge: siteConfig?.toc?.useJapaneseBadge ?? false,
	};
}

/**
 * 检查当前页面是否为文章页
 */
export function isPostPage(): boolean {
	const container = document.querySelector(
		".custom-md, .markdown-content, .prose, #post-container",
	);
	return container !== null;
}

/**
 * 获取容器选择器
 */
export function getContainerSelector(): string {
	if (typeof document === "undefined") {
		return "#post-container";
	}
	if (document.querySelector(".custom-md")) {
		return ".custom-md";
	}
	if (document.querySelector(".prose")) {
		return ".prose";
	}
	if (document.querySelector(".markdown-content")) {
		return ".markdown-content";
	}
	if (document.querySelector("#post-container")) {
		return "#post-container";
	}
	return ".custom-md";
}
