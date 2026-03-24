<script lang="ts">
	import Icon from "@iconify/svelte";

	import type { Song } from "../types";

	interface Props {
		song: Song;
		index: number;
		isCurrent: boolean;
		isPlaying: boolean;
		onclick: () => void;
	}

	const { song, index, isCurrent, isPlaying, onclick }: Props = $props();

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

<div
	class="playlist-item flex items-center gap-3 p-3 hover:bg-[var(--btn-plain-bg-hover)] cursor-pointer transition-colors"
	class:bg-[var(--btn-plain-bg)]={isCurrent}
	class:text-[var(--primary)]={isCurrent}
	{onclick}
	onkeydown={(e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			onclick();
		}
	}}
	role="button"
	tabindex="0"
	aria-label="播放 {song.title} - {song.artist}"
>
	<div class="w-6 h-6 flex items-center justify-center">
		{#if isCurrent && isPlaying}
			<Icon
				icon="material-symbols:graphic-eq"
				class="text-[var(--primary)] animate-pulse"
			/>
		{:else if isCurrent}
			<Icon icon="material-symbols:pause" class="text-[var(--primary)]" />
		{:else}
			<span class="text-sm text-[var(--content-meta)]">{index + 1}</span>
		{/if}
	</div>
	<div
		class="w-10 h-10 rounded-lg overflow-hidden bg-[var(--btn-regular-bg)] flex-shrink-0"
	>
		<img
			src={getAssetPath(song.cover)}
			alt={song.title}
			loading="lazy"
			class="w-full h-full object-cover"
		/>
	</div>
	<div class="flex-1 min-w-0">
		<div
			class="font-medium truncate"
			class:text-[var(--primary)]={isCurrent}
			class:text-90={!isCurrent}
		>
			{song.title}
		</div>
		<div
			class="text-sm text-[var(--content-meta)] truncate"
			class:text-[var(--primary)]={isCurrent}
		>
			{song.artist}
		</div>
	</div>
</div>
