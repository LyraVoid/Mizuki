// 0xjoyo project data
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
		description: "Ongoing hands-on learning repository covering Python fundamentals, core data structures, algorithms, recursion, trees, and complexity analysis.",
		image: "",
		category: "desktop",
		techStack: ["Python", "DSA"],
		status: "in-progress",
		startDate: "2026-08-01",
		featured: true,
		tags: ["Python", "Computer Science", "Algorithms"],
		showImage: false,
	},
	{
		id: "algorithm-experiments",
		title: "Algorithm Experiments",
		description: "Implementations and experiments with binary search, bubble sort, stacks, queues, hash tables, binary trees, BSTs, DFS, BFS, and recursion.",
		image: "",
		category: "desktop",
		techStack: ["Python", "Algorithms"],
		status: "in-progress",
		startDate: "2026-08-01",
		featured: true,
		tags: ["DSA", "Big-O", "Trees", "Searching", "Sorting"],
		showImage: false,
	},
	{
		id: "python-basics-projects",
		title: "Python Basics Projects",
		description: "Small beginner projects used to turn Python syntax into working programs, including a calculator and a star-pattern program.",
		image: "",
		category: "desktop",
		techStack: ["Python"],
		status: "completed",
		startDate: "2026-08-01",
		endDate: "2026-08-16",
		tags: ["Python", "Beginner Projects"],
		showImage: false,
	},
	{
		id: "0xjoyo-lab",
		title: "0xjoyo Personal Lab",
		description: "This personal site: a public record of the transition from CS fundamentals to AI, with notes, projects, skills, devices, and long-term goals.",
		image: "",
		category: "web",
		techStack: ["Astro", "TypeScript", "Tailwind CSS", "Markdown"],
		status: "in-progress",
		startDate: "2026-08-16",
		featured: true,
		tags: ["Portfolio", "Blog", "Learning Log"],
		showImage: false,
	},
	{
		id: "ai-roadmap",
		title: "CS → AI Roadmap",
		description: "Long-term learning track from programming and core CS through mathematics, data work, machine learning, AI engineering, and eventually research.",
		image: "",
		category: "other",
		techStack: ["Python", "Mathematics", "Machine Learning", "AI"],
		status: "planned",
		startDate: "2026-08-16",
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
