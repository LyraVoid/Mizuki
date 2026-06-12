<script lang="ts">
import AccordionDrawer from "../../common/AccordionDrawer.svelte";
import type { Song } from "../../music-player/types";
import TrackListItem from "./TrackListItem.svelte";

interface Props {
	playlist: Song[];
	currentIndex: number;
	isPlaying: boolean;
	show: boolean;
	onClose: () => void;
	onPlaySong: (index: number) => void;
}

const { playlist, currentIndex, isPlaying, show, onClose, onPlaySong }: Props =
	$props();
</script>

<AccordionDrawer {show} class="playlist-drawer">
	<div class="playlist-shell">
		<div
			class="playlist-content"
			role="listbox"
			aria-label="Playlist"
			aria-multiselectable="false"
		>
			{#each playlist as song, index}
				<TrackListItem
					{song}
					isCurrent={index === currentIndex}
					{isPlaying}
					onclick={() => onPlaySong(index)}
				/>
			{/each}
		</div>
	</div>
</AccordionDrawer>

<style>
	:global(.playlist-drawer) {
		margin-top: 0;
	}

	.playlist-shell {
		margin-top: 0.5rem;
		padding-top: 0.5rem;
		border-top: 1px solid
			color-mix(in srgb, var(--content-meta) 12%, transparent 88%);
	}

	.playlist-content {
		overflow-y: auto;
		max-height: 12rem;
		padding-right: 0.25rem;
		padding-bottom: 0.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.playlist-content::-webkit-scrollbar {
		display: none;
	}
</style>
