import type { ProfileConfig } from "../types/config";

// 个人资料配置
export const profileConfig: ProfileConfig = {
	avatar: "assets/images/gumi.webp", // 相对于 /src 目录。如果以 '/' 开头，则相对于 /public 目录
	name: "YKSetuna",
	bio: "der Gleichgueltige",
	typewriter: {
		enable: false, // 启用个人简介打字机效果
		speed: 80, // 打字速度（毫秒）
	},
	links: [
		{
			name: "Bilibili",
			icon: "fa7-brands:bilibili",
			url: "https://space.bilibili.com/21869977",
			external: true, // 外部链接，新标签页打开
		},
		{
			name: "Steam",
			icon: "fa7-brands:steam",
			url: "https://steamcommunity.com/profiles/76561198159046945/",
			external: true, // 外部链接，新标签页打开
		},
		// {
		// 	name: "Discord",
		// 	icon: "fa7-brands:discord",
		// 	url: "https://discord.gg/MqW6TcQtVM",
		// },
	],
};
