import getReadingTime from "reading-time";
import { visit } from "unist-util-visit";

export function remarkContent() {
	return (tree, { data }) => {
		// --- 安全性检查：确保 data.astro 存在 ---
		if (!data.astro) {
			data.astro = {};
		}
		if (!data.astro.frontmatter) {
			data.astro.frontmatter = {};
		}

		let fullText = ""; // 用于计算字数（包含全文）
		let excerpt = ""; // 用于存放摘要

		// 定义“手动摘要”的分隔符正则 (支持 或 ，忽略大小写)
		const moreTagRegex = /<!--\s*more\s*-->/i;
		let moreTagIndex = -1;

		// --- 遍历 AST 查找手动摘要分隔符 ---
		if (tree.children && Array.isArray(tree.children)) {
			moreTagIndex = tree.children.findIndex(
				(node) =>
					node.type === "html" &&
					node.value &&
					moreTagRegex.test(node.value),
			);
		}

		// --- 计算摘要 (Excerpt) ---
		if (moreTagIndex !== -1) {
			// 提取它之前的所有内容
			const excerptNodes = tree.children.slice(0, moreTagIndex);
			excerpt = excerptNodes.map(getNodeText).join("");
		} else {
			// 提取第一个非空的段落
			if (tree.children && Array.isArray(tree.children)) {
				for (const node of tree.children) {
					if (node.type === "paragraph") {
						const text = getNodeText(node);
						// 确保提取出的文本不是仅包含空白字符
						if (text && text.trim().length > 0) {
							excerpt = text;
							break;
						}
					}
				}
			}
		}

		// --- 计算阅读时间 (Reading Time) ---
		visit(tree, (node) => {
			// 跳过代码块，不计入字数
			if (node.type === "code" || node.type === "inlineCode") {
				return "skip";
			}

			// 累加文本
			if (node.type === "text" && node.value) {
				fullText += node.value + " ";
			}
		});

		// 针对 CJK (中日韩) 字符的字数统计优化
		const cjkPattern =
			/[\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af\u3000-\u303f\uff00-\uffef]/g;

		const cjkMatches = fullText.match(cjkPattern);
		const cjkCount = cjkMatches ? cjkMatches.length : 0;

		// 将 CJK 字符替换为空格，避免粘连，然后计算非 CJK (英文/数字) 单词数
		const nonCjkText = fullText.replace(cjkPattern, " ");
		const nonCjkStats = getReadingTime(nonCjkText);

		const totalWords = nonCjkStats.words + cjkCount;

		// 估算时间：英文 200词/分，中文 400字/分
		const minutes = nonCjkStats.words / 200 + cjkCount / 400;

		// --- 注入数据到 Frontmatter ---
		data.astro.frontmatter.excerpt = excerpt;
		data.astro.frontmatter.minutes = Math.max(1, Math.round(minutes));
		data.astro.frontmatter.words = totalWords;
	};
}

/**
 * 辅助函数：递归从节点中提取纯文本
 */
function getNodeText(node) {
	// 安全性检查
	if (!node) {
		return "";
	}

	// 如果是文本节点，直接返回
	if (node.type === "text") {
		return node.value || "";
	}

	// 如果是图片，提取 alt 文本 (可选，这里选择提取以保持语义)
	if (node.type === "image") {
		return node.alt || "";
	}

	// 跳过代码块和 HTML 标签
	if (
		node.type === "code" ||
		node.type === "inlineCode" ||
		node.type === "html"
	) {
		return "";
	}

	// 递归处理子节点
	if (node.children && Array.isArray(node.children)) {
		return node.children.map(getNodeText).join("");
	}

	return "";
}
