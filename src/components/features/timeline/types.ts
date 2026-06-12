export interface TimelineLink {
	name: string;
	url: string;
	type: "website" | "certificate" | "project" | "other";
}

export interface TimelineItem {
	id: string;
	title: string;
	description: string;
	type: "education" | "work" | "project" | "achievement";
	startDate: string;
	endDate?: string;
	location?: string;
	organization?: string;
	position?: string;
	skills?: string[];
	achievements?: string[];
	links?: TimelineLink[];
	icon?: string;
	color?: string;
	featured?: boolean;
}

export interface TimelineCardProps {
	item: TimelineItem;
	maxSkills?: number;
}
