/**
 * useFloatingTOC - Custom hooks for FloatingTOC component
 */

/**
 * Calculate scroll progress (0 to 1)
 */
export function getScrollProgress(): number {
	const scrollTop = window.scrollY || document.documentElement.scrollTop;
	const docHeight =
		document.documentElement.scrollHeight -
		document.documentElement.clientHeight;
	return docHeight > 0 ? scrollTop / docHeight : 0;
}

/**
 * Update progress ring SVG stroke-dashoffset
 * @param circle - The SVG circle element
 * @param progress - Scroll progress (0 to 1)
 */
export function updateProgressRing(
	circle: SVGCircleElement,
	progress: number,
): void {
	const radius = circle.r.baseVal.value;
	const circumference = radius * 2 * Math.PI;
	const offset = Math.max(
		0,
		Math.min(circumference, circumference - progress * circumference),
	);
	circle.style.strokeDashoffset = offset.toString();
}

/**
 * Find the active heading based on scroll position
 * @param headings - Array of heading elements
 * @param offsetTop - Offset from top of viewport
 * @returns Index of active heading, or -1 if none
 */
export function findActiveHeading(
	headings: HTMLElement[],
	scrollY: number,
	offsetTop = 150,
): number {
	let activeIndex = -1;
	for (let i = 0; i < headings.length; i++) {
		const heading = headings[i];
		if (
			heading.getBoundingClientRect().top + scrollY <
			scrollY + offsetTop
		) {
			activeIndex = i;
		} else {
			break;
		}
	}
	return activeIndex;
}

/**
 * Get all headings from the post container
 * @param container - The container element
 * @param maxLevel - Maximum heading depth
 * @returns Object with headings array and minLevel
 */
export function getHeadings(
	container: Element,
	maxLevel: number,
): { headings: HTMLElement[]; minLevel: number } {
	const allHeadings = container.querySelectorAll(
		"h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]",
	);

	const headings: HTMLElement[] = [];
	let minLevel = 6;

	allHeadings.forEach((h) => {
		const level = parseInt(h.tagName[1]);
		if (level < minLevel) {
			minLevel = level;
		}
	});

	allHeadings.forEach((heading) => {
		const level = parseInt(heading.tagName[1]);
		if (level < minLevel + maxLevel) {
			headings.push(heading as HTMLElement);
		}
	});

	return { headings, minLevel };
}
