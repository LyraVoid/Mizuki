import type { RainyDayConfig } from "../types/config";

/**
 * 雨滴窗口特效配置（雨滴落在窗户玻璃上的 WebGL 效果，基于 @arayui/rainy-day）
 *
 * ══════════════════════════════════════════════════════════════
 * 总开关（本地文件，构建期生效）
 * ══════════════════════════════════════════════════════════════
 *
 *   enable: true   → 执行 pnpm build 后：首页横幅出现雨滴，
 *                    「外观设置」面板的「特效」区出现雨滴控件（可切：无雨 / 仅横幅 / 全屏）
 *
 *   enable: false  → 完全不开启该板块：主布局不渲染 <RainyDay />，
 *                    设置面板不显示雨滴控件；并且 astro.config.mjs 会把
 *                    `@components/common/RainyDay.astro` 的 import 换成空组件
 *                    （src/components/common/RainyDayDisabled.astro），
 *                    于是本组件脚本与 @arayui/rainy-day（内含 Three.js，约 480KB）
 *                    连一个字节都不会进构建产物 —— 页面与产物都回到原样
 *
 * 注意：改完本文件必须重新构建（pnpm build / pnpm dev 重启）才会生效；
 *       面板里的档位是运行期偏好，存在 localStorage，会让配置里的默认档位失效
 *       （想回到这里的默认值：清掉 localStorage 的 rainyInBanner / rainyInFullscreen，
 *        或在设置面板里手动切回去）。
 *
 * ══════════════════════════════════════════════════════════════
 * 挂载位置（由「壁纸模式 + 面板档位」共同决定）
 * ══════════════════════════════════════════════════════════════
 *
 *   横幅模式 + 仅横幅  → #banner-wrapper 内一层：横幅图 + 雨（水波纹仍在最上层）
 *   横幅模式 + 全屏    → 两层：横幅区「横幅图 + 雨」+ 征文区「页面底色 + 雨」
 *                        （征文区底层不放图片，卡片文字不受影响）
 *   全屏 / overlay 壁纸 → [data-fullscreen-wallpaper] 内：壁纸图 + 雨
 *   无壁纸模式          → 没有可折射的背景 → 不挂载
 */
export const rainyDayConfig: RainyDayConfig = {
	// ── 总开关 ────────────────────────────────────────────────
	enable: true,

	// ── 用户偏好默认值（可在「外观设置 → 特效」里随时切换，选择记进 localStorage）──
	defaultInBannerMode: "banner", // "off" 无雨 | "banner" 仅横幅 | "fullscreen" 横幅 + 征文区
	defaultInFullscreenMode: "on", // "off" 无雨 | "on" 有雨
	showSwitch: true, // 是否在「外观设置」面板里显示雨滴控件

	// ── 挂载时机与过渡 ────────────────────────────────────────
	bgFadeMs: 500, // 轮播换图时雨层交叉淡入时长（毫秒；0 = 直接切换）
	lazyMount: true, // 延后到 load + 浏览器空闲再挂载（Three.js 不进首屏关键路径）
	idleDelayMs: 2500, // idle 兜底超时（毫秒）：最迟这么久一定挂载
	fadeInMs: 600, // 雨层挂载完成后的淡入时长（毫秒；0 = 不淡入）
	skipOnSlowNetwork: true, // 弱网/省流（saveData / 2G）不加载雨特效

	// ── 效果参数（可自行微调）────────────────────────────────
	intensity: 0.2, // 雨滴密度：0.3 稀疏、0.5 适中、0.8 密集
	speed: 1, // 下落速度：0.2 缓慢、0.5 中速
	brightness: 0.9, // 亮度
	normal: 1.0, // 法线强度（雨滴立体感）
	zoom: 2, // 雨滴图案缩放：值越大雨滴越大、越稀疏（0.1-3）
	blurIntensity: 0.2, // 玻璃模糊（建议 0-1，太大会糊掉背景）
	blurIterations: 12, // 模糊迭代（越小越快）
	lightning: false, // 闪电（想要戏剧性可开）
	panning: false, // 镜头平移
	postProcessing: true, // 后处理（征文区那一层会被单独关掉，见 RainyDay.astro）
	fps: 30, // 限帧，省电关键

	// ── 行为开关 ─────────────────────────────────────────────
	disableOnMobile: true, // 移动端默认不启用
	respectReducedMotion: true, // 系统开了「减少动态效果」就不渲染
	autoDisableWaves: false, // 雨窗开启时是否隐藏横幅水波纹（false = 两者叠加共存）
	pauseWhenHidden: true, // 切到别的标签页时暂停渲染
	lazy: true, // 懒加载 Three.js

	// ── 调试接口（调完请改回 false）──────────────────────────
	// 开启后可在浏览器控制台实时调参：
	//   setRainyOptions({ intensity: 0.8 })                  // 改单个/多个参数，立即生效
	//   setRainyOptions({ speed: 0.4, blurIntensity: 0.6 })  // 批量
	//   setRainyOptions({ lightning: true })                 // 开闪电
	//   getRainyOptions()                                    // 查看当前全部参数
	//   getRainyDebug()                                      // 查看当前挂了哪些雨层、各自用什么背景
	//   __rainyDay.pause() / __rainyDay.resume() / __rainyDay.destroy()
	//   参数范围：intensity 0-1、speed 0-10、brightness 0-1、normal 0-3、zoom 0.1-3、
	//            blurIntensity 0-10、blurIterations 1-64、fps 15-120（越界会被自动裁剪并提示）
	debug: false,
};
