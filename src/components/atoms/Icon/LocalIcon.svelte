<script lang="ts">
/**
 * Local Icon component for Svelte
 * Uses icons from @iconify-json packages installed locally - no CDN required
 */
interface Props {
	icon: string;
	class?: string;
}

const { icon, class: className = "" }: Props = $props();

const [collection, name] = $derived(
	icon.includes(":") ? icon.split(":") : ["mdi", icon],
);

const iconSetMap: Record<string, string> = {
	"material-symbols": "@iconify-json/material-symbols",
	"material-symbols-outlined": "@iconify-json/material-symbols",
	mdi: "@iconify-json/mdi",
	"fa7-solid": "@iconify-json/fa7-solid",
	"fa7-regular": "@iconify-json/fa7-regular",
	"fa7-brands": "@iconify-json/fa7-brands",
	"simple-icons": "@iconify-json/simple-icons",
};

const packageName = $derived(iconSetMap[collection]);
let svgContent = $state("");

$effect(() => {
	const currentIcon = icon;
	const currentPackageName = packageName;
	const currentName = name;
	const currentClassName = className;

	if (!currentPackageName) {
		return;
	}

	async function loadIcon() {
		try {
			const iconsData = await import(
				/* @vite-ignore */ `${currentPackageName}/icons.json`
			);
			const icons = iconsData.icons || {};
			const iconData = icons[currentName];

			if (iconData) {
				const viewBox = iconData.viewBox || "0 0 24 24";
				const body = iconData.body;

				if (body) {
					svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" class="${currentClassName}">${body}</svg>`;
				}
			}
		} catch (e) {
			console.warn(
				`Failed to load icon ${currentIcon} from ${currentPackageName}:`,
				e,
			);
		}
	}

	loadIcon();
});
</script>

{#if svgContent}
	{@html svgContent}
{:else}
	<span class={className}>●</span>
{/if}
