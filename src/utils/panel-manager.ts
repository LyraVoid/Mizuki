/**
 * 统一的浮窗管理器
 * 确保同一时间只有一个浮窗处于打开状态，并提供统一的动画效果
 */

type PanelId = 'mobile-toc-panel' | 'display-setting' | 'nav-menu-panel' | 'search-panel' | 'wallpaper-mode-panel';

class PanelManager {
    private activePanels: Set<PanelId> = new Set();
    private panelStack: PanelId[] = [];
    private readonly duration = 100;

    /**
     * 应用动画打开浮窗
     */
    private animateIn(panel: HTMLElement): Promise<void> {
        return new Promise((resolve) => {
            panel.classList.remove('float-panel-closed');
            panel.style.opacity = '0';
            panel.style.transform = 'scale(0.95) translateY(-10px)';
            panel.style.pointerEvents = 'none';
            
            panel.offsetHeight; // 强制重排
            
            panel.style.transition = `all ${this.duration}ms ease-out`;
            
            requestAnimationFrame(() => {
                panel.style.opacity = '1';
                panel.style.transform = 'scale(1) translateY(0)';
                panel.style.pointerEvents = 'auto';
                
                setTimeout(() => {
                    panel.style.transition = '';
                    resolve();
                }, this.duration);
            });
        });
    }

    /**
     * 应用动画关闭浮窗
     */
    private animateOut(panel: HTMLElement): Promise<void> {
        return new Promise((resolve) => {
            panel.style.transition = `all ${this.duration}ms ease-out`;
            panel.style.pointerEvents = 'none';
            panel.style.opacity = '0';
            panel.style.transform = 'scale(0.95) translateY(-10px)';
            
            setTimeout(() => {
                panel.classList.add('float-panel-closed');
                panel.style.transition = '';
                panel.style.opacity = '';
                panel.style.transform = '';
                panel.style.pointerEvents = '';
                resolve();
            }, this.duration);
        });
    }

    /**
     * 切换指定浮窗的开关状态
     * @param panelId 浮窗ID
     * @param forceState 强制设置状态 (可选)
     * @returns 浮窗最终状态 (true: 打开, false: 关闭)
     */
    async togglePanel(panelId: PanelId, forceState?: boolean): Promise<boolean> {
        const panel = document.getElementById(panelId);
        if (!panel) {
            console.warn(`Panel ${panelId} not found`);
            return false;
        }

        const isClosed = panel.classList.contains('float-panel-closed');
        const shouldOpen = forceState !== undefined ? forceState : isClosed;

        if (shouldOpen) {
            await this.closeAllPanelsExcept(panelId);
            await this.animateIn(panel);
            this.activePanels.add(panelId);
            this.panelStack = this.panelStack.filter(id => id !== panelId);
            this.panelStack.push(panelId);
            return true;
        } else {
            await this.closePanel(panelId);
            return false;
        }
    }

    /**
     * 关闭指定浮窗
     * @param panelId 浮窗ID
     */
    async closePanel(panelId: PanelId): Promise<void> {
        const panel = document.getElementById(panelId);
        if (panel && !panel.classList.contains('float-panel-closed')) {
            await this.animateOut(panel);
            this.activePanels.delete(panelId);
            this.panelStack = this.panelStack.filter(id => id !== panelId);
        }
    }

    /**
     * 关闭指定浮窗外的所有浮窗
     * @param exceptPanelId 要保持打开的浮窗ID
     */
    async closeAllPanelsExcept(exceptPanelId?: PanelId): Promise<void> {
        const closingPromises = Array.from(this.activePanels)
            .filter(panelId => panelId !== exceptPanelId)
            .map(panelId => this.closePanel(panelId));
        
        await Promise.all(closingPromises);
    }
}

// 创建全局浮窗管理器实例
export const panelManager = new PanelManager();

// 将浮窗管理器暴露到全局，方便在其他地方使用
if (typeof window !== 'undefined') {
    (window as any).panelManager = panelManager;
}

export default panelManager;
