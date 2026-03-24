<script lang="ts">
	import Icon from "@iconify/svelte";

	import Key from "../../../../i18n/i18nKey";
	import { i18n } from "../../../../i18n/translation";

	interface Props {
		cover: string;
		isPlaying: boolean;
		isLoading: boolean;
		size?: "mini" | "expanded" | "orb";
		onclick?: () => void;
		interactive?: boolean;
	}

	const {
		cover,
		isPlaying,
		isLoading,
		size = "mini",
		onclick,
		interactive = false,
	}: Props = $props();

	function getAssetPath(path: string): string {
		if (path.startsWith("http://") || path.startsWith("https://")) {
			return path;
		}
		if (path.startsWith("/")) {
			return path;
		}
		return `/${path}`;
	}

	const containerClasses = {
		mini: "cover-container relative w-12 h-12 rounded-full overflow-hidden",
		expanded:
			"cover-container relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0",
	};
</script>

{#if size === "orb"}
	<div
		class="orb-player w-12 h-12 bg-[var(--primary)] rounded-full shadow-lg cursor-pointer transition-all duration-500 ease-in-out flex items-center justify-center hover:scale-110 active:scale-95"
		{onclick}
		onkeydown={(e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onclick?.();
			}
		}}
		role="button"
		tabindex="0"
		aria-label={i18n(Key.musicPlayerShow)}
	>
		{#if isLoading}
			<Icon icon="eos-icons:loading" class="text-white text-lg" />
		{:else if isPlaying}
			<div class="flex space-x-0.5">
				<div
					class="w-0.5 h-3 bg-white rounded-full animate-pulse"
				></div>
				<div
					class="w-0.5 h-4 bg-white rounded-full animate-pulse"
					style="animation-delay: 150ms;"
				></div>
				<div
					class="w-0.5 h-2 bg-white rounded-full animate-pulse"
					style="animation-delay: 300ms;"
				></div>
			</div>
		{:else}
			<Icon
				icon="material-symbols:music-note"
				class="text-white text-lg"
			/>
		{/if}
	</div>
{:else if interactive}
	<div
		class={`${containerClasses[size]} cursor-pointer`}
		{onclick}
		onkeydown={(e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onclick?.();
			}
		}}
		role="button"
		tabindex="0"
		aria-label={isPlaying
			? i18n(Key.musicPlayerPause)
			: i18n(Key.musicPlayerPlay)}
	>
		<img
			src={getAssetPath(cover)}
			alt={i18n(Key.musicPlayerCover)}
			class="w-full h-full object-cover transition-transform duration-300"
			class:spinning={isPlaying && !isLoading}
			class:animate-pulse={isLoading}
		/>
		<div
			class="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
		>
			{#if isLoading}
				<Icon icon="eos-icons:loading" class="text-white text-xl" />
			{:else if isPlaying}
				<Icon
					icon="material-symbols:pause"
					class="text-white text-xl"
				/>
			{:else}
				<Icon
					icon="material-symbols:play-arrow"
					class="text-white text-xl"
				/>
			{/if}
		</div>
	</div>
{:else}
	<div class={containerClasses[size]}>
		<img
			src={getAssetPath(cover)}
			alt={i18n(Key.musicPlayerCover)}
			class="w-full h-full object-cover transition-transform duration-300"
			class:spinning={isPlaying && !isLoading}
			class:animate-pulse={isLoading}
		/>
	</div>
{/if}

<style>
	.cover-container img {
		animation: spin-continuous 3s linear infinite;
		animation-play-state: paused;
		transform-origin: center;
	}

	.cover-container img.spinning {
		animation-play-state: running;
	}

	@keyframes spin-continuous {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
