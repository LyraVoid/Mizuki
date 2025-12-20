import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string().optional().default(""),
		published: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		image: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		category: z.string().optional().nullable().default(""),
		lang: z.string().optional().default(""),
		pinned: z.boolean().optional().default(false),
		priority: z.number().optional(),
		author: z.string().optional().default(""),
		sourceLink: z.string().optional().default(""),
		licenseName: z.string().optional().default(""),
		licenseUrl: z.string().optional().default(""),
		encrypted: z.boolean().optional().default(false),
		password: z.string().optional().default(""),
		alias: z.string().optional(),
		permalink: z.string().optional(),
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});

const diaryCollection = defineCollection({
	type: "content",
	schema: z.object({
		date: z.date(),
		images: z.array(z.string()).optional().nullable().default([]),
		location: z.string().optional().nullable(),
		mood: z.string().optional().nullable(),
		tags: z.array(z.string()).optional().nullable().default([]),
	}),
});

const specCollection = defineCollection({
	schema: z.object({}),
});

export const collections = {
	posts: postsCollection,
	diary: diaryCollection,
	spec: specCollection,
};
