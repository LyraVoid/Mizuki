<script lang="ts">
	import Icon from "@iconify/svelte";
	import { onMount } from "svelte";

	import I18nKey from "../../i18n/i18nKey";
	import { i18n } from "../../i18n/translation";
	import {
		calculateDimensions,
		drawDateBadge,
		drawDecorativeCircles,
		drawRoundedRect,
		getLines,
		loadImage,
		parseDate,
		type PosterConfig,
		type SizeConfig,
	} from "./utils/poster-renderer";

	export let title: string;
	export let author: string;
	export let description = "";
	export let pubDate: string;
	export let coverImage: string | null = null;
	export let url: string;
	export let siteTitle: string;
	export let avatar: string | null = null;

	// Constants
	const SCALE = 2;
	const WIDTH = 425 * SCALE;
	const PADDING = 24 * SCALE;
	const CONTENT_WIDTH = WIDTH - PADDING * 2;
	const FONT_FAMILY = "'Roboto', sans-serif";

	// State
	let showModal = false;
	let posterImage: string | null = null;
	let generating = false;
	let themeColor = "#558e88";

	function isDarkMode(): boolean {
		return document.documentElement.classList.contains("dark");
	}

	function getPosterColors() {
		const dark = isDarkMode();
		return {
			background: dark ? "#1a1a1a" : "#ffffff",
			title: dark ? "#e5e5e5" : "#111827",
			descBg: dark ? "#2a2a2a" : "#e5e7eb",
			descText: dark ? "#a3a3a3" : "#4b5563",
			separator: dark ? "#2e2e2e" : "#f3f4f6",
			metaText: dark ? "#6b6b6b" : "#9ca3af",
			primaryText: dark ? "#d4d4d4" : "#1f2937",
			qrBg: dark ? "#2a2a2a" : "#ffffff",
			qrDark: dark ? "#ffffff" : "#000000",
			qrLight: dark ? "#1a1a1a" : "#ffffff",
			avatarBorder: dark ? "#2a2a2a" : "#ffffff",
			dateBg: dark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.3)",
			dateText: dark ? "#e5e5e5" : "#ffffff",
		};
	}

	onMount(() => {
		const temp = document.createElement("div");
		temp.style.color = "var(--primary)";
		temp.style.display = "none";
		document.body.appendChild(temp);
		const computedColor = getComputedStyle(temp).color;
		document.body.removeChild(temp);

		if (computedColor) {
			themeColor = computedColor;
		}

		const observer = new MutationObserver(() => {
			posterImage = null;
		});
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
		});

		return () => observer.disconnect();
	});

	async function generatePoster() {
		showModal = true;
		if (posterImage) {
			return;
		}

		generating = true;
		const colors = getPosterColors();

		try {
			const QRCode = await import("qrcode");
			const qrCodeUrl = await QRCode.toDataURL(url, {
				margin: 1,
				width: 100 * SCALE,
				color: { dark: colors.qrDark, light: colors.qrLight },
			});

			const [qrImg, coverImg, avatarImg] = await Promise.all([
				loadImage(qrCodeUrl),
				coverImage ? loadImage(coverImage) : Promise.resolve(null),
				avatar ? loadImage(avatar) : Promise.resolve(null),
			]);

			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				throw new Error("Canvas context not available");
			}

			const config: SizeConfig = {
				scale: SCALE,
				width: WIDTH,
				padding: PADDING,
				contentWidth: CONTENT_WIDTH,
			};
			const { coverHeight, titleHeight, descHeight, canvasHeight } =
				calculateDimensions(
					!!coverImage,
					title,
					description,
					ctx,
					config,
				);

			canvas.width = WIDTH;
			canvas.height = canvasHeight;

			// Background
			ctx.fillStyle = colors.background;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Decorative circles
			drawDecorativeCircles(
				ctx,
				canvas.width,
				canvas.height,
				themeColor,
				SCALE,
			);

			// Cover image
			if (coverImg) {
				const imgRatio = coverImg.width / coverImg.height;
				const targetRatio = WIDTH / coverHeight;
				let sx: number, sy: number, sWidth: number, sHeight: number;

				if (imgRatio > targetRatio) {
					sHeight = coverImg.height;
					sWidth = sHeight * targetRatio;
					sx = (coverImg.width - sWidth) / 2;
					sy = 0;
				} else {
					sWidth = coverImg.width;
					sHeight = sWidth / targetRatio;
					sx = 0;
					sy = (coverImg.height - sHeight) / 2;
				}
				ctx.drawImage(
					coverImg,
					sx,
					sy,
					sWidth,
					sHeight,
					0,
					0,
					WIDTH,
					coverHeight,
				);
			} else {
				ctx.save();
				ctx.fillStyle = themeColor;
				ctx.globalAlpha = 0.2;
				ctx.fillRect(0, 0, WIDTH, coverHeight);
				ctx.restore();
			}

			// Date badge
			const dateObj = parseDate(pubDate);
			if (dateObj) {
				drawDateBadge(
					ctx,
					dateObj,
					PADDING,
					coverHeight,
					SCALE,
					FONT_FAMILY,
					isDarkMode(),
				);
			}

			// Title
			const titleFontSize = 24 * SCALE;
			const titleLineHeight = 30 * SCALE;
			ctx.textBaseline = "top";
			ctx.textAlign = "left";
			ctx.font = `700 ${titleFontSize}px ${FONT_FAMILY}`;
			ctx.fillStyle = colors.title;
			const titleLines = getLines(ctx, title, CONTENT_WIDTH);
			let drawY = coverHeight + PADDING;
			for (const line of titleLines) {
				ctx.fillText(line, PADDING, drawY);
				drawY += titleLineHeight;
			}
			drawY += 16 * SCALE - (titleLineHeight - titleFontSize);

			// Description
			if (description) {
				const descFontSize = 14 * SCALE;
				ctx.fillStyle = colors.descBg;
				drawRoundedRect(
					ctx,
					PADDING,
					drawY - 8 * SCALE,
					4 * SCALE,
					descHeight + 8 * SCALE,
					2 * SCALE,
				);
				ctx.fill();

				ctx.font = `${descFontSize}px ${FONT_FAMILY}`;
				ctx.fillStyle = colors.descText;
				const descLines = getLines(
					ctx,
					description,
					CONTENT_WIDTH - 16 * SCALE,
				);
				for (const line of descLines.slice(0, 6)) {
					ctx.fillText(line, PADDING + 16 * SCALE, drawY);
					drawY += 25 * SCALE;
				}
			} else {
				drawY += 8 * SCALE;
			}

			// Separator line
			drawY += 24 * SCALE;
			ctx.beginPath();
			ctx.strokeStyle = colors.separator;
			ctx.lineWidth = 1 * SCALE;
			ctx.moveTo(PADDING, drawY);
			ctx.lineTo(WIDTH - PADDING, drawY);
			ctx.stroke();
			drawY += 16 * SCALE;

			// Footer
			const footerY = drawY;
			const qrSize = 80 * SCALE;
			const qrX = WIDTH - PADDING - qrSize;

			// QR code background
			ctx.fillStyle = colors.qrBg;
			ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
			ctx.shadowBlur = 4 * SCALE;
			ctx.shadowOffsetY = 2 * SCALE;
			drawRoundedRect(ctx, qrX, footerY, qrSize, qrSize, 4 * SCALE);
			ctx.fill();
			ctx.shadowColor = "transparent";

			// QR code image
			if (qrImg) {
				const qrInnerSize = 76 * SCALE;
				const qrPadding = (qrSize - qrInnerSize) / 2;
				ctx.drawImage(
					qrImg,
					qrX + qrPadding,
					footerY + qrPadding,
					qrInnerSize,
					qrInnerSize,
				);
			}

			// Avatar
			if (avatarImg) {
				ctx.save();
				const avatarSize = 64 * SCALE;
				const avatarX = PADDING;
				ctx.beginPath();
				ctx.arc(
					avatarX + avatarSize / 2,
					footerY + avatarSize / 2,
					avatarSize / 2,
					0,
					Math.PI * 2,
				);
				ctx.closePath();
				ctx.clip();
				ctx.drawImage(
					avatarImg,
					avatarX,
					footerY,
					avatarSize,
					avatarSize,
				);
				ctx.restore();

				ctx.beginPath();
				ctx.arc(
					avatarX + avatarSize / 2,
					footerY + avatarSize / 2,
					avatarSize / 2,
					0,
					Math.PI * 2,
				);
				ctx.strokeStyle = colors.avatarBorder;
				ctx.lineWidth = 2 * SCALE;
				ctx.stroke();
			}

			// Author text
			const avatarOffset = avatar ? 64 * SCALE + 16 * SCALE : 0;
			const textX = PADDING + avatarOffset;

			ctx.fillStyle = colors.metaText;
			ctx.font = `${12 * SCALE}px ${FONT_FAMILY}`;
			ctx.fillText(i18n(I18nKey.author), textX, footerY + 4 * SCALE);

			ctx.fillStyle = colors.primaryText;
			ctx.font = `700 ${20 * SCALE}px ${FONT_FAMILY}`;
			ctx.fillText(author, textX, footerY + 20 * SCALE);

			// Site title
			ctx.fillStyle = colors.metaText;
			ctx.font = `${12 * SCALE}px ${FONT_FAMILY}`;
			ctx.fillText(i18n(I18nKey.scanToRead), textX, footerY + 44 * SCALE);

			ctx.fillStyle = colors.primaryText;
			ctx.font = `700 ${20 * SCALE}px ${FONT_FAMILY}`;
			ctx.fillText(siteTitle, textX, footerY + 60 * SCALE);

			posterImage = canvas.toDataURL("image/png");
		} catch (error) {
			console.error("Failed to generate poster:", error);
		} finally {
			generating = false;
		}
	}

	function downloadPoster() {
		if (posterImage) {
			const a = document.createElement("a");
			a.href = posterImage;
			a.download = `poster-${title.replace(/\s+/g, "-")}.png`;
			a.click();
		}
	}

	function closeModal() {
		showModal = false;
	}

	let copied = false;
	const COPY_FEEDBACK_DURATION = 2000;

	async function copyLink() {
		try {
			if (navigator.clipboard?.writeText) {
				await navigator.clipboard.writeText(url);
			} else {
				const textarea = document.createElement("textarea");
				textarea.value = url;
				textarea.style.position = "fixed";
				textarea.style.left = "-9999px";
				document.body.appendChild(textarea);
				textarea.select();
				document.execCommand("copy");
				document.body.removeChild(textarea);
			}

			copied = true;
			setTimeout(() => {
				copied = false;
			}, COPY_FEEDBACK_DURATION);
		} catch (error) {
			console.error("Failed to copy link:", error);
		}
	}

	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return {
			destroy() {
				if (node.parentNode) {
					node.parentNode.removeChild(node);
				}
			},
		};
	}
</script>

<button
	class="btn-regular px-6 py-3 rounded-lg inline-flex items-center gap-2"
	on:click={generatePoster}
	aria-label="Generate Share Poster"
>
	<span>{i18n(I18nKey.shareArticle)}</span>
</button>

{#if showModal}
	<div
		use:portal
		class="fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity"
		style="background-color: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px);"
		on:click={closeModal}
	>
		<div
			class="rounded-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl transform transition-all"
			style="background-color: var(--float-panel-bg);"
			on:click|stopPropagation
		>
			<div
				class="p-6 flex justify-center min-h-[200px] items-center"
				style="background-color: var(--card-bg);"
			>
				{#if posterImage}
					<img
						src={posterImage}
						alt="Poster"
						class="max-w-full h-auto shadow-lg rounded-lg"
					/>
				{:else}
					<div class="flex flex-col items-center gap-3">
						<div
							class="w-8 h-8 border-2 rounded-full animate-spin"
							style="border-color: oklch(0.35 0.02 var(--hue)); border-top-color: {themeColor};"
						></div>
						<span
							class="text-sm"
							style="color: var(--content-meta);"
							>{i18n(I18nKey.generatingPoster)}</span
						>
					</div>
				{/if}
			</div>

			<div
				class="p-4 grid grid-cols-2 gap-3"
				style="border-top: 1px solid var(--line-color);"
			>
				<button
					class="py-3 rounded-xl font-medium active:scale-[0.98] transition-all flex items-center justify-center gap-2"
					style="background-color: var(--btn-card-bg-hover); color: var(--btn-content);"
					on:mouseenter={(e) =>
						(e.currentTarget.style.backgroundColor =
							"var(--btn-card-bg-active)")}
					on:mouseleave={(e) =>
						(e.currentTarget.style.backgroundColor =
							"var(--btn-card-bg-hover)")}
					on:click={copyLink}
				>
					{#if copied}
						<Icon
							icon="material-symbols:check"
							width="20"
							height="20"
						/>
						<span>{i18n(I18nKey.copied)}</span>
					{:else}
						<Icon
							icon="material-symbols:link"
							width="20"
							height="20"
						/>
						<span>{i18n(I18nKey.copyLink)}</span>
					{/if}
				</button>
				<button
					class="py-3 rounded-xl font-medium active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
					style="background-color: {themeColor}; color: white;"
					on:click={downloadPoster}
					disabled={!posterImage}
				>
					<Icon
						icon="material-symbols:download"
						width="20"
						height="20"
					/>
					{i18n(I18nKey.savePoster)}
				</button>
			</div>
		</div>
	</div>
{/if}
