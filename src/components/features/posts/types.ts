import type { CollectionEntry } from "astro:content";
import type { Page } from "astro";
import type { PostDateFormat } from "@/utils/date-utils";

export interface PostCardProps {
	class?: string;
	entry: CollectionEntry<"posts">;
	style?: string;
}

export interface PostMetaProps {
	published: Date;
	updated?: Date;
	dateFormat?: PostDateFormat;
	category?: string;
	tags?: string[];
	hideUpdateDate?: boolean;
	hideTagsForMobile?: boolean;
	isHome?: boolean;
	className?: string;
	id?: string;
	showOnlyBasicMeta?: boolean;
	words?: number;
	minutes?: number;
	showWordCount?: boolean;
}

export interface PostPageProps {
	page: Page<CollectionEntry<"posts">>;
}
