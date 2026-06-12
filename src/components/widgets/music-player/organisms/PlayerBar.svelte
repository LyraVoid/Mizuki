<script lang="ts">
import Icon from "@iconify/svelte";
import type { Action } from "svelte/action";

import Key from "../../../../i18n/i18nKey";
import { i18n } from "../../../../i18n/translation";
import PlayerControls from "../molecules/PlayerControls.svelte";
import ProgressControl from "../molecules/ProgressControl.svelte";
import TrackDisplay from "../molecules/TrackDisplay.svelte";
import VolumeControl from "../molecules/VolumeControl.svelte";
import type { RepeatMode, Song } from "../types";

interface Props {
	song: Song;
	currentTime: number;
	duration: number;
	isPlaying: boolean;
	isLoading: boolean;
	isShuffled: boolean;
	isRepeating: RepeatMode;
	showPlaylist: boolean;
	canSkip: boolean;
	volume: number;
	isMuted: boolean;
	isVolumeDragging: boolean;
	isHidden: boolean;
	volumeBarRef: Action<HTMLElement, undefined>;
	onPlayClick: () => void;
	onPrevClick: () => void;
	onNextClick: () => void;
	onShuffleClick: () => void;
	onRepeatClick: () => void;
	onProgressClick: (event: MouseEvent) => void;
	onProgressKeyDown: (event: KeyboardEvent) => void;
	onVolumeButtonClick: () => void;
	onSliderPointerDown: (event: PointerEvent) => void;
	onSliderKeyDown: (event: KeyboardEvent) => void;
	onHideClick: () => void;
	onPlaylistClick: () => void;
	onCollapseClick: () => void;
}

const {
	song,
	currentTime,
	duration,
	isPlaying,
	isLoading,
	isShuffled,
	isRepeating,
	showPlaylist,
	canSkip,
	volume,
	isMuted,
	isVolumeDragging,
	isHidden,
	volumeBarRef,
	onPlayClick,
	onPrevClick,
	onNextClick,
	onShuffleClick,
	onRepeatClick,
	onProgressClick,
	onProgressKeyDown,
	onVolumeButtonClick,
	onSliderPointerDown,
	onSliderKeyDown,
	onHideClick,
	onPlaylistClick,
	onCollapseClick,
}: Props = $props();
</script>

<div
	class="expanded-player card-base shadow-xl rounded-2xl p-4 transition-all duration-500 ease-in-out absolute bottom-0 right-0 w-80"
	class:opacity-0={isHidden}
	class:scale-95={isHidden}
	class:pointer-events-none={isHidden}
>
	<TrackDisplay
		{song}
		{currentTime}
		{duration}
		{isPlaying}
		{isLoading}
		size="expanded"
		showControls
		{showPlaylist}
		{onHideClick}
		{onPlaylistClick}
	/>
	<ProgressControl
		{currentTime}
		{duration}
		{onProgressClick}
		{onProgressKeyDown}
	/>
	<PlayerControls
		{isPlaying}
		{isLoading}
		{isShuffled}
		{isRepeating}
		{canSkip}
		{onPlayClick}
		{onPrevClick}
		{onNextClick}
		{onShuffleClick}
		{onRepeatClick}
	/>
	<VolumeControl
		{volume}
		{isMuted}
		{isVolumeDragging}
		{volumeBarRef}
		{onVolumeButtonClick}
		{onSliderPointerDown}
		{onSliderKeyDown}
		ariaLabel={i18n(Key.musicPlayerVolume)}
	>
		<button
			class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"
			onclick={onCollapseClick}
			title={i18n(Key.musicPlayerCollapse)}
		>
			<Icon icon="material-symbols:expand-more" class="text-lg" />
		</button>
	</VolumeControl>
</div>
