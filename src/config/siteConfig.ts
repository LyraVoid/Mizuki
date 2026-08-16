import type { SiteConfig } from "../types/config";

const SITE_LANG = "en";

export const siteConfig: SiteConfig = {
	title: "Youssef",
	subtitle: "AI & Computer Science Journey",
	siteURL: "https://0xjoyo.github.io/Mizuki_joyo-_edition/",
	siteStartDate: "2026-08-16",
	timeZone: "Africa/Cairo",

	lang: SITE_LANG,

	themeColor: {
		hue: 210,
		fixed: false,
	},

	featurePages: {
		anime: false,
		diary: false,
		friends: false,
		projects: true,
		skills: true,
		timeline: true,
		albums: false,
		devices: false,
		aiTools: true,
	},

	navbarTitle: {
		mode: "text-icon",
		text: "Youssef",
		icon: "assets/home/home.webp",
		logo: "assets/home/default-logo.webp",
	},

	pageScaling: {
		enable: false,
		targetWidth: 2000,
	},

	font: {
		mode: "custom",
	},

	bangumi: {
		userId: "",
		fetchOnDev: false,
	},

	bilibili: {
		vmid: "",
		fetchOnDev: false,
		coverMirror: "",
		useWebp: true,
	},

	anime: {
		mode: "local",
	},

	diaryApiUrl: "",

	postListLayout: {
		defaultMode: "list",
		enable: true,
		allowSwitch: true,
		categoryBar: {
			enable: true,
		},
	},

	ultrawidePostLayout: {
		enable: true,
		allowSwitch: true,
	},

	tagStyle: {
		useNewStyle: true,
	},

	wallpaperMode: {
		defaultMode: "banner",
		showModeSwitchOnMobile: "both",
	},

	banner: {
		src: {
			desktop: [
				"/assets/desktop-banner/1.webp",
				"/assets/desktop-banner/2.webp",
				"/assets/desktop-banner/3.webp",
				"/assets/desktop-banner/4.webp",
			],
			mobile: [
				"/assets/mobile-banner/1.webp",
				"/assets/mobile-banner/2.webp",
				"/assets/mobile-banner/3.webp",
				"/assets/mobile-banner/4.webp",
			],
		},
		position: "center",
		carousel: {
			enable: true,
			interval: 5,
			switchable: true,
		},
		waves: {
			enable: true,
			performanceMode: false,
			mobileDisable: false,
			switchable: true,
		},
		imageApi: {
			enable: false,
			url: "",
		},
		homeText: {
			enable: true,
			title: "Youssef's Lab",
			switchable: true,
			subtitle: [
				"Learning CS from the ground up.",
				"Building toward AI and research.",
				"Python, DSA, systems, mathematics, and AI.",
				"Documenting the process, one project at a time.",
			],
			typewriter: {
				enable: true,
				speed: 80,
				deleteSpeed: 40,
				pauseTime: 2500,
			},
		},
		credit: {
			enable: false,
			text: "",
			url: "",
		},
		navbar: {
			transparentMode: "semifull",
		},
	},

	toc: {
		enable: true,
		mobileTop: true,
		desktopSidebar: true,
		floating: true,
		depth: 2,
		useJapaneseBadge: false,
	},
	showCoverInContent: true,
	generateOgImages: false,
	favicon: [],
	showLastModified: true,
	pageProgressBar: {
		enable: true,
		height: 3,
		duration: 6000,
	},
	thirdPartyAnalytics: {
		enable: false,
		clarityId: "",
	},
	card: {
		border: true,
		followTheme: false,
	},
	imageOptimization: {
		formats: "webp",
		quality: 85,
		noReferrerDomains: ["*.hdslb.com"],
	},
};

export { SITE_LANG };
