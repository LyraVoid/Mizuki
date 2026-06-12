export interface IconProps {
	icon: string;
	class?: string;
	style?: string;
	size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
	color?: string;
	fallback?: string;
	loading?: "lazy" | "eager";
}
