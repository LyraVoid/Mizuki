<script lang="ts">
	import Icon from "@iconify/svelte";

	import type { Song } from "../../music-player/types";

	interface Props {
		currentSong: Song;
		currentTime: number;
		duration: number;
		volume: number;
		isMuted: boolean;
		onToggleMute: () => void;
		onSetVolume: (volume: number) => void;
	}

	const {
		currentSong,
		currentTime,
		duration,
		volume,
		isMuted,
		onToggleMute,
		onSetVolume,
	}: Props = $props();

	const currentTimeLabel = $derived(
		`${Math.floor(currentTime / 60)}:${String(Math.floor(currentTime % 60)).padStart(2, "0")}`,
	);

	const durationLabel = $derived(
		`${Math.floor(duration / 60)}:${String(Math.floor(duration % 60)).padStart(2, "0")}`,
	);

	const volumePercent = $derived(
		isMuted ? 0 : Math.max(0, Math.min(100, volume * 100)),
	);

	let isVolumeDragging = false;

	function handleVolumePointer(event: PointerEvent) {
		const el = event.currentTarget as HTMLElement | null;
		if (!el) {
			return;
		}
		isVolumeDragging = true;
		const rect = el.getBoundingClientRect();
		const percent = (event.clientX - rect.left) / rect.width;
		const nextVolume = Math.max(0, Math.min(1, percent));
		onSetVolume(nextVolume);
		el.setPointerCapture(event.pointerId);
	}

	function handleVolumeMove(event: PointerEvent) {
		if (!isVolumeDragging) {
			return;
		}
		handleVolumePointer(event);
	}

	function handleVolumeEnd() {
		isVolumeDragging = false;
	}

	function handleVolumeKeyDown(event: KeyboardEvent) {
		if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
			event.preventDefault();
			onSetVolume(Math.max(0, volume - 0.05));
		} else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
			event.preventDefault();
			onSetVolume(Math.min(1, volume + 0.05));
		} else if (event.key === "Enter") {
			event.preventDefault();
			onToggleMute();
		}
	}
</script>

<div class="flex flex-col min-w-0 flex-1 overflow-hidden">
	<div class="title-row">
		<span class="title-text truncate">{currentSong.title}</span>
	</div>
	<div class="artist-row">
		<span class="artist-text truncate">{currentSong.artist}</span>
	</div>
	<div class="meta-row">
		<div class="time-label" aria-live="polite">
			<span>{currentTimeLabel}</span>
			<span class="divider">/</span>
			<span>{durationLabel}</span>
		</div>

		<div class="volume-wrap">
			<button
				type="button"
				class="volume-btn"
				onclick={onToggleMute}
				aria-label="Toggle volume"
			>
				<Icon
					icon={isMuted || volume === 0
						? "material-symbols:volume-off-rounded"
						: "material-symbols:volume-up-rounded"}
					class="text-base"
				/>
			</button>

			<div
				class="volume-slider"
				onpointerdown={handleVolumePointer}
				onpointermove={handleVolumeMove}
				onpointerup={handleVolumeEnd}
				onpointercancel={handleVolumeEnd}
				onkeydown={handleVolumeKeyDown}
				role="slider"
				tabindex="0"
				aria-label="Volume"
				aria-valuemin="0"
				aria-valuemax="100"
				aria-valuenow={volumePercent}
			>
				<div
					class="volume-fill"
					style={`width: ${volumePercent}%`}
				></div>
			</div>
		</div>
	</div>
</div>

<style>
	.title-row {
		margin-bottom: 0.06rem;
	}

	.title-text {
		font-weight: 600;
		color: var(--content-main);
		line-height: 1.1;
	}

	:global(.dark) .title-text {
		color: rgb(245 245 245);
	}

	.artist-text {
		font-size: 0.75rem;
		color: var(--content-meta);
		display: block;
	}

	.artist-row {
		margin-bottom: 0.36rem;
	}

	.meta-row {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		min-width: 0;
		justify-content: space-between;
	}

	.time-label {
		display: flex;
		align-items: center;
		gap: 0.2rem;
		font-size: 0.75rem;
		font-family: inherit;
		color: var(--content-meta);
		white-space: nowrap;
		flex-shrink: 0;
	}

	.divider {
		opacity: 0.6;
	}

	.volume-wrap {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		min-width: 0;
		justify-content: flex-end;
		margin-left: auto;
	}

	.volume-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 0.375rem;
		color: var(--content-meta);
		transition: color 150ms ease;
	}

	.volume-btn:hover {
		color: var(--primary);
	}

	.volume-slider {
		position: relative;
		width: 4rem;
		height: 0.25rem;
		border-radius: 9999px;
		background: color-mix(
			in srgb,
			var(--btn-regular-bg) 80%,
			var(--content-meta) 20%
		);
		overflow: hidden;
		cursor: pointer;
		flex-shrink: 0;
		transition: height 150ms ease;
	}

	.volume-slider:hover,
	.volume-slider:focus-visible {
		height: 0.375rem;
	}

	.volume-fill {
		height: 100%;
		background: var(--primary);
		border-radius: inherit;
		transition: width 100ms linear;
	}

	.volume-slider:focus-visible {
		outline: 2px solid var(--primary);
		outline-offset: 2px;
	}

	@media (max-width: 520px) {
		.artist-row {
			margin-bottom: 0.28rem;
		}

		.meta-row {
			gap: 0.4rem;
		}

		.time-label {
			font-size: 0.625rem;
		}

		.volume-wrap {
			gap: 0.25rem;
		}

		.volume-btn {
			width: 1.25rem;
			height: 1.25rem;
		}

		.volume-slider {
			width: 3.2rem;
		}
	}
</style>
