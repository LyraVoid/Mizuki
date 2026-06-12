declare module "*.astro" {
	import type { AstroComponentFactory } from "astro/runtime/server/index.js";

	const Component: AstroComponentFactory;
	export default Component;
}

declare module "*.svelte" {
	import type { Component as SvelteComponent } from "svelte";

	const Component: SvelteComponent<Record<string, unknown>>;
	export default Component;
}
