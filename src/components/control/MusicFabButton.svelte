<script lang="ts">
	import Icon from "@iconify/svelte";
	import { onDestroy, onMount } from "svelte";

	import type { MusicPlayerState } from "@/stores/musicPlayerStore";
	import { musicPlayerStore } from "@/stores/musicPlayerStore";

	let state: MusicPlayerState = musicPlayerStore.getState();
	let unsubscribe: (() => void) | undefined;

	function toggleControlCenter() {
		musicPlayerStore.toggleExpanded();
	}

	$: currentSongTitle = state.currentSong?.title || "音乐控制中心";
	$: ariaLabel = state.isExpanded
		? `收起音乐控制中心：${currentSongTitle}`
		: `打开音乐控制中心：${currentSongTitle}`;
	$: statusIcon = state.isLoading
		? "svg-spinners:90-ring-with-bg"
		: "material-symbols:music-note-rounded";

	onMount(() => {
		unsubscribe = musicPlayerStore.subscribe((nextState) => {
			state = nextState;
		});
	});

	onDestroy(() => {
		unsubscribe?.();
	});
</script>

<button
	type="button"
	class:active={state.isExpanded}
	class:playing={state.isPlaying}
	class:loading={state.isLoading}
	class="music-fab btn-card"
	aria-label={ariaLabel}
	title={ariaLabel}
	onclick={toggleControlCenter}
>
	<span class="music-fab__icon" aria-hidden="true">
		<Icon icon={statusIcon} />
	</span>

	{#if state.isPlaying}
		<span class="music-fab__dot" aria-hidden="true"></span>
	{/if}
</button>

<style>
	.music-fab {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: var(--fab-button-size, 3rem);
		height: var(--fab-button-size, 3rem);
		min-width: 0;
		min-height: 0;
		padding: 0.25rem;
		border: 1px solid rgba(148, 163, 184, 0.45);
		border-radius: 1rem;
		cursor: pointer;
		color: var(--primary);
		pointer-events: auto;
		transition:
			transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
			box-shadow 0.3s ease,
			background 0.3s ease;
	}

	.music-fab:hover {
		box-shadow: var(--shadow-button);
	}

	.music-fab:active {
		transform: scale(0.94);
	}

	.music-fab.active {
		background: var(--btn-card-bg-active);
	}

	.music-fab__icon {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		line-height: 1;
	}

	.music-fab__dot {
		position: absolute;
		right: 0.38rem;
		bottom: 0.38rem;
		z-index: 2;
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 999px;
		background: var(--primary);
		box-shadow: 0 0 0 2px var(--card-bg);
	}

	.music-fab.playing::after {
		content: "";
		position: absolute;
		inset: 0;
		border-radius: inherit;
		border: 1px solid color-mix(in srgb, var(--primary) 35%, transparent);
		animation: music-fab-pulse 1.8s ease-out infinite;
	}

	.music-fab.loading .music-fab__icon :global(svg) {
		font-size: 1.2rem;
	}

	:global(.dark) .music-fab {
		border: 1px solid rgba(255, 255, 255, 0.15);
	}

	:global(.dark) .music-fab:hover {
		box-shadow: var(--shadow-button-dark);
	}

	@keyframes music-fab-pulse {
		0% {
			opacity: 0;
			transform: scale(0.92);
		}
		30% {
			opacity: 0.75;
		}
		100% {
			opacity: 0;
			transform: scale(1.12);
		}
	}

	@media (max-width: 768px) {
		.music-fab {
			border-radius: 0.75rem;
		}

		.music-fab__icon {
			font-size: 1.4rem;
		}
	}

	@media (max-width: 480px) {
		.music-fab {
			border-radius: 0.5rem;
		}
	}
</style>
