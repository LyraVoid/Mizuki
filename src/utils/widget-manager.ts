import { sidebarLayoutConfig } from "../config";
import type {
	SidebarLayoutConfig,
	WidgetComponentConfig,
	WidgetComponentType,
} from "../types/config";

/**
 * 组件映射表 - 将组件类型映射到实际的组件路径
 */
export const WIDGET_COMPONENT_MAP = {
	profile: "../components/widget/Profile.astro",
	announcement: "../components/widget/Announcement.astro",
	categories: "../components/widget/Categories.astro",
	tags: "../components/widget/Tags.astro",
	toc: "../components/widget/TOC.astro",
	"music-player": "../components/widget/MusicPlayer.svelte",
	pio: "../components/widget/Pio.astro", // 添加 Pio 组件映射
	"site-stats": "../components/widget/SiteStats.astro", // 站点统计组件
	calendar: "../components/widget/Calendar.astro", // 日历组件
	custom: null, // 自定义组件需要在配置中指定路径
} as const;

/**
 * 组件管理器类
 * 负责管理侧边栏组件的动态加载、排序和渲染
 */
export class WidgetManager {
	private config: SidebarLayoutConfig;

	constructor(config: SidebarLayoutConfig = sidebarLayoutConfig) {
		this.config = config;
	}

	/**
	 * 获取配置
	 */
	getConfig(): SidebarLayoutConfig {
		return this.config;
	}

	/**
	 * 根据位置获取组件列表
	 * @param position 组件位置：'top' | 'sticky'
	 * @param sidebar 侧边栏位置（可选）：'left' | 'right' | 'drawer'
	 * @param deviceType 设备类型（可选）：'mobile' | 'tablet' | 'desktop'
	 */
	getComponentsByPosition(
		position: "top" | "sticky",
		sidebar: "left" | "right" | "drawer" = "left",
		deviceType: "mobile" | "tablet" | "desktop" = "desktop",
	): WidgetComponentConfig[] {
		let activeSidebar = sidebar;

		// 手机端逻辑：完全由 drawer 决定，不合并左右侧栏
		if (deviceType === "mobile") {
			activeSidebar = "drawer";
		}
		// 平板端逻辑：在左侧有配置组件的情况下仅保留左侧组件，左侧没有配置组件时则将右侧的组件移到左侧
		else if (deviceType === "tablet") {
			if (sidebar === "right") {
				return [];
			}
			if (sidebar === "left") {
				activeSidebar =
					this.config.components.left.length > 0 ? "left" : "right";
			}
		}

		const componentTypes = this.config.components[activeSidebar] || [];

		return componentTypes
			.map((type) => {
				const prop = this.config.properties.find((p) => p.type === type);
				if (prop && prop.position === position) {
					return prop;
				}
				// 如果没有在 properties 中找到配置，且位置匹配默认的 top，则返回一个基础配置
				if (!prop && position === "top") {
					return { type, position: "top" } as WidgetComponentConfig;
				}
				return null;
			})
			.filter(Boolean) as WidgetComponentConfig[];
	}

	/**
	 * 获取组件的动画延迟时间
	 * @param component 组件配置
	 * @param index 组件在列表中的索引
	 */
	getAnimationDelay(component: WidgetComponentConfig, index: number): number {
		if (component.animationDelay !== undefined) {
			return component.animationDelay;
		}

		if (this.config.defaultAnimation.enable) {
			return (
				this.config.defaultAnimation.baseDelay +
				index * this.config.defaultAnimation.increment
			);
		}

		return 0;
	}

	/**
	 * 获取组件的CSS类名
	 * @param component 组件配置
	 * @param index 组件在列表中的索引
	 */
	getComponentClass(
		component: WidgetComponentConfig,
		_index: number,
	): string {
		const classes: string[] = [];

		// 添加基础类名
		if (component.class) {
			classes.push(component.class);
		}

		// 添加响应式隐藏类名
		if (component.responsive?.hidden) {
			component.responsive.hidden.forEach((device) => {
				switch (device) {
					case "mobile":
						classes.push("hidden", "md:block");
						break;
					case "tablet":
						classes.push("md:hidden", "lg:block");
						break;
					case "desktop":
						classes.push("lg:hidden");
						break;
				}
			});
		}

		return classes.join(" ");
	}

	/**
	 * 获取组件的内联样式
	 * @param component 组件配置
	 * @param index 组件在列表中的索引
	 */
	getComponentStyle(component: WidgetComponentConfig, index: number): string {
		const styles: string[] = [];

		// 添加自定义样式
		if (component.style) {
			styles.push(component.style);
		}

		// 添加动画延迟样式
		const animationDelay = this.getAnimationDelay(component, index);
		if (animationDelay > 0) {
			styles.push(`animation-delay: ${animationDelay}ms`);
		}

		return styles.join("; ");
	}

	/**
	 * 检查组件是否应该折叠
	 * @param component 组件配置
	 * @param itemCount 组件内容项数量
	 */
	isCollapsed(component: WidgetComponentConfig, itemCount: number): boolean {
		if (!component.responsive?.collapseThreshold) {
			return false;
		}
		return itemCount >= component.responsive.collapseThreshold;
	}

	/**
	 * 获取组件的路径
	 * @param componentType 组件类型
	 */
	getComponentPath(componentType: WidgetComponentType): string | null {
		return WIDGET_COMPONENT_MAP[componentType];
	}

	/**
	 * 检查当前设备是否应该显示侧边栏
	 * @param deviceType 设备类型
	 */
	shouldShowSidebar(deviceType: "mobile" | "tablet" | "desktop"): boolean {
		if (deviceType === "mobile") {
			return this.config.components.drawer.length > 0;
		}
		if (deviceType === "tablet") {
			return (
				this.config.components.left.length > 0 ||
				this.config.components.right.length > 0
			);
		}
		// desktop
		return (
			this.config.components.left.length > 0 ||
			this.config.components.right.length > 0
		);
	}

	/**
	 * 获取设备断点配置
	 */
	getBreakpoints() {
		return this.config.responsive.breakpoints;
	}

	/**
	 * 更新组件配置
	 * @param newConfig 新的配置
	 */
	updateConfig(newConfig: Partial<SidebarLayoutConfig>): void {
		this.config = { ...this.config, ...newConfig };
	}

	/**
	 * 添加新组件到布局中
	 * @param type 组件类型
	 * @param sidebar 侧边栏位置
	 */
	addComponentToLayout(
		type: WidgetComponentType,
		sidebar: "left" | "right" | "drawer" = "left",
	): void {
		if (!this.config.components[sidebar].includes(type)) {
			this.config.components[sidebar].push(type);
		}
	}

	/**
	 * 从布局中移除组件
	 * @param type 组件类型
	 */
	removeComponentFromLayout(type: WidgetComponentType): void {
		this.config.components.left = this.config.components.left.filter(
			(t) => t !== type,
		);
		this.config.components.right = this.config.components.right.filter(
			(t) => t !== type,
		);
		this.config.components.drawer = this.config.components.drawer.filter(
			(t) => t !== type,
		);
	}

	/**
	 * 检查组件是否应该在侧边栏中渲染
	 * @param componentType 组件类型
	 */
	isSidebarComponent(componentType: WidgetComponentType): boolean {
		// Pio 组件是全局组件，不在侧边栏中渲染
		return componentType !== "pio";
	}
}

/**
 * 默认组件管理器实例
 */
export const widgetManager = new WidgetManager();

/**
 * 工具函数：根据组件类型获取组件配置
 * @param componentType 组件类型
 */
export function getComponentConfig(
	componentType: WidgetComponentType,
): WidgetComponentConfig | undefined {
	return widgetManager
		.getConfig()
		.properties.find((p) => p.type === componentType);
}

/**
 * 工具函数：检查组件是否启用
 * @param componentType 组件类型
 */
export function isComponentEnabled(
	componentType: WidgetComponentType,
): boolean {
	const config = widgetManager.getConfig().components;
	return (
		config.left.includes(componentType) ||
		config.right.includes(componentType) ||
		config.drawer.includes(componentType)
	);
}

/**
 * 工具函数：获取所有启用的组件类型(左侧边栏为主)
 */
export function getEnabledComponentTypes(): WidgetComponentType[] {
	return widgetManager.getConfig().components.left;
}
