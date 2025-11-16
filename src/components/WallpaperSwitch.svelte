<script lang="ts">
import { WALLPAPER_FULLSCREEN, WALLPAPER_BANNER, WALLPAPER_NONE } from "@constants/constants.ts";
import Icon from "@iconify/svelte";
import {
    getStoredWallpaperMode,
    setWallpaperMode,
} from "@utils/setting-utils.ts";
import type { WALLPAPER_MODE } from "@/types/config.ts";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { panelManager } from "../utils/panel-manager.js";

const seq: WALLPAPER_MODE[] = [WALLPAPER_BANNER, WALLPAPER_FULLSCREEN, WALLPAPER_NONE];
let mode: WALLPAPER_MODE = $state(getStoredWallpaperMode());

function switchWallpaperMode(newMode: WALLPAPER_MODE) {
	mode = newMode;
	setWallpaperMode(newMode);
}

function toggleWallpaperMode() {
	let i = 0;
	for (; i < seq.length; i++) {
		if (seq[i] === mode) {
			break;
		}
	}
	switchWallpaperMode(seq[(i + 1) % seq.length]);
}

async function togglePanel() {
	// 关闭其他面板,但保留壁纸面板本身
	await panelManager.closeAllPanelsExcept('wallpaper-mode-panel');
	await panelManager.togglePanel('wallpaper-mode-panel');
}
</script>

<style>
.current-theme-btn {
	background-color: var(--primary);
	color: white;
}

/* 确保主题切换按钮的背景色即时更新 */
:global(.theme-switch-btn)::before {
	transition: transform 75ms ease-out, background-color 0ms !important;
}
</style>

<!-- z-50 make the panel higher than other float panels -->
<div class="relative z-50" role="menu" tabindex="-1">
    <button aria-label="Wallpaper Mode" role="menuitem" class="relative btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90 theme-switch-btn" id="wallpaper-mode-switch" onclick={togglePanel}>
        <div class="absolute" class:opacity-0={mode !== WALLPAPER_BANNER}>
            <Icon icon="material-symbols:image-outline" class="text-[1.25rem]"></Icon>
        </div>
        <div class="absolute" class:opacity-0={mode !== WALLPAPER_FULLSCREEN}>
            <Icon icon="material-symbols:wallpaper" class="text-[1.25rem]"></Icon>
        </div>
        <div class="absolute" class:opacity-0={mode !== WALLPAPER_NONE}>
            <Icon icon="material-symbols:hide-image-outline" class="text-[1.25rem]"></Icon>
        </div>
    </button>
    <div id="wallpaper-mode-panel" class="hidden lg:block absolute transition float-panel-closed top-11 -right-2 pt-5" >
        <div class="card-base float-panel p-2">
            <button class="flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 mb-0.5 theme-switch-btn"
                    class:current-theme-btn={mode === WALLPAPER_BANNER}
                    onclick={() => switchWallpaperMode(WALLPAPER_BANNER)}
            >
                <Icon icon="material-symbols:image-outline" class="text-[1.25rem] mr-3"></Icon>
                {i18n(I18nKey.wallpaperBanner)}
            </button>
            <button class="flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 mb-0.5 theme-switch-btn"
                    class:current-theme-btn={mode === WALLPAPER_FULLSCREEN}
                    onclick={() => switchWallpaperMode(WALLPAPER_FULLSCREEN)}
            >
                <Icon icon="material-symbols:wallpaper" class="text-[1.25rem] mr-3"></Icon>
                {i18n(I18nKey.wallpaperFullscreen)}
            </button>
            <button class="flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 theme-switch-btn"
                    class:current-theme-btn={mode === WALLPAPER_NONE}
                    onclick={() => switchWallpaperMode(WALLPAPER_NONE)}
            >
                <Icon icon="material-symbols:hide-image-outline" class="text-[1.25rem] mr-3"></Icon>
                {i18n(I18nKey.wallpaperNone)}
            </button>
        </div>
    </div>
</div>
