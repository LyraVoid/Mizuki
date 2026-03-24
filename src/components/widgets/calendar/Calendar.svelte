<script lang="ts">
	import Icon from "@iconify/svelte";
	import { onMount } from "svelte";

	import CalendarGrid from "./components/CalendarGrid.svelte";
	import MonthPicker from "./components/MonthPicker.svelte";
	import YearPicker from "./components/YearPicker.svelte";
	import {
		formatDateKey,
		formatMonthKey,
		getCurrentPostId,
		getDaysInMonth,
		getFirstDayOfMonth,
		processPostsData,
	} from "./hooks/useCalendar";
	import type {
		CalendarGridCell,
		CalendarPost,
		CalendarStats,
	} from "./types/calendar";

	interface Props {
		monthNames: string[];
		weekDays: string[];
		yearSuffix: string;
	}

	const { monthNames, weekDays, yearSuffix }: Props = $props();

	// State
	let allPostsData: CalendarPost[] = $state([]);
	let postDateMap: Record<string, CalendarPost[]> = $state({});
	let postsByMonth: Record<string, CalendarPost[]> = $state({});
	let stats: CalendarStats = $state({
		hasPostInYear: {},
		hasPostInMonth: {},
		minYear: new Date().getFullYear(),
		maxYear: new Date().getFullYear() + 5,
	});

	let currentYear = $state(new Date().getFullYear());
	let currentMonth = $state(new Date().getMonth());
	let selectedDateKey: string | null = $state(null);
	let currentView: "day" | "month" | "year" = $state("day");

	// Computed
	const today = new Date();
	const todayYear = today.getFullYear();
	const todayMonth = today.getMonth();
	const todayDate = today.getDate();

	const isBackToTodayVisible = $derived(
		currentYear !== todayYear ||
			currentMonth !== todayMonth ||
			selectedDateKey !== null,
	);

	const emptyCellsCount = $derived(
		getFirstDayOfMonth(currentYear, currentMonth),
	);

	const cells = $derived(
		(() => {
			const daysInMonth = getDaysInMonth(currentYear, currentMonth);
			const result: CalendarGridCell[] = [];

			for (let day = 1; day <= daysInMonth; day++) {
				const dateKey = formatDateKey(currentYear, currentMonth, day);
				const posts = postDateMap[dateKey] || [];
				const isToday =
					currentYear === todayYear &&
					currentMonth === todayMonth &&
					day === todayDate;
				const isSelected = selectedDateKey === dateKey;

				result.push({
					day,
					dateKey,
					posts,
					hasPost: posts.length > 0,
					postCount: posts.length,
					isToday,
					isSelected,
					isEmpty: false,
				});
			}

			return result;
		})(),
	);

	const currentPostId = $derived(
		getCurrentPostId(window.location.pathname, allPostsData),
	);

	const displayedPosts = $derived(
		(() => {
			if (selectedDateKey && postDateMap[selectedDateKey]) {
				return postDateMap[selectedDateKey];
			}
			const monthKey = formatMonthKey(currentYear, currentMonth);
			return postsByMonth[monthKey] || [];
		})(),
	);

	// Functions
	async function fetchCalendarData() {
		try {
			const res = await fetch("/api/calendar-data.json");
			const data = await res.json();
			if (Array.isArray(data)) {
				allPostsData = data;
				const processed = processPostsData(allPostsData);
				postDateMap = processed.postDateMap;
				postsByMonth = processed.postsByMonth;
				stats = processed.stats;

				const currentPostIdValue = getCurrentPostId(
					window.location.pathname,
					allPostsData,
				);
				if (currentPostIdValue) {
					const matchedPost = allPostsData.find(
						(p) => p.id === currentPostIdValue,
					);
					if (matchedPost) {
						const [y, m] = matchedPost.date.split("-");
						currentYear = parseInt(y);
						currentMonth = parseInt(m) - 1;
					}
				}
			}
		} catch (error) {
			console.error("Failed to fetch calendar data:", error);
		}
	}

	function handlePrevMonth() {
		currentMonth--;
		if (currentMonth < 0) {
			currentMonth = 11;
			currentYear--;
		}
	}

	function handleNextMonth() {
		currentMonth++;
		if (currentMonth > 11) {
			currentMonth = 0;
			currentYear++;
		}
	}

	function handleBackToToday() {
		currentYear = todayYear;
		currentMonth = todayMonth;
		selectedDateKey = null;
		if (currentView !== "day") {
			closeSelectionPanel();
		}
	}

	function handleTitleClick() {
		if (currentView === "day") {
			showMonthPicker();
		} else if (currentView === "month") {
			showYearPicker();
		} else {
			closeSelectionPanel();
		}
	}

	function handleCellClick(dateKey: string) {
		if (selectedDateKey === dateKey) {
			selectedDateKey = null;
		} else {
			selectedDateKey = dateKey;
		}
	}

	function handleMonthSelect(month: number) {
		currentMonth = month;
		closeSelectionPanel();
	}

	function handleYearSelect(year: number) {
		currentYear = year;
		showMonthPicker();
	}

	function showMonthPicker() {
		currentView = "month";
	}

	function showYearPicker() {
		currentView = "year";
	}

	function closeSelectionPanel() {
		currentView = "day";
	}

	onMount(() => {
		fetchCalendarData();
	});
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
			onclick={handleTitleClick}
			aria-label="Select month or year"
		>
			<span
				class="text-lg font-bold text-neutral-900 dark:text-neutral-100 select-none"
			>
				{currentYear}{yearSuffix}
				{monthNames[currentMonth]}
			</span>
		</button>
	</div>

	<div class="flex items-center gap-1 shrink-0 ml-2">
		<button
			type="button"
			class="p-1.5 rounded-md hover:bg-[var(--btn-plain-bg-hover)] text-[var(--primary)] transition-all
				{isBackToTodayVisible ? '' : 'invisible'}"
			onclick={handleBackToToday}
			aria-label="Back to today"
		>
			<Icon name="material-symbols:restart-alt-rounded" class="text-xl" />
		</button>
		<button
			type="button"
			class="p-1.5 rounded-md hover:bg-[var(--btn-plain-bg-hover)] text-neutral-600 dark:text-neutral-400 hover:text-[var(--primary)] transition-colors text-xl font-extrabold
				{currentView === 'day' ? '' : 'invisible'}"
			onclick={handlePrevMonth}
			aria-label="Previous month"
		>
			＜
		</button>
		<button
			type="button"
			class="p-1.5 rounded-md hover:bg-[var(--btn-plain-bg-hover)] text-neutral-600 dark:text-neutral-400 hover:text-[var(--primary)] transition-colors text-xl font-extrabold
				{currentView === 'day' ? '' : 'invisible'}"
			onclick={handleNextMonth}
			aria-label="Next month"
		>
			＞
		</button>
	</div>
</div>

<div class="relative w-full overflow-hidden" style="min-height: 15.625rem;">
	<div id="calendar-view" class="w-full opacity-100">
		<CalendarGrid
			{weekDays}
			{emptyCellsCount}
			{cells}
			onCellClick={handleCellClick}
		/>

		<div class="mt-4">
			<div
				class="h-[1px] w-full bg-neutral-200 dark:bg-neutral-700 mb-2"
				class:hidden={displayedPosts.length === 0}
			></div>
			<div
				class="flex flex-col gap-1 max-h-[9.375rem] overflow-y-auto custom-scrollbar"
			>
				{#if displayedPosts.length > 0}
					{#each displayedPosts as post (post.id)}
						{@const isCurrentPost = post.id === currentPostId}
						{@const [, m, d] = post.date.split("-")}
						{@const dateStr = `${parseInt(m)}-${parseInt(d)}`}
						<a
							href="/posts/{post.id}/"
							class="flex items-center justify-between text-sm transition-colors px-2 py-2 rounded-lg group border border-transparent
								{isCurrentPost
								? 'bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/10'
								: 'text-neutral-700 dark:text-neutral-300 hover:text-[var(--primary)] dark:hover:text-[var(--primary)] hover:bg-[var(--btn-plain-bg-hover)]'}"
						>
							<span
								class="truncate flex-1 font-bold transition-colors"
								>{post.title}</span
							>
							<span
								class="text-xs ml-2 whitespace-nowrap transition-colors
								{isCurrentPost
									? 'text-[var(--primary)]/80'
									: 'text-neutral-400 group-hover:text-[var(--primary)]/70'}"
							>
								{dateStr}
							</span>
						</a>
					{/each}
				{/if}
			</div>
		</div>
	</div>

	{#if currentView === "month"}
		<div class="absolute inset-0 bg-[var(--card-bg)] z-10 flex flex-col">
			<MonthPicker
				{monthNames}
				{currentYear}
				{currentMonth}
				{stats}
				onMonthSelect={handleMonthSelect}
			/>
		</div>
	{:else if currentView === "year"}
		<div class="absolute inset-0 bg-[var(--card-bg)] z-10 flex flex-col">
			<YearPicker {currentYear} {stats} onYearSelect={handleYearSelect} />
		</div>
	{/if}
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background-color: rgba(156, 163, 175, 0.5);
		border-radius: 2px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background-color: rgba(156, 163, 175, 0.8);
	}
</style>
