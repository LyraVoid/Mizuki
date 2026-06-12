import type { Project } from "../projects/types";

export interface FeaturedProjectsProps {
	projects: Project[];
	title?: string;
	class?: string;
}
