<script lang="ts">
	import Icon from "@iconify/svelte";

	interface Props {
		monthNames: string[];
		yearSuffix: string;
		currentYear: number;
		currentMonth: number;
		currentView: "day" | "month" | "year";
		isBackToTodayVisible: boolean;
		onPrevMonth: () => void;
		onNextMonth: () => void;
		onBackToToday: () => void;
		onTitleClick: () => void;
	}

	const {
		monthNames,
		yearSuffix,
		currentYear,
		currentMonth,
		currentView,
		isBackToTodayVisible,
		onPrevMonth,
		onNextMonth,
		onBackToToday,
		onTitleClick,
	}: Props = $props();

	const title = $derived(
		`${currentYear}${yearSuffix} ${monthNames[currentMonth]}`,
	);
</script>

<div class="flex justify-between items-center mb-2 mt-2">
	<div
		class="font-bold transition text-lg text-neutral-900 dark:text-neutral-100 relative ml-4 flex items-center
			before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
			before:absolute before:left-[-16px] before:top-[13.5px]"
	>
		<button
			type="button"
			class="flex justify-center items-center cursor-pointer hover:bg-[var(--btn-plain-bg-hover)] px-2 py-2 -ml-2 rounded-lg transition-colors"
			onclick={onTitleClick}
			aria-label="Select month or year"
		>
			<span
				class="text-lg font-bold text-neutral-900 dark:text-neutral-100 select-none"
			>
				{title}
			</span>
		</button>
	</div>

	<div class="flex items-center gap-1 shrink-0 ml-2">
		<button
			type="button"
			class="p-1.5 rounded-md hover:bg-[var(--btn-plain-bg-hover)] text-[var(--primary)] transition-all
				{isBackToTodayVisible ? '' : 'invisible'}"
			onclick={onBackToToday}
			aria-label="Back to today"
		>
			<Icon name="material-symbols:restart-alt-rounded" class="text-xl" />
		</button>
		<button
			type="button"
			class="p-1.5 rounded-md hover:bg-[var(--btn-plain-bg-hover)] text-neutral-600 dark:text-neutral-400 hover:text-[var(--primary)] transition-colors text-xl font-extrabold
				{currentView === 'day' ? '' : 'invisible'}"
			onclick={onPrevMonth}
			aria-label="Previous month"
		>
			＜
		</button>
		<button
			type="button"
			class="p-1.5 rounded-md hover:bg-[var(--btn-plain-bg-hover)] text-neutral-600 dark:text-neutral-400 hover:text-[var(--primary)] transition-colors text-xl font-extrabold
				{currentView === 'day' ? '' : 'invisible'}"
			onclick={onNextMonth}
			aria-label="Next month"
		>
			＞
		</button>
	</div>
</div>
