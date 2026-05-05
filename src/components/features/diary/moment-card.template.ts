// Memos API 集成 — 类型定义、数据转换和卡片渲染
// 参考: DIARY_MEMOS_SETUP.md

import type { DiaryItem } from "../../../data/diary";

// --- Memos API 响应类型 ---

export interface MemoAttachment {
	name: string;
	filename: string;
	type: string;
	size: string;
	memo: string;
}

export interface MemoLocation {
	placeholder: string;
	latitude: number;
	longitude: number;
}

export interface Memo {
	name: string;
	state: string;
	creator: string;
	createTime: string;
	displayTime: string;
	content: string;
	visibility: string;
	pinned: boolean;
	tags: string[];
	attachments: MemoAttachment[];
	location?: MemoLocation;
	snippet: string;
}

export interface MemosResponse {
	memos: Memo[];
	nextPageToken: string;
}

// --- 数据转换 ---

export function transformMemosToDiary(
	memos: Memo[],
	baseUrl: string,
): DiaryItem[] {
	return memos
		.filter((m) => m.visibility === "PUBLIC" && m.state === "NORMAL")
		.map((m, i) => ({
			id: i,
			content: m.content,
			date: m.createTime,
			tags: m.tags.length > 0 ? m.tags : undefined,
			images:
				m.attachments.length > 0
					? m.attachments
							.filter((a) => a.type.startsWith("image/"))
							.map((a) => `${baseUrl}/file/${a.name}/${a.filename}`)
					: undefined,
			location: m.location?.placeholder,
			mood: undefined,
		}))
		.sort((a, b) => {
			// pinned 优先，其次按时间倒序
			const aM = memos.find((m) => m.createTime === a.date);
			const bM = memos.find((m) => m.createTime === b.date);
			if (aM?.pinned && !bM?.pinned) return -1;
			if (!aM?.pinned && bM?.pinned) return 1;
			return new Date(b.date).getTime() - new Date(a.date).getTime();
		});
}

// --- 相对时间格式化（客户端版本） ---

export function formatRelativeTime(
	dateString: string,
	timeZone: number,
	minutesAgo: string,
	hoursAgo: string,
	daysAgo: string,
): string {
	const now = new Date();
	const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
	const localNow = utc + timeZone * 60 * 60 * 1000;
	const date = new Date(dateString);
	const diffInMinutes = Math.floor(
		(localNow - date.getTime()) / (1000 * 60),
	);

	if (diffInMinutes < 60) return `${diffInMinutes}${minutesAgo}`;
	if (diffInMinutes < 1440) {
		return `${Math.floor(diffInMinutes / 60)}${hoursAgo}`;
	}
	return `${Math.floor(diffInMinutes / 1440)}${daysAgo}`;
}

// --- 单张卡片 HTML 生成 ---

function getImageLayoutClass(count: number): string {
	if (count === 1) return "diary-images-single";
	if (count === 2) return "diary-images-double";
	if (count === 3) return "diary-images-triple";
	return "diary-images-grid";
}

function escapeHtml(text: string): string {
	const map: Record<string, string> = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#039;",
	};
	return text.replace(/[&<>"']/g, (c) => map[c]);
}

function renderMomentCard(
	moment: DiaryItem,
	index: number,
	opts: {
		minutesAgo: string;
		hoursAgo: string;
		daysAgo: string;
		timeZone: number;
	},
): string {
	const relativeTime = formatRelativeTime(
		moment.date,
		opts.timeZone,
		opts.minutesAgo,
		opts.hoursAgo,
		opts.daysAgo,
	);

	const tagsAttr = moment.tags?.join(",") || "";

	let imagesHtml = "";
	if (moment.images && moment.images.length > 0) {
		const layoutClass = getImageLayoutClass(moment.images.length);
		const imgs = moment.images
			.map(
				(img, i) => `
				<div class="relative rounded-lg overflow-hidden aspect-square cursor-pointer">
					<a href="javascript:void(0)" data-src="${escapeHtml(img)}" data-fancybox="diary-${index}-${i}" class="block w-full h-full">
						<img src="${escapeHtml(img)}" alt="diary moment image" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" loading="lazy" decoding="async" />
					</a>
				</div>`,
			)
			.join("");
		imagesHtml = `<div class="diary-images grid gap-2 mb-3 ${layoutClass}">${imgs}</div>`;
	}

	let tagsHtml = "";
	if (moment.tags && moment.tags.length > 0) {
		const tagSpans = moment.tags
			.map(
				(tag) =>
					`<span class="btn-regular h-6 text-xs px-2 rounded-lg">${escapeHtml(tag)}</span>`,
			)
			.join("");
		tagsHtml = `<div class="flex flex-wrap gap-1.5 mb-3">${tagSpans}</div>`;
	}

	const locationHtml = moment.location
		? `<span class="flex items-center gap-1"><iconify-icon icon="material-symbols:location-on" class="text-xs w-3.5 h-3.5"></iconify-icon>${escapeHtml(moment.location)}</span>`
		: "";

	return `
	<div class="moment-card group relative bg-transparent rounded-xl border border-black/10 dark:border-white/10 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1" data-tags="${tagsAttr}">
		<div class="p-5">
			<p class="text-sm md:text-base text-black/90 dark:text-white/90 leading-relaxed mb-3">${escapeHtml(moment.content)}</p>
			${imagesHtml}
			${tagsHtml}
			<hr class="border-t border-black/5 dark:border-white/5 my-3" />
			<div class="flex items-center justify-between text-xs text-black/50 dark:text-white/50 flex-wrap gap-2">
				<div class="flex items-center gap-1.5">
					<iconify-icon icon="material-symbols:schedule" class="text-xs w-3.5 h-3.5"></iconify-icon>
					<time datetime="${escapeHtml(moment.date)}">${relativeTime}</time>
				</div>
				<div class="flex items-center gap-3">
					${locationHtml}
				</div>
			</div>
		</div>
		<div class="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"></div>
	</div>`;
}

// --- 全部卡片 HTML 生成 ---

export function renderMomentCards(
	moments: DiaryItem[],
	opts: {
		minutesAgo: string;
		hoursAgo: string;
		daysAgo: string;
		timeZone: number;
	},
): string {
	return moments.map((m, i) => renderMomentCard(m, i, opts)).join("");
}
