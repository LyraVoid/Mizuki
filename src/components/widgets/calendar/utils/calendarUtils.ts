export function getFirstDayOfMonth(year: number, month: number): number {
	return (new Date(year, month, 1).getDay() + 6) % 7;
}

export function getDaysInMonth(year: number, month: number): number {
	return new Date(year, month + 1, 0).getDate();
}

export function formatDateKey(
	year: number,
	month: number,
	day: number,
): string {
	return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function getMonthKey(year: number, month: number): string {
	return `${year}-${month}`;
}

export function isToday(
	year: number,
	month: number,
	day: number,
	todayYear: number,
	todayMonth: number,
	todayDate: number,
): boolean {
	return year === todayYear && month === todayMonth && day === todayDate;
}

export function parseDateFromPath(
	path: string,
): { year: number; month: number } | null {
	const match = path.match(/(\d{4})-(\d{2})-\d{2}/);
	if (match) {
		return {
			year: parseInt(match[1]),
			month: parseInt(match[2]) - 1,
		};
	}
	return null;
}
