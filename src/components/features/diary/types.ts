import type { DiaryItem } from "../../../data/diary";

export interface MomentCardProps {
	moment: DiaryItem;
	index: number;
	minutesAgo: string;
	hoursAgo: string;
	daysAgo: string;
}
