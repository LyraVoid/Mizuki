/**
 * 运行时性能监控工具
 * 收集 Core Web Vitals 指标并可选上报到分析服务
 */

// Web Vitals 类型定义
interface LayoutShift extends PerformanceEntry {
	value: number;
	hadRecentInput: boolean;
	numInputEvents: number;
	numLongTasks: number;
	lastInputTime: number;
}

interface LargestContentfulPaint extends PerformanceEntry {
	renderTime: number;
	loadTime: number;
	size: number;
	element?: Element;
	url?: string;
	id?: string;
}

interface PerformanceEventTiming extends PerformanceEntry {
	processingStart: number;
	processingEnd: number;
	duration: number;
	cancelable: boolean;
	target: Node | null;
	startTime: number;
}

export interface WebVitalsMetric {
	name: string;
	value: number;
	rating: "good" | "needs-improvement" | "poor";
	delta: number;
	id: string;
	entries: PerformanceEntry[];
}

export type MetricCallback = (metric: WebVitalsMetric) => void;

/**
 * 观察 Cumulative Layout Shift (CLS)
 */
export function observeCLS(callback: MetricCallback): () => void {
	let clsValue = 0;
	let clsEntries: LayoutShift[] = [];

	const observer = new PerformanceObserver((list) => {
		for (const entry of list.getEntries()) {
			const layoutShift = entry as LayoutShift;
			if (!layoutShift.hadRecentInput) {
				clsEntries.push(layoutShift);
				clsValue += layoutShift.value;
			}
		}
	});

	observer.observe({ type: "layout-shift", buffered: true });

	// 每隔 1 秒上报一次 CLS 值
	const intervalId = setInterval(() => {
		if (clsValue > 0) {
			callback({
				name: "CLS",
				value: clsValue,
				rating:
					clsValue < 0.1
						? "good"
						: clsValue < 0.25
							? "needs-improvement"
							: "poor",
				delta: clsValue,
				id: `cls-${Date.now()}`,
				entries: clsEntries,
			});
		}
	}, 1000);

	// 最终上报
	const snoopOnPreviousEntries = () => {
		clsEntries = [];
		new PerformanceObserver((list) => {
			for (const entry of list.getEntries()) {
				const layoutShift = entry as LayoutShift;
				if (!layoutShift.hadRecentInput) {
					clsEntries.push(layoutShift);
				}
			}
		}).observe({ type: "layout-shift", buffered: true });
	};

	// 返回清理函数
	return () => {
		clearInterval(intervalId);
		observer.disconnect();
		snoopOnPreviousEntries();
	};
}

/**
 * 观察 Largest Contentful Paint (LCP)
 */
export function observeLCP(
	callback: MetricCallback,
	reportAllChanges = false,
): () => void {
	let lcpValue = 0;
	const lcpEntries: LargestContentfulPaint[] = [];

	const observer = new PerformanceObserver((list) => {
		const entries = list.getEntries();
		const lastEntry = entries[entries.length - 1];
		if (lastEntry) {
			lcpEntries.push(lastEntry as LargestContentfulPaint);
			lcpValue =
				(lastEntry as LargestContentfulPaint).renderTime ||
				(lastEntry as LargestContentfulPaint).loadTime;

			if (reportAllChanges || lcpValue > 0) {
				callback({
					name: "LCP",
					value: lcpValue,
					rating:
						lcpValue < 2500
							? "good"
							: lcpValue < 4000
								? "needs-improvement"
								: "poor",
					delta: lcpValue,
					id: `lcp-${Date.now()}`,
					entries: lcpEntries,
				});
			}
		}
	});

	observer.observe({ type: "largest-contentful-paint", buffered: true });

	// 返回清理函数
	return () => {
		observer.disconnect();
	};
}

/**
 * 观察 First Input Delay (FID) / Interaction to Next Paint (INP)
 */
export function observeFID(callback: MetricCallback): () => void {
	// FID 已弃用，使用 INP 代替
	let fidValue = 0;

	const observer = new PerformanceObserver((list) => {
		for (const entry of list.getEntries()) {
			const firstInput = entry as PerformanceEventTiming;
			if (firstInput) {
				fidValue = firstInput.processingStart - firstInput.startTime;

				callback({
					name: "FID",
					value: fidValue,
					rating:
						fidValue < 100
							? "good"
							: fidValue < 300
								? "needs-improvement"
								: "poor",
					delta: fidValue,
					id: `fid-${Date.now()}`,
					entries: [firstInput],
				});
			}
		}
	});

	observer.observe({ type: "first-input", buffered: true });

	// 返回清理函数
	return () => {
		observer.disconnect();
	};
}

/**
 * 观察 Interaction to Next Paint (INP)
 */
export function observeINP(callback: MetricCallback): () => void {
	let inpValue = 0;
	const inpEntries: PerformanceEventTiming[] = [];
	let pendingEntries: PerformanceEventTiming[] = [];

	const observer = new PerformanceObserver((list) => {
		for (const entry of list.getEntries()) {
			const eventTiming = entry as PerformanceEventTiming;
			// 使用类型断言访问 interactionId
			if ((eventTiming as { interactionId?: number }).interactionId) {
				pendingEntries.push(eventTiming);
			}
		}
	});

	// 使用类型断言来传递非标准选项
	observer.observe({
		type: "event",
		buffered: true,
		...({ durationThreshold: 16 } as PerformanceObserverInit),
	});

	// 检查待处理的交互
	const checkPendingEntries = () => {
		for (const entry of pendingEntries) {
			const duration = entry.duration;
			if (duration > inpValue) {
				inpValue = duration;
				inpEntries.push(entry);
			}
		}
		pendingEntries = [];

		if (inpValue > 0) {
			callback({
				name: "INP",
				value: inpValue,
				rating:
					inpValue < 200
						? "good"
						: inpValue < 500
							? "needs-improvement"
							: "poor",
				delta: inpValue,
				id: `inp-${Date.now()}`,
				entries: inpEntries,
			});
		}
	};

	const intervalId = setInterval(checkPendingEntries, 100);

	// 返回清理函数
	return () => {
		clearInterval(intervalId);
		observer.disconnect();
	};
}

/**
 * 观察 First Contentful Paint (FCP)
 */
export function observeFCP(callback: MetricCallback): () => void {
	let fcpValue = 0;

	const observer = new PerformanceObserver((list) => {
		for (const entry of list.getEntries()) {
			if (entry.name === "first-contentful-paint") {
				fcpValue = entry.startTime;
				callback({
					name: "FCP",
					value: fcpValue,
					rating:
						fcpValue < 1800
							? "good"
							: fcpValue < 3000
								? "needs-improvement"
								: "poor",
					delta: fcpValue,
					id: `fcp-${Date.now()}`,
					entries: [entry],
				});
			}
		}
	});

	observer.observe({ type: "paint", buffered: true });

	// 返回清理函数
	return () => {
		observer.disconnect();
	};
}

/**
 * 观察 Navigation Timing API
 */
export function observeNavigationTiming(callback: MetricCallback): () => void {
	const observer = new PerformanceObserver((list) => {
		for (const entry of list.getEntries()) {
			if (entry.entryType === "navigation") {
				const nav = entry as PerformanceNavigationTiming;
				callback({
					name: "NavigationTiming",
					value: nav.responseStart - nav.requestStart,
					rating: "good",
					delta: nav.responseEnd - nav.requestStart,
					id: `nav-${Date.now()}`,
					entries: [nav],
				});
			}
		}
	});

	observer.observe({ type: "navigation", buffered: true });

	// 返回清理函数
	return () => {
		observer.disconnect();
	};
}

/**
 * 观察 Resource Timing API
 */
export function observeResourceTiming(
	callback: MetricCallback,
	resourceFilter?: (resource: PerformanceResourceTiming) => boolean,
): () => void {
	const observer = new PerformanceObserver((list) => {
		for (const entry of list.getEntries()) {
			const resource = entry as PerformanceResourceTiming;
			if (resourceFilter && !resourceFilter(resource)) {
				continue;
			}
			callback({
				name: "ResourceTiming",
				value: resource.duration,
				rating: "good",
				delta: resource.duration,
				id: `resource-${Date.now()}-${resource.name}`,
				entries: [resource],
			});
		}
	});

	observer.observe({ type: "resource", buffered: true });

	// 返回清理函数
	return () => {
		observer.disconnect();
	};
}

/**
 * 性能回归检测
 */
export function checkPerformanceRegression(
	currentMetrics: Record<string, number>,
	baselineMetrics: Record<string, number>,
	thresholds: { regressionPercent: number },
): {
	hasRegression: boolean;
	regressions: Array<{
		metric: string;
		current: number;
		baseline: number;
		percent: number;
	}>;
} {
	const regressions: Array<{
		metric: string;
		current: number;
		baseline: number;
		percent: number;
	}> = [];

	for (const [metric, currentValue] of Object.entries(currentMetrics)) {
		const baselineValue = baselineMetrics[metric];
		if (baselineValue === undefined || baselineValue === 0) {
			continue;
		}

		const percentChange =
			((currentValue - baselineValue) / baselineValue) * 100;

		if (percentChange > thresholds.regressionPercent) {
			regressions.push({
				metric,
				current: currentValue,
				baseline: baselineValue,
				percent: percentChange,
			});
		}
	}

	return {
		hasRegression: regressions.length > 0,
		regressions,
	};
}

/**
 * 初始化所有 Web Vitals 监控
 */
export function initPerformanceMonitoring(
	callback: MetricCallback,
	options: {
		reportAllChanges?: boolean;
		collectResourceTiming?: boolean;
	} = {},
): () => void {
	const { reportAllChanges = false, collectResourceTiming = false } = options;

	const cleanups: Array<() => void> = [];

	cleanups.push(observeCLS(callback));
	cleanups.push(observeLCP(callback, reportAllChanges));
	cleanups.push(observeFID(callback));
	cleanups.push(observeINP(callback));
	cleanups.push(observeFCP(callback));
	cleanups.push(observeNavigationTiming(callback));

	if (collectResourceTiming) {
		cleanups.push(observeResourceTiming(callback));
	}

	// 返回清理所有监控的函数
	return () => {
		cleanups.forEach((cleanup) => cleanup());
	};
}
