import type { Project } from "../projects/types";

export interface ProjectsCategoryProps {
	category: string;
	projects: Project[];
	categoryText: string;
	class?: string;
}
