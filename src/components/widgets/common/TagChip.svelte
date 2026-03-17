<script lang="ts">
	interface Props {
		href?: string;
		label?: string;
		class?: string;
	}
	let { href, label, class: className = "" }: Props = $props();
</script>

{#if href}
	<a {href} aria-label={label} class="tag-chip {className}">
		<slot />
	</a>
{:else}
	<span class="tag-chip {className}">
		<slot />
	</span>
{/if}

<style>
	.tag-chip {
		display: inline-flex;
		align-items: center;
		height: 2rem;
		padding: 0 0.75rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		background-color: var(--btn-plain-bg-hover);
		color: var(--btn-content);
		transition: all 0.2s ease;
		text-decoration: none;
		cursor: pointer;
	}

	.tag-chip:hover {
		background-color: var(--primary);
		color: white;
	}

	:global(.dark) .tag-chip {
		background-color: var(--card-bg);
		color: var(--text-color);
	}

	:global(.dark) .tag-chip:hover {
		background-color: var(--primary);
		color: white;
	}
</style>
