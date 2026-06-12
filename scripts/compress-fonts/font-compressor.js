import fs from "node:fs";
import path from "node:path";
import Fontmin from "fontmin";
import { ROOT_DIR } from "./utils.js";
import { getFontConfigs } from "./config-parser.js";
import { collectText, getAsciiCharset } from "./text-collector.js";

/**
 * 压缩字体并输出到 dist 目录
 */
export async function compressFonts() {
	try {
		const fonts = getFontConfigs();

		if (fonts.length === 0) {
			console.log(
				"⚠ No fonts to compress (enableCompress=false or localFonts is empty)",
			);
			return;
		}

		console.log(`Found ${fonts.length} font configs to compress`);

		const distDir = path.join(ROOT_DIR, "dist");
		if (!fs.existsSync(distDir)) {
			console.log(
				"⚠ dist directory does not exist, please run astro build first",
			);
			return;
		}

		const distFontDir = path.join(distDir, "assets/font");
		if (!fs.existsSync(distFontDir)) {
			fs.mkdirSync(distFontDir, { recursive: true });
		}

		const cjkText = await collectText();
		const asciiText = getAsciiCharset();

		console.log("Starting font compression...");

		let totalOriginalSize = 0;
		let totalCompressedSize = 0;
		let processedCount = 0;
		const errors = [];

		for (const fontConfig of fonts) {
			const text =
				fontConfig.type === "asciiFont" ? asciiText : cjkText;

			for (const fontFile of fontConfig.files) {
				const fontSrc = path.join(
					ROOT_DIR,
					"public/assets/font",
					fontFile,
				);
				const ext = path.extname(fontFile).toLowerCase();
				const baseName = path.basename(fontFile, ext);

				if (!fs.existsSync(fontSrc)) {
					const errorMsg = `❌ Config error [${fontConfig.type}]: Font file does not exist\n   In config: "${fontFile}"\n   Expected path: public/assets/font/${fontFile}\n\n   Please check:\n   1. Is the filename correct (case sensitive)?\n   2. Is the file in public/assets/font/?\n   3. Is ${fontConfig.type}.localFonts in src/config/siteConfig.ts correct?`;
					errors.push(errorMsg);
					console.log(`\n${errorMsg}\n`);
					continue;
				}

				const originalSize = fs.statSync(fontSrc).size;
				totalOriginalSize += originalSize;

				if (ext === ".woff2" || ext === ".woff") {
					console.log(
						`⚠ Skipping ${fontFile} (already web-optimized format)`,
					);
					fs.copyFileSync(fontSrc, path.join(distFontDir, fontFile));
					totalCompressedSize += originalSize;
				} else if (ext === ".ttf" || ext === ".otf") {
					console.log(`Compressing ${fontFile}...`);

					const fontmin = new Fontmin()
						.src(fontSrc)
						.use(
							Fontmin.glyph({
								text,
								hinting: false,
							}),
						)
						.use(
							Fontmin.ttf2woff2({
								clone: false,
								deflate: true,
							}),
						)
						.dest(distFontDir);

					await new Promise((resolve, reject) => {
						fontmin.run((err, files) => {
							if (err) reject(err);
							else resolve(files);
						});
					});

					const compressedFile = path.join(
						distFontDir,
						`${baseName}.woff2`,
					);

					if (fs.existsSync(compressedFile)) {
						const compressedSize =
							fs.statSync(compressedFile).size;
						totalCompressedSize += compressedSize;
						const reduction = (
							(1 - compressedSize / originalSize) *
							100
						).toFixed(2);
						console.log(
							`✓ ${fontFile} → ${baseName}.woff2 (${(compressedSize / 1024).toFixed(2)} KB, reduced ${reduction}%)`,
						);
						processedCount++;
					}
				} else {
					console.log(
						`⚠ Unsupported font format, skipping: ${fontFile}`,
					);
				}
			}
		}

		if (errors.length > 0) {
			console.log("\n❌ Font compression encountered errors!");
			console.log(`${errors.length} errors, please fix and retry.\n`);

			const fontDir = path.join(ROOT_DIR, "public/assets/font");
			if (fs.existsSync(fontDir)) {
				const actualFiles = fs
					.readdirSync(fontDir)
					.filter((f) =>
						[".ttf", ".otf", ".woff", ".woff2"].includes(
							path.extname(f).toLowerCase(),
						),
					);
				if (actualFiles.length > 0) {
					console.log("Available font files:");
					for (const f of actualFiles) console.log(`  - ${f}`);
				} else {
					console.log("  (font directory is empty)");
				}
			}

			process.exit(1);
		}

		if (processedCount > 0) {
			const totalReduction = (
				(1 - totalCompressedSize / totalOriginalSize) *
				100
			).toFixed(2);
			console.log("\n✓ Font optimization complete!");
			console.log(
				`  Files processed: ${processedCount}, Overall reduction: ${totalReduction}%`,
			);
		} else {
			console.log("\n⚠ No font files processed");
		}
	} catch (error) {
		console.error("❌ Font compression failed:", error);
		process.exit(1);
	}
}
