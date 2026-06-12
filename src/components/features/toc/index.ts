/**
 * TOC 组件统一导出
 *
 * Astro 组件使用包装器模式重导出
 * Svelte 组件（MobileTOC）请从原始位置导入：@components/MobileTOC.svelte
 */

// 子组件导出
export { default as TOCBadge } from "./components/TOCBadge.astro";
export { default as TOCItemComponent } from "./components/TOCItem.astro";
export { default as TOCProgressBar } from "./components/TOCProgressBar.astro";
// 组件导出（兼容包装器）
export { default as FloatingTOC } from "./FloatingTOC.astro";
// Hooks 导出
export * from "./hooks/useFloatingTOC";
// Highlight hooks
export {
	calculateActiveHeadingRange,
	calculateFallbackActiveHeading,
	createHeadingVisibilityObserver,
	findActiveHeadingByObserver,
	findActiveHeadingIndex,
	isElementInViewport,
} from "./hooks/useTocHighlight";
// Navigation hooks
export {
	createHeadingClickHandler,
	extractHeadingsFromDOM,
	getContainerSelector,
	getTOCConfig as getTocConfig,
	isPostPage,
	scrollToHeading as scrollToTocHeading,
} from "./hooks/useTocNavigation";
// Scroll hooks
export {
	calculateActiveIndicatorPosition,
	calculateReadingProgress as getReadingProgress,
	createScrollHandler,
	debounce as debounceScroll,
	scrollActiveIntoView,
	throttle as throttleScroll,
	updateProgressRing,
} from "./hooks/useTocScroll";
export { default as SidebarTOC } from "./SidebarTOC.astro";
// 类型导出
export type {
	HeadingData,
	TOCBaseProps,
	TOCConfig,
	TOCItem,
	TOCObserverOptions,
	TOCScrollOptions,
} from "./types/toc";
// Calculator utilities
export {
	getKatakanaBadge,
	JAPANESE_KATAKANA,
	KATAKANA_COUNT,
} from "./utils/japanese-katakana";
export {
	generateTOCItems as calcTOCItems,
	getBadgeClass,
	getBadgeText,
	getIndentClass,
	getMinLevel as calcMinLevel,
	getTextClass,
	isInRange,
} from "./utils/toc-calculator";
// 工具函数导出
export {
	calculateReadingProgress,
	createHeadingObserver,
	debounce,
	extractHeadings,
	generateTOCItems,
	getMinLevel,
	getTOCConfig,
	scrollToHeading,
} from "./utils/toc-utils";
