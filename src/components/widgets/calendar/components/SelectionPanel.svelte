<script lang="ts">
	import type { CalendarStats } from "../types/calendar";
	import MonthPicker from "./MonthPicker.svelte";
	import YearPicker from "./YearPicker.svelte";

	interface Props {
		monthNames: string[];
		currentYear: number;
		currentMonth: number;
		currentView: "day" | "month" | "year";
		stats: CalendarStats;
		onMonthSelect: (month: number) => void;
		onYearSelect: (year: number) => void;
		onClose: () => void;
	}

	const {
		monthNames,
		currentYear,
		currentMonth,
		currentView,
		stats,
		onMonthSelect,
		onYearSelect,
		onClose,
	}: Props = $props();

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onClose();
		}
	}
</script>

<div
	class="absolute inset-0 bg-[var(--card-bg)] z-10 flex flex-col transition-opacity duration-200"
	class:opacity-0={currentView === "day"}
	class:opacity-100={currentView !== "day"}
	class:hidden={currentView === "day"}
	onclick={handleBackdropClick}
	role="dialog"
	aria-label="Date selection panel"
>
	{#if currentView === "month"}
		<MonthPicker
			{monthNames}
			{currentYear}
			{currentMonth}
			{stats}
			{onMonthSelect}
		/>
	{:else if currentView === "year"}
		<YearPicker {currentYear} {stats} {onYearSelect} />
	{/if}
</div>
