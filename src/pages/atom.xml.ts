import { getImage } from "astro:assets";
// import { getCollection } from "astro:content";
import type { APIContext, ImageMetadata } from "astro";
import MarkdownIt from "markdown-it";
import { parse as htmlParser } from "node-html-parser";
import sanitizeHtml from "sanitize-html";
import { profileConfig, siteConfig } from "@/config";
import { getSortedPosts } from "@/utils/content-utils";
import { getPostUrl } from "@/utils/url-utils";
import { initPostIdMap } from "@/utils/permalink-utils";

const markdownParser = new MarkdownIt();

// get dynamic import of images as a map collection
const imagesGlob = import.meta.glob<{ default: ImageMetadata }>(
	"/src/content/**/*.{jpeg,jpg,png,gif,webp}", // include posts and assets
);

export async function GET(context: APIContext) {
	if (!context.site) {
		throw Error("site not set");
	}

	// Use the same ordering as site listing (pinned first, then by published desc)
	// 过滤掉加密文章和草稿文章
	const posts = (await getSortedPosts()).filter(
		(post) => !post.data.encrypted && post.data.draft !== true,
	);

	// 初始化文章 ID 映射（用于 permalink 功能）
	initPostIdMap(posts);

	// 创建Atom feed头部
	let atomFeed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${siteConfig.title}</title>
  <subtitle>${siteConfig.subtitle || "No description"}</subtitle>
  <link href="${context.site}" rel="alternate" type="text/html"/>
  <link href="${new URL("atom.xml", context.site)}" rel="self" type="application/atom+xml"/>
  <id>${context.site}</id>
  <updated>${new Date().toISOString()}</updated>
  <language>${siteConfig.lang}</language>`;

	for (const post of posts) {
		// convert markdown to html string, ensure post.body is a string
		const body = markdownParser.render(String(post.body ?? ""));
		// convert html string to DOM-like structure
		const html = htmlParser.parse(body);
		// hold all img tags in variable images
		const images = html.querySelectorAll("img");

		for (const img of images) {
			const src = img.getAttribute("src");
			if (!src) continue;

			// Handle content-relative images and convert them to built _astro paths
			if (
				src.startsWith("./") ||
				src.startsWith("../") ||
				(!src.startsWith("http") && !src.startsWith("/"))
			) {
				let importPath: string | null = null;

				if (src.startsWith("./")) {
					// Path relative to the post file directory
					const prefixRemoved = src.slice(2);
					// Check if this post is in a subdirectory (like bestimageapi/index.md)
					const postPath = post.id; // This gives us the full path like "bestimageapi/index.md"
					const postDir = postPath.includes("/")
						? postPath.split("/")[0]
						: "";

					if (postDir) {
						// For posts in subdirectories
						importPath = `/src/content/posts/${postDir}/${prefixRemoved}`;
					} else {
						// For posts directly in posts directory
						importPath = `/src/content/posts/${prefixRemoved}`;
					}
				} else if (src.startsWith("../")) {
					// Path like ../assets/images/xxx -> relative to /src/content/
					const cleaned = src.replace(/^\.\.\//, "");
					importPath = `/src/content/${cleaned}`;
				} else {
					// Handle direct filename (no ./ prefix) - assume it's in the same directory as the post
					const postPath = post.id; // This gives us the full path like "bestimageapi/index.md"
					const postDir = postPath.includes("/")
						? postPath.split("/")[0]
						: "";

					if (postDir) {
						// For posts in subdirectories
						importPath = `/src/content/posts/${postDir}/${src}`;
					} else {
						// For posts directly in posts directory
						importPath = `/src/content/posts/${src}`;
					}
				}

				const imageMod = await imagesGlob[importPath]?.()?.then(
					(res) => res.default,
				);
				if (imageMod) {
					const optimizedImg = await getImage({ src: imageMod });
					img.setAttribute(
						"src",
						new URL(optimizedImg.src, context.site).href,
					);
				} else {
					// Debug: log the failed import path
					console.log(
						`Failed to load image: ${importPath} for post: ${post.id}`,
					);
				}
			} else if (src.startsWith("/")) {
				// images starting with `/` are in public dir
				img.setAttribute("src", new URL(src, context.site).href);
			}
		}

		// 添加Atom条目
		const postUrl = new URL(getPostUrl(post), context.site).href;
		const content = sanitizeHtml(html.toString(), {
			allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
		});

		atomFeed += `
  <entry>
    <title>${post.data.title}</title>
    <link href="${postUrl}" rel="alternate" type="text/html"/>
    <id>${postUrl}</id>
    <published>${post.data.published.toISOString()}</published>
    <updated>${post.data.updated?.toISOString() || post.data.published.toISOString()}</updated>
    <summary>${post.data.description || ""}</summary>
    <content type="html"><![CDATA[${content}]]></content>
    <author>
      <name>${profileConfig.name}</name>
    </author>`;

		// 添加分类标签
		if (post.data.category) {
			atomFeed += `
    <category term="${post.data.category}"></category>`;
		}

		atomFeed += `
  </entry>`;
	}

	// 关闭Atom feed
	atomFeed += `
</feed>`;

	return new Response(atomFeed, {
		headers: {
			"Content-Type": "application/atom+xml; charset=utf-8",
		},
	});
}
