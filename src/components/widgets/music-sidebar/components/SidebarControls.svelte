<script lang="ts">
import Icon from "@iconify/svelte";

import NextButton from "../../music-player/atoms/NextButton.svelte";
import PlayButton from "../../music-player/atoms/PlayButton.svelte";
import PrevButton from "../../music-player/atoms/PrevButton.svelte";

interface Props {
	isPlaying: boolean;
	isShuffled: boolean;
	repeatMode: number;
	onToggleMode?: () => void;
	onPrev: () => void;
	onNext: () => void;
	onTogglePlay: () => void;
	onTogglePlaylist: () => void;
}

const {
	isPlaying,
	isShuffled,
	repeatMode,
	onToggleMode,
	onPrev,
	onNext,
	onTogglePlay,
	onTogglePlaylist,
}: Props = $props();

const repeatIcon = $derived(
	isShuffled
		? "material-symbols:shuffle-rounded"
		: repeatMode === 1
			? "material-symbols:repeat-one-rounded"
			: "material-symbols:repeat-rounded",
);

const modeActive = $derived(isShuffled || repeatMode > 0);
</script>

<div class="controls-row">
	<button
		class="icon-btn mode-btn"
		class:active-mode={modeActive}
		onclick={() => onToggleMode?.()}
		aria-label="Repeat mode"
	>
		<Icon icon={repeatIcon} class="text-xl" />
	</button>
	<PrevButton onclick={onPrev} disabled={false} />
	<PlayButton {isPlaying} isLoading={false} onclick={onTogglePlay} />
	<NextButton onclick={onNext} disabled={false} />
	<button
		class="icon-btn list-btn"
		onclick={onTogglePlaylist}
		aria-label="Playlist"
	>
		<Icon icon="material-symbols:queue-music-rounded" />
	</button>
</div>

<style>
	.controls-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.25rem;
		margin-top: 0.75rem;
		padding-inline: 0.125rem;
		flex-wrap: nowrap;
	}

	.icon-btn {
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--content-main);
		transition:
			color 150ms ease,
			transform 150ms ease;
		flex: 0 0 auto;
	}

	.icon-btn:hover {
		color: var(--primary);
	}

	.icon-btn:active {
		transform: scale(0.96);
	}

	.mode-btn,
	.list-btn {
		color: var(--content-meta);
	}

	.active-mode {
		color: var(--primary);
	}

	.controls-row :global(button) {
		flex-shrink: 0;
	}

	@media (width < 520px) {
		.controls-row {
			gap: 0.15rem;
			padding-inline: 0;
		}

		.controls-row :global(.btn-plain) {
			width: 2.25rem;
			height: 2.25rem;
			padding: 0;
			border-radius: 0.6rem;
			flex: 0 0 2.25rem;
		}

		.controls-row :global(.btn-regular) {
			width: 2.75rem;
			height: 2.75rem;
			flex: 0 0 2.75rem;
		}

		.icon-btn {
			width: 1.9rem;
			height: 1.9rem;
			flex: 0 0 1.9rem;
		}
	}
</style>
