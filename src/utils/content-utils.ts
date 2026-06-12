import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { initPostIdMap } from "@utils/permalink-utils";
import { getCategoryUrl, getPostUrl } from "@utils/url-utils";

// // Retrieve posts and sort them by publication date
async function getRawSortedPosts() {
	const allBlogPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const sorted = allBlogPosts.sort((a, b) => {
		// 首先按置顶状态排序，置顶文章在前
		if (a.data.pinned && !b.data.pinned) {
			return -1;
		}
		if (!a.data.pinned && b.data.pinned) {
			return 1;
		}

		// 如果置顶状态相同，优先按 Priority 排序（数值越小越靠前）
		if (a.data.pinned && b.data.pinned) {
			const priorityA = a.data.priority;
			const priorityB = b.data.priority;
			if (priorityA !== undefined && priorityB !== undefined) {
				if (priorityA !== priorityB) {
					return priorityA - priorityB;
				}
			} else if (priorityA !== undefined) {
				return -1;
			} else if (priorityB !== undefined) {
				return 1;
			}
		}

		// 否则按发布日期排序
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
	return sorted;
}

export async function getSortedPosts() {
	const sorted = await getRawSortedPosts();

	for (let i = 1; i < sorted.length; i++) {
		sorted[i].data.nextSlug = sorted[i - 1].id;
		sorted[i].data.nextTitle = sorted[i - 1].data.title;
	}
	for (let i = 0; i < sorted.length - 1; i++) {
		sorted[i].data.prevSlug = sorted[i + 1].id;
		sorted[i].data.prevTitle = sorted[i + 1].data.title;
	}

	return sorted;
}
export interface PostForList {
	id: string;
	data: CollectionEntry<"posts">["data"];
	url?: string; // 预计算的文章 URL
}
export async function getSortedPostsList(): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedPosts();

	// 初始化文章 ID 映射（用于 permalink 功能）
	initPostIdMap(sortedFullPosts);

	// delete post.body，并预计算 URL
	const sortedPostsList = sortedFullPosts.map((post) => ({
		id: post.id,
		data: post.data,
		url: getPostUrl(post),
	}));

	return sortedPostsList;
}
export interface Tag {
	name: string;
	count: number;
}

export async function getTagList(): Promise<Tag[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const countMap: Record<string, number> = {};
	allBlogPosts.forEach((post: { data: { tags: string[] } }) => {
		post.data.tags.forEach((tag: string) => {
			if (!countMap[tag]) {
				countMap[tag] = 0;
			}
			countMap[tag]++;
		});
	});

	// sort tags
	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export interface Category {
	name: string;
	count: number;
	url: string;
}

export async function getCategoryList(): Promise<Category[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	const count: Record<string, number> = {};
	allBlogPosts.forEach((post: { data: { category: string | null } }) => {
		if (!post.data.category) {
			const ucKey = i18n(I18nKey.uncategorized);
			count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
			return;
		}

		const categoryName =
			typeof post.data.category === "string"
				? post.data.category.trim()
				: String(post.data.category).trim();

		count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
	});

	const lst = Object.keys(count).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	const ret: Category[] = [];
	for (const c of lst) {
		ret.push({
			name: c,
			count: count[c],
			url: getCategoryUrl(c),
		});
	}
	return ret;
}

/**
 * 对文本进行分词，支持中英文混合
 *
 * - 优先使用 Intl.Segmenter（在支持的运行时中效果更好）
 * - 在不支持 Segmenter 的环境（如部分 Node 运行时）下
 *   回退到基于正则的简单分词，以避免构建报错
 * - 过滤标点和空白，英文统一小写
 */
function tokenize(text: string): Set<string> {
	const tokens = new Set<string>();

	const hasSegmenter =
		typeof Intl !== "undefined" &&
		"Segmenter" in Intl &&
		typeof (Intl as unknown as { Segmenter?: unknown }).Segmenter ===
			"function";

	if (!hasSegmenter) {
		const basicTokens = text
			.toLowerCase()
			.split(/[\s\p{P}]+/gu)
			.filter(Boolean);
		for (const t of basicTokens) {
			tokens.add(t);
		}
		return tokens;
	}

	const segmenter = new (
		Intl as unknown as {
			Segmenter: new (
				locale: string,
				options: { granularity: string },
			) => {
				segment: (
					text: string,
				) => Iterable<{ segment: unknown; isWordLike: boolean | undefined }>;
			};
		}
	).Segmenter("zh", {
		granularity: "word",
	});
	for (const { segment, isWordLike } of segmenter.segment(text)) {
		if (!isWordLike) {
			continue;
		}
		tokens.add((segment as string).toLowerCase());
	}
	return tokens;
}

/**
 * 计算两个集合的 Jaccard 相似度
 */
function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
	if (a.size === 0 && b.size === 0) {
		return 0;
	}
	let intersection = 0;
	for (const item of a) {
		if (b.has(item)) {
			intersection++;
		}
	}
	const union = a.size + b.size - intersection;
	return union === 0 ? 0 : intersection / union;
}

/**
 * 计算标签的 IDF（逆文档频率）权重
 * 稀有标签（出现频率低）获得更高权重，常见标签权重更低
 * IDF(tag) = log(N / (1 + df(tag)))，N = 总文章数，df = 包含该标签的文章数
 */
function computeTagIDF(
	allPosts: { data: { tags?: string[] } }[],
): Map<string, number> {
	const tagDF = new Map<string, number>();
	const N = allPosts.length;

	for (const post of allPosts) {
		const tags = post.data.tags || [];
		for (const tag of tags) {
			tagDF.set(tag, (tagDF.get(tag) || 0) + 1);
		}
	}

	const tagIDF = new Map<string, number>();
	for (const [tag, df] of tagDF) {
		tagIDF.set(tag, Math.log(N / (1 + df)));
	}
	return tagIDF;
}

/**
 * 计算 IDF 加权标签相似度
 * 对共有标签的 IDF 值求和，归一化到 [0, 1]
 */
function idfWeightedTagSimilarity(
	currentTags: string[],
	candidateTags: string[],
	tagIDF: Map<string, number>,
): number {
	if (currentTags.length === 0 || candidateTags.length === 0) {
		return 0;
	}

	const candidateSet = new Set(candidateTags);
	let intersectionWeight = 0;
	let currentTotalWeight = 0;

	for (const tag of currentTags) {
		const idf = tagIDF.get(tag) ?? 0;
		currentTotalWeight += idf;
		if (candidateSet.has(tag)) {
			intersectionWeight += idf;
		}
	}

	return currentTotalWeight === 0 ? 0 : intersectionWeight / currentTotalWeight;
}

/**
 * 获取相关文章推荐 — 多算法加权评分
 *
 * 评分维度（权重可通过 relatedPostsConfig.weights 配置）：
 * - tagSimilarity: 标签相似度（Jaccard 或 IDF 加权）
 * - titleSimilarity: 标题分词 Jaccard 相似度
 * - descriptionSimilarity: 描述文本分词相似度
 * - categoryMatch: 同分类加分
 * - freshness: 时间新鲜度（指数衰减）
 *
 * 总分 = Σ(维度分数 × 权重) / Σ权重
 */
export async function getRelatedPosts(
	currentPost: CollectionEntry<"posts">,
	maxCount = 5,
): Promise<PostForList[]> {
	const { relatedPostsConfig } = await import("../config/index.js");
	const weights = relatedPostsConfig.weights ?? {};
	const halfLife = relatedPostsConfig.freshnessHalfLife ?? 180;

	const w = {
		tagSimilarity: weights.tagSimilarity ?? 1.0,
		titleSimilarity: weights.titleSimilarity ?? 0.6,
		descriptionSimilarity: weights.descriptionSimilarity ?? 0.4,
		categoryMatch: weights.categoryMatch ?? 0.3,
		freshness: weights.freshness ?? 0.2,
		useIDF: weights.tagIDF ?? true,
	};

	const allPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	// 排除自身和加密文章
	const candidates = allPosts.filter(
		(p) => p.id !== currentPost.id && !p.data.password,
	);

	if (candidates.length === 0) return [];

	const currentTags = currentPost.data.tags || [];
	const currentTokens = tokenize(currentPost.data.title);
	const currentDesc = tokenize(currentPost.data.description || "");
	const currentCategory = currentPost.data.category || "";
	const now = Date.now();

	// 预计算标签 IDF
	const tagIDF = w.useIDF ? computeTagIDF(allPosts) : new Map<string, number>();

	// 权重总和（用于归一化）
	const totalWeight =
		w.tagSimilarity +
		w.titleSimilarity +
		w.descriptionSimilarity +
		w.categoryMatch +
		w.freshness;

	const scored = candidates.map((post) => {
		const postTags = post.data.tags || [];

		// 标签相似度
		let tagScore: number;
		if (w.useIDF && currentTags.length > 0 && postTags.length > 0) {
			tagScore = idfWeightedTagSimilarity(currentTags, postTags, tagIDF);
		} else {
			tagScore = jaccardSimilarity(new Set(currentTags), new Set(postTags));
		}

		// 标题相似度
		const postTokens = tokenize(post.data.title);
		const titleScore = jaccardSimilarity(currentTokens, postTokens);

		// 描述相似度
		const postDesc = tokenize(post.data.description || "");
		const descScore = jaccardSimilarity(currentDesc, postDesc);

		// 分类匹配
		const postCategory = post.data.category || "";
		const catScore =
			currentCategory && postCategory && currentCategory === postCategory
				? 1
				: 0;

		// 时间新鲜度（指数衰减，半衰期可配）
		const daysSincePublished =
			(now - new Date(post.data.published).getTime()) / (1000 * 60 * 60 * 24);
		const freshnessScore = Math.exp(
			(-Math.LN2 * daysSincePublished) / halfLife,
		);

		// 加权总分（归一化到 [0, 1]）
		const totalScore =
			totalWeight === 0
				? 0
				: (tagScore * w.tagSimilarity +
						titleScore * w.titleSimilarity +
						descScore * w.descriptionSimilarity +
						catScore * w.categoryMatch +
						freshnessScore * w.freshness) /
					totalWeight;

		return { post, totalScore, tagScore };
	});

	// 按总分降序排列
	scored.sort((a, b) => b.totalScore - a.totalScore);

	// 优先取有标签匹配的，不足时从剩余候选中补充
	const withTagMatch = scored.filter((s) => s.tagScore > 0);
	const withoutTagMatch = scored.filter((s) => s.tagScore === 0);

	const result: PostForList[] = [];

	for (const s of withTagMatch) {
		if (result.length >= maxCount) break;
		result.push({ id: s.post.id, data: s.post.data });
	}

	for (const s of withoutTagMatch) {
		if (result.length >= maxCount) break;
		result.push({ id: s.post.id, data: s.post.data });
	}

	return result;
}
