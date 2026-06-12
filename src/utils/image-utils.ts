import { siteConfig } from "../config/siteConfig";
import type { ImageFormat } from "../types/config";

/**
 * 获取图片优化格式配置
 * 从 siteConfig.imageOptimization.formats 读取，默认 "both"（avif+webp）
 */
export function getImageFormats(): ImageFormat[] {
	const formatConfig = siteConfig.imageOptimization?.formats ?? "both";
	switch (formatConfig) {
		case "avif":
			return ["avif"];
		case "webp":
			return ["webp"];
		default:
			return ["avif", "webp"];
	}
}

/**
 * 获取图片优化质量配置
 * 从 siteConfig.imageOptimization.quality 读取，默认 80
 */
export function getImageQuality(): number {
	return siteConfig.imageOptimization?.quality ?? 80;
}

/**
 * 获取图片回退格式
 * formats 为 "avif" 时回退到 avif，其他情况回退到 webp
 */
export function getFallbackFormat(): "avif" | "webp" {
	const formatConfig = siteConfig.imageOptimization?.formats ?? "both";
	return formatConfig === "avif" ? "avif" : "webp";
}

/**
 * 检查是否需要为图片添加 referrerpolicy="no-referrer" 以解决防盗链 403 问题
 * 基于 siteConfig.imageOptimization.noReferrerDomains 通配符匹配
 * @param urlStr - 图片完整 URL
 */
export function shouldAddNoReferrer(urlStr: string): boolean {
	if (!urlStr.startsWith("http")) return false;
	const domains = siteConfig.imageOptimization?.noReferrerDomains || [];
	if (domains.length === 0) return false;
	try {
		const hostname = new URL(urlStr).hostname;
		return domains.some((pattern) => {
			const regexPattern = pattern.replace(/\./g, "\\.").replace(/\*/g, ".*");
			return new RegExp(`^${regexPattern}$`).test(hostname);
		});
	} catch {
		return false;
	}
}
