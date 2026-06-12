import {
	calculateDimensions,
	drawDateBadge,
	drawDecorativeCircles,
	drawRoundedRect,
	getLines,
	loadImage,
	parseDate,
	type SizeConfig,
} from "../utils/poster-renderer";

const FONT_FAMILY = "'Roboto', sans-serif";

export interface PosterDrawOptions {
	title: string;
	description: string;
	pubDate: string;
	coverImage: string | null;
	author: string;
	siteTitle: string;
	avatar: string | null;
	qrCodeUrl: string;
	themeColor: string;
	scale: number;
	width: number;
	padding: number;
	contentWidth: number;
	authorLabel: string;
	scanToReadLabel: string;
}

export async function generatePosterImage(
	options: PosterDrawOptions,
): Promise<string> {
	const {
		title,
		description,
		pubDate,
		coverImage,
		author,
		siteTitle,
		avatar,
		qrCodeUrl,
		themeColor,
		scale,
		width,
		padding,
		contentWidth,
		authorLabel,
		scanToReadLabel,
	} = options;

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
		scale,
		width,
		padding,
		contentWidth,
	};

	const { coverHeight, descHeight, canvasHeight } = calculateDimensions(
		!!coverImage,
		title,
		description,
		ctx,
		config,
	);

	canvas.width = width;
	canvas.height = canvasHeight;

	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	drawDecorativeCircles(ctx, canvas.width, canvas.height, themeColor, scale);

	if (coverImg) {
		const imgRatio = coverImg.width / coverImg.height;
		const targetRatio = width / coverHeight;
		let sx: number;
		let sy: number;
		let sWidth: number;
		let sHeight: number;

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
		ctx.drawImage(coverImg, sx, sy, sWidth, sHeight, 0, 0, width, coverHeight);
	} else {
		ctx.save();
		ctx.fillStyle = themeColor;
		ctx.globalAlpha = 0.2;
		ctx.fillRect(0, 0, width, coverHeight);
		ctx.restore();
	}

	const dateObj = parseDate(pubDate);
	if (dateObj) {
		drawDateBadge(ctx, dateObj, padding, coverHeight, scale, FONT_FAMILY);
	}

	const titleFontSize = 24 * scale;
	const titleLineHeight = 30 * scale;
	ctx.textBaseline = "top";
	ctx.textAlign = "left";
	ctx.font = `700 ${titleFontSize}px ${FONT_FAMILY}`;
	ctx.fillStyle = "#111827";
	const titleLines = getLines(ctx, title, contentWidth);
	let drawY = coverHeight + padding;
	for (const line of titleLines) {
		ctx.fillText(line, padding, drawY);
		drawY += titleLineHeight;
	}
	drawY += 16 * scale - (titleLineHeight - titleFontSize);

	if (description) {
		const descFontSize = 14 * scale;
		ctx.fillStyle = "#e5e7eb";
		drawRoundedRect(
			ctx,
			padding,
			drawY - 8 * scale,
			4 * scale,
			descHeight + 8 * scale,
			2 * scale,
		);
		ctx.fill();

		ctx.font = `${descFontSize}px ${FONT_FAMILY}`;
		ctx.fillStyle = "#4b5563";
		const descLines = getLines(ctx, description, contentWidth - 16 * scale);
		for (const line of descLines.slice(0, 6)) {
			ctx.fillText(line, padding + 16 * scale, drawY);
			drawY += 25 * scale;
		}
	} else {
		drawY += 8 * scale;
	}

	drawY += 24 * scale;
	ctx.beginPath();
	ctx.strokeStyle = "#f3f4f6";
	ctx.lineWidth = 1 * scale;
	ctx.moveTo(padding, drawY);
	ctx.lineTo(width - padding, drawY);
	ctx.stroke();
	drawY += 16 * scale;

	const footerY = drawY;
	const qrSize = 80 * scale;
	const qrX = width - padding - qrSize;

	ctx.fillStyle = "#ffffff";
	ctx.shadowColor = "rgba(0, 0, 0, 0.05)";
	ctx.shadowBlur = 4 * scale;
	ctx.shadowOffsetY = 2 * scale;
	drawRoundedRect(ctx, qrX, footerY, qrSize, qrSize, 4 * scale);
	ctx.fill();
	ctx.shadowColor = "transparent";

	if (qrImg) {
		const qrInnerSize = 76 * scale;
		const qrPadding = (qrSize - qrInnerSize) / 2;
		ctx.drawImage(
			qrImg,
			qrX + qrPadding,
			footerY + qrPadding,
			qrInnerSize,
			qrInnerSize,
		);
	}

	if (avatarImg) {
		ctx.save();
		const avatarSize = 64 * scale;
		const avatarX = padding;
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
		ctx.drawImage(avatarImg, avatarX, footerY, avatarSize, avatarSize);
		ctx.restore();

		ctx.beginPath();
		ctx.arc(
			avatarX + avatarSize / 2,
			footerY + avatarSize / 2,
			avatarSize / 2,
			0,
			Math.PI * 2,
		);
		ctx.strokeStyle = "#ffffff";
		ctx.lineWidth = 2 * scale;
		ctx.stroke();
	}

	const avatarOffset = avatar ? 64 * scale + 16 * scale : 0;
	const textX = padding + avatarOffset;

	ctx.fillStyle = "#9ca3af";
	ctx.font = `${12 * scale}px ${FONT_FAMILY}`;
	ctx.fillText(authorLabel, textX, footerY + 4 * scale);

	ctx.fillStyle = "#1f2937";
	ctx.font = `700 ${20 * scale}px ${FONT_FAMILY}`;
	ctx.fillText(author, textX, footerY + 20 * scale);

	ctx.fillStyle = "#9ca3af";
	ctx.font = `${12 * scale}px ${FONT_FAMILY}`;
	ctx.fillText(scanToReadLabel, textX, footerY + 44 * scale);

	ctx.fillStyle = "#1f2937";
	ctx.font = `700 ${20 * scale}px ${FONT_FAMILY}`;
	ctx.fillText(siteTitle, textX, footerY + 60 * scale);

	return canvas.toDataURL("image/png");
}
