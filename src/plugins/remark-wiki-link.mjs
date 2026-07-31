import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { slug } from "github-slugger";
import matter from "gray-matter";

const POSTS_DIR = fileURLToPath(new URL("../content/posts/", import.meta.url));
const MARKDOWN_EXTENSION = /\.(?:md|mdx|markdown)$/i;
const WIKI_LINK = /!?\[\[([^[\]\n]+)\]\]/g;
const STANDALONE_WIKI_LINK = /^\[\[([^[\]\n]+)\]\]$/;
const SKIPPED_NODE_TYPES = new Set([
	"code",
	"inlineCode",
	"link",
	"linkReference",
	"mdxJsxFlowElement",
	"mdxJsxTextElement",
]);
let metaCache = { expiresAt: 0, metas: [] };

function normalizeContentPath(value) {
	const normalized = value
		.trim()
		.replaceAll("\\", "/")
		.replace(/^\.?\//, "")
		.replace(/\/+$/, "")
		.replace(MARKDOWN_EXTENSION, "");
	const segments = normalized.split("/").filter(Boolean);
	if (
		segments.length === 0 ||
		segments.some((segment) => segment === "." || segment === "..")
	) {
		return "";
	}
	return segments[0] === "posts"
		? segments.slice(1).join("/")
		: segments.join("/");
}

function toContentPath(filePath) {
	return path
		.relative(POSTS_DIR, filePath)
		.replaceAll("\\", "/")
		.replace(MARKDOWN_EXTENSION, "");
}

function collectPostMetas() {
	const now = Date.now();
	if (now < metaCache.expiresAt) return metaCache.metas;
	const metas = [];
	const stack = [POSTS_DIR];
	while (stack.length > 0) {
		const directory = stack.pop();
		let entries = [];
		try {
			entries = readdirSync(directory, { withFileTypes: true });
		} catch {
			continue;
		}
		for (const entry of entries) {
			const filePath = path.join(directory, entry.name);
			if (entry.isDirectory()) {
				stack.push(filePath);
			} else if (MARKDOWN_EXTENSION.test(entry.name)) {
				try {
					if (!statSync(filePath).isFile()) continue;
					metas.push({
						filePath,
						contentPath: toContentPath(filePath),
						data: matter(readFileSync(filePath, "utf8")).data ?? {},
					});
				} catch {
					// 单篇文章损坏不应阻断其它 Wiki Link。
				}
			}
		}
	}
	metaCache = { expiresAt: now + 1000, metas };
	return metas;
}

function resolveMeta(metas, target) {
	const exactSlug = metas.find(
		(meta) =>
			typeof meta.data.slug === "string" && meta.data.slug.trim() === target,
	);
	if (exactSlug) return exactSlug;

	const exactPath = metas.find(
		(meta) =>
			meta.contentPath === target ||
			meta.contentPath.replace(/\/index$/i, "") === target,
	);
	if (exactPath) return exactPath;

	if (!target.includes("/")) {
		const byName = metas.filter(
			(meta) => path.basename(meta.contentPath) === target,
		);
		if (byName.length === 1) return byName[0];
		if (byName.length > 1) {
			console.warn(
				`[remark-wiki-link] "${target}" 匹配到多个文件，请使用更完整的路径。`,
			);
		}
	}
	return null;
}

function postId(meta) {
	const customSlug =
		typeof meta.data.slug === "string" ? meta.data.slug.trim() : "";
	return (customSlug || meta.contentPath).replace(/\/index$/i, "");
}

function publishedDate(meta) {
	const date = new Date(meta?.data.published ?? 0);
	return Number.isNaN(date.getTime()) ? new Date(0) : date;
}

function globalPermalink(meta, metas, config) {
	let result = config.format || "%postname%";
	const published = publishedDate(meta);
	const id = postId(meta);
	const rawName = path.basename(meta.contentPath);
	const numericId =
		[...metas]
			.filter((item) => item.data.draft !== true)
			.sort((a, b) => publishedDate(a) - publishedDate(b))
			.findIndex((item) => item.filePath === meta.filePath) + 1;
	result = result
		.replaceAll("%year%", String(published.getFullYear()))
		.replaceAll("%monthnum%", String(published.getMonth() + 1).padStart(2, "0"))
		.replaceAll("%day%", String(published.getDate()).padStart(2, "0"))
		.replaceAll("%hour%", String(published.getHours()).padStart(2, "0"))
		.replaceAll("%minute%", String(published.getMinutes()).padStart(2, "0"))
		.replaceAll("%second%", String(published.getSeconds()).padStart(2, "0"))
		.replaceAll("%post_id%", String(Math.max(0, numericId)))
		.replaceAll("%postname%", id)
		.replaceAll("%raw_postname%", rawName)
		.replaceAll("%category%", meta.data.category || "uncategorized");
	return result.replace(/^\/+|\/+$/g, "");
}

function postUrl(meta, fallback, options, metas) {
	if (typeof meta?.data.permalink === "string" && meta.data.permalink.trim()) {
		return `/${meta.data.permalink.replace(/^\/+|\/+$/g, "")}/`;
	}
	if (meta && options.permalink?.enable) {
		return `/${globalPermalink(meta, metas, options.permalink)}/`;
	}
	if (typeof meta?.data.alias === "string" && meta.data.alias.trim()) {
		return `/posts/${meta.data.alias.replace(/^\/+|\/+$/g, "")}/`;
	}
	const id = meta ? postId(meta) : fallback;
	return `/posts/${id
		.split("/")
		.map((part) => encodeURIComponent(part))
		.join("/")}/`;
}

function parseValue(value) {
	const separator = value.indexOf("|");
	const destination = (
		separator === -1 ? value : value.slice(0, separator)
	).trim();
	const alias = separator === -1 ? "" : value.slice(separator + 1).trim();
	const headingIndex = destination.indexOf("#");
	const page =
		headingIndex === -1 ? destination : destination.slice(0, headingIndex);
	const heading =
		headingIndex === -1 ? "" : destination.slice(headingIndex + 1).trim();
	const contentPath = page ? normalizeContentPath(page) : "";
	if ((!contentPath && !heading) || (page && !contentPath)) return null;
	return { alias, contentPath, destination, heading };
}

function text(value) {
	return { type: "text", value };
}

function element(tagName, properties, children) {
	return {
		type: "paragraph",
		data: { hName: tagName, hProperties: properties },
		children,
	};
}

function displayTitle(parsed, meta) {
	if (parsed.alias) return parsed.alias;
	if (typeof meta?.data.title === "string" && meta.data.title.trim()) {
		return meta.data.title.trim();
	}
	return parsed.contentPath || parsed.heading;
}

function createLink(parsed, metas, options) {
	const meta = parsed.contentPath
		? resolveMeta(metas, parsed.contentPath)
		: null;
	const base = parsed.contentPath
		? postUrl(meta, parsed.contentPath, options, metas)
		: "";
	return {
		type: "link",
		url: `${base}${parsed.heading ? `#${slug(parsed.heading)}` : ""}`,
		children: [text(displayTitle(parsed, meta))],
	};
}

function formatDate(value) {
	if (value instanceof Date && !Number.isNaN(value.getTime())) {
		return value.toISOString().slice(0, 10);
	}
	const match = String(value ?? "").match(/^\d{4}-\d{2}-\d{2}/);
	return match?.[0] ?? "";
}

function createCard(parsed, metas, options) {
	const meta = resolveMeta(metas, parsed.contentPath);
	if (!meta) return null;
	const encrypted = meta.data.encrypted === true || Boolean(meta.data.password);
	const info = [
		element("div", { class: "wlc-title" }, [text(displayTitle(parsed, meta))]),
	];
	if (!encrypted && typeof meta.data.description === "string") {
		const description = meta.data.description.trim();
		if (description) {
			info.push(
				element("div", { class: "wlc-description" }, [text(description)]),
			);
		}
	}

	const metaItems = [];
	const published = formatDate(meta.data.published);
	if (published) {
		metaItems.push(element("span", { class: "wlc-date" }, [text(published)]));
	}
	if (typeof meta.data.category === "string" && meta.data.category.trim()) {
		metaItems.push(
			element("span", { class: "wlc-category" }, [
				text(meta.data.category.trim()),
			]),
		);
	}
	if (Array.isArray(meta.data.tags) && meta.data.tags.length > 0) {
		metaItems.push(
			element(
				"span",
				{ class: "wlc-tags" },
				meta.data.tags
					.filter((tag) => typeof tag === "string")
					.map((tag) =>
						element("span", { class: "wlc-tag" }, [text(`#${tag}`)]),
					),
			),
		);
	}
	if (metaItems.length > 0) {
		info.push(element("div", { class: "wlc-meta" }, metaItems));
	}

	return element(
		"a",
		{
			class: "card-wiki-link no-styling",
			href: postUrl(meta, parsed.contentPath, options, metas),
		},
		[element("div", { class: "wlc-info" }, info)],
	);
}

function replaceInline(value, metas, options) {
	const children = [];
	let cursor = 0;
	let changed = false;
	for (const match of value.matchAll(WIKI_LINK)) {
		if (match[0].startsWith("!")) continue;
		const parsed = parseValue(match[1]);
		if (!parsed) continue;
		if (match.index > cursor)
			children.push(text(value.slice(cursor, match.index)));
		children.push(createLink(parsed, metas, options));
		cursor = match.index + match[0].length;
		changed = true;
	}
	if (!changed) return null;
	if (cursor < value.length) children.push(text(value.slice(cursor)));
	return children;
}

function transform(node, metas, options) {
	if (SKIPPED_NODE_TYPES.has(node.type) || !Array.isArray(node.children))
		return;
	for (let index = 0; index < node.children.length; index++) {
		const child = node.children[index];
		if (
			child.type === "paragraph" &&
			child.children?.length === 1 &&
			child.children[0].type === "text"
		) {
			const match = child.children[0].value.trim().match(STANDALONE_WIKI_LINK);
			if (match) {
				const parsed = parseValue(match[1]);
				if (parsed?.contentPath && !parsed.heading) {
					const card = createCard(parsed, metas, options);
					if (card) {
						node.children[index] = card;
						continue;
					}
				}
			}
		}
		if (child.type === "text") {
			const replacements = replaceInline(child.value, metas, options);
			if (replacements) {
				node.children.splice(index, 1, ...replacements);
				index += replacements.length - 1;
			}
		} else {
			transform(child, metas, options);
		}
	}
}

export function remarkWikiLink(options = {}) {
	return (tree) => {
		if (options.enable === false) return;
		transform(tree, collectPostMetas(), options);
	};
}
