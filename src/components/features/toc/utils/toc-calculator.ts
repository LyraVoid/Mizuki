/**
 * toc-calculator - TOC 计算工具
 * 包含 TOC 生成、徽章计算等核心算法
 */

import type { HeadingData, TOCItem } from "../types/toc";
import { JAPANESE_KATAKANA } from "./japanese-katakana";

/**
 * 计算最小标题级别
 */
export function getMinLevel(headings: HeadingData[]): number {
	if (headings.length === 0) {
		return 1;
	}
	return Math.min(...headings.map((h) => h.level));
}

/**
 * 获取 TOC 徽章文本
 */
export function getBadgeText(
	index: number,
	level: number,
	minLevel: number,
	useJapaneseBadge: boolean,
): string {
	if (level !== minLevel) {
		return "";
	}

	if (useJapaneseBadge && index < JAPANESE_KATAKANA.length) {
		return JAPANESE_KATAKANA[index];
	}
	return (index + 1).toString();
}

/**
 * 生成 TOC 条目数组
 */
export function generateTOCItems(
	headings: HeadingData[],
	depth: number,
	useJapaneseBadge: boolean,
): TOCItem[] {
	if (headings.length === 0) {
		return [];
	}

	const minLevel = getMinLevel(headings);
	let h1Count = 0;

	return headings
		.filter((h) => h.level < minLevel + depth)
		.map((h) => {
			const itemDepth = h.level - minLevel;
			const badge = getBadgeText(
				h1Count,
				h.level,
				minLevel,
				useJapaneseBadge,
			);

			if (h.level === minLevel) {
				h1Count++;
			}

			return {
				id: h.id,
				text: h.text,
				level: h.level,
				depth: itemDepth,
				badge,
			};
		});
}

/**
 * 获取徽章样式类
 */
export function getBadgeClass(level: number, minLevel: number): string {
	if (level === minLevel) {
		return "bg-[var(--toc-badge-bg)] text-[var(--btn-content)]";
	} else if (level === minLevel + 1) {
		return "w-2 h-2 rounded-[0.1875rem] bg-[var(--toc-badge-bg)]";
	} else {
		return "w-1.5 h-1.5 rounded-sm bg-black/5 dark:bg-white/10";
	}
}

/**
 * 获取缩进类
 */
export function getIndentClass(depth: number): string {
	if (depth === 0) {
		return "";
	}
	if (depth === 1) {
		return "ml-4";
	}
	return "ml-8";
}

/**
 * 获取文本样式类
 */
export function getTextClass(level: number, minLevel: number): string {
	if (level <= minLevel + 1) {
		return "text-50";
	}
	return "text-30";
}

/**
 * 检查值是否在范围内
 */
export function isInRange(value: number, min: number, max: number): boolean {
	return min < value && value < max;
}
