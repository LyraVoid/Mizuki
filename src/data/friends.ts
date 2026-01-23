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
		title: "Mizuki Docs",
		imgurl: "http://q.qlogo.cn/headimg_dl?dst_uin=3231515355&spec=640&img_type=jpg",
		desc: "Mizuki User Manual",
		siteurl: "https://docs.mizuki.mysqil.com",
		tags: ["文档"],
	},
	{
		id: 2,
		title: "QiuLingYanの小站",
		imgurl: "https://i.postimg.cc/R0Rb7Lgv/cgi-bin-mmwebwx-bin-webwxgetmsgimg-Msg-ID-7182137176871366394-skey-crypt-e10aef0c-d761f5527e6b8c6.jpg",
		desc: "QiuLingYan 的废纸篓喵～",
		siteurl: "https://qiulingyan.top/",
		tags: ["fvv 喵", "Blog"],
	},
	{
		id: 3,
		title: "Amachiromaker",
		imgurl: "https://nacho.zako.wf/favicon.png",
		desc: "这是一个被甘城猫猫下线的捏脸网站",
		siteurl: "https://nacho.zako.wf/",
		tags: ["喵喵喵～"],
	},
	{
		id: 4,
		title: "a1235789i",
		imgurl: "https://photo.zako.wf/i/2025/10/25/68fcde525ea57.jpg",
		desc: "牛仔,Minecraft Add-On汉化者",
		siteurl: "https://a1235789i.zako.wf/",
		tags: ["Add-On汉化", "Home", "Minecraft"],
	},
	{
		id: 5,
		title: "HeroicEl065925",
		imgurl: "https://heroicel065925.zako.wf/favicon.ico",
		desc: "HeroicEl065925,Minecraft&觉醒光碟",
		siteurl: "https://HeroicEl065925.zako.wf/",
		tags: ["觉醒光碟", "Home", "Minecraft"],
	},
	{
		id: 6,
		title: "Betsy Blog",
		imgurl: "https://img.micostar.cc/images/avatar.webp",
		desc: "爱我所爱，我们是彼此永远的动力",
		siteurl: "https://www.micostar.cc/",
		tags: ["Unity", "Blog"],
	},
	{
		id: 7,
		title: "LHL's Blog",
		imgurl: "https://cdn.sa.net/2025/04/18/KXpf8u5SQYNPkA3.jpg",
		desc: "想把海洋里所有鱼都握在手里，把森林里里所有花都插在心头.",
		siteurl: "https://blog.lhl.one/",
		tags: ["Blog"],
	},
	{
		id: 8,
		title: "lx小窝",
		imgurl: "https://blog.lxlovo.top/wp-content/uploads/2025/12/luoxiao.jpg",
		desc: "一个爱写文的菜鸟.",
		siteurl: "https://blog.lxlovo.top/",
		tags: ["写文", "Blog", "日常"],
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
