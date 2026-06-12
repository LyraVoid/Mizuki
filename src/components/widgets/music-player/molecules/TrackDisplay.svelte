<script lang="ts">
import Icon from "@iconify/svelte";

import Key from "../../../../i18n/i18nKey";
import { i18n } from "../../../../i18n/translation";
import CoverImage from "../atoms/CoverImage.svelte";
import TrackInfo from "../atoms/TrackInfo.svelte";
import type { Song } from "../types";

interface Props {
	song: Song;
	currentTime: number;
	duration: number;
	isPlaying: boolean;
	isLoading: boolean;
	size?: "mini" | "expanded";
	showControls?: boolean;
	showPlaylist?: boolean;
	onCoverClick?: () => void;
	onInfoClick?: () => void;
	onHideClick?: () => void;
	onExpandClick?: () => void;
	onPlaylistClick?: () => void;
}

const {
	song,
	currentTime,
	duration,
	isPlaying,
	isLoading,
	size = "mini",
	showControls = false,
	showPlaylist = false,
	onCoverClick,
	onInfoClick,
	onHideClick,
	onExpandClick,
	onPlaylistClick,
}: Props = $props();
</script>

<div
	class={size === "mini"
		? "flex items-center gap-3 mb-0"
		: "flex items-center gap-4 mb-4"}
>
	{#if size === "mini"}
		<CoverImage
			cover={song.cover}
			{isPlaying}
			{isLoading}
			size="mini"
			interactive
			onclick={onCoverClick}
		/>
		<div
			class="flex-1 min-w-0 cursor-pointer"
			onclick={onInfoClick}
			onkeydown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onInfoClick?.();
				}
			}}
			role="button"
			tabindex="0"
			aria-label={i18n(Key.musicPlayerExpand)}
		>
			<TrackInfo {song} {currentTime} {duration} size="mini" />
		</div>
		<div class="flex items-center gap-1">
			<button
				class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"
				onclick={(e) => {
					e.stopPropagation();
					onHideClick?.();
				}}
				title={i18n(Key.musicPlayerHide)}
			>
				<Icon icon="material-symbols:visibility-off" class="text-lg" />
			</button>
			<button
				class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"
				onclick={(e) => {
					e.stopPropagation();
					onExpandClick?.();
				}}
			>
				<Icon icon="material-symbols:expand-less" class="text-lg" />
			</button>
		</div>
	{:else}
		<CoverImage
			cover={song.cover}
			{isPlaying}
			{isLoading}
			size="expanded"
		/>
		<TrackInfo {song} {currentTime} {duration} showTime size="expanded" />
		{#if showControls}
			<div class="flex items-center gap-1">
				<button
					class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"
					onclick={onHideClick}
					title={i18n(Key.musicPlayerHide)}
				>
					<Icon
						icon="material-symbols:visibility-off"
						class="text-lg"
					/>
				</button>
				<button
					class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"
					class:text-[var(--primary)]={showPlaylist}
					onclick={onPlaylistClick}
					title={i18n(Key.musicPlayerPlaylist)}
				>
					<Icon icon="material-symbols:queue-music" class="text-lg" />
				</button>
			</div>
		{/if}
	{/if}
</div>
