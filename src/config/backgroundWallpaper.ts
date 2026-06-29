import type { FullscreenWallpaperConfig } from "../types/config";

export const fullscreenWallpaperConfig: FullscreenWallpaperConfig = {
	enable: true,
	src: {
		desktop: [
			"/assets/desktop-banner/desktop-1.jpg",
			// "/assets/desktop-banner/desktop-2.jpg",
			// "/assets/desktop-banner/desktop-3.jpg",
			// "/assets/desktop-banner/desktop-4.jpg"
		], // 桌面横幅图片
		mobile: [
			// "/assets/mobile-banner/mobile-1.png",
			// "/assets/mobile-banner/mobile-2.png",
			// "/assets/mobile-banner/mobile-3.png",
			"/assets/mobile-banner/mobile-4.png"
		], // 移动横幅图片
	},
	position: "center",
	carousel: {
		enable: true,
		interval: 5,
	},
	zIndex: -1,
	opacity: 0.8,
	blur: 1,
	switchable: true,
	overlay: {
		opacity: 0.8,
		blur: 10,
		cardOpacity: 0.5,
		switchable: {
			opacity: true,
			blur: true,
			cardOpacity: true,
		},
	},
	fullscreen: {
		switchable: {
			opacity: true,
			blur: true,
		},
	},
};
