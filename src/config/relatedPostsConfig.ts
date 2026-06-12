import type { RelatedPostsConfig } from "../types/config";

// 相关文章配置
export const relatedPostsConfig: RelatedPostsConfig = {
	enable: true,
	maxCount: 5,

	// 评分权重配置 — 各维度权重值归一化后使用，无需手动凑到 1.0
	// 调大某个权重 = 该维度在排序中更重要；设为 0 = 忽略该维度
	weights: {
		tagSimilarity: 1.0, // 标签 Jaccard 相似度（权重最高，核心信号）
		titleSimilarity: 0.6, // 标题分词 Jaccard 相似度
		descriptionSimilarity: 0.4, // 描述文本分词相似度
		categoryMatch: 0.3, // 同分类加分
		freshness: 0.2, // 时间新鲜度（越新越高分）
		tagIDF: true, // 启用 IDF 加权：稀有标签匹配权重更高，常见标签权重更低
	},

	// 新鲜度半衰期（天）：发表日期距今多少天，新鲜度分数衰减到一半
	// 180 ≈ 6个月，90 ≈ 3个月（偏好近期文章），365 ≈ 1年（对时间不敏感）
	freshnessHalfLife: 180,
};
