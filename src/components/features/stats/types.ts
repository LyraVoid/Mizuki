export interface StatTrend {
	value: number;
	isPositive: boolean;
	label?: string;
}

export interface StatLink {
	url: string;
	text: string;
}

export interface StatCardProps {
	title: string;
	value: string | number;
	subtitle?: string;
	icon?: string;
	color?: string;
	gradient?: {
		from: string;
		to: string;
	};
	size?: "small" | "medium" | "large";
	trend?: StatTrend;
	link?: StatLink;
}
