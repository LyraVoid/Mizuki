import { siteConfig } from "../config";

export type PostDateFormat = "date" | "datetime";

const pad = (n: number) => n.toString().padStart(2, "0");

export function formatDateToYYYYMMDD(date: Date): string {
	const Y = date.getFullYear();
	const M = pad(date.getMonth() + 1);
	const D = pad(date.getDate());
	return `${Y}-${M}-${D}`;
}

export function formatDateTime(date: Date): string {
	const datePart = formatDateToYYYYMMDD(date);
	const h = pad(date.getHours());
	const m = pad(date.getMinutes());
	const s = pad(date.getSeconds());
	return `${datePart} ${h}:${m}:${s}`;
}

export function formatDateForDisplay(
	date: Date,
	format?: PostDateFormat,
): string {
	const resolvedFormat = format ?? siteConfig.postDateFormat;
	return resolvedFormat === "datetime"
		? formatDateTime(date)
		: formatDateToYYYYMMDD(date);
}

export function formatDateForJsonLd(date: Date): string {
	return date.toISOString();
}

// 国际化日期格式化函数
export function formatDateI18n(dateString: string): string {
	const date = new Date(dateString);
	const lang = siteConfig.lang || "en";

	// 根据语言设置不同的日期格式
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
	};

	// 语言代码映射
	const localeMap: Record<string, string> = {
		zh_CN: "zh-CN",
		zh_TW: "zh-TW",
		en: "en-US",
		ja: "ja-JP",
		ko: "ko-KR",
		es: "es-ES",
		th: "th-TH",
		vi: "vi-VN",
		tr: "tr-TR",
		id: "id-ID",
		fr: "fr-FR",
		de: "de-DE",
		ru: "ru-RU",
		ar: "ar-SA",
	};

	const locale = localeMap[lang] || "en-US";
	return date.toLocaleDateString(locale, options);
}
