// 友情链接数据配置
// 用于管理友情链接页面的数据

export interface FriendItem {
	id: number;
	title: string;
	imgurl: string;
	desc: string;
	siteurl: string;
	tags: string[];
}

// 友情链接数据
export const friendsData: FriendItem[] = [
	{
		id: 1,
		title: "Astro",
		imgurl: "https://avatars.githubusercontent.com/u/44914786?v=4&s=640",
		desc: "The web framework for content-driven websites",
		siteurl: "https://github.com/withastro/astro",
		tags: ["Framework"],
	},
	{
		id: 2,
		title: "Mizuki Docs",
		imgurl: "http://q.qlogo.cn/headimg_dl?dst_uin=3231515355&spec=640&img_type=jpg",
		desc: "Mizuki User Manual",
		siteurl: "https://docs.mizuki.mysqil.com",
		tags: ["Docs"],
	},
	{
		id: 3,
		title: "Vercel",
		imgurl: "https://avatars.githubusercontent.com/u/14985020?v=4&s=640",
		desc: "Develop. Preview. Ship.",
		siteurl: "https://vercel.com",
		tags: ["Hosting", "Cloud"],
	},
	{
		id: 4,
		title: "Tailwind CSS",
		imgurl: "https://avatars.githubusercontent.com/u/67109815?v=4&s=640",
		desc: "A utility-first CSS framework for rapidly building custom designs",
		siteurl: "https://tailwindcss.com",
		tags: ["CSS", "Framework"],
	},
	{
		id: 5,
		title: "TypeScript",
		imgurl: "https://avatars.githubusercontent.com/u/6154722?v=4&s=640",
		desc: "TypeScript is JavaScript with syntax for types",
		siteurl: "https://www.typescriptlang.org",
		tags: ["Language", "JavaScript"],
	},
	{
		id: 6,
		title: "React",
		imgurl: "https://avatars.githubusercontent.com/u/6412038?v=4&s=640",
		desc: "A JavaScript library for building user interfaces",
		siteurl: "https://reactjs.org",
		tags: ["Framework", "JavaScript"],
	},
	{
		id: 7,
		title: "GitHub",
		imgurl: "https://avatars.githubusercontent.com/u/9919?v=4&s=640",
		desc: "Where the world builds software",
		siteurl: "https://github.com",
		tags: ["Development", "Platform"],
	},
	{
		id: 8,
		title: "MDN Web Docs",
		imgurl: "https://avatars.githubusercontent.com/u/7565578?v=4&s=640",
		desc: "The web's most comprehensive resource for web developers",
		siteurl: "https://developer.mozilla.org",
		tags: ["Docs", "Reference"],
	},
];

// 获取所有友情链接数据
export function getFriendsList(): FriendItem[] {
	return friendsData;
}

// 获取随机排序的友情链接数据
export function getShuffledFriendsList(): FriendItem[] {
	const shuffled = [...friendsData];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}
