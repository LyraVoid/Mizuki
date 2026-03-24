<script lang="ts">
	import type { CalendarGridCell } from "../types/calendar";

	interface Props {
		weekDays: string[];
		emptyCellsCount: number;
		cells: CalendarGridCell[];
		onCellClick: (dateKey: string) => void;
	}

	const { weekDays, emptyCellsCount, cells, onCellClick }: Props = $props();

	function getCellClass(cell: CalendarGridCell): string {
		let bgClass =
			"hover:bg-[var(--btn-plain-bg-hover)] text-neutral-700 dark:text-neutral-300 border border-transparent";

		if (cell.isEmpty) {
			return "aspect-square";
		}

		if (cell.isSelected) {
			bgClass =
				"bg-[var(--primary)] text-white shadow-md border border-transparent";
		} else if (cell.isToday) {
			bgClass =
				"text-[var(--primary)] font-bold bg-[var(--primary)]/10 border border-[var(--primary)]";
		} else if (cell.hasPost) {
			bgClass =
				"font-bold text-neutral-900 dark:text-neutral-100 hover:bg-[var(--btn-plain-bg-hover)] border border-transparent";
		}

		return `calendar-day aspect-square flex items-center justify-center rounded-md cursor-pointer relative transition-all duration-200 ${bgClass}`;
	}

	function handleCellClick(cell: CalendarGridCell) {
		if (!cell.isEmpty && cell.dateKey) {
			onCellClick(cell.dateKey);
		}
	}
</script>

<div class="grid grid-cols-7 gap-1 mb-2">
	{#each weekDays as day}
		<div
			class="text-center text-xs text-neutral-500 dark:text-neutral-400 font-medium py-1"
		>
			{day}
		</div>
	{/each}
</div>
<div class="grid grid-cols-7 gap-1">
	{#each { length: emptyCellsCount } as _}
		<div class="aspect-square"></div>
	{/each}

	{#each cells as cell (cell.dateKey)}
		{#if !cell.isEmpty}
			<button
				type="button"
				class={getCellClass(cell)}
				data-date={cell.dateKey}
				onclick={() => handleCellClick(cell)}
			>
				{cell.day}
				{#if cell.hasPost && !cell.isSelected}
					<span
						class="absolute bottom-1 w-1 h-1 rounded-full bg-[var(--primary)]"
					></span>
				{/if}
				{#if cell.hasPost && cell.postCount > 1}
					<span
						class="absolute top-0.5 right-0.5 text-[9px] opacity-70 scale-75"
						>{cell.postCount}</span
					>
				{/if}
			</button>
		{/if}
	{/each}
</div>
