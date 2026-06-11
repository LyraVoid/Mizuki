<script lang="ts">
import type { BadgeProps } from "./types";

const { value, class: className = "" }: BadgeProps = $props();
</script>

{#if value != null && value !== ""}
	<div class="badge {className}">
		{value}
	</div>
{/if}

<style>
	.badge {
		transition: all 0.2s ease;
		padding: 0 0.5rem;
		height: 1.75rem;
		min-width: 2rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--btn-content);
		background-color: oklch(0.95 0.025 var(--hue));
		display: flex;
		align-items: center;
		justify-content: center;
	}
	:global(.dark) .badge {
		color: var(--deep-text);
		background-color: var(--primary);
	}
</style>
