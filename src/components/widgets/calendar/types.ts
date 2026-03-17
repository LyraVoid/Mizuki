export interface CalendarPost {
	id: string;
	title: string;
	date: string;
}

export interface CalendarStats {
	hasPostInYear: Record<number, boolean>;
	hasPostInMonth: Record<string, boolean>;
	minYear: number;
	maxYear: number;
}

export interface CalendarState {
	currentYear: number;
	currentMonth: number;
	selectedDateKey: string | null;
	currentView: "day" | "month" | "year";
}

export type MonthNames = string[];
export type WeekDays = string[];
