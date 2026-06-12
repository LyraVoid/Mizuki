/**
 * TOC 组件共享类型定义
 */

export interface TOCItem {
	/** 标题 ID（用于锚点） */
	id: string;
	/** 标题文本 */
	text: string;
	/** 标题级别（1-6） */
	level: number;
	/** 相对深度（0 = 顶级） */
	depth: number;
	/** 徽章文本（数字或日语字符） */
	badge?: string;
}

export interface TOCConfig {
	/** 是否启用 TOC */
	enable: boolean;
	/** 显示模式 */
	mode: "float" | "sidebar";
	/** 标题深度（1-6） */
	depth: number;
	/** 是否使用日语徽章 */
	useJapaneseBadge: boolean;
}

export interface HeadingData {
	/** 标题 ID */
	id: string;
	/** 标题文本 */
	text: string;
	/** 标题级别（1-6） */
	level: number;
}

export interface TOCBaseProps {
	/** 自定义类名 */
	class?: string;
}

export interface TOCObserverOptions {
	/** 根部边距 */
	rootMargin?: string;
	/** 阈值 */
	threshold?: number;
	/** 活动标题变化回调 */
	onActiveChange?: (id: string) => void;
}

export interface TOCScrollOptions {
	/** 顶部偏移量（用于导航栏） */
	offset?: number;
	/** 是否平滑滚动 */
	behavior?: ScrollBehavior;
}
