<script lang="ts">
import Key from "../../../../i18n/i18nKey";
import { i18n } from "../../../../i18n/translation";

interface Props {
	currentTime: number;
	duration: number;
	onclick: (event: MouseEvent) => void;
	onkeydown: (event: KeyboardEvent) => void;
}

const { currentTime, duration, onclick, onkeydown }: Props = $props();
</script>

<div
	class="progress-bar flex-1 h-2 bg-(--btn-regular-bg) rounded-full cursor-pointer"
	{onclick}
	{onkeydown}
	role="slider"
	tabindex="0"
	aria-label={i18n(Key.musicPlayerProgress)}
	aria-valuemin="0"
	aria-valuemax="100"
	aria-valuenow={duration > 0 ? (currentTime / duration) * 100 : 0}
>
	<div
		class="h-full bg-(--primary) rounded-full transition-all duration-100"
		style="width: {duration > 0 ? (currentTime / duration) * 100 : 0}%"
	></div>
</div>
