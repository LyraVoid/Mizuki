import type {
	DARK_MODE,
	LIGHT_MODE,
	WALLPAPER_BANNER,
	WALLPAPER_FULLSCREEN,
	WALLPAPER_NONE,
} from "../constants/constants";

export type SiteConfig = {
	title: string;
	subtitle: string;
	siteURL: string; // 站点URL，以斜杠结尾，例如：https://mizuki.mysqil.com/
	keywords?: string[]; // 站点关键词，用于生成 <meta name="keywords">
	siteStartDate?: string; // 站点开始日期，格式：YYYY-MM-DD，用于计算运行天数

	timeZone:
		| -12
		| -11
		| -10
		| -9
		| -8
		| -7
		| -6
		| -5
		| -4
		| -3
		| -2
		| -1
		| 0
		| 1
		| 2
		| 3
		| 4
		| 5
		| 6
		| 7
		| 8
		| 9
		| 10
		| 11
		| 12;

	lang:
		| "en"
		| "zh_CN"
		| "zh_TW"
		| "ja"
		| "ko"
		| "es"
		| "th"
		| "vi"
		| "tr"
		| "id";

	themeColor: {
		hue: number;
		fixed: boolean;
	};

	// 特色页面开关配置
	featurePages: {
		anime: boolean; // 番剧页面开关
		diary: boolean; // 日记页面开关
		friends: boolean; // 友链页面开关
		projects: boolean; // 项目页面开关
		skills: boolean; // 技能页面开关
		timeline: boolean; // 时间线页面开关
		albums: boolean; // 相册页面开关
		devices: boolean; // 设备页面开关
	};

	// 文章列表布局配置
	postListLayout: {
		defaultMode: "list" | "grid"; // 默认布局模式：list=列表模式，grid=网格模式
		allowSwitch: boolean; // 是否允许用户切换布局
	};

	// 顶栏标题配置
	navbarTitle?: {
		mode?: "text-icon" | "logo"; // 显示模式："text-icon" 显示图标+文本，"logo" 仅显示Logo
		text: string; // 顶栏标题文本
		icon?: string; // 顶栏标题图标路径
		logo?: string; // 网站Logo图片路径
	};

	// 页面自动缩放配置
	pageScaling?: {
		enable: boolean; // 是否开启自动缩放
		targetWidth?: number; // 目标宽度，低于此宽度时开始缩放
	};

	// 添加字体配置
	font: {
		asciiFont: {
			fontFamily: string;
			fontWeight: string | number;
			localFonts: string[];
			enableCompress: boolean;
		};
		cjkFont: {
			fontFamily: string;
			fontWeight: string | number;
			localFonts: string[];
			enableCompress: boolean;
		};
	};

	// 添加bangumi配置
	bangumi?: {
		userId?: string; // Bangumi用户ID
		fetchOnDev?: boolean;
	};

	// 添加bilibili配置
	bilibili?: {
		vmid?: string; // Bilibili用户ID (vmid)
		fetchOnDev?: boolean; // 是否在开发环境下获取 Bilibili 数据
		SESSDATA?: string; // Bilibili SESSDATA（可选，用于获取进度信息）
		coverMirror?: string; // 封面图片镜像源（可选，默认为空字符串）
		useWebp?: boolean; // 是否使用WebP格式（默认 true）
	};

	// 添加番剧页面配置
	anime?: {
		mode?: "bangumi" | "local" | "bilibili"; // 番剧页面模式
	};

	// 标签样式配置
	tagStyle?: {
		useNewStyle?: boolean; // 是否使用新样式（悬停高亮样式）还是旧样式（外框常亮样式）
	};

	// 壁纸模式配置
	wallpaperMode: {
		defaultMode: "banner" | "fullscreen" | "none"; // 默认壁纸模式：banner=顶部横幅，fullscreen=全屏壁纸，none=无壁纸
		showModeSwitchOnMobile?: "off" | "mobile" | "desktop" | "both"; // 整体布局方案切换按钮显示设置：off=隐藏，mobile=仅移动端，desktop=仅桌面端，both=全部显示
	};

	banner: {
		src:
			| string
			| string[]
			| {
					desktop?: string | string[];
					mobile?: string | string[];
			  }; // 支持单个图片、图片数组或分别设置桌面端和移动端图片
		position?: "top" | "center" | "bottom";
		carousel?: {
			enable: boolean; // 是否启用轮播
			interval: number; // 轮播间隔时间（秒）
		};
		waves?: {
			enable: boolean; // 是否启用水波纹效果
			performanceMode?: boolean; // 性能模式：减少动画复杂度
			mobileDisable?: boolean; // 移动端禁用
		};
		imageApi?: {
			enable: boolean; // 是否启用图片API
			url: string; // API地址，返回每行一个图片链接的文本
		};
		homeText?: {
			enable: boolean; // 是否在首页显示自定义文字
			title?: string; // 主标题
			subtitle?: string | string[]; // 副标题，支持单个字符串或字符串数组
			typewriter?: {
				enable: boolean; // 是否启用打字机效果
				speed: number; // 打字速度（毫秒）
				deleteSpeed: number; // 删除速度（毫秒）
				pauseTime: number; // 完整显示后的暂停时间（毫秒）
			};
		};
		credit: {
			enable: boolean;
			text: string;
			url?: string;
		};
		navbar?: {
			transparentMode?: "semi" | "full" | "semifull"; // 导航栏透明模式
		};
	};
	toc: {
		enable: boolean;
		mode: "float" | "sidebar"; // 目录显示模式："float" 悬浮按钮模式，"sidebar" 侧边栏模式
		depth: 1 | 2 | 3;
		useJapaneseBadge?: boolean; // 使用日语假名标记（あいうえお...）代替数字
	};
	showCoverInContent: boolean; // 控制文章封面在文章内容页显示的开关
	generateOgImages: boolean;
	favicon: Favicon[];
	showLastModified: boolean; // 控制“上次编辑”卡片显示的开关
};

export type Favicon = {
	src: string;
	theme?: "light" | "dark";
	sizes?: string;
};

export enum LinkPreset {
	Home = 0,
	Archive = 1,
	About = 2,
	Friends = 3,
	Anime = 4,
	Diary = 5,
	Albums = 6,
	Projects = 7,
	Skills = 8,
	Timeline = 9,
}

export type NavBarLink = {
	name: string;
	url: string;
	external?: boolean;
	icon?: string; // 菜单项图标
	children?: (NavBarLink | LinkPreset)[]; // 支持子菜单，可以是NavBarLink或LinkPreset
};

export type NavBarConfig = {
	links: (NavBarLink | LinkPreset)[];
};

export type ProfileConfig = {
	avatar?: string;
	name: string;
	bio?: string;
	links: {
		name: string;
		url: string;
		icon: string;
	}[];
	typewriter?: {
		enable: boolean; // 是否启用打字机效果
		speed?: number; // 打字速度（毫秒）
	};
};

export type LicenseConfig = {
	enable: boolean;
	name: string;
	url: string;
};

// Permalink 配置
export type PermalinkConfig = {
	enable: boolean; // 是否启用全局 permalink 功能
	/**
	 * permalink 格式模板
	 * 支持的占位符：
	 * - %year% : 4位年份 (2024)
	 * - %monthnum% : 2位月份 (01-12)
	 * - %day% : 2位日期 (01-31)
	 * - %hour% : 2位小时 (00-23)
	 * - %minute% : 2位分钟 (00-59)
	 * - %second% : 2位秒数 (00-59)
	 * - %post_id% : 文章序号（按发布时间升序排列）
	 * - %postname% : 文章文件名（slug）
	 * - %category% : 分类名（无分类时为 "uncategorized"）
	 *
	 * 示例：
	 * - "%year%-%monthnum%-%postname%" => "2024-12-my-post"
	 * - "%post_id%-%postname%" => "42-my-post"
	 * - "%category%-%postname%" => "tech-my-post"
	 *
	 * 注意：不支持斜杠 "/"，所有生成的链接都在根目录下
	 */
	format: string;
};

// 评论配置

export type CommentConfig = {
	enable: boolean; // 是否启用评论功能
	twikoo?: TwikooConfig;
};

type TwikooConfig = {
	envId: string;
	region?: string;
	lang?: string;
};

export type LIGHT_DARK_MODE = typeof LIGHT_MODE | typeof DARK_MODE;

export type WALLPAPER_MODE =
	| typeof WALLPAPER_BANNER
	| typeof WALLPAPER_FULLSCREEN
	| typeof WALLPAPER_NONE;

export type BlogPostData = {
	body: string;
	title: string;
	published: Date;
	description: string;
	tags: string[];
	draft?: boolean;
	image?: string;
	category?: string;
	pinned?: boolean;
	prevTitle?: string;
	prevSlug?: string;
	nextTitle?: string;
	nextSlug?: string;
};

export type ExpressiveCodeConfig = {
	theme: string;
	hideDuringThemeTransition?: boolean; // 是否在主题切换时隐藏代码块
};

export type AnnouncementConfig = {
	// enable属性已移除，现在通过sidebarLayoutConfig统一控制
	title?: string; // 公告栏标题
	content: string; // 公告栏内容
	icon?: string; // 公告栏图标
	type?: "info" | "warning" | "success" | "error"; // 公告类型
	closable?: boolean; // 是否可关闭
	link?: {
		enable: boolean; // 是否启用链接
		text: string; // 链接文字
		url: string; // 链接地址
		external?: boolean; // 是否外部链接
	};
};

export type MusicPlayerConfig = {
	enable: boolean; // 是否启用音乐播放器功能
	mode: "meting" | "local"; // 音乐播放器模式
	meting_api: string; // Meting API 地址
	id: string; // 歌单ID
	server: string; // 音乐源服务器
	type: string; // 音乐类型
};

export type FooterConfig = {
	enable: boolean; // 是否启用Footer HTML注入功能
	customHtml?: string; // 自定义HTML内容，用于添加备案号等信息
};

// 组件配置类型定义
export type WidgetComponentType =
	| "profile"
	| "announcement"
	| "categories"
	| "tags"
	| "toc"
	| "music-player"
	| "pio" // 添加 pio 组件类型
	| "site-stats" // 站点统计组件
	| "calendar" // 日历组件
	| "custom";

export type WidgetComponentConfig = {
	type: WidgetComponentType; // 组件类型
	position: "top" | "sticky"; // 组件位置：顶部固定区域或粘性区域
	class?: string; // 自定义CSS类名
	style?: string; // 自定义内联样式
	animationDelay?: number; // 动画延迟时间（毫秒）
	responsive?: {
		hidden?: ("mobile" | "tablet" | "desktop")[]; // 在指定设备上隐藏
		collapseThreshold?: number; // 折叠阈值
	};
	customProps?: Record<string, any>; // 自定义属性，用于扩展组件功能
};

export type SidebarLayoutConfig = {
	properties: WidgetComponentConfig[]; // 组件配置列表
	components: {
		left: WidgetComponentType[];
		right: WidgetComponentType[];
		drawer: WidgetComponentType[];
	};
	defaultAnimation: {
		enable: boolean; // 是否启用默认动画
		baseDelay: number; // 基础延迟时间（毫秒）
		increment: number; // 每个组件递增的延迟时间（毫秒）
	};
	responsive: {
		breakpoints: {
			mobile: number; // 移动端断点（px）
			tablet: number; // 平板端断点（px）
			desktop: number; // 桌面端断点（px）
		};
	};
};

export type SakuraConfig = {
	enable: boolean; // 是否启用樱花特效
	sakuraNum: number; // 樱花数量，默认21
	limitTimes: number; // 樱花越界限制次数，-1为无限循环
	size: {
		min: number; // 樱花最小尺寸倍数
		max: number; // 樱花最大尺寸倍数
	};
	opacity: {
		min: number; // 樱花最小不透明度
		max: number; // 樱花最大不透明度
	};
	speed: {
		horizontal: {
			min: number; // 水平移动速度最小值
			max: number; // 水平移动速度最大值
		};
		vertical: {
			min: number; // 垂直移动速度最小值
			max: number; // 垂直移动速度最大值
		};
		rotation: number; // 旋转速度
		fadeSpeed: number; // 消失速度
	};
	zIndex: number; // 层级，确保樱花在合适的层级显示
};

export type FullscreenWallpaperConfig = {
	src:
		| string
		| string[]
		| {
				desktop?: string | string[];
				mobile?: string | string[];
		  }; // 支持单个图片、图片数组或分别设置桌面端和移动端图片
	position?: "top" | "center" | "bottom"; // 壁纸位置，等同于 object-position
	carousel?: {
		enable: boolean; // 是否启用轮播
		interval: number; // 轮播间隔时间（秒）
	};
	zIndex?: number; // 层级，确保壁纸在合适的层级显示
	opacity?: number; // 壁纸透明度，0-1之间
	blur?: number; // 背景模糊程度，单位px
};

/**
 * Pio 看板娘配置
 */
export type PioConfig = {
	enable: boolean; // 是否启用看板娘
	models?: string[]; // 模型文件路径数组
	position?: "left" | "right"; // 看板娘位置
	width?: number; // 看板娘宽度
	height?: number; // 看板娘高度
	mode?: "static" | "fixed" | "draggable"; // 展现模式
	hiddenOnMobile?: boolean; // 是否在移动设备上隐藏
	dialog?: {
		welcome?: string | string[]; // 欢迎词
		touch?: string | string[]; // 触摸提示
		home?: string; // 首页提示
		skin?: [string, string]; // 换装提示 [切换前, 切换后]
		close?: string; // 关闭提示
		link?: string; // 关于链接
		custom?: Array<{
			selector: string; // CSS选择器
			type: "read" | "link"; // 类型
			text?: string; // 自定义文本
		}>;
	};
};

/**
 * 分享组件配置
 */
export type ShareConfig = {
	enable: boolean; // 是否启用分享功能
};
