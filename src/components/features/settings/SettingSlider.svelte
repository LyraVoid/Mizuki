<script lang="ts">
let {
	label = "",
	displayValue = "",
	min = 0,
	max = 100,
	step = 1,
	value = 50,
	oninput,
}: {
	label?: string;
	displayValue?: string;
	min?: number;
	max?: number;
	step?: number;
	value?: number;
	oninput?: ((e: Event) => void) | undefined;
} = $props();

let sliderId = `slider-${Math.random().toString(36).slice(2, 9)}`;

function updateProgress(input: HTMLInputElement) {
	const minVal = Number(input.min || 0);
	const maxVal = Number(input.max || 100);
	const val = Number(input.value || 0);
	const progress = ((val - minVal) * 100) / (maxVal - minVal || 1);
	input.style.setProperty(
		"--range-progress",
		`${Math.min(100, Math.max(0, progress))}%`,
	);
}

function handleInput(e: Event) {
	const input = e.currentTarget as HTMLInputElement;
	updateProgress(input);
	if (oninput) oninput(e);
}
</script>

<div class="rounded-lg bg-[var(--btn-regular-bg)] p-2.5 transition-colors">
	<div class="flex items-center justify-between mb-1.5">
		<span class="text-sm font-medium text-[var(--btn-content)] opacity-85">{label}</span>
		<span class="text-xs text-[var(--btn-content)] font-mono">{displayValue}</span>
	</div>
	<input
		id={sliderId}
		type="range"
		{min}
		{max}
		{step}
		bind:value
		oninput={handleInput}
		class="slider w-full range-slider"
	/>
</div>

<style lang="stylus">
	.slider
		-webkit-appearance none
		height 0.85rem
		border-radius 999px
		cursor pointer
		outline none

	.range-slider
		background-image unquote("linear-gradient(90deg, var(--primary) 0 var(--range-progress, 50%), var(--btn-regular-bg-active) var(--range-progress, 50%) 100%)")
		transition background-image 0.1s ease

	:global(.slider::-webkit-slider-thumb)
		-webkit-appearance none
		height 0.875rem
		width 0.875rem
		border-radius 50%
		background white
		box-shadow 0 1px 4px rgba(0, 0, 0, 0.2), 0 0 0 2px var(--primary)
		cursor pointer
		transition transform 0.15s ease

		&:hover
			transform scale(1.15)

		&:active
			transform scale(1.05)

	:global(.slider::-moz-range-thumb)
		height 0.875rem
		width 0.875rem
		border-radius 50%
		background white
		box-shadow 0 1px 4px rgba(0, 0, 0, 0.2), 0 0 0 2px var(--primary)
		cursor pointer
		border none
</style>
