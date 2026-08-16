// Personal project data
export interface Project {
	id: string;
	title: string;
	description: string;
	image: string;
	category: "web" | "mobile" | "desktop" | "other";
	techStack: string[];
	status: "completed" | "in-progress" | "planned";
	liveDemo?: string;
	sourceCode?: string;
	visitUrl?: string;
	startDate: string;
	endDate?: string;
	featured?: boolean;
	tags?: string[];
	showImage?: boolean;
}

export const projectsData: Project[] = [
	{
		id: "python-dsa-lab",
		title: "Python & DSA Lab",
		description:
			"A collection of implementations and small experiments covering Python fundamentals, data structures, algorithms, and complexity analysis.",
		image: "",
		category: "desktop",
		techStack: ["Python", "DSA"],
		status: "in-progress",
		startDate: "2026-08-01",
		featured: true,
		tags: ["Python", "Algorithms", "Computer Science"],
		showImage: false,
	},
	{
		id: "binary-search",
		title: "Algorithm Visualizer Experiments",
		description:
			"Hands-on implementations of searching, sorting, trees, recursion, and traversal algorithms while building a strong CS foundation.",
		image: "",
		category: "desktop",
		techStack: ["Python", "Algorithms"],
		status: "in-progress",
		startDate: "2026-08-01",
		tags: ["DSA", "Algorithms", "Learning"],
		showImage: false,
	},
	{
		id: "ai-roadmap",
		title: "AI Learning Roadmap",
		description:
			"A long-term learning track from computer science fundamentals toward machine learning, AI engineering, and research.",
		image: "",
		category: "other",
		techStack: ["Python", "Mathematics", "Machine Learning"],
		status: "planned",
		startDate: "2026-08-16",
		featured: true,
		tags: ["AI", "Machine Learning", "Research"],
		showImage: false,
	},
];

export const getProjectStats = () => {
	const total = projectsData.length;
	const completed = projectsData.filter((p) => p.status === "completed").length;
	const inProgress = projectsData.filter((p) => p.status === "in-progress").length;
	const planned = projectsData.filter((p) => p.status === "planned").length;

	return { total, byStatus: { completed, inProgress, planned } };
};

export const getProjectsByCategory = (category?: string) => {
	if (!category || category === "all") return projectsData;
	return projectsData.filter((project) => project.category === category);
};

export const getFeaturedProjects = () => projectsData.filter((project) => project.featured);

export const getAllTechStack = () => {
	const techSet = new Set<string>();
	projectsData.forEach((project) => project.techStack.forEach((tech) => techSet.add(tech)));
	return Array.from(techSet).sort();
};
