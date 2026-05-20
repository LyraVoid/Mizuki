export interface LayoutHandlerOptions {
	containerId: string;
	hasRightSidebars: boolean;
}

export function initAnimeLayoutHandler(options: LayoutHandlerOptions) {
	const { containerId, hasRightSidebars } = options;

	function updateAnimeListLayout(layout: string, shouldAnimate = true) {
		const animeListContainer = document.getElementById(containerId);
		if (!animeListContainer) {
			return;
		}
		animeListContainer.dataset.currentLayout = layout;

		const animeItems = Array.from(
			document.querySelectorAll("[data-anime-status]"),
		) as HTMLElement[];
		const visibleItems = animeItems.filter(
			(item) => item.offsetParent !== null,
		);
		const firstPositions = new Map();
		if (shouldAnimate) {
			visibleItems.forEach((item) => {
				const rect = item.getBoundingClientRect();
				firstPositions.set(item, {
					left: rect.left,
					top: rect.top,
					width: rect.width,
					height: rect.height,
				});
			});
		}

		const style = document.createElement("style");
		style.innerHTML = `.anime-grid-container .group { transition: none !important; }`;
		document.head.appendChild(style);
		animeListContainer.classList.remove(
			"anime-list-mode",
			"anime-grid-mode",
		);
		animeListContainer.classList.remove(
			"grid-cols-1",
			"md:grid-cols-2",
			"lg:grid-cols-3",
		);
		if (layout === "grid") {
			animeListContainer.classList.add("anime-grid-mode");
			if (hasRightSidebars) {
				const rightSidebar = document.querySelector(
					".right-sidebar-container",
				) as HTMLElement | null;
				if (rightSidebar) {
					rightSidebar.style.display = "none";
					rightSidebar.classList.add("hidden-in-grid-mode");
				}
			}
			const mainGrid = document.getElementById(
				"main-grid",
			) as HTMLElement | null;
			if (mainGrid) {
				mainGrid.style.gridTemplateColumns = "17.5rem 1fr";
				mainGrid.classList.add("two-column-layout");
			}
		} else {
			animeListContainer.classList.add("anime-list-mode");
			animeListContainer.classList.add("grid-cols-1", "lg:grid-cols-2");
			if (hasRightSidebars) {
				const rightSidebar = document.querySelector(
					".right-sidebar-container",
				) as HTMLElement | null;
				if (rightSidebar) {
					rightSidebar.style.display = "";
					rightSidebar.classList.remove("hidden-in-grid-mode");
				}
			}
			const mainGrid = document.getElementById(
				"main-grid",
			) as HTMLElement | null;
			if (mainGrid) {
				mainGrid.style.gridTemplateColumns = "";
				mainGrid.classList.remove("two-column-layout");
			}
		}

		void animeListContainer.offsetHeight;
		if (!shouldAnimate) {
			if (style.parentNode) {
				style.parentNode.removeChild(style);
			}
			return;
		}

		requestAnimationFrame(() => {
			if (style.parentNode) {
				style.parentNode.removeChild(style);
			}

			visibleItems.forEach((item) => {
				const first = firstPositions.get(item);
				if (!first) {
					return;
				}
				const last = item.getBoundingClientRect();

				const deltaX = Math.round(first.left - last.left);
				const deltaY = Math.round(first.top - last.top);
				const deltaW = first.width / last.width;
				const deltaH = first.height / last.height;

				if (
					Math.abs(deltaX) < 1 &&
					Math.abs(deltaY) < 1 &&
					Math.abs(deltaW - 1) < 0.01 &&
					Math.abs(deltaH - 1) < 0.01
				) {
					return;
				}

				item.style.willChange = "transform";
				item.style.transition = "none";
				item.style.transformOrigin = "top left";
				item.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`;
			});

			void animeListContainer.offsetHeight;
			requestAnimationFrame(() => {
				visibleItems.forEach((item) => {
					item.style.transition =
						"transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)";
					item.style.transform = "";
				});
				setTimeout(() => {
					visibleItems.forEach((item) => {
						item.style.transition = "";
						item.style.transformOrigin = "";
						item.style.transform = "";
						item.style.willChange = "";
					});
				}, 500);
			});
		});
	}

	function initAnimeLayout() {
		const animeListContainer = document.getElementById(containerId);
		if (!animeListContainer) {
			return false;
		}
		const currentLayout = localStorage.getItem("postListLayout") || "list";
		updateAnimeListLayout(currentLayout, false);
		requestAnimationFrame(() => {
			animeListContainer.classList.remove("opacity-0");
		});
		return true;
	}

	let retryCount = 0;
	const maxRetries = 10;

	function tryInit() {
		if (initAnimeLayout()) {
			return;
		}
		if (retryCount < maxRetries) {
			retryCount++;
			const delay = Math.min(100 * Math.pow(1.5, retryCount), 1000);
			setTimeout(tryInit, delay);
		} else {
			setTimeout(() => {
				const animeListContainer = document.getElementById(containerId);
				if (animeListContainer) {
					const currentLayout =
						localStorage.getItem("postListLayout") || "list";
					updateAnimeListLayout(currentLayout, false);
					animeListContainer.classList.remove("opacity-0");
				}
			}, 2000);
		}
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", tryInit);
	} else {
		tryInit();
	}

	window.addEventListener("layoutChange", ((
		event: CustomEvent<{ layout: string }>,
	) => {
		updateAnimeListLayout(event.detail.layout);
	}) as EventListener);
}

export function initLayoutListener(
	containerId: string,
	hasRightSidebars: boolean,
) {
	initAnimeLayoutHandler({ containerId, hasRightSidebars });
}
