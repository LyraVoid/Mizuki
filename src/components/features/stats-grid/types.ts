import type { StatCardProps } from "../stats/types";

export interface StatsGridProps {
	stats: StatCardProps[];
	columns?: 2 | 3 | 4;
	class?: string;
}
