import { DARK_MODE, DEFAULT_THEME, LIGHT_MODE } from "@constants/constants";

import { fullscreenWallpaperConfig, sakuraConfig, siteConfig } from "@/config";
import type { LIGHT_DARK_MODE, WALLPAPER_MODE } from "@/types/config";

export function getDefaultHue(): number {
	const fallback = "250";
	const configCarrier = document.getElementById("config-carrier");
	if (!configCarrier) {
		return Number.parseInt(fallback, 10);
	}
	return Number.parseInt(configCarrier.dataset.hue || fallback, 10);
}

export function getHue(): number {
	if (siteConfig.themeColor.fixed) return getDefaultHue();
	const stored = localStorage.getItem("hue");
	return stored ? Number.parseInt(stored, 10) : getDefaultHue();
}

export function setHue(hue: number): void {
	localStorage.setItem("hue", String(hue));
	const r = document.querySelector(":root") as HTMLElement;
	if (!r) {
		return;
	}
	r.style.setProperty("--hue", String(hue));
}

export function applyThemeToDocument(theme: LIGHT_DARK_MODE) {
	const currentIsDark = document.documentElement.classList.contains("dark");
	const currentTheme = document.documentElement.getAttribute("data-theme");

	let targetIsDark = false;
	switch (theme) {
		case LIGHT_MODE:
			targetIsDark = false;
			break;
		case DARK_MODE:
			targetIsDark = true;
			break;
		default:
			targetIsDark = currentIsDark;
			break;
	}

	const needsThemeChange = currentIsDark !== targetIsDark;
	const expectedTheme = targetIsDark ? "github-dark" : "github-light";
	const needsCodeThemeUpdate = currentTheme !== expectedTheme;

	if (!needsThemeChange && !needsCodeThemeUpdate) {
		return;
	}

	const performThemeChange = () => {
		if (needsThemeChange) {
			if (targetIsDark) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
		}

		if (needsCodeThemeUpdate) {
			const expressiveTheme = targetIsDark ? "github-dark" : "github-light";
			document.documentElement.setAttribute("data-theme", expressiveTheme);
		}
	};

	if (
		needsThemeChange &&
		document.startViewTransition &&
		!window.matchMedia("(prefers-reduced-motion: reduce)").matches
	) {
		document.documentElement.classList.add(
			"is-theme-transitioning",
			"use-view-transition",
		);

		const transition = document.startViewTransition(() => {
			performThemeChange();
		});

		transition.finished
			.then(() => {
				queueMicrotask(() => {
					document.documentElement.classList.remove(
						"is-theme-transitioning",
						"use-view-transition",
					);
				});
			})
			.catch(() => {
				document.documentElement.classList.remove(
					"is-theme-transitioning",
					"use-view-transition",
				);
			});
	} else {
		if (needsThemeChange) {
			document.documentElement.classList.add("is-theme-transitioning");
		}

		performThemeChange();

		if (needsThemeChange) {
			requestAnimationFrame(() => {
				document.documentElement.classList.remove("is-theme-transitioning");
			});
		}
	}
}

export function setTheme(theme: LIGHT_DARK_MODE): void {
	localStorage.setItem("theme", theme);
	applyThemeToDocument(theme);
}

export function getStoredTheme(): LIGHT_DARK_MODE {
	return (localStorage.getItem("theme") as LIGHT_DARK_MODE) || DEFAULT_THEME;
}

export function getStoredWallpaperMode(): WALLPAPER_MODE {
	if (!fullscreenWallpaperConfig.enable)
		return siteConfig.wallpaperMode.defaultMode as WALLPAPER_MODE;
	return (
		(localStorage.getItem("wallpaperMode") as WALLPAPER_MODE) ||
		siteConfig.wallpaperMode.defaultMode
	);
}

export function setWallpaperMode(mode: WALLPAPER_MODE): void {
	localStorage.setItem("wallpaperMode", mode);
	window.dispatchEvent(
		new CustomEvent("wallpaper-mode-change", { detail: { mode } }),
	);
}

function getConfigDefault(key: string, fallback: string): string {
	const configCarrier = document.getElementById("config-carrier");
	if (!configCarrier) return fallback;
	return configCarrier.dataset[key] || fallback;
}

// ─── Overlay Settings ────────────────────────────────────────

export function getDefaultOverlayOpacity(): number {
	return Number(
		getConfigDefault(
			"overlayOpacity",
			String(fullscreenWallpaperConfig.overlay?.opacity ?? 0.8),
		),
	);
}

export function getStoredOverlayOpacity(): number {
	const sw = fullscreenWallpaperConfig.overlay?.switchable;
	const isSwitchable =
		typeof sw === "object" ? (sw.opacity ?? true) : (sw ?? true);
	if (!isSwitchable) return getDefaultOverlayOpacity();
	const stored = localStorage.getItem("overlayOpacity");
	return stored ? Number(stored) : getDefaultOverlayOpacity();
}

export function setOverlayOpacity(value: number): void {
	localStorage.setItem("overlayOpacity", String(value));
	const wallpaper = document.querySelector(
		"[data-fullscreen-wallpaper]",
	) as HTMLElement;
	if (wallpaper) {
		wallpaper.style.setProperty("--wallpaper-opacity", String(value));
	}
	window.dispatchEvent(new CustomEvent("overlay-settings-change"));
}

export function getDefaultOverlayBlur(): number {
	return Number(
		getConfigDefault(
			"overlayBlur",
			String(fullscreenWallpaperConfig.overlay?.blur ?? 10),
		),
	);
}

export function getStoredOverlayBlur(): number {
	const sw = fullscreenWallpaperConfig.overlay?.switchable;
	const isSwitchable =
		typeof sw === "object" ? (sw.blur ?? true) : (sw ?? true);
	if (!isSwitchable) return getDefaultOverlayBlur();
	const stored = localStorage.getItem("overlayBlur");
	return stored ? Number(stored) : getDefaultOverlayBlur();
}

export function setOverlayBlur(value: number): void {
	localStorage.setItem("overlayBlur", String(value));
	const wallpaper = document.querySelector(
		"[data-fullscreen-wallpaper]",
	) as HTMLElement;
	if (wallpaper) {
		wallpaper.style.setProperty("--wallpaper-blur", `${value}px`);
	}
	window.dispatchEvent(new CustomEvent("overlay-settings-change"));
}

export function getDefaultOverlayCardOpacity(): number {
	return Number(
		getConfigDefault(
			"overlayCardOpacity",
			String(fullscreenWallpaperConfig.overlay?.cardOpacity ?? 0.5),
		),
	);
}

export function getStoredOverlayCardOpacity(): number {
	const sw = fullscreenWallpaperConfig.overlay?.switchable;
	const isSwitchable =
		typeof sw === "object" ? (sw.cardOpacity ?? true) : (sw ?? true);
	if (!isSwitchable) return getDefaultOverlayCardOpacity();
	const stored = localStorage.getItem("overlayCardOpacity");
	return stored ? Number(stored) : getDefaultOverlayCardOpacity();
}

export function setOverlayCardOpacity(value: number): void {
	localStorage.setItem("overlayCardOpacity", String(value));
	const root = document.querySelector(":root") as HTMLElement;
	if (root) {
		root.style.setProperty("--card-transparent-opacity", String(value));
	}
	window.dispatchEvent(new CustomEvent("overlay-settings-change"));
}

// ─── Fullscreen Settings ─────────────────────────────────────

export function getDefaultFullscreenOpacity(): number {
	return Number(
		getConfigDefault(
			"fullscreenOpacity",
			String(fullscreenWallpaperConfig.opacity ?? 0.8),
		),
	);
}

export function getStoredFullscreenOpacity(): number {
	const sw = fullscreenWallpaperConfig.fullscreen?.switchable;
	const isSwitchable =
		typeof sw === "object" ? (sw.opacity ?? true) : (sw ?? true);
	if (!isSwitchable) return getDefaultFullscreenOpacity();
	const stored = localStorage.getItem("fullscreenOpacity");
	return stored ? Number(stored) : getDefaultFullscreenOpacity();
}

export function setFullscreenOpacity(value: number): void {
	localStorage.setItem("fullscreenOpacity", String(value));
	const wallpaper = document.querySelector(
		"[data-fullscreen-wallpaper]",
	) as HTMLElement;
	if (wallpaper) {
		wallpaper.style.setProperty("--wallpaper-opacity", String(value));
	}
	window.dispatchEvent(new CustomEvent("fullscreen-settings-change"));
}

export function getDefaultFullscreenBlur(): number {
	return Number(
		getConfigDefault(
			"fullscreenBlur",
			String(fullscreenWallpaperConfig.blur ?? 0),
		),
	);
}

export function getStoredFullscreenBlur(): number {
	const sw = fullscreenWallpaperConfig.fullscreen?.switchable;
	const isSwitchable =
		typeof sw === "object" ? (sw.blur ?? true) : (sw ?? true);
	if (!isSwitchable) return getDefaultFullscreenBlur();
	const stored = localStorage.getItem("fullscreenBlur");
	return stored ? Number(stored) : getDefaultFullscreenBlur();
}

export function setFullscreenBlur(value: number): void {
	localStorage.setItem("fullscreenBlur", String(value));
	const wallpaper = document.querySelector(
		"[data-fullscreen-wallpaper]",
	) as HTMLElement;
	if (wallpaper) {
		wallpaper.style.setProperty("--wallpaper-blur", `${value}px`);
	}
	window.dispatchEvent(new CustomEvent("fullscreen-settings-change"));
}

export function applyWallpaperVisualSettings(mode?: WALLPAPER_MODE): void {
	const currentMode = mode || getStoredWallpaperMode();
	const wallpaper = document.querySelector(
		"[data-fullscreen-wallpaper]",
	) as HTMLElement;
	const root = document.documentElement;

	if (!wallpaper) {
		return;
	}

	if (currentMode === "overlay") {
		wallpaper.style.setProperty(
			"--wallpaper-opacity",
			String(getStoredOverlayOpacity()),
		);
		wallpaper.style.setProperty(
			"--wallpaper-blur",
			`${getStoredOverlayBlur()}px`,
		);
		root.style.setProperty(
			"--card-transparent-opacity",
			String(getStoredOverlayCardOpacity()),
		);
		return;
	}

	if (currentMode === "fullscreen") {
		wallpaper.style.setProperty(
			"--wallpaper-opacity",
			String(getStoredFullscreenOpacity()),
		);
		wallpaper.style.setProperty(
			"--wallpaper-blur",
			`${getStoredFullscreenBlur()}px`,
		);
		root.style.removeProperty("--card-transparent-opacity");
		return;
	}

	wallpaper.style.removeProperty("--wallpaper-opacity");
	wallpaper.style.removeProperty("--wallpaper-blur");
	root.style.removeProperty("--card-transparent-opacity");
}

// ─── Waves ───────────────────────────────────────────────────

export function getDefaultWavesEnabled(): boolean {
	return siteConfig.banner?.waves?.enable ?? true;
}

export function getStoredWavesEnabled(): boolean {
	if (!getDefaultWavesEnabled()) return false;
	const stored = localStorage.getItem("wavesEnabled");
	return stored !== null ? stored === "true" : true;
}

export function setWavesEnabled(enabled: boolean): void {
	localStorage.setItem("wavesEnabled", String(enabled));
	document.documentElement.setAttribute("data-waves-enabled", String(enabled));
	window.dispatchEvent(
		new CustomEvent("waves-toggle", { detail: { enabled } }),
	);
}

// ─── Banner Title ────────────────────────────────────────────

export function getDefaultBannerTitleEnabled(): boolean {
	return siteConfig.banner?.homeText?.enable ?? true;
}

export function getStoredBannerTitleEnabled(): boolean {
	if (!getDefaultBannerTitleEnabled()) return false;
	const stored = localStorage.getItem("bannerTitleEnabled");
	return stored !== null ? stored === "true" : true;
}

export function setBannerTitleEnabled(enabled: boolean): void {
	localStorage.setItem("bannerTitleEnabled", String(enabled));
	document.documentElement.setAttribute(
		"data-banner-title-enabled",
		String(enabled),
	);
	window.dispatchEvent(
		new CustomEvent("banner-title-toggle", { detail: { enabled } }),
	);
}

// ─── Banner Carousel ─────────────────────────────────────────

export function getDefaultBannerCarouselEnabled(): boolean {
	return siteConfig.banner?.carousel?.enable ?? true;
}

export function getStoredBannerCarouselEnabled(): boolean {
	const stored = localStorage.getItem("bannerCarouselEnabled");
	return stored !== null
		? stored === "true"
		: getDefaultBannerCarouselEnabled();
}

export function setBannerCarouselEnabled(enabled: boolean): void {
	localStorage.setItem("bannerCarouselEnabled", String(enabled));
	window.dispatchEvent(
		new CustomEvent("banner-carousel-change", { detail: { enabled } }),
	);
}

// ─── Sakura ──────────────────────────────────────────────────

export function getDefaultSakuraEnabled(): boolean {
	return sakuraConfig.enable ?? false;
}

export function getStoredSakuraEnabled(): boolean {
	if (!sakuraConfig.enable) return false;
	const stored = localStorage.getItem("sakuraEnabled");
	return stored !== null ? stored === "true" : false;
}

export function setSakuraEnabled(enabled: boolean): void {
	localStorage.setItem("sakuraEnabled", String(enabled));
	window.dispatchEvent(
		new CustomEvent("sakura-toggle", { detail: { enabled } }),
	);
}
