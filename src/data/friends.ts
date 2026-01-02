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
		title: "123SummerTime",
		imgurl: "https://123summertime.top/images/static/avatar.jpg",
		desc: "夏神",
		siteurl: "https://123summertime.top",
		tags: ["vrchatFriend"],
	},
	{
		id: 2,
		title: "粟悟饭与龟波功",
		imgurl: "https://ooo.0x0.ooo/2025/03/30/O0OCxU.jpg",
		desc: "有着绝绝牛牛子的伪人",
		siteurl: "https://www.jjnnz.sbs/",
		tags: ["vrchatFriend"],
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
