<script lang="ts">
import ProgressBar from "../atoms/ProgressBar.svelte";

interface Props {
	currentTime: number;
	duration: number;
	onProgressClick: (event: MouseEvent) => void;
	onProgressKeyDown: (event: KeyboardEvent) => void;
}

const { currentTime, duration, onProgressClick, onProgressKeyDown }: Props =
	$props();
</script>

<div class="progress-section mb-4">
	<ProgressBar
		{currentTime}
		{duration}
		onclick={onProgressClick}
		onkeydown={onProgressKeyDown}
	/>
</div>
