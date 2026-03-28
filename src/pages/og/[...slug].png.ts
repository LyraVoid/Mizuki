import type { APIContext, GetStaticPaths } from "astro";
import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import satori from "satori";
import sharp from "sharp";

import { removeFileExtension } from "@/utils/url-utils";

import { profileConfig, siteConfig } from "../../config";

type Weight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
type FontStyle = "normal" | "italic";
interface FontOptions {
	data: Buffer | ArrayBuffer;
	name: string;
	weight?: Weight;
	style?: FontStyle;
	lang?: string;
}
export const prerender = true;

// 使用 import.meta.glob 替代 fs 读取图片文件
const avatarModules = import.meta.glob<{ default: ImageMetadata }>(
	"/src/assets/images/**/*.{png,jpg,jpeg,webp}",
	{ eager: true, import: "default" }
);

const faviconModules = import.meta.glob<{ default: ImageMetadata }>(
	"/public/favicon/**/*.{png,ico}",
	{ eager: true, import: "default" }
);

export const getStaticPaths: GetStaticPaths = async () => {
	if (!siteConfig.generateOgImages) {
		return [];
	}

	const allPosts = await getCollection("posts");
	const publishedPosts = allPosts.filter((post) => !post.data.draft);

	return publishedPosts.map((post) => {
		// 将 id 转换为 slug（移除扩展名）以匹配路由参数
		const slug = removeFileExtension(post.id);
		return {
			params: { slug },
			props: { post },
		};
	});
};

let fontCache: { regular: Buffer | null; bold: Buffer | null } | null = null;

async function fetchNotoSansSCFonts() {
	if (fontCache) {
		return fontCache;
	}

	try {
		const cssResp = await fetch(
			"https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap",
		);
		if (!cssResp.ok) {
			throw new Error("Failed to fetch Google Fonts CSS");
		}
		const cssText = await cssResp.text();

		const getUrlForWeight = (weight: number) => {
			const blockRe = new RegExp(
				`@font-face\\s*{[^}]*font-weight:\\s*${weight}[^}]*}`,
				"g",
			);
			const match = cssText.match(blockRe);
			if (!match || match.length === 0) {
				return null;
			}
			const urlMatch = match[0].match(/url\((https:[^)]+)\)/);
			return urlMatch ? urlMatch[1] : null;
		};

		const regularUrl = getUrlForWeight(400);
		const boldUrl = getUrlForWeight(700);

		if (!regularUrl || !boldUrl) {
			console.warn(
				"Could not find font urls in Google Fonts CSS; falling back to no fonts.",
			);
			fontCache = { regular: null, bold: null };
			return fontCache;
		}

		const [rResp, bResp] = await Promise.all([
			fetch(regularUrl),
			fetch(boldUrl),
		]);
		if (!rResp.ok || !bResp.ok) {
			console.warn(
				"Failed to download font files from Google; falling back to no fonts.",
			);
			fontCache = { regular: null, bold: null };
			return fontCache;
		}

		const rBuf = Buffer.from(await rResp.arrayBuffer());
		const bBuf = Buffer.from(await bResp.arrayBuffer());

		fontCache = { regular: rBuf, bold: bBuf };
		return fontCache;
	} catch (err) {
		console.warn("Error fetching fonts:", err);
		fontCache = { regular: null, bold: null };
		return fontCache;
	}
}

// 获取图片的 base64 数据
async function getImageBase64(imagePath: string): Promise<string | null> {
	try {
		// 尝试从 import.meta.glob 结果中获取
		const normalizedPath = imagePath.startsWith("/")
			? imagePath
			: `/${imagePath}`;

		// 查找匹配的图片模块
		for (const [path, module] of Object.entries(avatarModules)) {
			if (path.includes(normalizedPath) || normalizedPath.includes(path.replace("/src/", ""))) {
				const img = module as ImageMetadata;
				if (img.src) {
					// 如果是本地路径，需要获取实际文件内容
					if (img.src.startsWith("/")) {
						// 在构建时，我们可以尝试获取文件
						try {
							const response = await fetch(`http://localhost:4321${img.src}`);
							if (response.ok) {
								const arrayBuffer = await response.arrayBuffer();
								return `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
							}
						} catch {
							// 如果获取失败，返回 null
							return null;
						}
					}
				}
			}
		}

		// 对于 favicon，尝试从模块中获取
		for (const [path, module] of Object.entries(faviconModules)) {
			if (path.includes("favicon")) {
				const img = module as ImageMetadata;
				if (img.src) {
					return img.src;
				}
			}
		}

		return null;
	} catch (err) {
		console.warn("Error getting image base64:", err);
		return null;
	}
}

export async function GET({
	props,
}: APIContext<{ post: CollectionEntry<"posts"> }>) {
	const { post } = props;

	// Try to fetch fonts from Google Fonts (woff2) at runtime.
	const { regular: fontRegular, bold: fontBold } =
		await fetchNotoSansSCFonts();

	// 获取头像和图标
	// 注意：在 Cloudflare Workers 环境中，我们无法使用 fs 读取文件
	// 这里使用占位符或者尝试从网络获取
	let avatarBase64 = "";
	let iconBase64 = "";

	// 尝试获取头像
	if (profileConfig.avatar) {
		const avatarUrl = await getImageBase64(profileConfig.avatar);
		if (avatarUrl) {
			avatarBase64 = avatarUrl;
		}
	}

	// 尝试获取 favicon
	if (siteConfig.favicon.length > 0) {
		const iconUrl = await getImageBase64(siteConfig.favicon[0].src);
		if (iconUrl) {
			iconBase64 = iconUrl;
		}
	}

	const hue = siteConfig.themeColor.hue;
	const primaryColor = `hsl(${hue}, 90%, 65%)`;
	const textColor = "hsl(0, 0%, 95%)";

	const subtleTextColor = `hsl(${hue}, 10%, 75%)`;
	const backgroundColor = `hsl(${hue}, 15%, 12%)`;

	const pubDate = post.data.published.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});

	const description = post.data.description;

	const children: any[] = [
		{
			type: "div",
			props: {
				style: {
					width: "100%",
					display: "flex",
					alignItems: "center",
					gap: "20px",
				},
				children: [
					iconBase64 && {
						type: "img",
						props: {
							src: iconBase64,
							width: 48,
							height: 48,
							style: { borderRadius: "10px" },
						},
					},
					{
						type: "div",
						props: {
							style: {
								fontSize: "36px",
								fontWeight: 600,
								color: subtleTextColor,
							},
							children: siteConfig.title,
						},
					},
				].filter(Boolean),
			},
		},
		{
			type: "div",
			props: {
				style: {
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					flexGrow: 1,
					gap: "20px",
				},
				children: [
					{
						type: "div",
						props: {
							style: {
								display: "flex",
								alignItems: "flex-start",
							},
							children: [
								{
									type: "div",
									props: {
										style: {
											width: "10px",
											height: "68px",
											backgroundColor:
												primaryColor,
											borderRadius: "6px",
											marginTop: "14px",
										},
									},
								},
								{
									type: "div",
									props: {
										style: {
											fontSize: "72px",
											fontWeight: 700,
											lineHeight: 1.2,
											color: textColor,
											marginLeft: "25px",
											display: "-webkit-box",
											overflow: "hidden",
											textOverflow: "ellipsis",
											lineClamp: 3,
											WebkitLineClamp: 3,
											WebkitBoxOrient: "vertical",
										},
										children: post.data.title,
									},
								},
							],
						},
					},
					description && {
						type: "div",
						props: {
							style: {
								fontSize: "32px",
								lineHeight: 1.5,
								color: subtleTextColor,
								paddingLeft: "35px",
								display: "-webkit-box",
								overflow: "hidden",
								textOverflow: "ellipsis",
								lineClamp: 2,
								WebkitLineClamp: 2,
								WebkitBoxOrient: "vertical",
							},
							children: description,
						},
					},
				].filter(Boolean),
			},
		},
		{
			type: "div",
			props: {
				style: {
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					width: "100%",
				},
				children: [
					{
						type: "div",
						props: {
							style: {
								display: "flex",
								alignItems: "center",
								gap: "20px",
							},
							children: [
								avatarBase64 && {
									type: "img",
									props: {
										src: avatarBase64,
										width: 60,
										height: 60,
										style: { borderRadius: "50%" },
									},
								},
								{
									type: "div",
									props: {
										style: {
											fontSize: "28px",
											fontWeight: 600,
											color: textColor,
										},
										children: profileConfig.name,
									},
								},
							].filter(Boolean),
						},
					},
					{
						type: "div",
						props: {
							style: {
								fontSize: "28px",
								color: subtleTextColor,
							},
							children: pubDate,
						},
					},
				],
			},
		},
	];

	const template = {
		type: "div",
		props: {
			style: {
				height: "100%",
				width: "100%",
				display: "flex",
				flexDirection: "column",
				backgroundColor: backgroundColor,
				fontFamily:
					'"Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
				padding: "60px",
			},
			children,
		},
	};

	const fonts: FontOptions[] = [];
	if (fontRegular) {
		fonts.push({
			name: "Noto Sans SC",
			data: fontRegular,
			weight: 400,
			style: "normal",
		});
	}
	if (fontBold) {
		fonts.push({
			name: "Noto Sans SC",
			data: fontBold,
			weight: 700,
			style: "normal",
		});
	}

	const svg = await satori(template, {
		width: 1200,
		height: 630,
		fonts,
	});

	const png = await sharp(Buffer.from(svg)).png().toBuffer();

	return new Response(new Uint8Array(png), {
		headers: {
			"Content-Type": "image/png",
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
}
