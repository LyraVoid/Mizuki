/**
 * 过渡效果控制器
 * 管理页面过渡动画的配置和行为
 */

import { TRANSITION_CONFIG, type TransitionConfig } from "../core/swup-config";

export class TransitionEffect {
	private config: TransitionConfig;
	private root: HTMLElement;

	constructor(config?: Partial<TransitionConfig>) {
		this.config = { ...TRANSITION_CONFIG, ...config };
		this.root = document.documentElement;
	}

	/**
	 * 应用过渡配置到 CSS 变量
	 */
	applyConfig(): void {
		const { duration, easing, easingOut, translateDistance, staggerDelay } =
			this.config;

		this.root.style.setProperty("--transition-duration", `${duration}ms`);
		this.root.style.setProperty("--transition-easing", easing);
		this.root.style.setProperty("--transition-easing-out", easingOut);
		this.root.style.setProperty(
			"--transition-translate",
			translateDistance,
		);
		this.root.style.setProperty(
			"--transition-stagger",
			`${staggerDelay}ms`,
		);
	}

	/**
	 * 重置为默认配置
	 */
	reset(): void {
		this.config = { ...TRANSITION_CONFIG };
		this.applyConfig();
	}

	/**
	 * 动态调整动画时长
	 */
	setDuration(duration: number): void {
		this.config.duration = duration;
		this.root.style.setProperty("--transition-duration", `${duration}ms`);
	}

	/**
	 * 动态调整位移距离
	 */
	setTranslateDistance(distance: string): void {
		this.config.translateDistance = distance;
		this.root.style.setProperty("--transition-translate", distance);
	}

	/**
	 * 获取当前配置
	 */
	getConfig(): TransitionConfig {
		return { ...this.config };
	}

	/**
	 * 销毁实例
	 */
	destroy(): void {
		this.reset();
	}
}

let transitionEffectInstance: TransitionEffect | null = null;

export function getTransitionEffect(
	config?: Partial<TransitionConfig>,
): TransitionEffect {
	if (!transitionEffectInstance) {
		transitionEffectInstance = new TransitionEffect(config);
	}
	return transitionEffectInstance;
}

export function destroyTransitionEffect(): void {
	if (transitionEffectInstance) {
		transitionEffectInstance.destroy();
		transitionEffectInstance = null;
	}
}
