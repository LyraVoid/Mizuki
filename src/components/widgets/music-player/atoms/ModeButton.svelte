<script lang="ts">
import Icon from "@iconify/svelte";

import type { RepeatMode } from "../types";

interface Props {
	mode: "shuffle" | "repeat";
	isActive: boolean;
	repeatMode?: RepeatMode;
	onclick: () => void;
	disabled?: boolean;
}

const {
	mode,
	isActive,
	repeatMode = 0,
	onclick,
	disabled = false,
}: Props = $props();
</script>

{#if mode === "shuffle"}
	<button
		class="w-10 h-10 rounded-lg"
		class:btn-regular={isActive}
		class:btn-plain={!isActive}
		{onclick}
		{disabled}
	>
		<Icon icon="material-symbols:shuffle" class="text-lg" />
	</button>
{:else}
	<button
		class="w-10 h-10 rounded-lg"
		class:btn-regular={isActive}
		class:btn-plain={!isActive}
		{onclick}
	>
		{#if repeatMode === 1}
			<Icon icon="material-symbols:repeat-one" class="text-lg" />
		{:else if repeatMode === 2}
			<Icon icon="material-symbols:repeat" class="text-lg" />
		{:else}
			<Icon icon="material-symbols:repeat" class="text-lg opacity-50" />
		{/if}
	</button>
{/if}
