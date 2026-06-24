<script lang="ts">
import Icon from "@iconify/svelte";
    import { Snippet } from "svelte";

let {
	title = "",
	isOpen = true,
	showReset = false,
	onreset,
	children
}: {
	title?: string;
	isOpen?: boolean;
	showReset?: boolean;
	onreset?: (() => void) | undefined;
	children: Snippet;
} = $props();

function toggleSection() {
	isOpen = !isOpen;
}

function handleReset() {
	if (onreset) onreset();
}
</script>

<div class="setting-section mb-1.5">
	<div class="group flex items-center gap-2 px-1 py-2">
		<button
			type="button"
			class="flex min-w-0 flex-1 items-center gap-2 text-left cursor-pointer"
			onclick={toggleSection}
		>
		<div
			class="chevron transition-transform duration-200 shrink-0"
			class:rotate-90={isOpen}
		>
			<Icon icon="material-symbols:chevron-right-rounded" class="text-[1rem] opacity-50"></Icon>
		</div>
		<span class="text-sm font-bold text-(--deep-text) dark:text-neutral-100 flex-1">{title}</span>
		</button>
		{#if showReset}
			<button
				type="button"
				class="btn-regular w-6 h-6 rounded-md active:scale-90 opacity-0 group-hover:opacity-70 hover:opacity-100! transition-opacity"
				onclick={handleReset}
				aria-label="Reset section"
			>
				<Icon icon="fa7-solid:arrow-rotate-left" class="text-[0.7rem] text-(--btn-content)"></Icon>
			</button>
		{/if}
	</div>
	<div
		class="section-content overflow-hidden transition-all duration-200"
		class:max-h-0={!isOpen}
		class:max-h-[500px]={isOpen}
		class:opacity-0={!isOpen}
		class:opacity-100={isOpen}
		style="padding-left: 0.25rem; padding-right: 0.25rem;"
	>
		<div class="space-y-1.5 pb-1">
			{@render children()}
		</div>
	</div>
</div>
