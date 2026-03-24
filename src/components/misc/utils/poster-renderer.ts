/**
 * poster-renderer.ts - Canvas rendering utilities for SharePoster component
 */

export interface PosterConfig {
	title: string;
	author: string;
	description: string;
	pubDate: string;
	coverImage: string | null;
	url: string;
	siteTitle: string;
	avatar: string | null;
	themeColor: string;
}

export interface SizeConfig {
	scale: number;
	width: number;
	padding: number;
	contentWidth: number;
}

/**
 * Load image from URL with fallback to proxy
 */
export async function loadImage(src: string): Promise<HTMLImageElement | null> {
	return new Promise((resolve) => {
		const img = new Image();
		img.crossOrigin = "anonymous";

		img.onload = () => resolve(img);
		img.onerror = () => {
			if (src.includes("images.weserv.nl") || src.startsWith("data:")) {
				resolve(null);
				return;
			}

			const proxyImg = new Image();
			proxyImg.crossOrigin = "anonymous";
			proxyImg.onload = () => resolve(proxyImg);
			proxyImg.onerror = () => resolve(null);
			proxyImg.src = `https://images.weserv.nl/?url=${encodeURIComponent(src)}&output=png`;
		};

		img.src = src;
	});
}

/**
 * Get text lines wrapped to fit maxWidth
 */
export function getLines(
	ctx: CanvasRenderingContext2D,
	text: string,
	maxWidth: number,
): string[] {
	const lines: string[] = [];
	let currentLine = "";

	for (const char of text) {
		if (ctx.measureText(currentLine + char).width < maxWidth) {
			currentLine += char;
		} else {
			lines.push(currentLine);
			currentLine = char;
		}
	}

	if (currentLine) {
		lines.push(currentLine);
	}
	return lines;
}

/**
 * Draw rounded rectangle on canvas
 */
export function drawRoundedRect(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	radius: number,
): void {
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();
}

/**
 * Parse date string to object
 */
export function parseDate(
	dateStr: string,
): { day: string; month: string; year: string } | null {
	try {
		const d = new Date(dateStr);
		if (Number.isNaN(d.getTime())) {
			return null;
		}

		return {
			day: d.getDate().toString().padStart(2, "0"),
			month: (d.getMonth() + 1).toString().padStart(2, "0"),
			year: d.getFullYear().toString(),
		};
	} catch {
		return null;
	}
}

/**
 * Calculate poster dimensions
 */
export function calculateDimensions(
	hasCover: boolean,
	title: string,
	description: string,
	ctx: CanvasRenderingContext2D,
	config: SizeConfig,
): {
	coverHeight: number;
	titleHeight: number;
	descHeight: number;
	canvasHeight: number;
} {
	const { scale, padding, contentWidth } = config;
	const FONT_FAMILY = "'Roboto', sans-serif";

	const coverHeight = (hasCover ? 200 : 120) * scale;
	const titleFontSize = 24 * scale;
	const descFontSize = 14 * scale;
	const titleLineHeight = 30 * scale;

	// Calculate title height
	ctx.font = `700 ${titleFontSize}px ${FONT_FAMILY}`;
	const titleLines = getLines(ctx, title, contentWidth);
	const titleHeight = titleLines.length * titleLineHeight;

	// Calculate description height
	let descHeight = 0;
	if (description) {
		ctx.font = `${descFontSize}px ${FONT_FAMILY}`;
		const descLines = getLines(ctx, description, contentWidth - 16 * scale);
		descHeight = Math.min(descLines.length, 6) * (25 * scale);
	}

	const canvasHeight =
		coverHeight +
		padding +
		titleHeight +
		16 * scale +
		descHeight +
		(description ? 24 * scale : 8 * scale) +
		24 * scale +
		80 * scale + // QR size
		padding;

	return { coverHeight, titleHeight, descHeight, canvasHeight };
}

/**
 * Draw decorative circles on poster
 */
export function drawDecorativeCircles(
	ctx: CanvasRenderingContext2D,
	canvasWidth: number,
	canvasHeight: number,
	themeColor: string,
	scale: number,
): void {
	ctx.save();
	ctx.globalAlpha = 0.1;
	ctx.fillStyle = themeColor;
	ctx.beginPath();
	ctx.arc(canvasWidth - 25 * scale, 25 * scale, 75 * scale, 0, Math.PI * 2);
	ctx.fill();
	ctx.beginPath();
	ctx.arc(10 * scale, canvasHeight - 10 * scale, 50 * scale, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}

/**
 * Draw date badge on cover image
 */
export function drawDateBadge(
	ctx: CanvasRenderingContext2D,
	dateObj: { day: string; month: string; year: string },
	padding: number,
	coverHeight: number,
	scale: number,
	FONT_FAMILY: string,
	isDarkMode: boolean = false,
): void {
	const dateBoxW = 60 * scale;
	const dateBoxH = 60 * scale;
	const dateBoxX = padding;
	const dateBoxY = coverHeight - dateBoxH;

	const bgColor = isDarkMode
		? "rgba(255, 255, 255, 0.15)"
		: "rgba(0, 0, 0, 0.3)";
	const textColor = isDarkMode ? "#e5e5e5" : "#ffffff";
	const separatorColor = isDarkMode
		? "rgba(255, 255, 255, 0.4)"
		: "rgba(255, 255, 255, 0.6)";

	// Background
	ctx.fillStyle = bgColor;
	drawRoundedRect(ctx, dateBoxX, dateBoxY, dateBoxW, dateBoxH, 4 * scale);
	ctx.fill();

	// Day number
	ctx.fillStyle = textColor;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = `700 ${30 * scale}px ${FONT_FAMILY}`;
	ctx.fillText(dateObj.day, dateBoxX + dateBoxW / 2, dateBoxY + 24 * scale);

	// Separator line
	ctx.beginPath();
	ctx.strokeStyle = separatorColor;
	ctx.lineWidth = 1 * scale;
	ctx.moveTo(dateBoxX + 10 * scale, dateBoxY + 42 * scale);
	ctx.lineTo(dateBoxX + dateBoxW - 10 * scale, dateBoxY + 42 * scale);
	ctx.stroke();

	// Year month
	ctx.font = `${10 * scale}px ${FONT_FAMILY}`;
	ctx.fillText(
		`${dateObj.year} ${dateObj.month}`,
		dateBoxX + dateBoxW / 2,
		dateBoxY + 51 * scale,
	);
}
