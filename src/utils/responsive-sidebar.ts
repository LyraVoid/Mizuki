/**
 * 响应式侧边栏管理器
 * 提供侧边栏响应式显示的通用逻辑
 */
import type { SidebarElementId } from "./types/widget";
import { widgetManager } from "./widget-manager";
import { getDeviceType } from "./widget-renderer";

// Window 扩展接口
interface WindowWithCustomProps extends Window {
	[key: string]: unknown;
}

/**
 * 侧边栏显示配置
 */
export interface SidebarDisplayConfig {
	elementId: SidebarElementId;
	managerKey: string;
	breakpoints: { mobile: number; tablet: number };
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
 * 创建侧边栏显示属性
 * @param config 显示配置
 * @returns 计算后的 CSS 显示属性
 */
function getSidebarDisplayProperty(
	config: SidebarDisplayConfig,
): Record<string, string> {
	const width = window.innerWidth;
	const deviceType = getDeviceType(width, config.breakpoints);

	let show = false;
	if (deviceType === "mobile") {
		show = config.showConfig.mobile && config.hasComponents.mobile;
	} else if (deviceType === "tablet") {
		show = config.showConfig.tablet && config.hasComponents.tablet;
	} else {
		show = config.showConfig.desktop && config.hasComponents.tablet;
	}

	return {
		[`--sidebar-${deviceType}-display`]: show ? "block" : "none",
	};
}

/**
 * 初始化响应式侧边栏管理器
 * @param config 侧边栏显示配置
 */
export function initSidebarManager(config: SidebarDisplayConfig): void {
	const managerKey = config.managerKey;
	const win = window as unknown as WindowWithCustomProps;

	// 避免重复初始化
	if (win[managerKey]) {
		return;
	}
	win[managerKey] = true;

	/**
	 * 更新侧边栏显示状态
	 */
	function updateDisplay(): void {
		const sidebar = document.getElementById(config.elementId);
		if (!sidebar) {
			return;
		}

		const displayProps = getSidebarDisplayProperty(config);
		for (const [property, value] of Object.entries(displayProps)) {
			sidebar.style.setProperty(property, value);
		}
	}

	// 初始化显示状态
	updateDisplay();

	// 监听窗口大小变化
	const resizeHandler = (): void => updateDisplay();
	const resizeKey = `${config.managerKey}ResizeHandler`;
	win[resizeKey] = resizeHandler;
	window.addEventListener("resize", resizeHandler);

	// 监听 SWUP 内容替换事件
	if (typeof window !== "undefined" && win.swup) {
		const swupHookKey = `${config.managerKey}SwupHooked`;
		if (!win[swupHookKey]) {
			win[swupHookKey] = true;
			win.swup.hooks.on("content:replace", () => {
				// 延迟执行以确保 DOM 已更新
				setTimeout(() => {
					updateDisplay();
				}, 100);
			});
		}
	}
}

/**
 * 获取 RightSideBar 的显示配置
 */
export function getRightSidebarDisplayConfig(): SidebarDisplayConfig {
	return {
		elementId: "right-sidebar",
		managerKey: "__mizukiRightSidebarManagerInitialized",
		breakpoints: widgetManager.getBreakpoints(),
		showConfig: {
			mobile: false,
			tablet: false,
			desktop: true,
		},
		hasComponents: {
			mobile: false,
			tablet: false,
		},
	};
}
