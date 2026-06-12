# 侧栏组件开发指南

> 本文档用于规范侧栏相关组件的开发流程，避免出现"配置了组件但页面不显示"的遗漏。

## 适用范围

- 新增或重构侧栏组件（如 `music-sidebar`、自定义统计组件等）
- 调整 `sidebarLayoutConfig` 中的组件布局
- 在左侧栏、右侧栏、抽屉侧栏中复用同一组件

---

## 接入步骤：3 步缺一不可

### 步骤 1：在类型系统中声明组件类型

文件：`src/types/config.ts`

在 `WidgetComponentType` 中新增类型枚举：

```ts
export type WidgetComponentType =
	| "profile"
	| "announcement"
	| "categories"
	| "tags"
	| "toc"
	| "music-player"
	| "music-sidebar" // ✅ 新增类型
	| "pio"
	| "site-stats"
	| "calendar"
	| "custom";
```

> **规则**：所有侧栏组件必须先在 `WidgetComponentType` 中声明。缺少此步 TS 编译不通过，配置也无意义。

---

### 步骤 2：在 `sidebarLayoutConfig` 中配置布局

文件：`src/config.ts`

使用 `SidebarLayoutConfig.components` 来控制组件出现的位置和顺序：

```ts
export const sidebarLayoutConfig: SidebarLayoutConfig = {
	properties: [
		{
			type: "music-sidebar",
			position: "sticky",
			class: "onload-animation",
			animationDelay: 100,
		},
		// ... 其他组件
	],
	components: {
		left: ["profile", "announcement", "categories", "tags"],
		right: ["site-stats", "calendar", "music-sidebar"], // 在右侧栏显示
		drawer: [
			"profile",
			"announcement",
			"music-sidebar",
			"categories",
			"tags",
		],
	},
	// ...
};
```

> **规则**：
> - `properties` 定义组件的"存在性"、位置（top / sticky）、动画等属性
> - `components.left / right / drawer` 定义在不同侧栏中"展示哪些组件、按什么顺序"

---

### 步骤 3：在所有侧栏渲染器中注册组件（最容易忘记）

这是最常出错的步骤。侧栏渲染依赖**手动的 componentMap**，若未注册则对应类型会被静默忽略。

请务必检查以下 **3 个文件**：

#### 3.1 左侧栏：`src/components/widgets/sidebar/SideBar.astro`

```ts
import { MusicSidebarWidget } from "../music-sidebar";

const componentMap: Record<string, unknown> = {
	profile: Profile,
	announcement: Announcement,
	categories: Categories,
	tags: Tags,
	toc: SidebarTOC,
	"music-player": MusicPlayer,
	"music-sidebar": MusicSidebarWidget, // ✅ 必须注册
	"site-stats": SiteStats,
	calendar: Calendar,
};
```

#### 3.2 右侧栏：`src/components/layout/RightSideBar.astro`

```ts
import { MusicSidebarWidget } from "@/components/widgets/music-sidebar";

const componentMap: Record<string, unknown> = {
	profile: Profile,
	announcement: Announcement,
	categories: Categories,
	tags: Tags,
	toc: SidebarTOC,
	"music-player": MusicPlayer,
	"music-sidebar": MusicSidebarWidget, // ✅ 必须注册（与左侧栏独立）
	"site-stats": SiteStats,
	calendar: Calendar,
};
```

#### 3.3 抽屉侧栏：`src/components/widgets/sidebar/SideBar.astro`

抽屉侧栏与左侧栏共用同一个文件 `SideBar.astro`，确认 3.1 的注册已覆盖抽屉。

> **典型遗漏**：只在 `SideBar.astro`（左侧栏）中注册了组件，却忘记在 `RightSideBar.astro`（右侧栏）中注册。导致在 `sidebarLayoutConfig.components.right` 中添加了组件但右侧栏始终不显示。

---

## 常见问题排查

### Q1：配置了组件但页面不显示

请按以下顺序排查：

1. `src/types/config.ts` 中的 `WidgetComponentType` 是否包含该类型？
2. `src/config.ts` 中 `sidebarLayoutConfig.components` 的对应数组是否包含该类型？
3. 对应侧栏渲染器的 `componentMap` 是否注册了该类型？
4. 该侧栏在当前设备宽度下是否被响应式逻辑隐藏了？
5. 组件自身是否有 `enable` 配置导致不渲染？

### Q2：音乐播放器配置说明

音乐播放器有以下配置选项（位于 `musicPlayerConfig`）：

| 配置项 | 类型 | 说明 |
|--------|------|------|
| `enable` | boolean | 控制音乐核心是否初始化。为 `false` 时，悬浮 UI 和侧栏均不工作 |
| `showFloatingPlayer` | boolean | 控制悬浮播放器 UI 是否显示。为 `false` 时仅侧栏可用 |
| `mode` | "meting" \| "local" | 播放列表数据来源 |
| `meting_api` | string | Meting API 地址 |
| `id` | string | 歌单 ID |
| `server` | string | 音乐源服务器 |
| `type` | string | 播单类型 |

**验证场景**：
- `enable=true, showFloatingPlayer=true` — 全功能，悬浮 UI 和侧栏均可用
- `enable=true, showFloatingPlayer=false` — 仅侧栏可用，悬浮 UI 不显示
- `enable=false` — 音乐核心不初始化，悬浮 UI 和侧栏均不工作

**注意**：`music-sidebar` 侧栏组件依赖 `musicPlayerStore` 运行，当 `enable=false` 时侧栏也无法工作。

### Q3：只在左侧栏显示，右侧栏不显示

请检查 `RightSideBar.astro` 的 `componentMap` 是否包含该组件类型。左侧栏注册了不等于右侧栏也自动注册。

### Q4：组件在 SSR 时报错 `window is not defined`

**原因**：Svelte 组件在服务端渲染阶段访问了 `window` 对象。

**解法**：在 Astro 中使用 `client:only` 指令禁止服务端渲染：

```astro
<!-- ❌ 错误：服务端仍会渲染组件 -->
<MyComponent client:idle />

<!-- ✅ 正确：只在浏览器执行 -->
<MyComponent client:only="svelte" />
```

### Q5：多个侧栏需要各自独立的状态

若同一组件在多个侧栏实例中需要独立状态（如侧栏播放列表的展开/收起状态），该状态应存在**组件自身**，而非共享全局状态。

---

## 代码审查检查清单

在代码审查时，必须检查：

- [ ] `src/types/config.ts` 的 `WidgetComponentType` 中已声明新组件类型
- [ ] `src/config.ts` 的 `sidebarLayoutConfig.components` 中已配置该组件
- [ ] `SideBar.astro`（左侧栏 + 抽屉）的 `componentMap` 中已注册
- [ ] `RightSideBar.astro`（右侧栏）的 `componentMap` 中已注册
- [ ] Svelte 组件使用了正确的 `client:*` 指令（避免 SSR window 错误）
- [ ] 组件自身的功能开关（如 `enable`、`showFloatingPlayer`）已正确配置

---

## 配置文件速查表

| 文件 | 作用 | 必须操作 |
|------|------|----------|
| `src/types/config.ts` | 类型声明 | 在 `WidgetComponentType` 中新增枚举 |
| `src/config.ts` | 布局配置 | 在 `sidebarLayoutConfig.components` 中添加组件 |
| `src/components/widgets/sidebar/SideBar.astro` | 左侧栏渲染 | 在 `componentMap` 中注册 |
| `src/components/layout/RightSideBar.astro` | 右侧栏渲染 | 在 `componentMap` 中注册（独立于左侧栏） |
