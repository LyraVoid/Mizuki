import type { Favicon } from "@/types/config.ts";

export const defaultFavicons: Favicon[] = [
	{
		src: "/favicon/favicon.ico",
		theme: "light",
		sizes: "64x64",
	},
	{
		src: "/favicon/favicon.ico",
		theme: "dark",
		sizes: "64x64",
	},
];
