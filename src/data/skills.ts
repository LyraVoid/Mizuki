// Current 0xjoyo skill data
export interface Skill {
	id: string;
	name: string;
	description: string;
	icon: string;
	category: "frontend" | "backend" | "database" | "tools" | "other";
	level: "beginner" | "intermediate" | "advanced" | "expert";
	experience: { years: number; months: number };
	projects?: string[];
	certifications?: string[];
	color?: string;
}

export const skillsData: Skill[] = [
	{ id: "python", name: "Python", description: "Main language for current learning and projects: variables, data types, control flow, loops, functions, modules, slicing, comprehensions, enumerate/zip, and basic OOP.", icon: "logos:python", category: "backend", level: "beginner", experience: { years: 0, months: 1 }, projects: ["python-dsa-lab"] },
	{ id: "dsa", name: "Data Structures & Algorithms", description: "Hands-on work with Python lists as arrays, stacks, queues, hash tables, binary search, bubble sort, recursion, binary trees, BSTs, DFS, BFS, and Big-O basics.", icon: "material-symbols:account-tree", category: "other", level: "beginner", experience: { years: 0, months: 1 }, projects: ["python-dsa-lab", "algorithm-experiments"] },
	{ id: "oop", name: "Object-Oriented Programming", description: "Python classes, __init__, self, attributes, methods, and basic object-oriented design.", icon: "material-symbols:category", category: "backend", level: "beginner", experience: { years: 0, months: 1 } },
	{ id: "python-stdlib", name: "Python Standard Library", description: "Practical use of import/from import and common built-in data structures and utilities.", icon: "logos:python", category: "tools", level: "beginner", experience: { years: 0, months: 1 } },
	{ id: "git-github", name: "Git & GitHub", description: "Repositories, branches, commits, and maintaining a public technical portfolio.", icon: "fa7-brands:github", category: "tools", level: "beginner", experience: { years: 0, months: 1 } },
	{ id: "linux", name: "Linux", description: "Practical experience with Linux distributions, terminals, Bash, virtualization, and system experimentation.", icon: "logos:linux-tux", category: "tools", level: "intermediate", experience: { years: 0, months: 8 } },
	{ id: "bash", name: "Bash", description: "Terminal navigation, file operations, shell commands, and basic scripting concepts.", icon: "logos:bash-icon", category: "tools", level: "beginner", experience: { years: 0, months: 8 } },
	{ id: "networking", name: "Networking Fundamentals", description: "TCP/UDP, packets, IPv4/IPv6, DNS, MAC/IP concepts, ports, and common networking terminology.", icon: "material-symbols:lan", category: "other", level: "beginner", experience: { years: 0, months: 6 } },
	{ id: "web", name: "Web Fundamentals", description: "Basic understanding of websites, HTML, JavaScript concepts, browsers, and client/server fundamentals.", icon: "material-symbols:language", category: "frontend", level: "beginner", experience: { years: 0, months: 6 } },
	{ id: "c", name: "C", description: "Early-stage C programming used to strengthen low-level programming concepts.", icon: "logos:c", category: "backend", level: "beginner", experience: { years: 0, months: 1 } },
	{ id: "numpy", name: "NumPy", description: "Beginning familiarity with NumPy as a numerical computing library; deeper review is part of the AI preparation phase.", icon: "logos:numpy", category: "tools", level: "beginner", experience: { years: 0, months: 1 } },
	{ id: "pandas", name: "Pandas", description: "Beginning familiarity with Pandas for data analysis; currently a skill being strengthened for the AI path.", icon: "logos:pandas", category: "tools", level: "beginner", experience: { years: 0, months: 1 } },
	{ id: "japanese", name: "Japanese", description: "Early study focused on Hiragana, reading, writing, review, and self-testing.", icon: "material-symbols:translate", category: "other", level: "beginner", experience: { years: 0, months: 1 } },
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
