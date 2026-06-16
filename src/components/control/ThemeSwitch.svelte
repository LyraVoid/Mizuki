<script lang="ts">
import { DARK_MODE, DEFAULT_THEME, LIGHT_MODE } from "@constants/constants";
import Icon from "@iconify/svelte";
import { getStoredTheme, setTheme } from "@utils/setting-utils";
import { onMount } from "svelte";

import type { LIGHT_DARK_MODE } from "@/types/config.ts";

const seq: LIGHT_DARK_MODE[] = [LIGHT_MODE, DARK_MODE];
let mode: LIGHT_DARK_MODE = $state(DEFAULT_THEME);
let isChanging = false;

onMount(() => {
	mode = getStoredTheme();

	// 监听 Swup 的内容替换事件，确保在页面切换后同步主题状态
	const handleContentReplace = () => {
		requestAnimationFrame(() => {
			const newMode = getStoredTheme();
			if (mode !== newMode) {
				mode = newMode;
			}
		});
	};

	let swupHooked = false;

	const setupSwupHook = () => {
		if (!swupHooked && window.swup?.hooks) {
			window.swup.hooks.on("content:replace", handleContentReplace);
			swupHooked = true;
		}
	};

	if (window.swup?.hooks) {
		setupSwupHook();
	} else {
		document.addEventListener("swup:enable", setupSwupHook, { once: true });
	}

	return () => {
		if (window.swup?.hooks && swupHooked) {
			window.swup.hooks.off("content:replace", handleContentReplace);
		}
		document.removeEventListener("swup:enable", setupSwupHook);
	};
});

function switchScheme(newMode: LIGHT_DARK_MODE) {
	// 防止连续快速点击
	if (isChanging) {
		return;
	}

	isChanging = true;
	mode = newMode;
	setTheme(newMode);

	// 50ms 后重置状态，防止过快切换
	setTimeout(() => {
		isChanging = false;
	}, 50);
}

function toggleScheme() {
	if (isChanging) {
		return;
	}

	let i = 0;
	for (; i < seq.length; i++) {
		if (seq[i] === mode) {
			break;
		}
	}
	switchScheme(seq[(i + 1) % seq.length]);
}
</script>

<button
	aria-label="Light/Dark Mode"
	class="relative btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90 theme-switch-btn z-50"
	id="scheme-switch"
	onclick={toggleScheme}
	data-mode={mode}
>
	<div
		class="absolute transition-all duration-300 ease-in-out"
		class:opacity-0={mode !== LIGHT_MODE}
		class:rotate-180={mode !== LIGHT_MODE}
	>
		<Icon
			icon="material-symbols:wb-sunny-outline-rounded"
			class="text-[1.25rem]"
		></Icon>
	</div>
	<div
		class="absolute transition-all duration-300 ease-in-out"
		class:opacity-0={mode !== DARK_MODE}
		class:rotate-180={mode !== DARK_MODE}
	>
		<Icon
			icon="material-symbols:dark-mode-outline-rounded"
			class="text-[1.25rem]"
		></Icon>
	</div>
</button>

<style>
	/* 确保主题切换按钮的背景色即时更新 */
	.theme-switch-btn::before {
		transition:
			transform 75ms ease-out,
			background-color 0ms !important;
	}
</style>
