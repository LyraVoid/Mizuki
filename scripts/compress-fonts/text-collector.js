import fs from "node:fs";
import path from "node:path";
import {
	ROOT_DIR,
	readFilesRecursively,
	extractStringsToSet,
	extractMarkdownText,
	CJK_REGEX,
	mergeSet,
} from "./utils.js";
import { getLang, isAnimePageEnabled, getAnimeMode, getBangumiUserId, getMusicConfig } from "./config-parser.js";

/**
 * 获取 ASCII 字符集（用于 asciiFont）
 */
export function getAsciiCharset() {
	const chars = new Set();
	for (let i = 32; i <= 126; i++) {
		chars.add(String.fromCharCode(i));
	}
	const common = " !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
	for (const char of common) chars.add(char);
	for (let i = 0; i <= 9; i++) chars.add(String(i));
	const alphabet =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	for (const char of alphabet) chars.add(char);
	return Array.from(chars).sort().join("");
}

/**
 * 从 src/data/ 目录提取字符串
 */
function collectFromDataDir(textSet) {
	const dataDir = path.join(ROOT_DIR, "src/data");
	if (!fs.existsSync(dataDir)) return;

	const files = readFilesRecursively(dataDir);
	for (const file of files) {
		if (file.endsWith(".ts") || file.endsWith(".js")) {
			const content = fs.readFileSync(file, "utf-8");
			extractStringsToSet(content, textSet);
		}
	}
}

/**
 * 从音乐播放器本地常量文件提取字符串
 */
function collectFromMusicConstants(textSet) {
	const filePath = path.join(
		ROOT_DIR,
		"src/components/widgets/music-player/constants.ts",
	);
	if (!fs.existsSync(filePath)) return;
	const content = fs.readFileSync(filePath, "utf-8");
	extractStringsToSet(content, textSet);
}

/**
 * 从 src/config/ 目录下所有配置文件提取字符串
 * 配置已拆分为多个文件（siteConfig、navBarConfig、profileConfig、musicConfig 等），需全部扫描
 */
function collectFromConfig(textSet) {
	const configDir = path.join(ROOT_DIR, "src/config");
	if (!fs.existsSync(configDir)) return;

	const files = readFilesRecursively(configDir);
	for (const file of files) {
		if (file.endsWith(".ts") || file.endsWith(".js")) {
			const content = fs.readFileSync(file, "utf-8");
			extractStringsToSet(content, textSet);
		}
	}
}

/**
 * 从 i18n 语言文件提取字符串
 */
function collectFromI18n(textSet) {
	const lang = getLang();
	const filePath = path.join(ROOT_DIR, `src/i18n/languages/${lang}.ts`);
	if (!fs.existsSync(filePath)) return;
	const content = fs.readFileSync(filePath, "utf-8");
	extractStringsToSet(content, textSet);
}

/**
 * 从 content 目录提取 CJK 字符
 */
function collectFromContent(textSet) {
	let contentDir;
	if (
		process.env.ENABLE_CONTENT_SYNC === "true" &&
		process.env.CONTENT_DIR
	) {
		contentDir = path.join(ROOT_DIR, process.env.CONTENT_DIR);
		console.log(
			`ℹ Using external content directory: ${process.env.CONTENT_DIR}`,
		);
	} else {
		contentDir = path.join(ROOT_DIR, "src/content");
	}

	if (!fs.existsSync(contentDir)) {
		console.log(`⚠ Content directory does not exist: ${contentDir}`);
		return;
	}

	const files = readFilesRecursively(contentDir);
	for (const file of files) {
		const ext = path.extname(file);
		if ([".md", ".mdx", ".ts", ".js"].includes(ext)) {
			const content = fs.readFileSync(file, "utf-8");
			const text = extractMarkdownText(content, ext);
			for (const char of text) {
				if (CJK_REGEX.test(char)) {
					textSet.add(char);
				}
			}
		}
	}
}

/**
 * 添加常用字符和兜底词汇
 */
function addCommonChars(textSet) {
	const commonChars =
		"0123456789，。！？；：\"\"''（）【】《》、·—…「」『』";
	for (const char of commonChars) textSet.add(char);

	const alphabet =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	for (const char of alphabet) textSet.add(char);

	const fallbackWords = ["示例", "歌曲", "艺术家"];
	for (const word of fallbackWords) {
		for (const char of word) textSet.add(char);
	}
}

// ── 远程 API 数据采集 ──

/**
 * 从 Meting API 获取歌单数据中的文字
 */
async function fetchMetingPlaylistText() {
	try {
		const musicConfig = getMusicConfig();
		if (!musicConfig) {
			console.log(
				"ℹ Music player disabled, skipping Meting API text collection",
			);
			return new Set();
		}

		if (musicConfig.mode !== "meting") {
			console.log(
				'ℹ Music player mode is not "meting", skipping API text collection',
			);
			return new Set();
		}

		const apiUrl = musicConfig.meting_api
			.replace(":server", musicConfig.server)
			.replace(":type", musicConfig.type)
			.replace(":id", musicConfig.id)
			.replace(":auth", "")
			.replace(":r", Date.now().toString());

		console.log("ℹ Fetching music playlist from Meting API...");
		console.log(`  URL: ${apiUrl}`);

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000);

		const textSet = new Set();

		try {
			const response = await fetch(apiUrl, {
				signal: controller.signal,
				headers: {
					"User-Agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
				},
			});
			clearTimeout(timeoutId);

			if (!response.ok) {
				throw new Error(
					`HTTP ${response.status}: ${response.statusText}`,
				);
			}

			const playlist = await response.json();
			if (!Array.isArray(playlist)) {
				throw new Error("API response is not an array");
			}

			console.log(
				`✓ Successfully fetched ${playlist.length} songs from Meting API`,
			);

			let songCount = 0;
			for (const song of playlist) {
				const title = song.name ?? song.title ?? "";
				const artist = song.artist ?? song.author ?? "";
				if (title.trim() || artist.trim()) {
					songCount++;
					for (const char of title) textSet.add(char);
					for (const char of artist) textSet.add(char);
				}
			}

			if (songCount === 0) {
				console.log(
					"⚠ No valid song data found in API response",
				);
			}
		} catch (fetchError) {
			clearTimeout(timeoutId);
			if (fetchError.name === "AbortError") {
				console.log(
					"⚠ Meting API request timeout (10s), skipping music text collection",
				);
			} else {
				console.log(
					`⚠ Failed to fetch Meting API data: ${fetchError.message}, skipping music text collection`,
				);
			}
		}

		return textSet;
	} catch (error) {
		console.log(
			`⚠ Error processing Meting API config: ${error.message}, skipping music text collection`,
		);
		return new Set();
	}
}

/**
 * 从 Bilibili 数据文件获取番剧文字
 */
async function fetchBilibiliAnimeText() {
	try {
		if (!isAnimePageEnabled()) {
			console.log(
				"ℹ Anime page disabled, skipping Bilibili text collection",
			);
			return new Set();
		}

		if (getAnimeMode() !== "bilibili") {
			console.log(
				'ℹ Anime mode is not "bilibili", skipping Bilibili text collection',
			);
			return new Set();
		}

		const dataFilePath = path.join(ROOT_DIR, "src/data/bilibili-data.json");
		if (!fs.existsSync(dataFilePath)) {
			console.log(
				"ℹ Bilibili data file not found, skipping Bilibili text collection",
			);
			return new Set();
		}

		console.log("ℹ Reading anime data from Bilibili data file...");

		const textSet = new Set();
		const animeList = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));

		if (!Array.isArray(animeList)) {
			console.log(
				"⚠ Bilibili data is not an array, skipping text collection",
			);
			return new Set();
		}

		let processedCount = 0;
		for (const item of animeList) {
			for (const char of item.title || "") textSet.add(char);
			for (const char of item.description || item.evaluate || "")
				textSet.add(char);
			for (const char of item.studio || "") textSet.add(char);
			for (const char of item.year || "") textSet.add(char);
			if (Array.isArray(item.genre)) {
				for (const genre of item.genre) {
					if (typeof genre === "string") {
						for (const char of genre) textSet.add(char);
					}
				}
			}
			for (const char of item.subtitle || "") textSet.add(char);
			processedCount++;
		}

		if (processedCount > 0) {
			console.log(
				`✓ Successfully processed ${processedCount} anime items from Bilibili data`,
			);
		} else {
			console.log("⚠ No anime data found in Bilibili data file");
		}

		return textSet;
	} catch (error) {
		console.log(
			`⚠ Error processing Bilibili data: ${error.message}, skipping Bilibili text collection`,
		);
		return new Set();
	}
}

/**
 * 从 Bangumi API 获取番剧文字
 */
async function fetchBangumiAnimeText() {
	try {
		if (!isAnimePageEnabled()) {
			console.log(
				"ℹ Anime page disabled, skipping Bangumi API text collection",
			);
			return new Set();
		}

		const userId = getBangumiUserId();
		const mode = getAnimeMode();

		if (mode !== "bangumi" || !userId) {
			console.log(
				'ℹ Anime mode is not "bangumi" or no userId configured, skipping Bangumi API text collection',
			);
			return new Set();
		}

		console.log("ℹ Fetching anime data from Bangumi API...");
		console.log(`  User ID: ${userId}`);

		const textSet = new Set();
		const BANGUMI_API_BASE = "https://api.bgm.tv";
		const collectionTypes = [1, 2, 3, 4, 5];

		async function fetchCollection(userId, subjectType, type) {
			try {
				const allData = [];
				let offset = 0;
				const limit = 50;
				let hasMore = true;

				while (hasMore) {
					const controller = new AbortController();
					const timeoutId = setTimeout(
						() => controller.abort(),
						10000,
					);

					const response = await fetch(
						`${BANGUMI_API_BASE}/v0/users/${userId}/collections?subject_type=${subjectType}&type=${type}&limit=${limit}&offset=${offset}`,
						{
							signal: controller.signal,
							headers: {
								"User-Agent":
									"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
							},
						},
					);
					clearTimeout(timeoutId);

					if (!response.ok) {
						throw new Error(
							`HTTP ${response.status}: ${response.statusText}`,
						);
					}

					const data = await response.json();
					if (data.data && data.data.length > 0) {
						allData.push(...data.data);
					}
					hasMore = data.data && data.data.length >= limit;
					offset += limit;

					await new Promise((r) => setTimeout(r, 200));
				}

				return allData;
			} catch (error) {
				console.log(
					`⚠ Failed to fetch collection type ${type}: ${error.message}`,
				);
				return [];
			}
		}

		async function fetchSubjectPersons(subjectId) {
			try {
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 5000);
				const response = await fetch(
					`${BANGUMI_API_BASE}/v0/subjects/${subjectId}/persons`,
					{
						signal: controller.signal,
						headers: {
							"User-Agent":
								"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
						},
					},
				);
				clearTimeout(timeoutId);
				if (!response.ok) return [];
				const data = await response.json();
				return Array.isArray(data) ? data : [];
			} catch {
				return [];
			}
		}

		let totalItems = 0;
		for (const type of collectionTypes) {
			const collections = await fetchCollection(userId, 2, type);
			if (collections.length === 0) continue;

			console.log(
				`✓ Fetched ${collections.length} items from collection type ${type}`,
			);
			totalItems += collections.length;

			for (const item of collections) {
				const subject = item.subject || {};
				for (const char of subject.name_cn || "") textSet.add(char);
				for (const char of subject.name || "") textSet.add(char);
				for (const char of subject.short_summary || "")
					textSet.add(char);

				if (Array.isArray(subject.tags)) {
					for (const tag of subject.tags) {
						if (tag.name) {
							for (const char of tag.name) textSet.add(char);
						}
					}
				}

				if (item.subject_id && Math.random() < 0.3) {
					const persons = await fetchSubjectPersons(
						item.subject_id,
					);
					for (const person of persons) {
						if (person.name) {
							for (const char of person.name)
								textSet.add(char);
						}
						if (person.relation) {
							for (const char of person.relation)
								textSet.add(char);
						}
					}
					await new Promise((r) => setTimeout(r, 100));
				}
			}
		}

		if (totalItems > 0) {
			console.log(
				`✓ Successfully processed ${totalItems} anime items from Bangumi API`,
			);
		} else {
			console.log("⚠ No anime data found from Bangumi API");
		}

		return textSet;
	} catch (error) {
		console.log(
			`⚠ Error processing Bangumi API config: ${error.message}, skipping anime text collection`,
		);
		return new Set();
	}
}

/**
 * 主文本收集函数 — 从所有来源收集 CJK 字符
 */
export async function collectText() {
	const textSet = new Set();

	// 本地文件扫描
	collectFromDataDir(textSet);
	collectFromMusicConstants(textSet);
	collectFromConfig(textSet);
	collectFromI18n(textSet);
	collectFromContent(textSet);

	// 常用字符
	addCommonChars(textSet);

	// 远程 API 数据
	const metingText = await fetchMetingPlaylistText();
	mergeSet(metingText, textSet);
	if (metingText.size > 0) {
		console.log(
			`✓ Added ${metingText.size} unique characters from music playlist`,
		);
	}

	const bangumiText = await fetchBangumiAnimeText();
	mergeSet(bangumiText, textSet);
	if (bangumiText.size > 0) {
		console.log(
			`✓ Added ${bangumiText.size} unique characters from Bangumi anime data`,
		);
	}

	const bilibiliText = await fetchBilibiliAnimeText();
	mergeSet(bilibiliText, textSet);
	if (bilibiliText.size > 0) {
		console.log(
			`✓ Added ${bilibiliText.size} unique characters from Bilibili anime data`,
		);
	}

	return Array.from(textSet).sort().join("");
}
