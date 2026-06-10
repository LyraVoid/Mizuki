<script lang="ts">
import { onDestroy, onMount } from "svelte";

import type { MusicPlayerState } from "@/stores/musicPlayerStore";
import { musicPlayerStore } from "@/stores/musicPlayerStore";

import SidebarControls from "./components/SidebarControls.svelte";
import SidebarCover from "./components/SidebarCover.svelte";
import SidebarPlaylist from "./components/SidebarPlaylist.svelte";
import SidebarProgress from "./components/SidebarProgress.svelte";
import SidebarTrackInfo from "./components/SidebarTrackInfo.svelte";

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

<div class="music-sidebar-widget">
	<div class="flex items-center gap-3 mb-2.5">
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
	@media (max-width: 520px) {
		.music-sidebar-widget {
			min-width: 0;
		}

		.music-sidebar-widget > :global(div:first-child) {
			gap: 0.75rem;
			margin-bottom: 0.5rem;
		}
	}
</style>
