<script lang="ts">
	import { onMount } from "svelte";

	import type { CalendarStats } from "../types/calendar";

	interface Props {
		currentYear: number;
		stats: CalendarStats;
		onYearSelect: (year: number) => void;
	}

	const { currentYear, stats, onYearSelect }: Props = $props();

	let containerEl: HTMLDivElement;

	const years = $derived(() => {
		const result: number[] = [];
		for (let y = stats.minYear; y <= stats.maxYear; y++) {
			result.push(y);
		}
		return result;
	});

	function getYearClass(year: number): string {
		const isCurrent = year === currentYear;
		let baseClass =
			"cursor-pointer rounded-lg flex flex-col items-center justify-center py-3 transition-all hover:bg-[var(--btn-plain-bg-hover)] relative border border-transparent";

		if (isCurrent) {
			baseClass +=
				" border-[var(--primary)] text-[var(--primary)] bg-[var(--primary)]/5";
		} else {
			baseClass += " text-neutral-700 dark:text-neutral-300";
		}

		return baseClass;
	}

	function scrollToCurrentYear() {
		setTimeout(() => {
			const el = containerEl?.querySelector(
				`[data-year="${currentYear}"]`,
			);
			if (el) {
				el.scrollIntoView({ block: "center", behavior: "smooth" });
			}
		}, 50);
	}

	onMount(() => {
		scrollToCurrentYear();
	});
</script>

<div
	bind:this={containerEl}
	class="w-full h-full p-2 grid grid-cols-4 gap-2 content-start overflow-y-auto custom-scrollbar"
>
	{#each years() as year (year)}
		{@const hasPost = stats.hasPostInYear[year]}
		<button
			type="button"
			class={getYearClass(year)}
			data-year={year}
			onclick={() => onYearSelect(year)}
		>
			<span class="text-sm font-bold">{year}</span>
			{#if hasPost}
				<span class="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-1"
				></span>
			{:else}
				<span class="w-1.5 h-1.5 mt-1"></span>
			{/if}
		</button>
	{/each}
</div>
