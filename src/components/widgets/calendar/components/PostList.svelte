<script lang="ts">
	import type { CalendarPost } from "../types/calendar";

	interface Props {
		posts: CalendarPost[];
		currentPostId: string | null;
		isEmpty: boolean;
	}

	const { posts, currentPostId, isEmpty }: Props = $props();

	function formatDate(dateStr: string): string {
		const [, m, d] = dateStr.split("-");
		return `${parseInt(m)}-${parseInt(d)}`;
	}

	function getContainerClass(isCurrentPost: boolean): string {
		const baseClass =
			"flex items-center justify-between text-sm transition-colors px-2 py-2 rounded-lg group border border-transparent";

		if (isCurrentPost) {
			return `${baseClass} bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/10`;
		}
		return `${baseClass} text-neutral-700 dark:text-neutral-300 hover:text-[var(--primary)] dark:hover:text-[var(--primary)] hover:bg-[var(--btn-plain-bg-hover)]`;
	}

	function getTitleClass(isCurrentPost: boolean): string {
		if (isCurrentPost) {
			return "truncate flex-1 font-bold transition-colors";
		}
		return "truncate flex-1 font-bold transition-colors";
	}

	function getDateClass(isCurrentPost: boolean): string {
		if (isCurrentPost) {
			return "text-xs ml-2 whitespace-nowrap transition-colors text-[var(--primary)]/80";
		}
		return "text-xs ml-2 whitespace-nowrap transition-colors text-neutral-400 group-hover:text-[var(--primary)]/70";
	}
</script>

<div class="mt-4">
	<div
		class="h-[1px] w-full bg-neutral-200 dark:bg-neutral-700 mb-2"
		class:hidden={isEmpty}
	></div>
	<div
		class="flex flex-col gap-1 max-h-[9.375rem] overflow-y-auto custom-scrollbar"
	>
		{#if !isEmpty}
			{#each posts as post (post.id)}
				{@const isCurrentPost = post.id === currentPostId}
				<a
					href="/posts/{post.id}/"
					class={getContainerClass(isCurrentPost)}
				>
					<span class={getTitleClass(isCurrentPost)}
						>{post.title}</span
					>
					<span class={getDateClass(isCurrentPost)}
						>{formatDate(post.date)}</span
					>
				</a>
			{/each}
		{/if}
	</div>
</div>
