<script lang="ts">
	import Key from "../../../../i18n/i18nKey";
	import { i18n } from "../../../../i18n/translation";
	import type { Song } from "../types";

	interface Props {
		song: Song;
		currentTime: number;
		duration: number;
		showTime?: boolean;
		size?: "mini" | "expanded";
	}

	const {
		song,
		currentTime,
		duration,
		showTime = false,
		size = "mini",
	}: Props = $props();

	function formatTime(seconds: number): string {
		if (!Number.isFinite(seconds) || seconds < 0) {
			return "0:00";
		}
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	}

	function getAssetPath(path: string): string {
		if (path.startsWith("http://") || path.startsWith("https://")) {
			return path;
		}
		if (path.startsWith("/")) {
			return path;
		}
		return `/${path}`;
	}
</script>

{#if size === "mini"}
	<div class="flex-1 min-w-0">
		<div class="text-sm font-medium text-90 truncate">{song.title}</div>
		<div class="text-xs text-50 truncate">{song.artist}</div>
	</div>
{:else}
	<div class="flex-1 min-w-0">
		<div class="song-title text-lg font-bold text-90 truncate mb-1">
			{song.title}
		</div>
		<div class="song-artist text-sm text-50 truncate">{song.artist}</div>
		{#if showTime}
			<div class="text-xs text-30 mt-1">
				{formatTime(currentTime)} / {formatTime(duration)}
			</div>
		{/if}
	</div>
{/if}
