<script lang="ts">
	import Icon from "@iconify/svelte";

	interface Props {
		name: string;
		icon?: string;
		class?: string;
	}
	let { name, icon, class: className = "" }: Props = $props();
</script>

<div class="widget-header {className}">
	{#if icon}
		<Icon {icon} class="widget-header-icon" />
	{/if}
	<span class="widget-header-title">{name}</span>
	<slot />
</div>

<style>
	.widget-header {
		font-weight: 700;
		font-size: 1.125rem;
		color: var(--text-color);
		position: relative;
		margin-left: 2rem;
		margin-bottom: 0.5rem;
		margin-top: 1rem;
		display: flex;
		align-items: center;
		transition: color 0.2s ease;
	}

	.widget-header::before {
		content: "";
		width: 0.25rem;
		height: 1rem;
		border-radius: 0.25rem;
		background-color: var(--primary);
		position: absolute;
		left: -1rem;
		top: 0.375rem;
	}

	.widget-header-icon {
		margin-right: 0.5rem;
		font-size: 1.25rem;
	}

	.widget-header-title {
		transition: color 0.2s ease;
	}

	:global(.dark) .widget-header {
		color: var(--text-color);
	}
</style>
