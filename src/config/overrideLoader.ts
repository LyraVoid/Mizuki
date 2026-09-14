/**
 * 配置覆盖加载器
 *
 * 从 src/config/overrides/ 读取用户的部分配置覆盖，合并进上游默认配置。
 * 该目录由 sync-content 从内容仓库的 overrides/ 同步而来，不随代码仓库提交；
 * 目录缺失时 import.meta.glob 返回空对象，所有配置退回上游默认值。
 *
 * 约定：覆盖文件名 = 被覆盖的导出常量名。例如 overrides/sakuraConfig.ts 覆盖
 * sakuraConfig（注意上游文件名是 effectsConfig.ts）。文件名拼错会在构建期报错，
 * 而不是静默失效。
 */
import { deepMerge } from "./deepMerge";

const OVERRIDABLE_CONFIGS = [
	"announcementConfig",
	"commentConfig",
	"expressiveCodeConfig",
	"footerConfig",
	"fullscreenWallpaperConfig",
	"licenseConfig",
	"markdownConfig",
	"musicPlayerConfig",
	"navBarConfig",
	"permalinkConfig",
	"pioConfig",
	"profileConfig",
	"randomPostsConfig",
	"rainyDayConfig",
	"relatedPostsConfig",
	"sakuraConfig",
	"shareConfig",
	"sidebarLayoutConfig",
	"siteConfig",
] as const;

export type OverridableConfigName = (typeof OVERRIDABLE_CONFIGS)[number];

const overrideModules = import.meta.glob<{ default?: unknown }>(
	"./overrides/*.ts",
	{ eager: true },
);

const overrides = collectOverrides();

function collectOverrides(): Map<string, unknown> {
	const allowed = new Set<string>(OVERRIDABLE_CONFIGS);
	const collected = new Map<string, unknown>();

	for (const [modulePath, module] of Object.entries(overrideModules)) {
		const name = modulePath.replace(/^.*\//, "").replace(/\.ts$/, "");

		if (!allowed.has(name)) {
			throw new Error(
				`Unknown config override "${modulePath}". The file name must match one of the exported config names: ${OVERRIDABLE_CONFIGS.join(", ")}`,
			);
		}

		if (module?.default === undefined) {
			throw new Error(
				`Config override "${modulePath}" has no default export. Expected: export default { ... } satisfies DeepPartial<${name === "siteConfig" ? "SiteConfig" : "..."}>`,
			);
		}

		collected.set(name, module.default);
	}

	return collected;
}

/**
 * 把同名覆盖合并进默认配置。没有对应覆盖文件时原样返回默认配置。
 */
export function withOverride<T>(name: OverridableConfigName, base: T): T {
	return deepMerge(base, overrides.get(name));
}
