import type { PioConfig } from "../types/config";

// Pio 看板娘配置
export const pioConfig: PioConfig = {
	enable: true, // 启用看板娘
	models: [
		"/pio/models/HK416/normal.model3.json",
		// "/pio/models/G36/normal.model3.json",
	], // 默认模型路径
	position: "left", // 模型位置
	width: 240, // 默认宽度
	height: 600, // 默认高度
	mode: "draggable", // 默认为可拖拽模式
	hiddenOnMobile: true, // 默认在移动设备上隐藏
	hideAboutMenu: false, // 隐藏内置 About 菜单按钮
	dialog: {
		// welcome: "茶番劇場へようこそ", // 欢迎词
		// touch: [
		// 	"指挥官，你想摸摸这只猫吗？",
		// ], // 触摸提示
		// home: "指挥官，不要焦躁哦。", // 首页提示
		// skin: ["请给予下一步的指示，指挥官。", "看着吧。"], // 换装提示
		// close: "呜……", // 关闭提示
		link: "https://github.com/LyraVoid/Mizuki", // 关于链接
	},
};
