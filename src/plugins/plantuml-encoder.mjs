import * as pako from "pako";

const ALPHABET =
	"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";

function encode6(value) {
	return ALPHABET.charAt(value & 0x3f);
}

function append3(a, b, c) {
	return (
		encode6(a >> 2) +
		encode6(((a & 3) << 4) | (b >> 4)) +
		encode6(((b & 15) << 2) | (c >> 6)) +
		encode6(c)
	);
}

function encode64(bytes) {
	let result = "";
	for (let index = 0; index < bytes.length; index += 3) {
		result += append3(
			bytes[index],
			bytes[index + 1] ?? 0,
			bytes[index + 2] ?? 0,
		);
	}
	return result;
}

export function encodePlantUML(source) {
	if (typeof source !== "string") {
		throw new TypeError("PlantUML source must be a string");
	}
	return encode64(
		pako.deflateRaw(new TextEncoder().encode(source), { level: 9 }),
	);
}

export function injectPlantUMLTheme(source, theme) {
	if (
		!theme?.trim() ||
		/^\s*!theme\s+\S+/m.test(source) ||
		/^\s*skinparam\s+backgroundColor\b/im.test(source)
	) {
		return source;
	}
	const directive = `!theme ${theme.trim()}`;
	const start = source.match(/^[^\S\r\n]*@startuml[^\r\n]*\r?\n?/);
	if (!start) return `${directive}\n${source}`;
	return `${source.slice(0, start[0].length)}${directive}\n${source.slice(start[0].length)}`;
}

export function plantUMLUrl(server, encoded) {
	return `${server.replace(/\/+$/, "")}/svg/${encoded}`;
}
