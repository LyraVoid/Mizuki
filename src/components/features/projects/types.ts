export interface Project {
	id: string;
	title: string;
	description: string;
	image?: string;
	category: string;
	techStack: string[];
	status: "completed" | "in-progress" | "planned";
	demoUrl?: string;
	sourceUrl?: string;
	liveDemo?: string;
	sourceCode?: string;
	visitUrl?: string;
	startDate: string;
	endDate?: string;
	featured?: boolean;
	tags?: string[];
	showImage?: boolean;
}

export interface ProjectCardProps {
	project: Project;
	size?: "small" | "medium" | "large";
	showImage?: boolean;
	maxTechStack?: number;
}
