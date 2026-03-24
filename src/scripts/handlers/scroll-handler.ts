/**
 * 滚动处理器
 * 管理页面滚动相关的功能，包括自定义滚动条和滚动监听
 */

/**
 * 滚动处理器类
 * 负责自定义滚动条初始化和滚动事件管理
 */
export class ScrollHandler {
	private katexScrollbarStyleAdded = false;

	/**
	 * 初始化自定义滚动条
	 * 为 KaTeX 公式添加水平滚动支持
	 */
	initCustomScrollbar(): void {
		const katexElements = document.querySelectorAll(
			".katex-display:not([data-scrollbar-initialized])",
		) as NodeListOf<HTMLElement>;

		katexElements.forEach((element) => {
			if (!element.parentNode) {
				return;
			}

			const container = document.createElement("div");
			container.className = "katex-display-container";
			element.parentNode.insertBefore(container, element);
			container.appendChild(element);

			// 使用 CSS 滚动条
			container.style.cssText = `
				overflow-x: auto;
				scrollbar-width: thin;
				scrollbar-color: rgba(0,0,0,0.3) transparent;
			`;

			// 添加 webkit 自定义滚动条样式（只添加一次）
			this.addKatexScrollbarStyle();

			element.setAttribute("data-scrollbar-initialized", "true");
		});
	}

	/**
	 * 添加 KaTeX 滚动条样式（只添加一次）
	 */
	private addKatexScrollbarStyle(): void {
		if (this.katexScrollbarStyleAdded) {
			return;
		}

		const style = document.createElement("style");
		style.textContent = `
			.katex-display-container::-webkit-scrollbar {
				height: 6px;
			}
			.katex-display-container::-webkit-scrollbar-track {
				background: transparent;
			}
			.katex-display-container::-webkit-scrollbar-thumb {
				background: rgba(0,0,0,0.3);
				border-radius: 3px;
			}
			.katex-display-container::-webkit-scrollbar-thumb:hover {
				background: rgba(0,0,0,0.5);
			}
		`;

		if (!document.head.querySelector("style[data-katex-scrollbar]")) {
			style.setAttribute("data-katex-scrollbar", "true");
			document.head.appendChild(style);
			this.katexScrollbarStyleAdded = true;
		}
	}

	/**
	 * 检查并加载 KaTeX 样式
	 */
	checkKatex(): void {
		if (document.querySelector(".katex")) {
			import("katex/dist/katex.css");
		}
	}

	/**
	 * 节流函数
	 * 限制函数调用频率
	 */
	static throttle<T extends (...args: any[]) => any>(
		func: T,
		limit: number,
	): (...args: Parameters<T>) => void {
		let inThrottle = false;
		return function (this: any, ...args: Parameters<T>) {
			if (!inThrottle) {
				func.apply(this, args);
				inThrottle = true;
				setTimeout(() => (inThrottle = false), limit);
			}
		};
	}
}

// 创建全局实例
let globalScrollHandler: ScrollHandler | null = null;

/**
 * 获取全局滚动处理器实例
 */
export function getScrollHandler(): ScrollHandler {
	if (!globalScrollHandler) {
		globalScrollHandler = new ScrollHandler();
	}
	return globalScrollHandler;
}

/**
 * 初始化自定义滚动条（便捷函数）
 */
export function initCustomScrollbar(): void {
	const handler = getScrollHandler();
	handler.initCustomScrollbar();
}

/**
 * 检查 KaTeX（便捷函数）
 */
export function checkKatex(): void {
	const handler = getScrollHandler();
	handler.checkKatex();
}
