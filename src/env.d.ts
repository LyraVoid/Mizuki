/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

declare module "sharp" {
	export default function sharp(input?: Buffer | string): import("sharp").Sharp;
}
