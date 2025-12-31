<script lang="ts">
import Icon from "@iconify/svelte";
import { onMount } from "svelte";
import I18nKey from "../i18n/i18nKey";
import { i18n } from "../i18n/translation";
import { navigateToPage } from "../utils/navigation-utils";
import { panelManager } from "../utils/panel-manager.js";

let tocItems: Array<{
	id: string;
	text: string;
	level: number;
	badge?: string;
}> = [];
let postItems: Array<{
	title: string;
	url: string;
	category?: string;
	pinned?: boolean;
}> = [];
let activeId = "";
let observer: IntersectionObserver;
let isHomePage = false;
let swupReady = false;
let useJapaneseBadge = false;
let tocDepth = 3;

const togglePanel = async () => {
	await panelManager.togglePanel("mobile-toc-panel");
};

const setPanelVisibility = async (show: boolean): Promise<void> => {
	await panelManager.togglePanel("mobile-toc-panel", show);
};

const generateTOC = () => {
	// 获取配置
	useJapaneseBadge = (window as any).siteConfig?.toc?.useJapaneseBadge || false;
	tocDepth = (window as any).siteConfig?.toc?.depth || 3;

	const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
	const items: Array<{
		id: string;
		text: string;
		level: number;
		badge?: string;
	}> = [];
	const japaneseHiragana = [
		"ア",
		"イ",
		"ウ",
		"エ",
		"オ",
		"カ",
		"キ",
		"ク",
		"ケ",
		"コ",
		"サ",
		"シ",
		"ス",
		"セ",
		"ソ",
		"タ",
		"チ",
		"ツ",
		"テ",
		"ト",
	];
	let h1Count = 0;

	headings.forEach((heading) => {
		if (heading.id) {
			const level = Number.parseInt(heading.tagName.charAt(1), 10);

			// 根据depth配置过滤标题
			if (level > tocDepth) {
				return;
			}

			const text = (heading.textContent || "").replace(/#+\s*$/, "");
			let badge = "";

			// 只为H1标题生成badge
			if (level === 1) {
				h1Count++;
				if (useJapaneseBadge && h1Count - 1 < japaneseHiragana.length) {
					badge = japaneseHiragana[h1Count - 1];
				} else {
					badge = h1Count.toString();
				}
			}

			items.push({ id: heading.id, text, level, badge });
		}
	});

	tocItems = items;
};

const generatePostList = () => {
	// 查找所有文章卡片
	const postCards = document.querySelectorAll(".card-base");
	const items: Array<{
		title: string;
		url: string;
		category?: string;
		pinned?: boolean;
	}> = [];

	postCards.forEach((card) => {
		// 查找标题链接
		const titleLink = card.querySelector('a[href*="/posts/"].transition.group');
		// 查找分类链接
		const categoryLink = card.querySelector('a[href*="/categories/"].link-lg');
		// 查找置顶图标
		const pinnedIcon = titleLink?.querySelector('svg[data-icon="mdi:pin"]');

		if (titleLink) {
			const href = titleLink.getAttribute("href");
			const title = titleLink.textContent?.replace(/\s+/g, " ").trim() || "";
			const category = categoryLink?.textContent?.trim() || "";
			const pinned = !!pinnedIcon;

			if (href && title) {
				items.push({ title, url: href, category, pinned });
			}
		}
	});

	postItems = items;
};

const checkIsHomePage = () => {
	const pathname = window.location.pathname;
	// 检查是否为首页或首页的分页页面
	// 分页格式：/, /2/, /3/, 等等
	isHomePage =
		pathname === "/" || pathname === "" || /^\/\d+\/?$/.test(pathname);
};

const scrollToHeading = (id: string) => {
	const element = document.getElementById(id);
	if (element) {
		// 关闭面板
		setPanelVisibility(false);

		// 滚动到目标位置，考虑导航栏高度
		const offset = 80;
		const elementPosition = element.offsetTop - offset;

		window.scrollTo({
			top: elementPosition,
			behavior: "smooth",
		});
	}
};

const navigateToPost = (url: string) => {
	// 关闭面板
	setPanelVisibility(false);

	// 使用统一的导航工具函数，实现无刷新跳转
	navigateToPage(url);
};

const updateActiveHeading = () => {
	const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
	const scrollTop = window.scrollY;
	const offset = 100;

	let currentActiveId = "";
	headings.forEach((heading) => {
		if (heading.id) {
			const elementTop = (heading as HTMLElement).offsetTop - offset;
			if (scrollTop >= elementTop) {
				currentActiveId = heading.id;
			}
		}
	});

	activeId = currentActiveId;
};

const setupIntersectionObserver = () => {
	const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

	if (observer) {
		observer.disconnect();
	}

	observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					activeId = entry.target.id;
				}
			});
		},
		{
			rootMargin: "-80px 0px -80% 0px",
			threshold: 0,
		},
	);

	headings.forEach((heading) => {
		if (heading.id) {
			observer.observe(heading);
		}
	});
};

let swupListenersRegistered = false;

const setupSwupListeners = () => {
	if (
		typeof window !== "undefined" &&
		(window as any).swup &&
		!swupListenersRegistered
	) {
		const swup = (window as any).swup;

		// 只监听页面视图事件，避免重复触发
		swup.hooks.on("page:view", () => {
			// 延迟执行，确保页面已完全加载
			setTimeout(() => {
				init();
			}, 200);
		});

		swupListenersRegistered = true;
		console.log("MobileTOC Swup listener registered");
	} else if (!swupListenersRegistered) {
		// 降级处理：监听普通页面切换事件
		window.addEventListener("popstate", () => {
			setTimeout(init, 200);
		});
		swupListenersRegistered = true;
		console.log("MobileTOC fallback listener registered");
	}
};

const checkSwupAvailability = () => {
	if (typeof window !== "undefined") {
		// 检查Swup是否已加载
		swupReady = !!(window as any).swup;

		// 如果Swup还未加载，监听其加载事件
		if (!swupReady) {
			const checkSwup = () => {
				if ((window as any).swup) {
					swupReady = true;
					document.removeEventListener("swup:enable", checkSwup);
					// Swup加载完成后设置监听器
					setupSwupListeners();
				}
			};

			// 监听Swup启用事件
			document.addEventListener("swup:enable", checkSwup);

			// 设置超时检查
			setTimeout(() => {
				if ((window as any).swup) {
					swupReady = true;
					document.removeEventListener("swup:enable", checkSwup);
					// Swup加载完成后设置监听器
					setupSwupListeners();
				}
			}, 1000);
		} else {
			// Swup已经加载，直接设置监听器
			setupSwupListeners();
		}
	}
};

const init = () => {
	checkIsHomePage();
	checkSwupAvailability();
	if (isHomePage) {
		generatePostList();
	} else {
		generateTOC();
		setupIntersectionObserver();
		updateActiveHeading();
	}
};

onMount(() => {
	// 延迟初始化，确保页面内容已加载
	setTimeout(init, 100);

	// 监听滚动事件作为备用
	window.addEventListener("scroll", updateActiveHeading);

	return () => {
		if (observer) {
			observer.disconnect();
		}
		window.removeEventListener("scroll", updateActiveHeading);

		// 清理Swup事件监听器
		if (typeof window !== "undefined" && (window as any).swup) {
			const swup = (window as any).swup;
			swup.hooks.off("page:view");
		}

		// 清理popstate事件监听器
		window.removeEventListener("popstate", init);
		swupListenersRegistered = false;
	};
});

// 导出初始化函数供外部调用
if (typeof window !== "undefined") {
	(window as any).mobileTOCInit = init;
}
</script>

<!-- TOC toggle button for mobile -->
<button 
	on:click={togglePanel} 
	aria-label="Table of Contents" 
	id="mobile-toc-switch"
	class="btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90 lg:!hidden theme-switch-btn"
>
	<Icon icon="material-symbols:format-list-bulleted" class="text-[1.25rem]" />
</button>

<!-- Mobile TOC Panel -->
<div 
	id="mobile-toc-panel" 
	class="float-panel float-panel-closed mobile-toc-panel absolute md:w-[20rem] w-[calc(100vw-2rem)]
		top-20 left-4 md:left-[unset] right-4 shadow-2xl rounded-2xl p-4"
>
	<div class="flex items-center justify-between mb-4">
		<h3 class="text-lg font-bold text-[var(--primary)]">{isHomePage ? i18n(I18nKey.postList) : i18n(I18nKey.tableOfContents)}</h3>
		<button 
			on:click={togglePanel}
			aria-label="Close TOC"
			class="btn-plain rounded-lg h-8 w-8 active:scale-90 theme-switch-btn"
		>
			<Icon icon="material-symbols:close" class="text-[1rem]" />
		</button>
	</div>

	{#if isHomePage}
		{#if postItems.length === 0}
			<div class="text-center py-8 text-black/50 dark:text-white/50">
				<Icon icon="material-symbols:article-outline" class="text-2xl mb-2" />
				<p>暂无文章</p>
			</div>
		{:else}
			<div class="post-content">
				{#each postItems as post}
					<button
						on:click={() => navigateToPost(post.url)}
						class="post-item"
					>
						<div class="post-title">
							{#if post.pinned}
								<Icon icon="mdi:pin" class="pinned-icon" />
							{/if}
							{post.title}
						</div>
						{#if post.category}
							<div class="post-category">{post.category}</div>
						{/if}
					</button>
				{/each}
			</div>
		{/if}
	{:else}
		{#if tocItems.length === 0}
			<div class="text-center py-8 text-black/50 dark:text-white/50">
				<p>当前页面没有目录</p>
			</div>
		{:else}
			<div class="toc-content">
				{#each tocItems as item}
					<button
						on:click={() => scrollToHeading(item.id)}
						class="toc-item level-{item.level} {activeId === item.id ? 'active' : ''}"
						class:active={activeId === item.id}
					>
						{#if item.level === 1}
							<span class="badge">{item.badge}</span>
						{:else if item.level === 2}
							<span class="dot-square"></span>
						{:else}
							<span class="dot-small"></span>
						{/if}
						<span class="toc-text">{item.text}</span>
					</button>
				{/each}
			</div>
		{/if}
	{/if}
</div>

<style>
	.mobile-toc-panel {
		max-height: calc(100vh - 120px);
		overflow-y: auto;
		background: var(--card-bg);
		border: 1px solid var(--line-color);
		backdrop-filter: blur(10px);
	}

	/* 确保主题切换按钮的背景色即时更新 */
	:global(.theme-switch-btn)::before {
		transition: transform 75ms ease-out, background-color 0ms !important;
	}

	.toc-content {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.post-content {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.toc-item {
		display: flex;
		align-items: center;
		width: 100%;
		text-align: left;
		padding: 8px 12px;
		border-radius: 8px;
		transition: all 0.2s ease;
		border: none;
		background: transparent;
		cursor: pointer;
		color: rgba(0, 0, 0, 0.75);
		font-size: 0.9rem;
		line-height: 1.4;
	}

	:global(.dark) .toc-item {
		color: rgba(255, 255, 255, 0.75);
	}

	.toc-item:hover {
		background: var(--btn-plain-bg-hover);
		color: var(--primary);
	}

	.toc-item.active {
		background: var(--btn-plain-bg-active);
		color: var(--primary);
		font-weight: 600;
		border-left: 3px solid var(--primary);
		padding-left: 9px;
	}

	/* 不同级别的标题缩进 */
	.toc-item.level-1 {
		padding-left: 12px;
		font-weight: 600;
		font-size: 1rem;
		gap: 8px;
	}

	.toc-item.level-2 {
		padding-left: 28px;
		gap: 6px;
	}

	.toc-item.level-3 {
		padding-left: 36px;
		font-size: 0.85rem;
		gap: 6px;
	}

	.toc-item.level-4 {
		padding-left: 44px;
		font-size: 0.8rem;
		gap: 6px;
	}

	.toc-item.level-5,
	.toc-item.level-6 {
		padding-left: 52px;
		font-size: 0.75rem;
		color: rgba(0, 0, 0, 0.5);
		gap: 6px;
	}

	:global(.dark) .toc-item.level-5,
	:global(.dark) .toc-item.level-6 {
		color: rgba(255, 255, 255, 0.5);
	}

	.toc-item.level-1.active {
		padding-left: 9px;
	}

	.toc-item.level-2.active {
		padding-left: 25px;
	}

	.toc-item.level-3.active {
		padding-left: 33px;
	}

	.toc-item.level-4.active {
		padding-left: 41px;
	}

	.toc-item.level-5.active,
	.toc-item.level-6.active {
		padding-left: 49px;
	}

	.badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 20px;
		height: 20px;
		padding: 0 4px;
		border-radius: 6px;
		background: var(--toc-badge-bg);
		color: var(--btn-content);
		font-size: 0.8rem;
		font-weight: 600;
		flex-shrink: 0;
		line-height: 1;
	}

	.dot-square {
		display: inline-block;
		width: 8px;
		height: 8px;
		border-radius: 2px;
		background: var(--toc-badge-bg);
		flex-shrink: 0;
	}

	.dot-small {
		display: inline-block;
		width: 6px;
		height: 6px;
		border-radius: 2px;
		background: rgba(0, 0, 0, 0.05);
		flex-shrink: 0;
	}

	:global(.dark) .dot-small {
		background: rgba(255, 255, 255, 0.1);
	}

	.toc-text {
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		flex: 1;
	}

	.post-item {
		display: block;
		width: 100%;
		text-align: left;
		padding: 12px;
		border-radius: 8px;
		transition: all 0.2s ease;
		border: none;
		background: transparent;
		cursor: pointer;
		border: 1px solid var(--line-color);
	}

	.post-item:hover {
		background: var(--btn-plain-bg-hover);
		border-color: var(--primary);
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.post-title {
		font-size: 0.9rem;
		font-weight: 600;
		color: rgba(0, 0, 0, 0.75);
		margin-bottom: 4px;
		line-height: 1.4;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	:global(.dark) .post-title {
		color: rgba(255, 255, 255, 0.75);
	}

	.post-category {
		font-size: 0.75rem;
		color: rgba(0, 0, 0, 0.5);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	:global(.dark) .post-category {
		color: rgba(255, 255, 255, 0.5);
	}

	:global(.pinned-icon) {
		display: inline;
		color: var(--primary);
		font-size: 1.25rem;
		margin-right: 0.5rem;
		transform: translateY(-0.125rem);
		vertical-align: middle;
	}

	.post-item:hover .post-title {
		color: var(--primary);
	}

	.post-item:hover .post-category {
		color: rgba(0, 0, 0, 0.75);
	}

	:global(.dark) .post-item:hover .post-category {
		color: rgba(255, 255, 255, 0.75);
	}

	/* 滚动条样式 */
	.mobile-toc-panel::-webkit-scrollbar {
		width: 4px;
	}

	.mobile-toc-panel::-webkit-scrollbar-track {
		background: transparent;
	}

	.mobile-toc-panel::-webkit-scrollbar-thumb {
		background: var(--line-color);
		border-radius: 2px;
	}

	.mobile-toc-panel::-webkit-scrollbar-thumb:hover {
		background: var(--text-color-25);
	}
</style>