<script lang="ts">
	interface Props {
		href?: string;
		label?: string;
		dot?: boolean;
		badge?: string | number;
		class?: string;
	}
	let {
		href,
		label,
		dot = false,
		badge,
		class: className = "",
	}: Props = $props();
</script>

{#if href}
	<a {href} aria-label={label} class="chip-wrapper {className}">
		<button class="chip">
			{#if dot}
				<div class="chip-dot"></div>
			{/if}
			<span class="chip-content">
				<slot />
			</span>
			{#if badge !== undefined && badge !== null && badge !== ""}
				<div class="chip-badge">{badge}</div>
			{/if}
		</button>
	</a>
{:else}
	<button class="chip {className}">
		{#if dot}
			<div class="chip-dot"></div>
		{/if}
		<span class="chip-content">
			<slot />
		</span>
		{#if badge !== undefined && badge !== null && badge !== ""}
			<div class="chip-badge">{badge}</div>
		{/if}
	</button>
{/if}

<style>
	.chip-wrapper {
		display: block;
		width: 100%;
		text-decoration: none;
	}

	.chip {
		width: 100%;
		height: 2.5rem;
		border-radius: 0.5rem;
		background: none;
		transition: all 0.2s ease;
		padding-left: 0.5rem;
		display: flex;
		align-items: center;
		cursor: pointer;
		border: none;
		color: inherit;
	}

	.chip:hover {
		background-color: var(--btn-plain-bg-hover);
		padding-left: 0.75rem;
	}

	.chip:active {
		background-color: var(--btn-plain-bg-active);
	}

	.chip-content {
		overflow: hidden;
		text-align: left;
		white-space: nowrap;
		text-overflow: ellipsis;
		flex: 1;
	}

	.chip-dot {
		height: 0.25rem;
		width: 0.25rem;
		background-color: var(--btn-content);
		transition: all 0.2s ease;
		border-radius: 0.25rem;
		margin-right: 0.5rem;
		flex-shrink: 0;
	}

	:global(.dark) .chip-dot {
		background-color: var(--card-bg);
	}

	.chip-badge {
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
		margin-left: 1rem;
		flex-shrink: 0;
	}

	:global(.dark) .chip-badge {
		color: var(--deep-text);
		background-color: var(--primary);
	}

	.chip-wrapper:hover .chip {
		color: var(--primary);
	}

	:global(.dark) .chip-wrapper:hover .chip {
		color: var(--primary);
	}
</style>
