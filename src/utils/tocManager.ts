/**
 * TOC (Table of Contents) 工具类
 * 用于 CardTOC 的 TOC 逻辑
 * 基于 Firefly 项目的 TOCManager 实现
 */

import I18nKey from "../i18n/i18nKey";
import { i18n } from "../i18n/translation";
import { JAPANESE_KATAKANA } from "../components/features/toc/utils/japanese-katakana";

export interface TOCConfig {
	contentId?: string;
	contentElement?: HTMLElement;
	maxLevel?: number;
	scrollOffset?: number;
	useJapaneseBadge?: boolean;
}

export class TOCManager {
	private tocItems: HTMLElement[] = [];
	private observer: IntersectionObserver | null = null;
	private minDepth = 10;
	private maxLevel: number;
	private scrollTimeout: number | null = null;
	private contentId: string | null;
	private contentElement: HTMLElement | null;
	private scrollOffset: number;
	private useJapaneseBadge: boolean;

	constructor(config: TOCConfig) {
		this.contentId = config.contentId ?? null;
		this.contentElement = config.contentElement ?? null;
		this.maxLevel = config.maxLevel || 3;
		this.scrollOffset = config.scrollOffset || 80;
		this.useJapaneseBadge = config.useJapaneseBadge ?? false;
	}

	/**
	 * 获取当前实例绑定的 TOC 容器。
	 * 优先使用实例级元素引用，避免多实例时因为重复 id 命中错误节点。
	 */
	private getTOCContentElement(): HTMLElement | null {
		if (this.contentElement) {
			return this.contentElement;
		}

		if (!this.contentId) {
			return null;
		}

		return document.getElementById(this.contentId);
	}

	/**
	 * 获取当前实例内部的活动指示器。
	 * 指示器限定在当前内容容器内查询，避免多个目录组件互相污染。
	 */
	private getIndicatorElement(): HTMLElement | null {
		return this.getTOCContentElement()?.querySelector(
			"[data-card-toc-indicator]",
		) as HTMLElement | null;
	}

	private getContentContainer(): Element | null {
		return (
			document.querySelector(".custom-md") ||
			document.querySelector(".prose") ||
			document.querySelector(".markdown-content")
		);
	}

	private getAllHeadings(): HTMLElement[] {
		const contentContainer = this.getContentContainer();
		if (!contentContainer) {
			return [];
		}
		return Array.from(
			contentContainer.querySelectorAll("h1, h2, h3, h4, h5, h6"),
		);
	}

	private calculateMinDepth(headings: HTMLElement[]): number {
		let minDepth = 10;
		headings.forEach((heading) => {
			const depth = Number.parseInt(heading.tagName.charAt(1), 10);
			minDepth = Math.min(minDepth, depth);
		});
		return minDepth;
	}

	private filterHeadings(headings: HTMLElement[]): HTMLElement[] {
		return Array.from(headings).filter((heading) => {
			const depth = Number.parseInt(heading.tagName.charAt(1), 10);
			return depth < this.minDepth + this.maxLevel;
		});
	}

	private getCleanTextContent(element: HTMLElement): string {
		const clone = element.cloneNode(true) as HTMLElement;
		for (const el of clone.querySelectorAll("script, style")) {
			el.remove();
		}
		return clone.textContent || "";
	}

	private escapeHtmlAttr(value: string): string {
		return value
			.replace(/&/g, "&amp;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");
	}

	private generateBadgeContent(depth: number, heading1Count: number): string {
		if (depth === this.minDepth) {
			if (
				this.useJapaneseBadge &&
				heading1Count - 1 < JAPANESE_KATAKANA.length
			) {
				return JAPANESE_KATAKANA[heading1Count - 1];
			}
			return heading1Count.toString();
		}
		if (depth === this.minDepth + 1) {
			return '<span class="toc-badge-dot"></span>';
		}
		return '<span class="toc-badge-dot toc-badge-dot-sm"></span>';
	}

	private getEmptyStateHTML(): string {
		return `<div class="text-center py-8 text-gray-500 dark:text-gray-400"><p>${i18n(I18nKey.tocEmpty)}</p></div>`;
	}

	public generateTOCHTML(): string {
		const headings = this.getAllHeadings();

		if (headings.length === 0) {
			return this.getEmptyStateHTML();
		}

		this.minDepth = this.calculateMinDepth(headings);
		const filteredHeadings = this.filterHeadings(headings);

		if (filteredHeadings.length === 0) {
			return this.getEmptyStateHTML();
		}

		let tocHTML = "";
		let heading1Count = 1;

		filteredHeadings.forEach((heading) => {
			const depth = Number.parseInt(heading.tagName.charAt(1), 10);
			const depthLevel =
				depth === this.minDepth
					? 0
					: depth === this.minDepth + 1
						? 1
						: 2;

			if (!heading.id) {
				return;
			}

			const badgeContent = this.generateBadgeContent(
				depth,
				heading1Count,
			);
			if (depth === this.minDepth) {
				heading1Count++;
			}

			let headingText = this.getCleanTextContent(heading)
				.replace(/#+\s*$/, "")
				.trim();

			if (!headingText) {
				const dataSubtitles = heading.getAttribute("data-subtitles");
				if (dataSubtitles) {
					try {
						const subtitles = JSON.parse(dataSubtitles);
						headingText = Array.isArray(subtitles)
							? subtitles[0]
							: subtitles;
					} catch {
						// ignore
					}
				}
			}

			if (!headingText) {
				headingText =
					heading.id === "banner-subtitle"
						? "Banner Subtitle"
						: heading.id || "Heading";
			}

			const escapedHeadingText = this.escapeHtmlAttr(headingText);

			tocHTML += `
        <a 
          href="#${heading.id}" 
			  class="toc-item toc-level-${depthLevel}"
          data-heading-id="${heading.id}"
		  aria-label="${escapedHeadingText}"
		  title="${escapedHeadingText}"
        >
			  <div class="toc-badge ${depth === this.minDepth ? "toc-badge-index" : ""}">
            ${badgeContent}
          </div>
			  <div class="toc-label ${depth <= this.minDepth + 1 ? "toc-label-primary" : "toc-label-secondary"}">${headingText}</div>
        </a>
      `;
		});

		tocHTML +=
			'<div data-card-toc-indicator style="opacity: 0;" class="toc-active-indicator"></div>';

		return tocHTML;
	}

	public updateTOCContent(): void {
		const tocContent = this.getTOCContentElement();
		if (!tocContent) {
			return;
		}

		tocContent.innerHTML = this.generateTOCHTML();
		this.tocItems = Array.from(tocContent.querySelectorAll("a"));
	}

	private getVisibleHeadingIds(): string[] {
		const headings = this.getAllHeadings();
		const visibleHeadingIds: string[] = [];

		headings.forEach((heading) => {
			if (heading.id) {
				const rect = heading.getBoundingClientRect();
				const isVisible =
					rect.top < window.innerHeight && rect.bottom > 0;

				if (isVisible) {
					visibleHeadingIds.push(heading.id);
				}
			}
		});

		if (visibleHeadingIds.length === 0 && headings.length > 0) {
			let closestHeading: string | null = null;
			let minDistance = Number.POSITIVE_INFINITY;

			headings.forEach((heading) => {
				if (heading.id) {
					const rect = heading.getBoundingClientRect();
					const distance = Math.abs(rect.top);

					if (distance < minDistance) {
						minDistance = distance;
						closestHeading = heading.id;
					}
				}
			});

			if (closestHeading) {
				visibleHeadingIds.push(closestHeading);
			}
		}

		return visibleHeadingIds;
	}

	public updateActiveState(): void {
		if (!this.tocItems || this.tocItems.length === 0) {
			return;
		}

		this.tocItems.forEach((item) => {
			item.classList.remove("visible");
		});

		const visibleHeadingIds = this.getVisibleHeadingIds();

		const activeItems = this.tocItems.filter((item) => {
			const headingId = item.dataset.headingId;
			return headingId && visibleHeadingIds.includes(headingId);
		});

		activeItems.forEach((item) => {
			item.classList.add("visible");
		});

		this.updateActiveIndicator(activeItems);
	}

	private updateActiveIndicator(activeItems: HTMLElement[]): void {
		const indicator = this.getIndicatorElement();
		if (!indicator || !this.tocItems.length) {
			return;
		}

		if (activeItems.length === 0) {
			indicator.style.opacity = "0";
			return;
		}

		const tocContent = this.getTOCContentElement();
		if (!tocContent) {
			return;
		}

		const contentRect = tocContent.getBoundingClientRect();
		const firstActive = activeItems[0];
		const lastActive = activeItems[activeItems.length - 1];

		const firstRect = firstActive.getBoundingClientRect();
		const lastRect = lastActive.getBoundingClientRect();

		const top = firstRect.top - contentRect.top;
		const height = lastRect.bottom - firstRect.top;

		indicator.style.top = `${top}px`;
		indicator.style.height = `${height}px`;
		indicator.style.opacity = "1";

		if (firstActive) {
			this.scrollToActiveItem(firstActive);
		}
	}

	private scrollToActiveItem(activeItem: HTMLElement): void {
		if (!activeItem) {
			return;
		}

		const tocContainer = activeItem.closest(".toc-scroll-container");
		if (!tocContainer) {
			return;
		}

		if (this.scrollTimeout) {
			clearTimeout(this.scrollTimeout);
		}

		this.scrollTimeout = window.setTimeout(() => {
			const containerRect = tocContainer.getBoundingClientRect();
			const itemRect = activeItem.getBoundingClientRect();

			const isVisible =
				itemRect.top >= containerRect.top &&
				itemRect.bottom <= containerRect.bottom;

			if (!isVisible) {
				const itemOffsetTop = (activeItem as HTMLElement).offsetTop;
				const containerHeight = tocContainer.clientHeight;
				const itemHeight = activeItem.clientHeight;

				const targetScroll =
					itemOffsetTop - containerHeight / 2 + itemHeight / 2;

				tocContainer.scrollTo({
					top: targetScroll,
					behavior: "smooth",
				});
			}
		}, 100);
	}

	public handleClick(event: Event): void {
		event.preventDefault();
		const target = event.currentTarget as HTMLAnchorElement;
		const id = decodeURIComponent(
			target.getAttribute("href")?.substring(1) || "",
		);
		const targetElement = document.getElementById(id);

		if (targetElement) {
			const targetTop =
				targetElement.getBoundingClientRect().top +
				window.pageYOffset -
				this.scrollOffset;

			window.scrollTo({
				top: targetTop,
				behavior: "smooth",
			});
		}
	}

	public setupObserver(): void {
		const headings = this.getAllHeadings();

		if (this.observer) {
			this.observer.disconnect();
		}

		this.observer = new IntersectionObserver(
			() => {
				this.updateActiveState();
			},
			{
				rootMargin: "0px 0px 0px 0px",
				threshold: 0,
			},
		);

		headings.forEach((heading) => {
			if (heading.id) {
				this.observer?.observe(heading);
			}
		});
	}

	public bindClickEvents(): void {
		this.tocItems.forEach((item) => {
			item.addEventListener("click", this.handleClick.bind(this));
		});
	}

	public cleanup(): void {
		if (this.observer) {
			this.observer.disconnect();
			this.observer = null;
		}
		if (this.scrollTimeout) {
			clearTimeout(this.scrollTimeout);
			this.scrollTimeout = null;
		}
	}

	public init(): void {
		this.updateTOCContent();
		this.bindClickEvents();
		this.setupObserver();
		this.updateActiveState();
	}
}

export function isPostPage(): boolean {
	return window.location.pathname.includes("/posts/");
}
