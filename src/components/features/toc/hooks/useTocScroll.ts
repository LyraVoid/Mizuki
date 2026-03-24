/**
 * useTocScroll - TOC 滚动同步 hook
 * 处理滚动监听、进度计算等
 */

/**
 * 计算阅读进度（0-1）
 */
export function calculateReadingProgress(): number {
	const scrollTop = window.scrollY || document.documentElement.scrollTop;
	const docHeight =
		document.documentElement.scrollHeight -
		document.documentElement.clientHeight;
	return docHeight > 0 ? scrollTop / docHeight : 0;
}

/**
 * 更新进度环的 stroke-dashoffset
 */
export function updateProgressRing(
	circle: SVGCircleElement,
	progress: number,
): void {
	const radius = circle.r.baseVal.value;
	const circumference = radius * 2 * Math.PI;
	const offset = Math.max(
		0,
		Math.min(circumference, circumference - progress * circumference),
	);
	circle.style.strokeDashoffset = offset.toString();
}

/**
 * 创建滚动事件处理器（带 passive 选项）
 */
export function createScrollHandler(
	callback: () => void,
	options: AddEventListenerOptions = {},
): (event: Event) => void {
	const handler = (_event: Event) => {
		callback();
	};

	if (typeof window !== "undefined") {
		window.addEventListener("scroll", handler, {
			passive: true,
			...options,
		});
	}

	return handler;
}

/**
 * 滚动到 TOC 容器内的活动元素
 */
export function scrollActiveIntoView(
	container: HTMLElement,
	activeElements: HTMLElement[],
	tocHeight: number,
): void {
	if (activeElements.length === 0 || !container) {
		return;
	}

	const topmost = activeElements[0];
	const bottommost = activeElements[activeElements.length - 1];

	const visibleHeight =
		bottommost.getBoundingClientRect().bottom -
		topmost.getBoundingClientRect().top;

	let top: number;
	if (visibleHeight < 0.9 * tocHeight) {
		top = topmost.offsetTop - 32;
	} else {
		top = bottommost.offsetTop - tocHeight * 0.8;
	}

	container.scrollTo({ top, left: 0, behavior: "smooth" });
}

/**
 * 计算活动指示器的位置
 */
export function calculateActiveIndicatorPosition(
	container: HTMLElement,
	minEntry: HTMLElement,
	maxEntry: HTMLElement,
): { top: number; height: number } {
	const containerRect = container.getBoundingClientRect();
	const minRect = minEntry.getBoundingClientRect();
	const maxRect = maxEntry.getBoundingClientRect();

	const top = minRect.top - containerRect.top + container.scrollTop;
	const height = maxRect.bottom - minRect.top;

	return { top, height };
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
	fn: T,
	delay: number,
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), delay);
	};
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
	fn: T,
	limit: number,
): (...args: Parameters<T>) => void {
	let inThrottle = false;
	return (...args: Parameters<T>) => {
		if (!inThrottle) {
			fn(...args);
			inThrottle = true;
			setTimeout(() => {
				inThrottle = false;
			}, limit);
		}
	};
}
