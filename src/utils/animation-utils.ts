/**
 * 动画工具类 - 参考 yukina 主题的动画系统
 * 提供页面切换和组件动画的统一管理
 */

export interface AnimationConfig {
	duration?: number;
	delay?: number;
	easing?: string;
	direction?: "up" | "down" | "left" | "right";
}

export class AnimationManager {
	private static instance: AnimationManager;
	private isAnimating = false;
	private animationQueue: (() => void)[] = [];

	static getInstance(): AnimationManager {
		if (!AnimationManager.instance) {
			AnimationManager.instance = new AnimationManager();
		}
		return AnimationManager.instance;
	}

	/**
	 * 初始化动画系统
	 */
	init(): void {
		this.setupSwupIntegration();
		this.setupScrollAnimations();
		console.log("🎨 Animation Manager initialized");
	}

	/**
	 * 设置 Swup 集成
	 */
	private setupSwupIntegration(): void {
		if (typeof window !== "undefined" && (window as any).swup) {
			const swup = (window as any).swup;

			// 页面离开动画
			swup.hooks.on("animation:out:start", () => {
				this.triggerPageLeaveAnimation();
			});

			// 页面进入动画
			swup.hooks.on("animation:in:start", () => {
				this.triggerPageEnterAnimation();
			});

			// 内容替换后重新初始化动画
			swup.hooks.on("content:replace", () => {
				setTimeout(() => {
					this.initializePageAnimations();
				}, 50);
			});
		}
	}

	/**
	 * 触发页面离开动画
	 */
	private triggerPageLeaveAnimation(): void {
		this.isAnimating = true;
		document.documentElement.classList.add("is-leaving");

		// 移动端优化：减少动画延迟，避免闪烁
		const isMobile = window.innerWidth <= 768;
		const delay = isMobile ? 10 : 30;

		// 添加离开动画类到主要元素
		const mainElements = document.querySelectorAll(".transition-leaving");
		mainElements.forEach((element, index) => {
			setTimeout(() => {
				element.classList.add("animate-leave");
			}, index * delay);
		});
	}

	/**
	 * 触发页面进入动画
	 */
	private triggerPageEnterAnimation(): void {
		document.documentElement.classList.remove("is-leaving");
		document.documentElement.classList.add("is-entering");

		// 移除离开动画类
		const elements = document.querySelectorAll(".animate-leave");
		elements.forEach((element) => {
			element.classList.remove("animate-leave");
		});

		setTimeout(() => {
			document.documentElement.classList.remove("is-entering");
			this.isAnimating = false;
			this.processAnimationQueue();
		}, 300);
	}

	/**
	 * 初始化页面动画
	 */
	private initializePageAnimations(): void {
		// 重新应用加载动画
		const animatedElements = document.querySelectorAll(".onload-animation");
		animatedElements.forEach((element, index) => {
			const htmlElement = element as HTMLElement;
			const delay =
				Number.parseInt(htmlElement.style.animationDelay, 10) ||
				index * 50;

			// 重置动画
			htmlElement.style.opacity = "0";
			htmlElement.style.transform = "translateY(1.5rem)";

			setTimeout(() => {
				htmlElement.style.transition =
					"opacity 320ms cubic-bezier(0.4, 0, 0.2, 1), transform 320ms cubic-bezier(0.4, 0, 0.2, 1)";
				htmlElement.style.opacity = "1";
				htmlElement.style.transform = "translateY(0)";
			}, delay);
		});

		// 重新初始化侧边栏组件
		this.initializeSidebarComponents();
	}

	/**
	 * 初始化侧边栏组件
	 */
	private initializeSidebarComponents(): void {
		// 查找页面中的侧边栏元素
		const sidebar = document.getElementById("sidebar");
		if (sidebar) {
			// 触发自定义事件，通知侧边栏重新初始化
			const event = new CustomEvent("sidebar:init");
			sidebar.dispatchEvent(event);
		}

		// 触发全局事件，通知所有组件重新初始化
		const globalEvent = new CustomEvent("page:reinit");
		document.dispatchEvent(globalEvent);
	}

	/**
	 * 设置滚动动画
	 */
	private setupScrollAnimations(): void {
		if (typeof window === "undefined") {
			return;
		}

		const observerOptions = {
			root: null,
			rootMargin: "0px 0px -100px 0px",
			threshold: 0.1,
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("in-view");
					observer.unobserve(entry.target);
				}
			});
		}, observerOptions);

		// 观察所有需要滚动动画的元素
		const scrollElements = document.querySelectorAll(".animate-on-scroll");
		scrollElements.forEach((element) => {
			observer.observe(element);
		});
	}

	/**
	 * 添加动画到队列
	 */
	queueAnimation(callback: () => void): void {
		if (this.isAnimating) {
			this.animationQueue.push(callback);
		} else {
			callback();
		}
	}

	/**
	 * 处理动画队列
	 */
	private processAnimationQueue(): void {
		while (this.animationQueue.length > 0) {
			const callback = this.animationQueue.shift();
			if (callback) {
				callback();
			}
		}
	}

	/**
	 * 创建自定义动画
	 */
	createAnimation(element: HTMLElement, config: AnimationConfig): void {
		const {
			duration = 300,
			delay = 0,
			easing = "cubic-bezier(0.4, 0, 0.2, 1)",
			direction = "up",
		} = config;

		const transforms = {
			up: "translateY(1.5rem)",
			down: "translateY(-1.5rem)",
			left: "translateX(1.5rem)",
			right: "translateX(-1.5rem)",
		};

		// 设置初始状态
		element.style.opacity = "0";
		element.style.transform = transforms[direction];
		element.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;

		setTimeout(() => {
			element.style.opacity = "1";
			element.style.transform = "translate(0)";
		}, delay);
	}

	// batchAnimate is deprecated, use staggerAnimations instead
	// batchAnimate(
	// 	elements: NodeListOf<Element> | Element[],
	// 	config: AnimationConfig & { stagger?: number } = {},
	// ): void {
	// 	const { stagger = 50, ...animationConfig } = config;
	//
	// 	elements.forEach((element, index) => {
	// 		this.createAnimation(element as HTMLElement, {
	// 			...animationConfig,
	// 			delay: (animationConfig.delay || 0) + index * stagger,
	// 		});
	// 	});
	// }

	/**
	 * 批量动画
	 */
	staggerAnimations(
		elements: NodeListOf<Element> | HTMLElement[],
		config: AnimationConfig & { stagger?: number } = {},
	): void {
		const { stagger = 50, ...animationConfig } = config;

		elements.forEach((element: Element | HTMLElement, index: number) => {
			this.createAnimation(element as HTMLElement, {
				...animationConfig,
				delay: (animationConfig.delay || 0) + index * stagger,
			});
		});
	}

	/**
	 * 检查是否正在动画
	 */
	isCurrentlyAnimating(): boolean {
		return this.isAnimating;
	}
}

// 导出单例实例
export const animationManager = AnimationManager.getInstance();

// 自动初始化
if (typeof window !== "undefined") {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => {
			animationManager.init();
		});
	} else {
		animationManager.init();
	}
}
