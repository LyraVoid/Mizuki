/**
 * 雨滴窗口特效：参数映射与校验（纯逻辑模块，零依赖）
 *
 * 用途：
 *   - 给「控制台实时调参」提供 setter 映射与范围校验
 *   - keep 纯函数，方便在 Node 里直接跑测试（src/utils 下不引入任何运行时依赖）
 *
 * 注意：官方 v1.0.6 的 shader 只有 11 个 uniform（intensity/speed/normal/brightness/
 * zoom/blur_intensity/blur_iterations/panning/post_processing/lightning/texture_fill），
 * 文档站提到的 dropSize / color / wind / opacity / interactive 在该版本中并不存在。
 */

/** 支持运行时调整的参数键（与 RainyWindowOptions 一致） */
export const SUPPORTED_RAINY_KEYS = [
	"intensity",
	"speed",
	"brightness",
	"normal",
	"zoom",
	"blurIntensity",
	"blurIterations",
	"panning",
	"postProcessing",
	"lightning",
	"textureFill",
	"fps",
	"backgroundImage",
] as const;

export type RainyOptionKey = (typeof SUPPORTED_RAINY_KEYS)[number];

/** 单个参数值 */
export type RainyOptionValue = number | boolean | string;

/** 参数快照（键 → 当前值） */
export type RainyOptionsSnapshot = Record<string, RainyOptionValue | undefined>;

/**
 * 决策：雨窗 crossfade 时长
 *
 * 优先级：横幅/壁纸轮播自己的过渡时长（DOM 里读到的）→ 配置的回退值 bgFadeMs。
 * 返回 0 表示"不做交叉淡入，直接换贴图"。
 */
export function resolveBgFadeMs(
	carouselFadeMs: number | null | undefined,
	fallbackMs: number,
): number {
	if (
		typeof carouselFadeMs === "number" &&
		Number.isFinite(carouselFadeMs) &&
		carouselFadeMs > 0
	) {
		return Math.round(carouselFadeMs);
	}
	if (!Number.isFinite(fallbackMs) || fallbackMs <= 0) return 0;
	return Math.round(fallbackMs);
}

// ────────────────────────────────────────────────────────────
// 运行时偏好与挂载决策（纯函数，便于在 Node 里直接测试）
// ────────────────────────────────────────────────────────────

/** 横幅壁纸模式下雨的档位：无雨 / 仅横幅内 / 铺满整个视口 */
export type RainyBannerMode = "off" | "banner" | "fullscreen";

/** 全屏壁纸模式下雨的档位：无雨 / 有雨 */
export type RainyFullscreenMode = "off" | "on";

/** 用户偏好（存 localStorage，可在导航栏雨滴面板里切换） */
export interface RainyPrefs {
	banner: RainyBannerMode;
	fullscreen: RainyFullscreenMode;
}

/**
 * 雨窗的挂载位置：
 *   banner               → 横幅内部（#banner-wrapper）
 *   viewport-fullscreen  → 视口级全屏层（body 下的 fixed 容器）
 *   wallpaper-fullscreen → 全屏壁纸层内部（[data-fullscreen-wallpaper]）
 */
export type RainyPlacement =
	| "banner"
	| "viewport-fullscreen"
	| "wallpaper-fullscreen";

/**
 * 决策：当前壁纸模式 + 用户偏好 → 需要挂载的雨窗位置列表
 *
 * 注意「横幅模式 + 全屏」会返回**两个**位置：
 *   banner + viewport-fullscreen 同时挂 —— 横幅区用"图+雨"，征文区用"纯背景+雨"（无图片）
 */
export function resolveRainyPlacements(
	wallpaperMode: string,
	prefs: RainyPrefs,
): RainyPlacement[] {
	if (wallpaperMode === "banner") {
		if (prefs.banner === "banner") return ["banner"];
		// 横幅区（横幅图上的雨）+ 征文区（纯背景上的雨，底层不放图片）
		if (prefs.banner === "fullscreen") {
			return ["banner", "viewport-fullscreen"];
		}
		return [];
	}
	if (wallpaperMode === "fullscreen") {
		return prefs.fullscreen === "on" ? ["wallpaper-fullscreen"] : [];
	}
	// 本项目的 overlay（卡片半透明全屏壁纸）复用同一个 [data-fullscreen-wallpaper] 容器，
	// 因此与 fullscreen 落点一致
	if (wallpaperMode === "overlay") {
		return prefs.fullscreen === "on" ? ["wallpaper-fullscreen"] : [];
	}
	// none / 未知模式：没有背景图可折射 → 不挂载
	return [];
}

/**
 * 由页面背景色 `--page-bg` 推导"极淡同色微渐变"的起止色（亮度 ±delta）
 *
 * 为什么要渐变：特效的雨滴靠"折射背景细节"才看得见，纯色背景上几乎不可见；
 * 用同色系极淡渐变既保持"干净背景"的观感，又让雨滴清晰。
 *
 * 支持 `oklch(...)` 与 `rgb(...)`/`rgba(...)`；无法解析时返回 null（调用方应跳过挂载，
 * 避免特效库去加载它自带的 picsum 占位图）。
 */
export function deriveGradientStops(
	color: string | null | undefined,
	delta = 0.02,
): { from: string; to: string } | null {
	if (!color) return null;
	const raw = color.trim();

	// oklch(L C H) / oklch(L% C H / A)
	const oklch = raw.match(
		/^oklch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+(?:deg|rad|turn)?)\s*(?:\/\s*[\d.]+%?)?\s*\)$/i,
	);
	if (oklch) {
		const l = oklch[1].endsWith("%")
			? Number.parseFloat(oklch[1]) / 100
			: Number.parseFloat(oklch[1]);
		if (!Number.isFinite(l)) return null;
		const clamp = (v: number) => Math.min(1, Math.max(0, v));
		const fmt = (v: number) => Number(clamp(v).toFixed(4));
		return {
			from: `oklch(${fmt(l + delta)} ${oklch[2]} ${oklch[3]})`,
			to: `oklch(${fmt(l - delta)} ${oklch[2]} ${oklch[3]})`,
		};
	}

	// rgb(r, g, b) / rgba(r, g, b, a)
	const rgb = raw.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
	if (rgb) {
		const channels = [rgb[1], rgb[2], rgb[3]].map((v) => Number.parseFloat(v));
		if (channels.some((v) => !Number.isFinite(v))) return null;
		const shift = (v: number, k: number) =>
			Math.min(255, Math.max(0, Math.round(v * k)));
		return {
			from: `rgb(${channels.map((v) => shift(v, 1.02)).join(", ")})`,
			to: `rgb(${channels.map((v) => shift(v, 0.98)).join(", ")})`,
		};
	}

	return null;
}

/** 参数补丁：只传想改的字段 */
export interface RainyOptionPatch {
	intensity?: number;
	speed?: number;
	brightness?: number;
	normal?: number;
	zoom?: number;
	blurIntensity?: number;
	blurIterations?: number;
	panning?: boolean;
	postProcessing?: boolean;
	lightning?: boolean;
	textureFill?: boolean;
	fps?: number;
	backgroundImage?: string;
}

/** 布尔型参数键 */
export const BOOLEAN_RAINY_KEYS: RainyOptionKey[] = [
	"panning",
	"postProcessing",
	"lightning",
	"textureFill",
];

/** 数值参数的合法范围（integer 为 true 时取整） */
export const RAINY_OPTION_RANGES: Record<
	string,
	{ min: number; max: number; integer?: boolean }
> = {
	intensity: { min: 0, max: 1 },
	speed: { min: 0, max: 10 },
	brightness: { min: 0, max: 1 },
	normal: { min: 0, max: 3 },
	zoom: { min: 0.1, max: 3 },
	blurIntensity: { min: 0, max: 10 },
	blurIterations: { min: 1, max: 64, integer: true },
	fps: { min: 15, max: 120, integer: true },
};

/** 参数键 → 实例上的 setter 名 */
export const RAINY_OPTION_SETTERS: Record<string, string> = {
	intensity: "setIntensity",
	speed: "setSpeed",
	brightness: "setBrightness",
	normal: "setNormal",
	zoom: "setZoom",
	blurIntensity: "setBlurIntensity",
	blurIterations: "setBlurIterations",
	panning: "setPanning",
	postProcessing: "setPostProcessing",
	lightning: "setLightning",
	textureFill: "setTextureFill",
	fps: "setFps",
};

/** 实例上需要用到的方法（结构化定义，避免依赖三方类型） */
export interface RainyControlLike {
	setIntensity: (v: number) => void;
	setSpeed: (v: number) => void;
	setBrightness: (v: number) => void;
	setNormal: (v: number) => void;
	setZoom: (v: number) => void;
	setBlurIntensity: (v: number) => void;
	setBlurIterations: (v: number) => void;
	setPanning: (v: boolean) => void;
	setPostProcessing: (v: boolean) => void;
	setLightning: (v: boolean) => void;
	setTextureFill: (v: boolean) => void;
	setFps: (v: number) => void;
	loadImage: (url: string) => Promise<void>;
	loadVideo: (url: string) => Promise<void>;
}

export interface ApplyRainyOptionsResult {
	/** 本次真正生效的字段 */
	applied: Record<string, RainyOptionValue>;
	/** 被忽略的字段（非法值或未识别的键） */
	skipped: string[];
	/** 应用后的完整参数快照 */
	current: RainyOptionsSnapshot;
}

/** 判断背景素材是否为视频（决定用 loadVideo 还是 loadImage） */
export function isVideoUrl(url: string): boolean {
	return /\.(mp4|webm|ogv|ogg|mov|m4v)(\?.*)?$/i.test(url);
}

/** 把数值裁剪到合法范围；非法（NaN/非数字）返回 null */
export function clampRainyNumber(key: string, value: unknown): number | null {
	const range = RAINY_OPTION_RANGES[key];
	if (!range) return null;
	const num = typeof value === "number" ? value : Number(value);
	if (!Number.isFinite(num)) return null;
	const clamped = Math.min(range.max, Math.max(range.min, num));
	return range.integer ? Math.round(clamped) : clamped;
}

/**
 * 把参数补丁应用到实例上
 *
 * @param instance   RainyWindow 实例（或任何实现 RainyControlLike 的对象）
 * @param patch      想修改的参数
 * @param current    当前参数快照（用于返回完整状态）
 * @param warn       提示回调（默认 console.warn），便于测试时捕获
 */
export async function applyRainyOptions(
	instance: RainyControlLike,
	patch: RainyOptionPatch,
	current: RainyOptionsSnapshot = {},
	warn: (message: string) => void = (m) => console.warn(m),
): Promise<ApplyRainyOptionsResult> {
	const applied: Record<string, RainyOptionValue> = {};
	const skipped: string[] = [];
	const next: RainyOptionsSnapshot = { ...current };

	for (const key of Object.keys(patch)) {
		const value = (patch as Record<string, unknown>)[key];

		// 1) 背景素材：图片走 loadImage，视频走 loadVideo
		if (key === "backgroundImage") {
			if (typeof value !== "string" || value.trim() === "") {
				skipped.push(key);
				warn("[rainy-day] backgroundImage 需要非空字符串，已忽略");
				continue;
			}
			try {
				if (isVideoUrl(value)) await instance.loadVideo(value);
				else await instance.loadImage(value);
				applied[key] = value;
				next[key] = value;
			} catch (err) {
				skipped.push(key);
				warn(`[rainy-day] 背景素材加载失败（${value}）：${String(err)}`);
			}
			continue;
		}

		// 2) 布尔参数
		if (BOOLEAN_RAINY_KEYS.includes(key as RainyOptionKey)) {
			const setter = RAINY_OPTION_SETTERS[key];
			const boolValue = Boolean(value);
			(instance as unknown as Record<string, (v: boolean) => void>)[setter](
				boolValue,
			);
			applied[key] = boolValue;
			next[key] = boolValue;
			continue;
		}

		// 3) 数值参数
		const setter = RAINY_OPTION_SETTERS[key];
		if (setter) {
			const clamped = clampRainyNumber(key, value);
			if (clamped === null) {
				skipped.push(key);
				warn(`[rainy-day] ${key} 的值不合法（${String(value)}），已忽略`);
				continue;
			}
			const range = RAINY_OPTION_RANGES[key];
			if (
				typeof value === "number" &&
				(value < range.min || value > range.max)
			) {
				warn(
					`[rainy-day] ${key} 超出范围 [${range.min}, ${range.max}]，已裁剪为 ${clamped}`,
				);
			}
			(instance as unknown as Record<string, (v: number) => void>)[setter](
				clamped,
			);
			applied[key] = clamped;
			next[key] = clamped;
			continue;
		}

		// 4) 未识别的键
		skipped.push(key);
		warn(
			`[rainy-day] 不支持的参数「${key}」，可用参数：${SUPPORTED_RAINY_KEYS.join(", ")}`,
		);
	}

	return { applied, skipped, current: next };
}
