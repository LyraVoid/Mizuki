import type { ExpressiveCodeConfig } from "../types/config";

// 代码块样式配置
export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// 注意：某些样式（如背景颜色）已被覆盖，请参阅 astro.config.mjs 文件。
	// 请选择深色主题，因为此博客主题目前仅支持深色背景
	theme: "github-dark",
	// 是否在主题切换时隐藏代码块以避免卡顿问题
	hideDuringThemeTransition: true,
};
