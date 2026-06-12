<script lang="ts">
import SettingsPanel from "./SettingsPanel.svelte";

let { className = "" }: { className?: string } = $props();
</script>

<SettingsPanel className={className} />
