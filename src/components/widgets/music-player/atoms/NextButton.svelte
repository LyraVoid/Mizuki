<script lang="ts">
import Icon from "@iconify/svelte";

interface Props {
	onclick: () => void;
	disabled?: boolean;
}

const { onclick, disabled = false }: Props = $props();
</script>

<button
	class="btn-plain w-10 h-10 rounded-lg"
	aria-label="下一首"
	{onclick}
	{disabled}
>
	<Icon icon="material-symbols:skip-next" class="text-xl" />
</button>
