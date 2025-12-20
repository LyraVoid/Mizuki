import { getCollection, type CollectionEntry } from "astro:content";

export type DiaryEntry = CollectionEntry<"diary">;

const sortByDateDesc = (entries: DiaryEntry[]) =>
	entries.sort(
		(a, b) => b.data.date.getTime() - a.data.date.getTime(),
	);

const fetchDiaryEntries = async () => {
	const entries = await getCollection("diary");
	return sortByDateDesc(entries);
};

// 获取日记统计数据
export const getDiaryStats = async () => {
	const entries = await fetchDiaryEntries();
	const total = entries.length;
	const hasImages = entries.filter(
		(item) => item.data.images && item.data.images.length > 0,
	).length;
	const hasLocation = entries.filter((item) => !!item.data.location).length;
	const hasMood = entries.filter((item) => !!item.data.mood).length;

	return {
		total,
		hasImages,
		hasLocation,
		hasMood,
		imagePercentage:
			total === 0 ? 0 : Math.round((hasImages / total) * 100),
		locationPercentage:
			total === 0 ? 0 : Math.round((hasLocation / total) * 100),
		moodPercentage:
			total === 0 ? 0 : Math.round((hasMood / total) * 100),
	};
};

// 获取日记列表（按时间倒序）
export const getDiaryList = async (limit?: number) => {
	const entries = await fetchDiaryEntries();
	if (limit && limit > 0) {
		return entries.slice(0, limit);
	}
	return entries;
};

// 获取最新的日记
export const getLatestDiary = async () => {
	const [latest] = await getDiaryList(1);
	return latest;
};

// 根据ID（slug）获取日记
export const getDiaryById = async (id: string) => {
	const entries = await fetchDiaryEntries();
	return entries.find((item) => item.id === id);
};

// 获取包含图片的日记
export const getDiaryWithImages = async () => {
	const entries = await fetchDiaryEntries();
	return entries.filter(
		(item) => item.data.images && item.data.images.length > 0,
	);
};

// 根据标签筛选日记
export const getDiaryByTag = async (tag: string) => {
	const entries = await fetchDiaryEntries();
	return entries
		.filter((item) => item.data.tags?.includes(tag))
		.sort(
			(a, b) => b.data.date.getTime() - a.data.date.getTime(),
		);
};

// 获取所有标签
export const getAllTags = async () => {
	const entries = await fetchDiaryEntries();
	const tags = new Set<string>();
	entries.forEach((item) => {
		item.data.tags?.forEach((tag) => tags.add(tag));
	});
	return Array.from(tags).sort();
};
