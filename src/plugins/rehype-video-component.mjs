/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * @breif 建立視頻組件
 *
 * @param {*} properties
 * @param {*} children
 * @returns
 */

export function VideoComponent(properties) {
	return h("video", {
		src: properties.src,
		controls: properties.controls !== "false",
		autoplay: properties.autoplay === "true",
		loop: properties.loop === "true",
		muted: properties.muted === "true",
		poster: properties.poster,
	});
}
