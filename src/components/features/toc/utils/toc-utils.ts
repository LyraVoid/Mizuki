/**
 * TOC 组件共享工具函数
 */

import type { HeadingData, TOCConfig, TOCItem } from "../types/toc";
import { getKatakanaBadge } from "./japanese-katakana";

/**
 * 从 DOM 中提取标题数据
 * @param containerSelector - 容器选择器
 * @returns 标题数据数组
 */
export function extractHeadings(
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
		level: parseInt(h.tagName[1]),
	}));
}

/**
 * 计算最小标题级别
 * @param headings - 标题数据数组
 * @returns 最小级别
 */
export function getMinLevel(headings: HeadingData[]): number {
	if (headings.length === 0) {
		return 1;
	}
	return Math.min(...headings.map((h) => h.level));
}

/**
 * 过滤并转换标题为 TOC 条目
 * @param headings - 标题数据数组
 * @param config - TOC 配置
 * @returns TOC 条目数组
 */
export function generateTOCItems(
	headings: HeadingData[],
	config: TOCConfig,
): TOCItem[] {
	if (headings.length === 0) {
		return [];
	}

	const minLevel = getMinLevel(headings);
	const maxDepth = config.depth;

	let h1Count = 0;

	return headings
		.filter((h) => h.level < minLevel + maxDepth)
		.map((h) => {
			const depth = h.level - minLevel;
			let badge: string | undefined;

			if (h.level === minLevel) {
				badge = getKatakanaBadge(h1Count, config.useJapaneseBadge);
				h1Count++;
			}

			return {
				id: h.id,
				text: h.text,
				level: h.level,
				depth,
				badge,
			};
		});
}

/**
 * 滚动到指定标题
 * @param id - 标题 ID
 * @param offset - 顶部偏移量（用于导航栏）
 */
export function scrollToHeading(id: string, offset = 80): void {
	const element = document.getElementById(id);
	if (!element) {
		return;
	}

	const targetTop =
		element.getBoundingClientRect().top + window.scrollY - offset;
	window.scrollTo({
		top: targetTop,
		behavior: "smooth",
	});
}

/**
 * 创建标题可见性观察器
 * @param onActiveChange - 活动标题变更回调
 * @param options - 观察器选项
 * @returns IntersectionObserver 实例
 */
export function createHeadingObserver(
	onActiveChange: (id: string) => void,
	options: { rootMargin?: string; threshold?: number } = {},
): IntersectionObserver {
	const { rootMargin = "-80px 0px -80% 0px", threshold = 0 } = options;

	return new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting && entry.target.id) {
					onActiveChange(entry.target.id);
				}
			});
		},
		{ rootMargin, threshold },
	);
}

/**
 * 从全局配置获取 TOC 配置
 * @returns TOC 配置
 */
export function getTOCConfig(): TOCConfig {
	const siteConfig = window.siteConfig || {};
	return {
		enable: siteConfig.toc?.enable ?? true,
		mode: siteConfig.toc?.mode ?? "sidebar",
		depth: siteConfig.toc?.depth ?? 3,
		useJapaneseBadge: siteConfig.toc?.useJapaneseBadge ?? false,
	};
}

/**
 * 计算阅读进度
 * @returns 进度值（0-1）
 */
export function calculateReadingProgress(): number {
	const scrollTop = window.scrollY || document.documentElement.scrollTop;
	const docHeight =
		document.documentElement.scrollHeight -
		document.documentElement.clientHeight;
	return docHeight > 0 ? scrollTop / docHeight : 0;
}

/**
 * 防抖函数
 * @param fn - 要防抖的函数
 * @param delay - 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
	fn: T,
	delay: number,
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), delay);
	};
}
