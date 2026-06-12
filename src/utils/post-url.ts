import type { CollectionEntry } from "astro:content";

import { permalinkConfig } from "../config";
import { hasCustomPermalink, initPostIdMap } from "./permalink-utils";
import { removeFileExtension } from "./url-utils";

export function buildPostPaths(blogEntries: CollectionEntry<"posts">[]) {
	initPostIdMap(blogEntries);

	return blogEntries.flatMap((entry) => {
		const defaultSlug = removeFileExtension(entry.id);

		if (hasCustomPermalink(entry)) {
			return [{ params: { slug: defaultSlug }, props: { entry } }];
		}

		if (permalinkConfig.enable) {
			return [{ params: { slug: defaultSlug }, props: { entry } }];
		}

		const paths: {
			params: { slug: string };
			props: { entry: CollectionEntry<"posts"> };
		}[] = [{ params: { slug: defaultSlug }, props: { entry } }];

		if (entry.data.alias) {
			let alias = entry.data.alias.replace(/^\/+/, "").replace(/\/+$/, "");
			if (alias.startsWith("posts/")) {
				alias = alias.replace(/^posts\//, "");
			}
			paths.push({ params: { slug: alias }, props: { entry } });
		}

		return paths;
	});
}
