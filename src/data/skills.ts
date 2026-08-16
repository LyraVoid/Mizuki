// Personal skill data configuration

export interface Skill {
	id: string;
	name: string;
	description: string;
	icon: string;
	category: "frontend" | "backend" | "database" | "tools" | "other";
	level: "beginner" | "intermediate" | "advanced" | "expert";
	experience: {
		years: number;
		months: number;
	};
	projects?: string[];
	certifications?: string[];
	color?: string;
}

export const skillsData: Skill[] = [
	{
		id: "python",
		name: "Python",
		description:
			"Current primary language. Comfortable with core syntax, data structures, functions, modules, OOP basics, and small projects.",
		icon: "logos:python",
		category: "backend",
		level: "beginner",
		experience: { years: 0, months: 1 },
		projects: ["python-calculator", "python-star-triangle"],
	},
	{
		id: "dsa",
		name: "Data Structures & Algorithms",
		description:
			"Actively studying arrays/lists, stacks, queues, hash tables, binary search, sorting, trees, BSTs, DFS, BFS, recursion, and Big-O analysis.",
		icon: "material-symbols:account-tree",
		category: "other",
		level: "beginner",
		experience: { years: 0, months: 1 },
	},
	{
		id: "oop",
		name: "Object-Oriented Programming",
		description:
			"Python OOP fundamentals including classes, constructors, self, attributes, methods, and basic object design.",
		icon: "material-symbols:category",
		category: "backend",
		level: "beginner",
		experience: { years: 0, months: 1 },
	},
	{
		id: "git",
		name: "Git & GitHub",
		description:
			"Using GitHub repositories, branches, commits, and project-based version control while building a technical portfolio.",
		icon: "fa7-brands:github",
		category: "tools",
		level: "beginner",
		experience: { years: 0, months: 1 },
	},
	{
		id: "linux",
		name: "Linux",
		description:
			"Practical Linux experience with terminals, Bash, distributions, virtualization, and system experimentation.",
		icon: "logos:linux-tux",
		category: "tools",
		level: "intermediate",
		experience: { years: 0, months: 8 },
	},
	{
		id: "bash",
		name: "Bash",
		description: "Command-line fundamentals, shell usage, file operations, and basic scripting.",
		icon: "logos:bash-icon",
		category: "tools",
		level: "beginner",
		experience: { years: 0, months: 8 },
	},
	{
		id: "networking",
		name: "Networking Fundamentals",
		description:
			"Fundamentals of TCP/UDP, packets, IPv4/IPv6, DNS, MAC/IP concepts, ports, and common network terminology.",
		icon: "material-symbols:lan",
		category: "other",
		level: "beginner",
		experience: { years: 0, months: 6 },
	},
	{
		id: "web-basics",
		name: "Web Fundamentals",
		description:
			"Basic understanding of how websites work, including HTML, JavaScript concepts, browsers, and client/server fundamentals.",
		icon: "material-symbols:language",
		category: "frontend",
		level: "beginner",
		experience: { years: 0, months: 6 },
	},
	{
		id: "c",
		name: "C",
		description:
			"Early-stage C programming experience focused on fundamentals and understanding lower-level programming concepts.",
		icon: "logos:c",
		category: "backend",
		level: "beginner",
		experience: { years: 0, months: 1 },
	},
	{
		id: "numpy",
		name: "NumPy",
		description:
			"Familiar with NumPy as a core Python library for numerical computing and planned for deeper review as part of the AI path.",
		icon: "logos:numpy",
		category: "tools",
		level: "beginner",
		experience: { years: 0, months: 1 },
	},
	{
		id: "pandas",
		name: "Pandas",
		description:
			"Familiar with Pandas as a data-analysis library and currently treating it as a skill to strengthen for AI/data work.",
		icon: "logos:pandas",
		category: "tools",
		level: "beginner",
		experience: { years: 0, months: 1 },
	},
	{
		id: "japanese",
		name: "Japanese",
		description:
			"Beginning Japanese study with a focus on Hiragana, reading, writing, review, and self-testing.",
		icon: "material-symbols:translate",
		category: "other",
		level: "beginner",
		experience: { years: 0, months: 1 },
	},
];

export const getSkillStats = () => ({
	total: skillsData.length,
	byLevel: {
		beginner: skillsData.filter((skill) => skill.level === "beginner").length,
		intermediate: skillsData.filter((skill) => skill.level === "intermediate").length,
		advanced: skillsData.filter((skill) => skill.level === "advanced").length,
		expert: skillsData.filter((skill) => skill.level === "expert").length,
	},
});

export const getSkillsByCategory = (category?: string) => {
	if (!category || category === "all") return skillsData;
	return skillsData.filter((skill) => skill.category === category);
};
