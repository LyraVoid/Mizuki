import type {
	DARK_MODE,
	LIGHT_MODE,
	WALLPAPER_BANNER,
	WALLPAPER_FULLSCREEN,
	WALLPAPER_NONE,
	WALLPAPER_OVERLAY,
} from "../constants/constants";

export interface SiteConfig {
	title: string;
	subtitle: string;
	siteURL: string; // 站点URL，以斜杠结尾，例如：https://mizuki.mysqil.com/
	keywords?: string[]; // 站点关键词，用于生成 <meta name="keywords">
	siteStartDate?: string; // 站点开始日期，格式：YYYY-MM-DD，用于计算运行天数

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
		enable: boolean; // 是否启用布局切换功能
		allowSwitch: boolean; // 是否允许用户切换布局
		categoryBar?: {
			enable: boolean; // 是否在文章列表页显示分类导航条
		};
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
		coverMirror?: string; // 封面图片镜像源（可选，默认为空字符串）
		useWebp?: boolean; // 是否使用WebP格式（默认 true）
	};

	// 添加番剧页面配置
	anime?: {
		mode?: "bangumi" | "local" | "bilibili"; // 番剧页面模式
	};

	// 日记页面 Memos API 地址，客户端 fetch 获取动态数据
	diaryApiUrl?: string;

	// 标签样式配置
	tagStyle?: {
		useNewStyle?: boolean; // 是否使用新样式（悬停高亮样式）还是旧样式（外框常亮样式）
	};

	// 壁纸模式配置
	wallpaperMode: {
		defaultMode: "banner" | "fullscreen" | "overlay" | "none";
		showModeSwitchOnMobile?: "off" | "mobile" | "desktop" | "both";
	};

	banner: {
		src:
			| string
			| string[]
			| {
					desktop?: string | string[];
					mobile?: string | string[];
			  };
		position?: "top" | "center" | "bottom";
		carousel?: {
			enable: boolean;
			interval: number;
			switchable?: boolean;
		};
		waves?: {
			enable: boolean;
			performanceMode?: boolean;
			mobileDisable?: boolean;
			switchable?: boolean;
		};
		imageApi?: {
			enable: boolean;
			url: string;
		};
		homeText?: {
			enable: boolean;
			title?: string;
			subtitle?: string | string[];
			typewriter?: {
				enable: boolean;
				speed: number;
				deleteSpeed: number;
				pauseTime: number;
			};
			switchable?: boolean;
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
		enable: boolean; // 总开关，false 时所有 TOC 都不显示
		mobileTop: boolean; // 手机端顶部 TOC 按钮
		desktopSidebar: boolean; // 电脑端右侧边栏 TOC
		floating: boolean; // 悬浮 TOC 按钮
		depth: 1 | 2 | 3;
		useJapaneseBadge?: boolean; // 使用日语假名标记（あいうえお...）代替数字
	};
	showCoverInContent: boolean; // 控制文章封面在文章内容页显示的开关
	generateOgImages: boolean;
	favicon: Favicon[];
	showLastModified: boolean; // 控制"上次编辑"卡片显示的开关
	pageProgressBar?: PageProgressBarConfig; // 页面顶部进度条配置
	thirdPartyAnalytics?: ThirdPartyAnalyticsConfig; // 第三方统计配置

	// 卡片样式配置
	card?: {
		border: boolean; // 是否开启卡片边框和微阴影立体效果
		followTheme?: boolean; // 是否让卡片风格跟随主题色相
	};

	// 图片优化配置
	imageOptimization?: {
		formats?: "avif" | "webp" | "both"; // 图片输出格式：avif、webp 或 both（avif+webp）
		quality?: number; // 图片质量 1-100，推荐 70-85
		noReferrerDomains?: string[]; // 需要添加 no-referrer 的域名（支持通配符，如 "*.hdslb.com"）
	};
}

// 图片格式类型
export type ImageFormat = "avif" | "webp" | "png" | "jpg" | "jpeg" | "gif";

// 响应式图片布局类型
export type ResponsiveImageLayout = "constrained" | "full-width" | "none";

export interface Favicon {
	src: string;
	theme?: "light" | "dark";
	sizes?: string;
}

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

export interface NavBarLink {
	name: string;
	url: string;
	external?: boolean;
	icon?: string; // 菜单项图标
	children?: (NavBarLink | LinkPreset)[]; // 支持子菜单，可以是NavBarLink或LinkPreset
}

export interface NavBarConfig {
	links: (NavBarLink | LinkPreset)[];
}

export interface ProfileConfig {
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
}

export interface LicenseConfig {
	enable: boolean;
	name: string;
	url: string;
}

// Permalink 配置
export interface PermalinkConfig {
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
}

// 评论配置

export interface CommentConfig {
	enable: boolean; // 是否启用评论功能
	system?: "twikoo" | "giscus"; // 评论系统选择
	twikoo?: TwikooConfig;
	giscus?: GiscusConfig;
}

export interface GiscusConfig {
	repo: string;
	repoId: string;
	category: string;
	categoryId: string;
	mapping: string;
	strict: string;
	reactionsEnabled: string;
	emitMetadata: string;
	inputPosition: string;
	theme: string;
	lang: string;
	loading: string;
}

interface TwikooConfig {
	envId: string;
	region?: string;
	lang?: string;
}

export type LIGHT_DARK_MODE = typeof LIGHT_MODE | typeof DARK_MODE;

export type WALLPAPER_MODE =
	| typeof WALLPAPER_BANNER
	| typeof WALLPAPER_FULLSCREEN
	| typeof WALLPAPER_OVERLAY
	| typeof WALLPAPER_NONE;

export interface BlogPostData {
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
}

export interface ExpressiveCodeConfig {
	theme: string;
	hideDuringThemeTransition?: boolean; // 是否在主题切换时隐藏代码块
}

export interface AnnouncementConfig {
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
}

export interface MusicPlayerConfig {
	enable: boolean; // 是否启用音乐播放器功能
	showFloatingPlayer: boolean; // 是否显示悬浮播放器 UI
	floatingEntryMode?: "default" | "fab"; // 悬浮入口模式：默认独立播放器或集成到 FAB 组
	mode: "meting" | "local"; // 音乐播放器模式
	meting_api: string; // Meting API 地址
	id: string; // 歌单ID
	server: string; // 音乐源服务器
	type: string; // 音乐类型
}

export interface FooterConfig {
	enable: boolean; // 是否启用Footer HTML注入功能
	customHtml?: string; // 自定义HTML内容，用于添加备案号等信息
}

// 组件配置类型定义
export type WidgetComponentType =
	| "profile"
	| "announcement"
	| "categories"
	| "tags"
	| "toc"
	| "card-toc" // 卡片式目录组件
	| "music-player"
	| "music-sidebar"
	| "pio" // 添加 pio 组件类型
	| "site-stats" // 站点统计组件
	| "calendar" // 日历组件
	| "custom";

export interface WidgetComponentConfig {
	type: WidgetComponentType; // 组件类型
	position: "top" | "sticky"; // 组件位置：顶部固定区域或粘性区域
	class?: string; // 自定义CSS类名
	style?: string; // 自定义内联样式
	animationDelay?: number; // 动画延迟时间（毫秒）
	responsive?: {
		hidden?: ("mobile" | "tablet" | "desktop")[]; // 在指定设备上隐藏
		collapseThreshold?: number; // 折叠阈值
	};
	customProps?: Record<string, unknown>; // 自定义属性，用于扩展组件功能
}

export interface SidebarLayoutConfig {
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
}

export interface SakuraConfig {
	enable: boolean;
	switchable?: boolean;
	sakuraNum: number;
	limitTimes: number;
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
}

export interface FullscreenWallpaperConfig {
	enable?: boolean;
	src:
		| string
		| string[]
		| {
				desktop?: string | string[];
				mobile?: string | string[];
		  };
	position?: "top" | "center" | "bottom";
	carousel?: {
		enable: boolean;
		interval: number;
	};
	zIndex?: number;
	opacity?: number;
	blur?: number;
	switchable?: boolean;
	overlay?: {
		opacity?: number;
		blur?: number;
		cardOpacity?: number;
		switchable?:
			| boolean
			| {
					opacity?: boolean;
					blur?: boolean;
					cardOpacity?: boolean;
			  };
	};
	fullscreen?: {
		switchable?:
			| boolean
			| {
					opacity?: boolean;
					blur?: boolean;
			  };
	};
}

/**
 * Pio 看板娘配置
 */
export interface PioConfig {
	enable: boolean; // 是否启用看板娘
	models?: string[]; // 模型文件路径数组（支持 .model.json 和 .model3.json）
	position?: "left" | "right"; // 看板娘位置
	width?: number; // 看板娘宽度
	height?: number; // 看板娘高度
	mode?: "static" | "fixed" | "draggable"; // 展现模式
	hiddenOnMobile?: boolean; // 是否在移动设备上隐藏
	hideAboutMenu?: boolean; // 是否隐藏内置 About 菜单按钮
	dialog?: {
		welcome?: string | string[]; // 欢迎词
		touch?: string | string[]; // 触摸提示
		home?: string; // 首页提示
		skin?: [string, string]; // 换装提示 [切换前, 切换后]
		close?: string; // 关闭提示
		link?: string; // 关于链接
		custom?: {
			selector: string; // CSS选择器
			type: "read" | "link"; // 类型
			text?: string; // 自定义文本
		}[];
	};
	tips?: {
		welcomeMessage?: string[]; // 欢迎语
		messages?: string[]; // 循环提示内容
		duration?: number; // 每条 tips 展示时长（ms）
		interval?: number; // tips 循环间隔（ms）
	};
	menus?: {
		items?: {
			icon?: string; // Iconify 图标名称
			label: string; // 无障碍标题
			action: string; // 预定义动作名称
		}[];
		align?: "left" | "right"; // 菜单对齐方式
	};
}

/**
 * 分享组件配置
 */
export interface ShareConfig {
	enable: boolean; // 是否启用分享功能
}

/**
 * 相关文章组件配置
 */
export interface RelatedPostsConfig {
	enable: boolean; // 是否启用相关文章功能
	maxCount: number; // 相关文章数量
	weights?: RelatedPostsWeights; // 评分权重配置
	freshnessHalfLife?: number; // 新鲜度半衰期（天），默认 180
}

// 相关文章评分权重配置（所有权重归一化后使用）
export interface RelatedPostsWeights {
	tagSimilarity?: number; // 标签相似度权重，默认 1.0
	titleSimilarity?: number; // 标题相似度权重，默认 0.6
	descriptionSimilarity?: number; // 描述相似度权重，默认 0.4
	categoryMatch?: number; // 分类匹配权重，默认 0.3
	freshness?: number; // 时间新鲜度权重，默认 0.2
	tagIDF?: boolean; // 是否启用标签 IDF 加权（稀有标签权重更高），默认 true
}

/**
 * 随机文章组件配置
 */
export interface RandomPostsConfig {
	enable: boolean; // 是否启用随机文章功能
	maxCount: number; // 随机文章数量
}

/**
 * 页面顶部进度条配置
 */
export interface PageProgressBarConfig {
	enable: boolean; // 是否启用页面顶部进度条
	height?: number; // 进度条高度，默认 3px
	duration?: number; // 动画时长，默认 8000ms
}

/**
 * 第三方统计配置（可能影响 Lighthouse 评分）
 */
export interface ThirdPartyAnalyticsConfig {
	enable: boolean; // 是否启用第三方统计（Microsoft Clarity），默认关闭
	clarityId?: string; // Clarity 项目 ID
}
