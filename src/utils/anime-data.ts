import localAnimeList from "../data/anime";
import I18nKey from "../i18n/i18nKey";
import { i18n } from "../i18n/translation";

// 使用 import.meta.glob 替代 fs，支持 Cloudflare Workers
const bilibiliDataModule = import.meta.glob<{ default: RawAnimeItem[] }>(
	"/src/data/bilibili-data.json",
	{ eager: true }
);

const bangumiDataModule = import.meta.glob<{ default: RawAnimeItem[] }>(
	"/src/data/bangumi-data.json",
	{ eager: true }
);

export interface RawAnimeItem {
	title?: string;
	cover?: string;
	link?: string;
	status?: string;
	rating?: number | string;
	progress?: number | string;
	totalEpisodes?: number | string;
	description?: string;
	year?: string;
	studio?: string;
	genre?: string[];
}

export interface AnimeItem {
	title: string;
	cover: string;
	link: string;
	status: string;
	rating: number;
	progress: number;
	totalEpisodes: number;
	description: string;
	year: string;
	studio: string;
	genre: string[];
}

export type AnimeSourceConfig =
	| { type: "local"; data: AnimeItem[] }
	| {
			type: "json";
			filename: string;
			fetchOnDev?: boolean;
			emptyDescription?: string;
	  };

export function loadAnimeData(source: "bilibili" | "bangumi"): AnimeItem[] {
	try {
		let rawData: RawAnimeItem[] = [];

		if (source === "bilibili") {
			const module = Object.values(bilibiliDataModule)[0];
			rawData = module?.default || [];
		} else if (source === "bangumi") {
			const module = Object.values(bangumiDataModule)[0];
			rawData = module?.default || [];
		}

		if (!rawData || rawData.length === 0) {
			console.log(`[Anime] No data found for ${source}`);
			return [];
		}

		return rawData.map((item) => ({
			title: item.title || "Unknown",
			cover: item.cover || "",
			link: item.link || "",
			status: item.status || "planned",
			rating: Number(item.rating) || 0,
			progress: Number(item.progress) || 0,
			totalEpisodes: Number(item.totalEpisodes) || 12,
			description: item.description || "",
			year: item.year || "",
			studio: item.studio || "",
			genre: Array.isArray(item.genre) ? item.genre : [],
		}));
	} catch (error) {
		console.error(`[Anime] Failed to parse ${source} data:`, error);
		return [];
	}
}

export function getAnimeSourceConfigs(): Record<string, AnimeSourceConfig> {
	return {
		local: {
			type: "local",
			data: localAnimeList,
		},
		bilibili: {
			type: "json",
			filename: "bilibili-data.json",
			fetchOnDev: undefined,
			emptyDescription: i18n(I18nKey.animeEmptyBilibili),
		},
		bangumi: {
			type: "json",
			filename: "bangumi-data.json",
			fetchOnDev: undefined,
			emptyDescription: i18n(I18nKey.animeEmptyBangumi),
		},
	};
}

export function getAnimeList(
	mode: string,
	sourceConfigs: Record<string, AnimeSourceConfig>,
): { animeList: AnimeItem[]; currentConfig: AnimeSourceConfig | undefined } {
	let animeList: AnimeItem[] = [];
	const currentConfig = sourceConfigs[mode];

	if (currentConfig) {
		if (currentConfig.type === "local") {
			animeList = currentConfig.data;
		} else if (currentConfig.type === "json") {
			const isDev = import.meta.env.DEV;
			const shouldFetchOnDev = currentConfig.fetchOnDev ?? false;
			const skipLoad = isDev && !shouldFetchOnDev;

			if (skipLoad) {
				console.log(
					`[Dev] Skipping ${mode} data load (fetchOnDev is off).`,
				);
				animeList = [];
			} else {
				// 根据文件名判断数据源
				if (mode === "bilibili") {
					animeList = loadAnimeData("bilibili");
				} else if (mode === "bangumi") {
					animeList = loadAnimeData("bangumi");
				}
			}
		}
	} else {
		console.warn(`[Anime] Unknown or unconfigured mode: ${mode}`);
	}

	return { animeList, currentConfig };
}

export function getStatusMap(): Record<
	string,
	{ text: string; class: string; icon: string }
> {
	return {
		watching: {
			text: i18n(I18nKey.animeStatusWatching),
			class: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
			icon: "▶",
		},
		completed: {
			text: i18n(I18nKey.animeStatusCompleted),
			class: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
			icon: "✓",
		},
		planned: {
			text: i18n(I18nKey.animeStatusPlanned),
			class: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
			icon: "❤",
		},
		onhold: {
			text: i18n(I18nKey.animeStatusOnHold),
			class: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
			icon: "⏸",
		},
		dropped: {
			text: i18n(I18nKey.animeStatusDropped),
			class: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
			icon: "✗",
		},
	};
}
