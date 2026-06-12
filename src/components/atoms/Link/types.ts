export interface LinkProps {
	href: string;
	target?: "_blank" | "_self" | "_parent" | "_top";
	rel?: string;
	variant?: "default" | "muted" | "primary";
	underline?: boolean;
	class?: string;
}
