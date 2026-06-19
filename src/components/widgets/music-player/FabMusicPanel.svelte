<script lang="ts">
import { onDestroy, onMount } from "svelte";

import type { MusicPlayerState } from "@/stores/musicPlayerStore";
import { musicPlayerStore } from "@/stores/musicPlayerStore";

import SidebarControls from "../music-sidebar/components/SidebarControls.svelte";
import SidebarCover from "../music-sidebar/components/SidebarCover.svelte";
import SidebarPlaylist from "../music-sidebar/components/SidebarPlaylist.svelte";
import SidebarProgress from "../music-sidebar/components/SidebarProgress.svelte";
import SidebarTrackInfo from "../music-sidebar/components/SidebarTrackInfo.svelte";

let playerState: MusicPlayerState = $state(musicPlayerStore.getState());
let showPlaylist = $state(false);

function handleStateUpdate(event: Event) {
	const custom = event as CustomEvent<MusicPlayerState>;
	if (custom.detail) {
		playerState = custom.detail;
	}
}

onMount(() => {
	window.addEventListener("music-sidebar:state", handleStateUpdate);
});

onDestroy(() => {
	if (typeof window !== "undefined") {
		window.removeEventListener("music-sidebar:state", handleStateUpdate);
	}
});

function togglePlay() {
	musicPlayerStore.toggle();
}

function prev() {
	musicPlayerStore.prev();
}

function next() {
	musicPlayerStore.next();
}

function toggleMode() {
	musicPlayerStore.toggleMode();
}

function togglePlaylistView() {
	showPlaylist = !showPlaylist;
}

function playIndex(index: number) {
	musicPlayerStore.playIndex(index);
}

function seek(time: number) {
	musicPlayerStore.seek(time);
}

function toggleMute() {
	musicPlayerStore.toggleMute();
}

function setVolume(volume: number) {
	musicPlayerStore.setVolume(volume);
}
</script>

<div
	class="fab-music-panel card-base shadow-xl rounded-2xl p-4 w-[20rem] max-w-[80vw]"
>
	<div class="fab-music-header">
		<SidebarCover
			currentSong={playerState.currentSong}
			isPlaying={playerState.isPlaying}
			isLoading={playerState.isLoading}
		/>
		<SidebarTrackInfo
			currentSong={playerState.currentSong}
			currentTime={playerState.currentTime}
			duration={playerState.duration}
			volume={playerState.volume}
			isMuted={playerState.isMuted}
			onToggleMute={toggleMute}
			onSetVolume={setVolume}
		/>
	</div>

	<SidebarProgress
		currentTime={playerState.currentTime}
		duration={playerState.duration}
		onSeek={seek}
	/>

	<SidebarControls
		isPlaying={playerState.isPlaying}
		isShuffled={playerState.isShuffled}
		repeatMode={playerState.isRepeating}
		onToggleMode={toggleMode}
		onPrev={prev}
		onNext={next}
		onTogglePlay={togglePlay}
		onTogglePlaylist={togglePlaylistView}
	/>

	<SidebarPlaylist
		playlist={playerState.playlist}
		currentIndex={playerState.currentIndex}
		isPlaying={playerState.isPlaying}
		show={showPlaylist}
		onClose={togglePlaylistView}
		onPlaySong={playIndex}
	/>
</div>

<style>
	.fab-music-panel {
		border-radius: 1.25rem;
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid color-mix(in srgb, var(--line-color) 65%, transparent);
		box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08);
	}

	:global(.dark) .fab-music-panel {
		box-shadow: 0 18px 50px rgba(0, 0, 0, 0.5);
	}

	.fab-music-header {
		display: flex;
		align-items: center;
		gap: 0.8rem;
		margin-bottom: 0.75rem;
	}

	@media (width < 640px) {
		.fab-music-panel {
			padding: 0.9rem 0.85rem 0.9rem 0.9rem;
			border-radius: 1rem;
		}
	}
</style>
