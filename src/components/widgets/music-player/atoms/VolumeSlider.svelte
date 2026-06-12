<script lang="ts">
import type { Action } from "svelte/action";

interface Props {
	volume: number;
	isVolumeDragging: boolean;
	volumeBarRef: Action<HTMLElement, undefined>;
	onpointerdown: (event: PointerEvent) => void;
	onkeydown: (event: KeyboardEvent) => void;
	ariaLabel: string;
}

const {
	volume,
	isVolumeDragging,
	volumeBarRef,
	onpointerdown,
	onkeydown,
	ariaLabel,
}: Props = $props();
</script>

<div
	class="flex-1 h-2 bg-[var(--btn-regular-bg)] rounded-full cursor-pointer touch-none"
	use:volumeBarRef
	{onpointerdown}
	{onkeydown}
	role="slider"
	tabindex="0"
	aria-label={ariaLabel}
	aria-valuemin="0"
	aria-valuemax="100"
	aria-valuenow={volume * 100}
>
	<div
		class="h-full bg-[var(--primary)] rounded-full transition-all"
		class:duration-100={!isVolumeDragging}
		class:duration-0={isVolumeDragging}
		style="width: {volume * 100}%"
	></div>
</div>
