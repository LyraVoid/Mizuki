#!/usr/bin/env node

/**
 * 一键导出个性化配置
 *
 * 把当前 src/config/ 与上游原版逐项比对，只把「你改过的字段」导出成
 * overrides/ 覆盖文件，供内容仓库使用。
 *
 * 用法：
 *   pnpm export-config                  # 自动挑选上游基准
 *   pnpm export-config --ref=upstream/master
 *   pnpm export-config --out=../MyBlog-Content/overrides
 *
 * 基准 ref 必须指向「配置还是上游原版」的提交，脚本从 git 里取出那一版
 * 配置做对比，因此不需要你在磁盘上另留一份干净副本。
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { register } from "node:module";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual } from "node:util";

import { deepMerge } from "../src/config/deepMerge.ts";
import { LinkPreset } from "../src/types/config.ts";

// 配置文件里存在 `from "../types/config"` 这类省略扩展名的写法，Node 自身
// 解析不了，补一个 resolve 钩子。
register(
	`data:text/javascript,${encodeURIComponent(`
		export async function resolve(specifier, context, next) {
			try {
				return await next(specifier, context);
			} catch (error) {
				if (specifier.startsWith(".") && !/\\.[cm]?[jt]s$/.test(specifier)) {
					return next(specifier + ".ts", context);
				}
				throw error;
			}
		}
	`)}`,
);

const rootDir = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"..",
);

/** 覆盖文件名 = 导出常量名，与 src/config/overrideLoader.ts 的名单保持一致 */
const CONFIGS = [
	["announcementConfig", "announcementConfig", "AnnouncementConfig"],
	["backgroundWallpaper", "fullscreenWallpaperConfig", "FullscreenWallpaperConfig"],
	["commentConfig", "commentConfig", "CommentConfig"],
	["effectsConfig", "sakuraConfig", "SakuraConfig"],
	["expressiveCodeConfig", "expressiveCodeConfig", "ExpressiveCodeConfig"],
	["footerConfig", "footerConfig", "FooterConfig"],
	["licenseConfig", "licenseConfig", "LicenseConfig"],
	["markdownConfig", "markdownConfig", "MarkdownEnhancementConfig"],
	["musicConfig", "musicPlayerConfig", "MusicPlayerConfig"],
	["navBarConfig", "navBarConfig", "NavBarConfig"],
	["permalinkConfig", "permalinkConfig", "PermalinkConfig"],
	["pioConfig", "pioConfig", "PioConfig"],
	["profileConfig", "profileConfig", "ProfileConfig"],
	["randomPostsConfig", "randomPostsConfig", "RandomPostsConfig"],
	["rainyDayConfig", "rainyDayConfig", "RainyDayConfig"],
	["relatedPostsConfig", "relatedPostsConfig", "RelatedPostsConfig"],
	["shareConfig", "shareConfig", "ShareConfig"],
	["sidebarConfig", "sidebarLayoutConfig", "SidebarLayoutConfig"],
	["siteConfig", "siteConfig", "SiteConfig"],
];

/** MarkdownEnhancementConfig 声明在配置文件自身，不在 types/config.ts */
const TYPE_IN_CONFIG_FILE = new Set(["MarkdownEnhancementConfig"]);

const LINK_PRESET_NAMES = new Map(
	Object.entries(LinkPreset)
		.filter(([, value]) => typeof value === "number")
		.map(([name, value]) => [value, name]),
);

function parseArgs(argv) {
	const args = { ref: null, out: path.join(rootDir, "overrides-export") };
	for (const arg of argv) {
		if (arg.startsWith("--ref=")) args.ref = arg.slice(6);
		else if (arg.startsWith("--out=")) args.out = path.resolve(rootDir, arg.slice(6));
		else {
			console.error(`未知参数：${arg}`);
			process.exit(1);
		}
	}
	return args;
}

function git(args, options = {}) {
	return execFileSync("git", args, {
		cwd: rootDir,
		encoding: "utf-8",
		stdio: ["ignore", "pipe", "pipe"],
		...options,
	});
}

function refExists(ref) {
	try {
		git(["rev-parse", "--verify", "--quiet", `${ref}^{commit}`]);
		return true;
	} catch {
		return false;
	}
}

function resolveBaseRef(requested) {
	if (requested) {
		if (!refExists(requested)) {
			console.error(`✘ 找不到 git ref：${requested}`);
			process.exit(1);
		}
		return requested;
	}

	const candidates = ["upstream/master", "upstream/main", "origin/master", "origin/main"];
	const found = candidates.find(refExists);
	if (!found) {
		console.error("✘ 找不到可用的上游基准，请用 --ref=<git-ref> 指定");
		console.error(`   已尝试：${candidates.join("、")}`);
		process.exit(1);
	}
	return found;
}

/** 把某个 ref 下的 src/config 与 src/types 取出到临时目录 */
function materializeBaseTree(ref) {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), "mizuki-base-"));
	const files = git(["ls-tree", "-r", "--name-only", ref, "src/config", "src/types"])
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line.endsWith(".ts"));

	for (const file of files) {
		const target = path.join(dir, file);
		fs.mkdirSync(path.dirname(target), { recursive: true });
		fs.writeFileSync(target, git(["show", `${ref}:${file}`]));
	}
	return dir;
}

function isPlainObject(value) {
	if (typeof value !== "object" || value === null) return false;
	const proto = Object.getPrototypeOf(value);
	return proto === Object.prototype || proto === null;
}

/** 只保留与上游不同的字段 */
function minimalDiff(base, mine) {
	if (!isPlainObject(base) || !isPlainObject(mine)) {
		return isDeepStrictEqual(base, mine) ? undefined : mine;
	}

	const diff = {};
	for (const [key, value] of Object.entries(mine)) {
		const sub = minimalDiff(base[key], value);
		if (sub !== undefined) diff[key] = sub;
	}
	return Object.keys(diff).length ? diff : undefined;
}

/** 深合并表达不了「上游有、你删掉」的键，单独找出来提示 */
function findRemovedPaths(base, mine, trail = [], out = []) {
	if (!isPlainObject(base) || !isPlainObject(mine)) return out;
	for (const key of Object.keys(base)) {
		if (!(key in mine) || mine[key] === undefined) {
			out.push([...trail, key].join("."));
		} else {
			findRemovedPaths(base[key], mine[key], [...trail, key], out);
		}
	}
	return out;
}

function formatKey(key) {
	return /^[A-Za-z_$][\w$]*$/.test(key) ? key : JSON.stringify(key);
}

function serialize(value, depth, useLinkPreset) {
	const pad = "\t".repeat(depth);
	const padInner = "\t".repeat(depth + 1);

	if (Array.isArray(value)) {
		if (value.length === 0) return "[]";
		const items = value.map((item) => {
			if (useLinkPreset && typeof item === "number" && LINK_PRESET_NAMES.has(item)) {
				return `${padInner}LinkPreset.${LINK_PRESET_NAMES.get(item)}`;
			}
			return `${padInner}${serialize(item, depth + 1, useLinkPreset)}`;
		});
		return `[\n${items.join(",\n")},\n${pad}]`;
	}

	if (isPlainObject(value)) {
		const keys = Object.keys(value);
		if (keys.length === 0) return "{}";
		const entries = keys.map(
			(key) =>
				`${padInner}${formatKey(key)}: ${serialize(value[key], depth + 1, useLinkPreset)}`,
		);
		return `{\n${entries.join(",\n")},\n${pad}}`;
	}

	return JSON.stringify(value);
}

function renderFile(exportName, typeName, override) {
	const usesLinkPreset = exportName === "navBarConfig";
	const typeImport = TYPE_IN_CONFIG_FILE.has(typeName)
		? `import type { DeepPartial } from "../../types/config";\nimport type { ${typeName} } from "../markdownConfig";`
		: `import type { DeepPartial, ${typeName} } from "../../types/config";`;

	const valueImport = usesLinkPreset
		? `import { LinkPreset } from "../../types/config";\n`
		: "";

	return `${valueImport}${typeImport}

export default ${serialize(override, 0, usesLinkPreset)} satisfies DeepPartial<${typeName}>;
`;
}

async function main() {
	const args = parseArgs(process.argv.slice(2));
	const baseRef = resolveBaseRef(args.ref);
	const baseHash = git(["rev-parse", "--short", baseRef]).trim();

	console.log(`上游基准：${baseRef} (${baseHash})`);
	console.log(`导出目录：${path.relative(rootDir, args.out) || "."}\n`);

	const baseDir = materializeBaseTree(baseRef);
	const written = [];
	const identical = [];
	const problems = [];

	try {
		for (const [file, exportName, typeName] of CONFIGS) {
			const baseFile = path.join(baseDir, "src/config", `${file}.ts`);
			if (!fs.existsSync(baseFile)) {
				problems.push(`${exportName}：上游基准里没有 src/config/${file}.ts，跳过`);
				continue;
			}

			const base = (await import(pathToUrl(baseFile)))[exportName];
			const mine = (await import(pathToUrl(path.join(rootDir, "src/config", `${file}.ts`))))[exportName];

			const override = minimalDiff(base, mine);
			if (override === undefined) {
				identical.push(exportName);
				continue;
			}

			// 自检：导出的覆盖必须能还原出当前配置
			if (!isDeepStrictEqual(deepMerge(base, override), mine)) {
				const removed = findRemovedPaths(base, mine);
				problems.push(
					`${exportName}：覆盖无法还原当前配置${removed.length ? `，深合并表达不了这些被删掉的键：${removed.join("、")}` : ""}`,
				);
				continue;
			}

			fs.mkdirSync(args.out, { recursive: true });
			fs.writeFileSync(
				path.join(args.out, `${exportName}.ts`),
				renderFile(exportName, typeName, override),
			);
			written.push([exportName, Object.keys(override).length]);
		}
	} finally {
		fs.rmSync(baseDir, { recursive: true, force: true });
	}

	for (const [name, count] of written) {
		console.log(`  已导出 ${name}.ts（${count} 个顶层键）`);
	}
	if (identical.length) {
		console.log(`\n与上游一致、无需覆盖：${identical.join("、")}`);
	}
	if (problems.length) {
		console.log("\n需要手工处理：");
		for (const problem of problems) console.log(`  ✘ ${problem}`);
	}

	if (!written.length) {
		console.log("\n当前配置与上游完全一致，没有需要导出的内容。");
		return;
	}

	const outRel = path.relative(rootDir, args.out) || ".";
	console.log(`\n共导出 ${written.length} 个覆盖文件到 ${outRel}/`);
	console.log("\n接下来：");
	console.log(`  1. 复制到内容仓库：cp ${outRel}/*.ts <内容仓库>/overrides/`);
	console.log("  2. 把 src/config/ 还原成上游原版：");
	console.log(`     git checkout ${baseRef} -- src/config/`);
	console.log("  3. 同步并校验：pnpm sync-content && pnpm type-check && pnpm build");
	console.log("\n详见 docs/CONTENT_SEPARATION.md 的「配置覆盖」章节。");

	if (problems.length) process.exitCode = 1;
}

function pathToUrl(filePath) {
	return `file:///${filePath.split(path.sep).join("/")}`;
}

main().catch((error) => {
	console.error("✘ 导出失败：", error.message);
	process.exit(1);
});
