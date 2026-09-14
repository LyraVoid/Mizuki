import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
	type RainyBannerMode,
	type RainyFullscreenMode,
	type RainyPrefs,
	resolveRainyPlacements,
} from "../src/utils/rainy-day-options.ts";

function prefs(
	banner: RainyBannerMode,
	fullscreen: RainyFullscreenMode = "on",
): RainyPrefs {
	return { banner, fullscreen };
}

describe("rainy day placements", () => {
	it("横幅模式：仅横幅 → 只挂 #banner-wrapper", () => {
		assert.deepEqual(resolveRainyPlacements("banner", prefs("banner")), [
			"banner",
		]);
	});

	it("横幅模式：全屏档位 → 横幅 + 征文区两层", () => {
		assert.deepEqual(resolveRainyPlacements("banner", prefs("fullscreen")), [
			"banner",
			"viewport-fullscreen",
		]);
	});

	it("横幅模式：无雨档位 → 不挂载", () => {
		assert.deepEqual(resolveRainyPlacements("banner", prefs("off")), []);
	});

	// 本项目的「全屏」是 #banner-wrapper 被拉成 100vh（GridScripts 的 fullscreen 分支），
	// [data-fullscreen-wallpaper] 此时是 display:none —— 挂到那里会因为容器不可见而完全没有雨。
	// 征文区是页面底色、没有图层，所以要和「横幅模式 + 全屏档位」一样补第二层，否则雨只在上方图片区
	it("全屏壁纸模式：横幅 + 征文区两层", () => {
		assert.deepEqual(resolveRainyPlacements("fullscreen", prefs("off", "on")), [
			"banner",
			"viewport-fullscreen",
		]);
	});

	it("全屏壁纸模式：关掉雨 → 不挂载", () => {
		assert.deepEqual(
			resolveRainyPlacements("fullscreen", prefs("off", "off")),
			[],
		);
	});

	it("overlay 壁纸模式：挂在真正的全屏壁纸容器里", () => {
		assert.deepEqual(resolveRainyPlacements("overlay", prefs("off", "on")), [
			"overlay-wallpaper",
		]);
	});

	it("overlay 壁纸模式：关掉雨 → 不挂载", () => {
		assert.deepEqual(
			resolveRainyPlacements("overlay", prefs("off", "off")),
			[],
		);
	});

	it("无壁纸模式（含未知值）：没有可折射的背景，不挂载", () => {
		assert.deepEqual(
			resolveRainyPlacements("none", prefs("fullscreen", "on")),
			[],
		);
		assert.deepEqual(resolveRainyPlacements("", prefs("fullscreen", "on")), []);
	});
});
