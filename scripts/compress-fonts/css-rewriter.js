import fs from "node:fs";
import path from "node:path";
import { ROOT_DIR, readFilesRecursively } from "./utils.js";
import { getFontConfigs } from "./config-parser.js";

/**
 * 更新 dist 中的 CSS，将 ttf 引用替换为 woff2
 */
export async function updateCssFontReferences() {
	try {
		const fonts = getFontConfigs();
		const distDir = path.join(ROOT_DIR, "dist/");
		const publicFontDir = path.join(ROOT_DIR, "public/assets/font");

		const cssFiles = readFilesRecursively(distDir).filter((f) =>
			f.endsWith(".css"),
		);

		if (cssFiles.length === 0) {
			console.log("⚠ No CSS files found in dist");
			return;
		}

		// 处理配置中的字体
		for (const fontConfig of fonts) {
			for (const fontFile of fontConfig.files) {
				const ext = path.extname(fontFile).toLowerCase();
				const baseName = path.basename(fontFile, ext);
				const woff2File = `${baseName}.woff2`;

				const distWoff2 = path.join(
					ROOT_DIR,
					`dist/assets/font/${woff2File}`,
				);
				const publicWoff2 = path.join(
					publicFontDir,
					`${baseName}.woff2`,
				);
				const hasWoff2 =
					fs.existsSync(distWoff2) || fs.existsSync(publicWoff2);

				if (!hasWoff2) {
					console.log(
						`⚠ No woff2 found for ${baseName}, keeping ttf reference`,
					);
					continue;
				}

				for (const cssFile of cssFiles) {
					let cssContent = fs.readFileSync(cssFile, "utf-8");
					const originalContent = cssContent;

					const ttfPattern = new RegExp(
						`url\\(["']?/assets/font/${baseName}\\.ttf["']?\\)\\s*format\\(["']truetype["']\\)`,
						"g",
					);

					if (fontConfig.enableCompress) {
						cssContent = cssContent.replace(
							ttfPattern,
							`url("/assets/font/${woff2File}") format("woff2")`,
						);
					} else if (fs.existsSync(publicWoff2)) {
						cssContent = cssContent.replace(
							ttfPattern,
							`url("/assets/font/${woff2File}") format("woff2"), url("/assets/font/${baseName}.ttf") format("truetype")`,
						);
					}

					if (cssContent !== originalContent) {
						fs.writeFileSync(cssFile, cssContent);
						console.log(
							`✓ Updated CSS: ${cssFile} (${baseName})`,
						);
					}
				}
			}
		}

		// 处理未在 config 中配置但用户直接放在 font 目录的 woff2
		if (!fs.existsSync(publicFontDir)) return;
		const publicFiles = fs.readdirSync(publicFontDir);

		for (const file of publicFiles) {
			if (!file.endsWith(".woff2")) continue;
			const baseName = path.basename(file, ".woff2");
			const ttfFile = `${baseName}.ttf`;

			// 检查是否已在配置中处理过
			const isConfigured = fonts.some((fc) =>
				fc.files.some(
					(f) => path.basename(f, path.extname(f)) === baseName,
				),
			);
			if (isConfigured) continue;

			for (const cssFile of cssFiles) {
				let cssContent = fs.readFileSync(cssFile, "utf-8");
				const ttfPattern = new RegExp(
					`url\\(["']?/assets/font/${baseName}\\.ttf["']?\\)\\s*format\\(["']truetype["']\\)`,
					"g",
				);

				if (cssContent.match(ttfPattern)) {
					cssContent = cssContent.replace(
						ttfPattern,
						`url("/assets/font/${file}") format("woff2"), url("/assets/font/${ttfFile}") format("truetype")`,
					);
					fs.writeFileSync(cssFile, cssContent);
					console.log(
						`✓ Updated CSS: ${cssFile} (${baseName} - woff2 fallback)`,
					);
				}
			}
		}
	} catch (error) {
		console.error("⚠ CSS font reference update failed:", error.message);
	}
}
