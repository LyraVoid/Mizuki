<script lang="ts">
import Icon from "@iconify/svelte";

import type { Song } from "../../music-player/types";

interface Props {
	song: Song;
	isCurrent: boolean;
	isPlaying: boolean;
	onclick: () => void;
}

const { song, isCurrent, isPlaying, onclick }: Props = $props();

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
	class="track-list-item"
	class:is-current={isCurrent}
	{onclick}
	onkeydown={(e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			onclick();
		}
	}}
	role="option"
	tabindex="0"
	aria-selected={isCurrent}
	aria-label={`播放 ${song.title} - ${song.artist}`}
>
	<div class="cover-shell">
		<img
			src={getAssetPath(song.cover)}
			alt={song.title}
			loading="lazy"
			class="item-cover"
		/>
	</div>
	<div class="content">
		<div class="item-title" class:active={isCurrent}>{song.title}</div>
		<div class="item-artist" class:active={isCurrent}>{song.artist}</div>
	</div>
	{#if isCurrent && isPlaying}
		<Icon
			icon="material-symbols:graphic-eq-rounded"
			class="now-playing"
			style="color: var(--primary);"
		/>
	{/if}
</div>

<style>
	.track-list-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem;
		border-radius: 0.75rem;
		cursor: pointer;
		transition:
			background-color 180ms ease,
			transform 180ms ease;
	}

	.track-list-item:hover {
		background: color-mix(
			in srgb,
			var(--btn-plain-bg-hover) 75%,
			transparent 25%
		);
	}

	.track-list-item.is-current {
		background: color-mix(
			in srgb,
			var(--btn-plain-bg) 80%,
			transparent 20%
		);
	}

	.cover-shell {
		position: relative;
		width: 2rem;
		height: 2rem;
		border-radius: 0.5rem;
		overflow: hidden;
		flex-shrink: 0;
		background: var(--btn-regular-bg);
	}

	.item-cover {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.content {
		flex: 1;
		min-width: 0;
	}

	.item-title {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--content-main);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		transition: color 180ms ease;
	}

	.track-list-item:hover .item-title,
	.item-title.active {
		color: var(--primary);
	}

	:global(.dark) .item-title {
		color: rgb(229 229 229);
	}

	.item-artist {
		font-size: 10px;
		color: var(--content-meta);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.item-artist.active,
	.item-title.active {
		color: var(--primary);
	}

	:global(.dark) .item-artist {
		color: rgb(163 163 163);
	}

	:global(.dark) .item-artist.active,
	:global(.dark) .item-title.active {
		color: var(--primary);
	}
</style>
