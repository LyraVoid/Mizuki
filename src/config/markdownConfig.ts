export interface MarkdownEnhancementConfig {
	autoImageGrid: {
		enable: boolean;
		minImages: number;
		maxColumns: number;
	};
	wikiLink: {
		enable: boolean;
	};
	plantuml: {
		enable: boolean;
		server: string;
		lightTheme: string;
		darkTheme: string;
	};
}

/**
 * Markdown 增强配置。修改后需要重启 Astro 开发服务器。
 *
 * PlantUML 源码会编码进 URL 并交给配置的服务器渲染；私有内容可关闭该
 * 功能或改用自托管服务器。
 */
export const markdownConfig: MarkdownEnhancementConfig = {
	autoImageGrid: {
		enable: true,
		minImages: 2,
		maxColumns: 4,
	},
	wikiLink: {
		enable: true,
	},
	plantuml: {
		enable: true,
		server: "https://www.plantuml.com/plantuml",
		lightTheme: "",
		darkTheme: "cyborg",
	},
};
