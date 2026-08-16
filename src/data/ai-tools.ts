export type AIToolCategory =
	| "chat"
	| "coding"
	| "image"
	| "audio"
	| "video"
	| "writing"
	| "search"
	| "other";

export type AIToolFrequency =
	| "daily"
	| "weekly"
	| "occasional"
	| "experimental";

export type LocaleString = Partial<Record<"en" | "zh_CN" | "zh_TW" | "ja", string>>;

export function getLocaleString(value: LocaleString, lang: string): string {
	return value[lang as keyof LocaleString] ?? value["en"] ?? "";
}

export interface AITool {
	id: string;
	name: string;
	description: LocaleString;
	icon: string;
	category: AIToolCategory;
	frequency: AIToolFrequency;
	url?: string;
	usage?: LocaleString;
	tags?: string[];
	color?: string;
}

export const aiToolsData: AITool[] = [
	{
		id: "chatgpt",
		name: "ChatGPT",
		description: {
			en: "Primary AI study and coding assistant used for explanations, debugging, research guidance, planning, and technical discussion.",
		},
		icon: "simple-icons:openai",
		category: "chat",
		frequency: "daily",
		url: "https://chatgpt.com/",
		usage: { en: "Daily: learning, debugging, research, planning, and project work" },
		tags: ["Learning", "Coding", "Research", "AI"],
	},
	{
		id: "claude",
		name: "Claude",
		description: {
			en: "Used as an additional AI assistant for technical discussions, comparisons, and second opinions.",
		},
		icon: "simple-icons:anthropic",
		category: "chat",
		frequency: "occasional",
		url: "https://claude.ai/",
		usage: { en: "Occasional: comparison, research, and alternative reasoning" },
		tags: ["AI", "Research", "Second Opinion"],
	},
	{
		id: "github-copilot",
		name: "GitHub Copilot",
		description: {
			en: "AI-assisted coding workflow for generating, explaining, and refining code while building projects.",
		},
		icon: "fa7-brands:github",
		category: "coding",
		frequency: "occasional",
		url: "https://github.com/features/copilot",
		usage: { en: "Occasional: code assistance and experimentation" },
		tags: ["Coding", "GitHub", "Development"],
	},
	{
		id: "ai-image-tools",
		name: "AI Image Tools",
		description: {
			en: "Image-generation and image-editing tools used when visual assets are needed for projects or experimentation.",
		},
		icon: "material-symbols:image",
		category: "image",
		frequency: "occasional",
		usage: { en: "Occasional: visual assets and experiments" },
		tags: ["Images", "Design", "Experimentation"],
	},
];
