<script lang="ts">
import Icon from "@iconify/svelte";

let {
	icon = "",
	label = "",
	enabled = false,
	onToggle,
}: {
	icon?: string;
	label?: string;
	enabled?: boolean;
	onToggle?: (() => void) | undefined;
} = $props();
</script>

<button
	class="setting-toggle w-full btn-regular rounded-lg py-2.5 px-3 flex items-center gap-3 text-left active:scale-[0.98] transition-all relative overflow-hidden"
	class:bg-[var(--btn-regular-bg-hover)]={enabled}
	onclick={onToggle}
>
	{#if icon}
		<Icon icon={icon} class="text-[1.125rem] shrink-0 opacity-80"></Icon>
	{/if}
	<span class="text-sm flex-1 font-medium">{label}</span>
	<div
		class="toggle-track w-10 h-[22px] rounded-full transition-all duration-200 relative shrink-0"
		class:bg-[var(--primary)]={enabled}
		class:bg-[var(--btn-regular-bg-active)]={!enabled}
	>
		<div
			class="toggle-thumb absolute top-[3px] w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200"
			class:left-[3px]={!enabled}
			class:left-[23px]={enabled}
		></div>
	</div>
</button>

<style>
	.toggle-track {
		min-width: 40px;
	}
</style>
