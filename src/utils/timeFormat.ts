/**
 * Format relative time for diary moments
 * @param dateString ISO date string
 * @param minutesAgo text for minutes
 * @param hoursAgo text for hours
 * @param daysAgo text for days
 */
export function formatRelativeTime(
	dateString: string,
	minutesAgo: string,
	hoursAgo: string,
	daysAgo: string,
): string {
	const date = new Date(dateString);
	const diffInMinutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));

	if (diffInMinutes < 60) {
		return `${diffInMinutes}${minutesAgo}`;
	}
	if (diffInMinutes < 1440) {
		const hours = Math.floor(diffInMinutes / 60);
		return `${hours}${hoursAgo}`;
	}
	const days = Math.floor(diffInMinutes / 1440);
	return `${days}${daysAgo}`;
}
