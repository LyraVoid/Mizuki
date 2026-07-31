import type { ExpressiveCodeConfig } from "../types/config";

// 代码块样式配置
export const expressiveCodeConfig: ExpressiveCodeConfig = {
	darkTheme: "github-dark",
	lightTheme: "github-light",
	defaultWrap: true,
	// 是否在主题切换时隐藏代码块以避免卡顿问题
	hideDuringThemeTransition: true,
	languageBadge: {
		enable: true,
	},
	languageLogo: {
		enable: false,
		color: "mono",
		excludedLangs: ["text", "plaintext"],
	},
	collapsible: {
		enable: true,
		lineThreshold: 20,
		previewLines: 10,
		defaultCollapsed: true,
	},
	codeGroup: {
		enable: true,
	},
};
