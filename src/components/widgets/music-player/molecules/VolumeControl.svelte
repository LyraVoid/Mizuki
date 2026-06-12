<script lang="ts">
import type { Snippet } from "svelte";
import type { Action } from "svelte/action";

import VolumeButton from "../atoms/VolumeButton.svelte";
import VolumeSlider from "../atoms/VolumeSlider.svelte";

interface Props {
	volume: number;
	isMuted: boolean;
	isVolumeDragging: boolean;
	volumeBarRef: Action<HTMLElement, undefined>;
	onVolumeButtonClick: () => void;
	onSliderPointerDown: (event: PointerEvent) => void;
	onSliderKeyDown: (event: KeyboardEvent) => void;
	ariaLabel: string;
	children?: Snippet;
}

const {
	volume,
	isMuted,
	isVolumeDragging,
	volumeBarRef,
	onVolumeButtonClick,
	onSliderPointerDown,
	onSliderKeyDown,
	ariaLabel,
	children,
}: Props = $props();
</script>

<div class="bottom-controls flex items-center gap-2">
	<VolumeButton {volume} {isMuted} onclick={onVolumeButtonClick} />
	<VolumeSlider
		volume={isMuted ? 0 : volume}
		{isVolumeDragging}
		{volumeBarRef}
		onpointerdown={onSliderPointerDown}
		onkeydown={onSliderKeyDown}
		{ariaLabel}
	/>
	{@render children?.()}
</div>
