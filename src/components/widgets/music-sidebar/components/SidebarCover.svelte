<script lang="ts">
import CoverImage from "../../music-player/atoms/CoverImage.svelte";
import type { Song } from "../../music-player/types";

interface Props {
	currentSong: Song;
	isPlaying: boolean;
	isLoading: boolean;
}

const { currentSong, isPlaying, isLoading }: Props = $props();
</script>

<CoverImage
	cover={currentSong.cover}
	{isPlaying}
	{isLoading}
	size="expanded"
	interactive={false}
/>
