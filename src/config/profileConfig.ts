import type { ProfileConfig } from "../types/config";

// Personal profile configuration
export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.webp",
	name: "Youssef Joyo",
	bio: "AI & Computer Science learner building from fundamentals to research.",
	typewriter: {
		enable: true,
		speed: 80,
	},
	links: [
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/0xjoyo",
		},
	],
};
