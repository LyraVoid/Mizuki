/**
 * 面板处理器
 * 管理面板的点击外部关闭功能
 */

/**
 * 面板配置接口
 */
interface PanelConfig {
	id: string;
	ignoreElements: string[];
}

/**
 * 面板处理器类
 * 负责初始化面板的点击外部关闭功能
 */
export class PanelHandler {
	private panels: PanelConfig[] = [
		{
			id: "display-setting",
			ignoreElements: ["display-setting", "display-settings-switch"],
		},
		{
			id: "nav-menu-panel",
			ignoreElements: ["nav-menu-panel", "nav-menu-switch"],
		},
		{
			id: "search-panel",
			ignoreElements: ["search-panel", "search-bar", "search-switch"],
		},
		{
			id: "mobile-toc-panel",
			ignoreElements: ["mobile-toc-panel", "mobile-toc-switch"],
		},
		{
			id: "wallpaper-mode-panel",
			ignoreElements: ["wallpaper-mode-panel", "wallpaper-mode-switch"],
		},
	];

	private panelManager: any = null;
	private boundClickHandlers = new Map<string, (event: MouseEvent) => void>();

	/**
	 * 初始化面板处理器
	 */
	async init(): Promise<void> {
		try {
			// 动态导入面板管理器
			const module = await import("../../utils/panel-manager.js");
			this.panelManager = module.panelManager;

			// 设置所有面板的点击外部关闭功能
			this.panels.forEach((panel) => {
				this.setupClickOutsideToClose(panel);
			});

			console.log("PanelHandler: 初始化完成");
			return Promise.resolve();
		} catch (error) {
			console.error("PanelHandler: 初始化失败", error);
			return Promise.reject(error);
		}
	}

	/**
	 * 设置点击外部关闭面板
	 */
	private setupClickOutsideToClose(panel: PanelConfig): void {
		const clickHandler = async (event: MouseEvent) => {
			const target = event.target;
			if (!(target instanceof Node)) {
				return;
			}

			// 检查是否点击了忽略的元素
			for (const ignoreId of panel.ignoreElements) {
				const ignoreElement = document.getElementById(ignoreId);
				if (
					ignoreElement === target ||
					ignoreElement?.contains(target)
				) {
					return;
				}
			}

			// 关闭面板
			if (this.panelManager) {
				await this.panelManager.closePanel(panel.id);
			}
		};

		// 存储绑定的处理器以便后续清理
		this.boundClickHandlers.set(panel.id, clickHandler);
		document.addEventListener("click", clickHandler);
	}

	/**
	 * 添加自定义面板配置
	 */
	addPanel(panel: PanelConfig): void {
		this.panels.push(panel);
		if (this.panelManager) {
			this.setupClickOutsideToClose(panel);
		}
	}

	/**
	 * 移除面板配置
	 */
	removePanel(panelId: string): void {
		// 移除事件监听
		const handler = this.boundClickHandlers.get(panelId);
		if (handler) {
			document.removeEventListener("click", handler);
			this.boundClickHandlers.delete(panelId);
		}

		// 从配置中移除
		this.panels = this.panels.filter((p) => p.id !== panelId);
	}

	/**
	 * 销毁处理器
	 */
	destroy(): void {
		// 移除所有事件监听
		this.boundClickHandlers.forEach((handler) => {
			document.removeEventListener("click", handler);
		});
		this.boundClickHandlers.clear();
		this.panelManager = null;
	}

	/**
	 * 获取面板管理器实例
	 */
	getPanelManager(): any {
		return this.panelManager;
	}
}

// 创建全局实例
let globalPanelHandler: PanelHandler | null = null;

/**
 * 获取全局面板处理器实例
 */
export function getPanelHandler(): PanelHandler {
	if (!globalPanelHandler) {
		globalPanelHandler = new PanelHandler();
	}
	return globalPanelHandler;
}

/**
 * 初始化面板处理器（便捷函数）
 */
export async function initPanelHandler(): Promise<void> {
	const handler = getPanelHandler();
	await handler.init();
}
