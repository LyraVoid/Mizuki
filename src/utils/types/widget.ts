import type { MarkdownHeading } from "astro";

import type {
	WidgetComponentConfig,
	WidgetComponentType,
} from "@/types/config";

/**
 * Widget 组件类型
 */
export type WidgetType = WidgetComponentType;

/**
 * Widget 组件配置
 */
export interface WidgetConfig extends WidgetComponentConfig {
	customProps?: Record<string, unknown>;
}

/**
 * Widget 组件映射表类型
 */
export type WidgetComponentMap = Partial<Record<WidgetType, unknown>>;

/**
 * 渲染组件选项
 */
export interface RenderComponentOptions {
	component: WidgetConfig;
	index: number;
	components: WidgetConfig[];
	headings?: MarkdownHeading[];
}

/**
 * 渲染组件结果
 */
export interface RenderComponentResult {
	Component: unknown;
	props: Record<string, unknown>;
}

/**
 * 设备类型
 */
export type DeviceType = "mobile" | "tablet" | "desktop";

/**
 * 响应式边栏配置
 */
export interface ResponsiveSidebarConfig {
	breakpoints: {
		mobile: number;
		tablet: number;
	};
	showConfig: {
		mobile: boolean;
		tablet: boolean;
		desktop: boolean;
	};
	hasComponents: {
		mobile: boolean;
		tablet: boolean;
	};
}

/**
 * 侧边栏管理器接口
 */
export interface SidebarManagerInterface {
	init(): void;
	updateResponsiveDisplay(): void;
}

/**
 * 侧边栏元素 ID 类型
 */
export type SidebarElementId = "sidebar" | "right-sidebar";

/**
 * 侧边栏位置
 */
export type SidebarPosition = "left" | "right" | "drawer";
