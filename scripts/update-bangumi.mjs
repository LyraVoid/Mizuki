import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const API_BASE = "https://api.bgm.tv";
const CONFIG_PATH = path.join(
	path.dirname(fileURLToPath(import.meta.url)),
	"../src/config.ts",
);
const OUTPUT_FILE = path.join(
	path.dirname(fileURLToPath(import.meta.url)),
	"../src/data/bangumi-data.json",
);

async function getUserIdFromConfig() {
	try {
		const configContent = await fs.readFile(CONFIG_PATH, "utf-8");
		const match = configContent.match(
			/bangumi:\s*\{[\s\S]*?userId:\s*["']([^"']+)["']/,
		);

		if (match && match[1]) {
			const userId = match[1];
			if (
				userId === "your-bangumi-id" ||
				userId === "your-user-id" ||
				!userId
			) {
				console.warn(
					"Warning: userId in src/config.ts appears to be a default value.",
				);
				return userId;
			}
			return userId;
		}
		throw new Error("Could not find bangumi.userId in config.ts");
	} catch (error) {
		console.error("✘ Failed to read Bangumi ID from config.ts");
		throw error;
	}
}

async function getAnimeModeFromConfig() {
	try {
		const configContent = await fs.readFile(CONFIG_PATH, "utf-8");
		const match = configContent.match(
			/anime:\s*\{[\s\S]*?mode:\s*["']([^"']+)["']/,
		);

		if (match && match[1]) {
			return match[1];
		}
		return "bangumi";
	} catch (error) {
		return "bangumi";
	}
}

// 模拟延迟防止 API 限制
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchSubjectDetail(subjectId) {
	try {
		const response = await fetch(`${API_BASE}/v0/subjects/${subjectId}`);
		if (!response.ok) return null;
		return await response.json();
	} catch (error) {
		return null;
	}
}

function getStudioFromInfobox(infobox) {
	if (!Array.isArray(infobox)) return "Unknown";

	const targetKeys = ["动画制作", "制作", "製作", "开发"];

	for (const key of targetKeys) {
		const item = infobox.find((i) => i.key === key);
		if (item) {
			if (typeof item.value === "string") {
				return item.value;
			}
			if (Array.isArray(item.value)) {
				const validItem = item.value.find((v) => v.v);
				if (validItem) return validItem.v;
			}
		}
	}
	return "Unknown";
}

async function fetchCollection(userId, type) {
	let allData = [];
	let offset = 0;
	const limit = 50;
	let hasMore = true;

	console.log(`Fetching type: ${type}...`);

	while (hasMore) {
		const url = `${API_BASE}/v0/users/${userId}/collections?subject_type=2&type=${type}&limit=${limit}&offset=${offset}`;
		try {
			const response = await fetch(url);

			if (!response.ok) {
				if (response.status === 404) {
					console.log(
						`   User ${userId} does not exist or has no data of this type.`,
					);
					return [];
				}
				throw new Error(`API Error ${response.status}`);
			}

			const data = await response.json();

			if (data.data && data.data.length > 0) {
				allData = [...allData, ...data.data];
				process.stdout.write(
					`   Fetched ${allData.length} records...\r`,
				);
			}

			if (!data.data || data.data.length < limit) {
				hasMore = false;
			} else {
				offset += limit;
				await delay(300);
			}
		} catch (e) {
			console.error(`\nFetch failed (Type ${type}):`, e.message);
			hasMore = false;
		}
	}
	console.log("");
	return allData;
}

async function processData(items, status) {
	const results = [];
	let count = 0;
	const total = items.length;

	for (const item of items) {
		count++;
		process.stdout.write(
			`[${status}] Processing progress: ${count}/${total} (${item.subject_id})\r`,
		);

		const subjectDetail = await fetchSubjectDetail(item.subject_id);
		await delay(150);

		const year = item.subject?.date
			? item.subject.date.slice(0, 4)
			: "Unknown";

		const rating = item.rate
			? Number.parseFloat(item.rate.toFixed(1))
			: item.subject?.score
				? Number.parseFloat(item.subject.score.toFixed(1))
				: 0;

		const progress = item.ep_status || 0;
		const totalEpisodes = item.subject?.eps || progress;

		const studio = subjectDetail
			? getStudioFromInfobox(subjectDetail.infobox)
			: "Unknown";

		const description = (
			subjectDetail?.summary ||
			item.subject?.short_summary ||
			item.subject?.name_cn ||
			""
		).trimStart();

		results.push({
			title:
				item.subject?.name_cn || item.subject?.name || "Unknown Title",
			status: status,
			rating: rating,
			cover: item.subject?.images?.medium || "/assets/anime/default.webp",
			description: description,
			episodes: `${totalEpisodes} episodes`,
			year: year,
			genre: item.subject?.tags
				? item.subject.tags.slice(0, 3).map((tag) => tag.name)
				: ["Unknown"],
			studio: studio,
			link: item.subject?.id
				? `https://bgm.tv/subject/${item.subject.id}`
				: "#",
			progress: progress,
			totalEpisodes: totalEpisodes,
			startDate: item.subject?.date || "",
			endDate: item.subject?.date || "",
		});
	}
	console.log(`\n✓ Completed ${status} list processing`);
	return results;
}

async function main() {
	console.log("Initializing Bangumi data update script...");

	const animeMode = await getAnimeModeFromConfig();
	if (animeMode !== "bangumi") {
		console.log(
			`Detected current anime mode is "${animeMode}", skipping Bangumi data update.`,
		);
		return;
	}

	const USER_ID = await getUserIdFromConfig();
	console.log(`Read User ID: ${USER_ID}`);

	const collections = [
		{ type: 3, status: "watching" },
		{ type: 1, status: "planned" },
		{ type: 2, status: "completed" },
		{ type: 4, status: "onhold" },
		{ type: 5, status: "dropped" },
	];

	let finalAnimeList = [];

	for (const c of collections) {
		const rawData = await fetchCollection(USER_ID, c.type);
		if (rawData.length > 0) {
			const processed = await processData(rawData, c.status);
			finalAnimeList = [...finalAnimeList, ...processed];
		}
	}

	const dir = path.dirname(OUTPUT_FILE);
	try {
		await fs.access(dir);
	} catch {
		await fs.mkdir(dir, { recursive: true });
	}

	await fs.writeFile(OUTPUT_FILE, JSON.stringify(finalAnimeList, null, 2));
	console.log(`\nUpdate complete! Data saved to: ${OUTPUT_FILE}`);
	console.log(`Total collected: ${finalAnimeList.length} anime series`);
}

main().catch((err) => {
	console.error("\n✘ Script execution error:");
	console.error(err);
	process.exit(1);
});
