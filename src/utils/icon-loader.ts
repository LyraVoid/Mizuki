// 图标加载工具类
// 提供可靠的Iconify图标加载解决方案

interface IconifyLoadOptions {
	timeout?: number;
	retryCount?: number;
	retryDelay?: number;
}

class IconLoader {
	private static instance: IconLoader;
	private isLoaded = false;
	private isLoading = false;
	private loadPromise: Promise<void> | null = null;
	private observers = new Set<() => void>();

	private constructor() {}

	static getInstance(): IconLoader {
		if (!IconLoader.instance) {
			IconLoader.instance = new IconLoader();
		}
		return IconLoader.instance;
	}

	/**
	 * 加载Iconify图标库
	 */
	async loadIconify(options: IconifyLoadOptions = {}): Promise<void> {
		const { timeout = 10000, retryCount = 3, retryDelay = 1000 } = options;

		// 如果已经加载完成，直接返回
		if (this.isLoaded) {
			return Promise.resolve();
		}

		// 如果正在加载，返回现有的Promise
		if (this.isLoading && this.loadPromise) {
			return this.loadPromise;
		}

		this.isLoading = true;
		this.loadPromise = this.loadWithRetry(timeout, retryCount, retryDelay);

		try {
			await this.loadPromise;
			this.isLoaded = true;
			this.notifyObservers();
		} catch (error) {
			console.error("Failed to load Iconify after all retries:", error);
			throw error;
		} finally {
			this.isLoading = false;
		}
	}

	/**
	 * 带重试机制的加载
	 */
	private async loadWithRetry(
		timeout: number,
		retryCount: number,
		retryDelay: number,
	): Promise<void> {
		for (let attempt = 1; attempt <= retryCount; attempt++) {
			try {
				await this.loadScript(timeout);
				return;
			} catch (error) {
				console.warn(`Iconify load attempt ${attempt} failed:`, error);

				if (attempt === retryCount) {
					throw new Error(
						`Failed to load Iconify after ${retryCount} attempts`,
					);
				}

				// 等待后重试
				await new Promise((resolve) => setTimeout(resolve, retryDelay));
			}
		}
	}

	/**
	 * 加载脚本
	 */
	private loadScript(timeout: number): Promise<void> {
		return new Promise((resolve, reject) => {
			// 检查是否已经存在脚本
			const existingScript = document.querySelector(
				'script[src*="iconify-icon"]',
			);
			if (existingScript) {
				// 检查Iconify是否已经可用
				if (this.isIconifyReady()) {
					resolve();
					return;
				}
			}

			const script = document.createElement("script");
			script.src =
				"https://code.iconify.design/iconify-icon/3-latest/iconify-icon.min.js";
			script.async = true;
			script.defer = true;

			const timeoutId = setTimeout(() => {
				script.remove();
				reject(new Error("Iconify script load timeout"));
			}, timeout);

			script.onload = () => {
				clearTimeout(timeoutId);
				// 等待Iconify完全初始化
				this.waitForIconifyReady().then(resolve).catch(reject);
			};

			script.onerror = () => {
				clearTimeout(timeoutId);
				script.remove();
				reject(new Error("Failed to load Iconify script"));
			};

			document.head.appendChild(script);
		});
	}

	/**
	 * 等待Iconify完全准备就绪
	 */
	private waitForIconifyReady(maxWait = 5000): Promise<void> {
		return new Promise((resolve, reject) => {
			const startTime = Date.now();

			const checkReady = () => {
				if (this.isIconifyReady()) {
					resolve();
					return;
				}

				if (Date.now() - startTime > maxWait) {
					reject(new Error("Iconify initialization timeout"));
					return;
				}

				setTimeout(checkReady, 100);
			};

			checkReady();
		});
	}

	/**
	 * 检查Iconify是否准备就绪
	 */
	private isIconifyReady(): boolean {
		return (
			typeof window !== "undefined" &&
			"customElements" in window &&
			customElements.get("iconify-icon") !== undefined
		);
	}

	/**
	 * 添加加载完成观察者
	 */
	onLoad(callback: () => void): void {
		if (this.isLoaded) {
			callback();
		} else {
			this.observers.add(callback);
		}
	}

	/**
	 * 移除观察者
	 */
	offLoad(callback: () => void): void {
		this.observers.delete(callback);
	}

	/**
	 * 通知所有观察者
	 */
	private notifyObservers(): void {
		this.observers.forEach((callback) => {
			try {
				callback();
			} catch (error) {
				console.error("Error in icon load observer:", error);
			}
		});
		this.observers.clear();
	}

	/**
	 * 获取加载状态
	 */
	getLoadState(): { isLoaded: boolean; isLoading: boolean } {
		return {
			isLoaded: this.isLoaded,
			isLoading: this.isLoading,
		};
	}

	/**
	 * 预加载指定图标
	 */
	async preloadIcons(icons: string[]): Promise<void> {
		if (!this.isLoaded) {
			await this.loadIconify();
		}

		// 等待图标加载
		return new Promise((resolve) => {
			let loadedCount = 0;
			const totalIcons = icons.length;

			if (totalIcons === 0) {
				resolve();
				return;
			}

			const checkComplete = () => {
				loadedCount++;
				if (loadedCount >= totalIcons) {
					resolve();
				}
			};

			// 创建临时图标元素来触发加载
			icons.forEach((icon) => {
				const tempIcon = document.createElement("iconify-icon");
				tempIcon.setAttribute("icon", icon);
				tempIcon.style.display = "none";
				tempIcon.onload = checkComplete;
				tempIcon.onerror = checkComplete; // 即使加载失败也要继续
				document.body.appendChild(tempIcon);

				// 清理临时元素
				setTimeout(() => {
					if (tempIcon.parentNode) {
						tempIcon.parentNode.removeChild(tempIcon);
					}
				}, 1000);
			});

			// 设置超时
			setTimeout(() => {
				resolve();
			}, 5000);
		});
	}
}

// 导出单例实例
export const iconLoader = IconLoader.getInstance();

// 导出便捷函数
export const loadIconify = (options?: IconifyLoadOptions) =>
	iconLoader.loadIconify(options);
export const preloadIcons = (icons: string[]) => iconLoader.preloadIcons(icons);
export const onIconsReady = (callback: () => void) =>
	iconLoader.onLoad(callback);
