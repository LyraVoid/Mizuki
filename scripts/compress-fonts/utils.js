import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const ROOT_DIR = path.join(__dirname, "../..");

/**
 * 递归读取目录下所有文件
 */
export function readFilesRecursively(dir, fileList = []) {
	if (!fs.existsSync(dir)) return fileList;
	const files = fs.readdirSync(dir);
	for (const file of files) {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);
		if (stat.isDirectory()) {
			readFilesRecursively(filePath, fileList);
		} else {
			fileList.push(filePath);
		}
	}
	return fileList;
}

/**
 * 从文件内容中提取所有字符串字面量的字符
 * 统一替换 4 处重复代码
 */
export function extractStringsToSet(content, targetSet) {
	// 主要匹配：双引号、单引号、模板字符串
	const patterns = [
		/"([^"\\]|\\.|\\n|\\t)*"/g,
		/'([^'\\]|\\.|\\n|\\t)*'/g,
		/`([^`\\]|\\.|\\n|\\t)*`/g,
	];

	for (const pattern of patterns) {
		const matches = content.match(pattern);
		if (matches) {
			for (const match of matches) {
				let text = match;
				// 去除首尾引号
				if (
					(text.startsWith('"') && text.endsWith('"')) ||
					(text.startsWith("'") && text.endsWith("'")) ||
					(text.startsWith("`") && text.endsWith("`"))
				) {
					text = text.slice(1, -1);
				}
				// 处理转义字符
				text = text
					.replace(/\\n/g, "\n")
					.replace(/\\t/g, "\t")
					.replace(/\\"/g, '"')
					.replace(/\\'/g, "'");
				for (const char of text) {
					targetSet.add(char);
				}
			}
		}
	}

	// 简单正则作为补充
	const simpleMatches = content.match(/["'`]([^"'`]+)["'`]/g);
	if (simpleMatches) {
		for (const match of simpleMatches) {
			const text = match.slice(1, -1);
			for (const char of text) {
				targetSet.add(char);
			}
		}
	}
}

/**
 * 从 Markdown/MDX 内容中提取文本（去 frontmatter、代码块、HTML、URL）
 */
export function extractMarkdownText(content, ext) {
	let text = content;
	let frontmatterText = "";

	if (ext === ".md" || ext === ".mdx") {
		const frontmatterMatch = content.match(/^---[\s\S]*?---/m);
		if (frontmatterMatch) {
			const frontmatter = frontmatterMatch[0];

			// 提取无引号的 key: value
			const unquoted = frontmatter.match(/^\s*\w+:\s*([^'"\n]+)$/gm);
			if (unquoted) {
				for (const match of unquoted) {
					const value = match.replace(/^\s*\w+:\s*/, "").trim();
					if (!value.match(/^(true|false|\d{4}-\d{2}-\d{2}|\d+)$/)) {
						frontmatterText += `${value} `;
					}
				}
			}

			// 提取带引号的值
			const quoted = frontmatter.match(/:\s*['"]([^'"]+)['"]/g);
			if (quoted) {
				for (const match of quoted) {
					const value = match.replace(/:\s*['"]([^'"]+)['"]/, "$1");
					frontmatterText += `${value} `;
				}
			}

			// 提取列表项
			const listItems = frontmatter.match(/^\s*-\s*([^\n]+)$/gm);
			if (listItems) {
				for (const match of listItems) {
					const value = match.replace(/^\s*-\s*/, "").trim();
					frontmatterText += `${value} `;
				}
			}
		}

		text = text.replace(/^---[\s\S]*?---\s*/m, "");
		text = text.replace(/```[\s\S]*?```/g, "");
		text = text.replace(/`[^`]+`/g, "");
	}

	text = text.replace(/<[^>]*>/g, " ");
	text = text.replace(/[#*_~`[\]()]/g, " ");
	text = text.replace(/https?:\/\/[^\s]+/g, "");
	text = text.replace(/\s+/g, " ").trim();

	return `${frontmatterText} ${text}`.trim();
}

/**
 * CJK 字符正则
 */
export const CJK_REGEX = /[一-鿿぀-ゟ゠-ヿ가-힯　-〿＀-￯]/;

/**
 * 将 Set 中的字符添加到目标 Set
 */
export function mergeSet(source, target) {
	for (const char of source) {
		target.add(char);
	}
}
