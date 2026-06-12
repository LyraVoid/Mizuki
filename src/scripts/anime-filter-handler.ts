export function initFilterHandler() {
	if (typeof window.animeFilterEventListeners === "undefined") {
		window.animeFilterEventListeners = [];
	}

	function initFilterButtons() {
		const filterTags = document.querySelectorAll(".anime-filter-tag");
		const sentinel = document.getElementById("infinite-scroll-sentinel");
		const listContainer = document.getElementById("anime-list-container");
		const lazyStore = document.getElementById(
			"anime-lazy-store",
		) as HTMLTemplateElement | null;

		window.animeFilterEventListeners.forEach((listener) => {
			const [element, type, handler] = listener;
			element.removeEventListener(type, handler);
		});
		window.animeFilterEventListeners = [];

		filterTags.forEach((tag) => {
			const clickHandler = function (this: HTMLElement) {
				if (this.classList.contains("anime-active")) {
					return;
				}

				filterTags.forEach((t) => t.classList.remove("anime-active"));
				this.classList.add("anime-active");

				if (
					lazyStore &&
					lazyStore.content.children.length > 0 &&
					listContainer
				) {
					const fragment = document.createDocumentFragment();
					while (lazyStore.content.firstChild) {
						const node = lazyStore.content.firstChild;
						fragment.appendChild(node);
					}
					listContainer.appendChild(fragment);
				}

				if (sentinel) {
					sentinel.style.display = "none";
				}
				const initialHidden =
					listContainer!.querySelectorAll(".initial-hidden");
				initialHidden.forEach((el) => {
					el.classList.remove("hidden", "initial-hidden");
				});

				const status = this.getAttribute("data-status");
				const animeItems = Array.from(listContainer!.children).filter(
					(item) => item.hasAttribute("data-anime-status"),
				);
				const itemsToHide: HTMLElement[] = [];
				const itemsToShow: HTMLElement[] = [];
				const itemsToKeep: HTMLElement[] = [];

				animeItems.forEach((item) => {
					const itemStatus = item.getAttribute("data-anime-status");
					const shouldShow =
						status === "all" || itemStatus === status;
					const isCurrentlyVisible =
						!item.classList.contains("anime-hidden");

					if (shouldShow) {
						if (isCurrentlyVisible) {
							itemsToKeep.push(item as HTMLElement);
						} else {
							itemsToShow.push(item as HTMLElement);
						}
					} else {
						if (isCurrentlyVisible) {
							itemsToHide.push(item as HTMLElement);
						}
					}
				});

				const firstPositions = new Map<
					HTMLElement,
					{ left: number; top: number }
				>();
				itemsToKeep.forEach((item) => {
					const rect = item.getBoundingClientRect();
					firstPositions.set(item, {
						left: rect.left,
						top: rect.top,
					});
				});

				const runAnimation = () => {
					itemsToHide.forEach((item) => {
						item.classList.add("anime-hidden");
						item.classList.remove("anime-fade-out");
					});
					itemsToShow.forEach((item) => {
						item.classList.remove("anime-hidden");
						item.classList.add("anime-fade-in");
						item.style.transition = "none";
					});
					itemsToKeep.forEach((item) => {
						const first = firstPositions.get(item);
						if (!first) {
							return;
						}

						const rect = item.getBoundingClientRect();
						const deltaX = Math.round(first.left - rect.left);
						const deltaY = Math.round(first.top - rect.top);

						if (deltaX !== 0 || deltaY !== 0) {
							item.style.willChange = "transform";
							item.style.transition = "none";
							item.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
						}
					});

					requestAnimationFrame(() => {
						itemsToKeep.forEach((item) => {
							item.style.transition =
								"transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
							item.style.transform = "";
						});

						const STAGGER_LIMIT = 20;
						itemsToShow.forEach((item, index) => {
							item.style.transition = "";
							item.style.willChange = "opacity, transform";

							const delay =
								index < STAGGER_LIMIT ? index * 30 : 0;
							item.style.transitionDelay = `${delay}ms`;

							requestAnimationFrame(() => {
								item.classList.remove("anime-fade-in");
								item.classList.add("anime-fade-in-active");
							});
						});

						setTimeout(
							() => {
								[...itemsToKeep, ...itemsToShow].forEach(
									(item) => {
										item.classList.remove(
											"anime-fade-in-active",
										);
										item.style.transition = "";
										item.style.transform = "";
										item.style.opacity = "";
										item.style.willChange = "";
										item.style.transitionDelay = "";
									},
								);
							},
							600 +
								(itemsToShow.length > 0
									? Math.min(itemsToShow.length, 20) * 30
									: 0),
						);
					});
				};

				if (itemsToHide.length > 0) {
					itemsToHide.forEach((item) =>
						item.classList.add("anime-fade-out"),
					);
					setTimeout(runAnimation, 200);
				} else {
					runAnimation();
				}
			};

			tag.addEventListener("click", clickHandler);
			window.animeFilterEventListeners.push([tag, "click", clickHandler]);
		});

		if (sentinel && lazyStore && listContainer) {
			const observer = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting) {
						const BATCH_SIZE = 24;
						if (lazyStore.content.children.length === 0) {
							sentinel.style.display = "none";
							observer.disconnect();
							return;
						}

						const fragment = document.createDocumentFragment();
						let movedCount = 0;
						while (
							lazyStore.content.firstChild &&
							movedCount < BATCH_SIZE
						) {
							const node = lazyStore.content
								.firstChild as HTMLElement;
							if (node.nodeType === 1) {
								node.classList.add("anime-fade-in-active");
							}
							fragment.appendChild(node);
							movedCount++;
						}

						requestAnimationFrame(() => {
							listContainer.appendChild(fragment);
							if (lazyStore.content.children.length === 0) {
								sentinel.style.display = "none";
								observer.disconnect();
							}
						});
					}
				},
				{ rootMargin: "200px" },
			);
			observer.observe(sentinel);
		} else if (sentinel) {
			sentinel.style.display = "none";
		}
	}

	document.addEventListener("DOMContentLoaded", initFilterButtons);

	function setupSwupListeners() {
		if (window.swup) {
			window.swup.hooks.on("content:replace", () =>
				setTimeout(initFilterButtons, 150),
			);
			window.swup.hooks.on("page:view", () =>
				setTimeout(initFilterButtons, 150),
			);
		}
	}

	if (typeof window !== "undefined") {
		if (window.swup) {
			setupSwupListeners();
		} else {
			document.addEventListener("swup:enable", setupSwupListeners);
		}
	}
}

declare global {
	interface Window {
		animeFilterEventListeners: [Element, string, () => void][];
	}
}
