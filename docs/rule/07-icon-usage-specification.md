# 图标使用规范 (Icon Usage Specification)

## 1. 图标系统架构总览

本项目基于 [Iconify](https://iconify.design/) 生态系统，根据文件类型和运行场景，存在 **3 种标准化的图标使用方式**：

| # | 使用方式 | 属性名 | 导入来源 | 适用文件类型 | 运行时机 |
|---|---------|--------|---------|-------------|---------|
| ① | `<Icon name="...">` | `name` | `astro-icon/components` | `.astro` 静态组件/页面 | 构建时 (SSR) |
| ② | `<Icon icon="...">` | `icon` | `@iconify/svelte` | `.svelte` 客户端组件 | 客户端运行时 (CSR) |
| ③ | `<Icon icon="...">` | `icon` | 自定义 `@components/misc/Icon.astro` | `.astro`（需 loading 状态） | 构建时 + 客户端 |

> **禁止在业务代码中直接使用原生 `<iconify-icon>` 标签。**

---

## 2. 各方式的详细说明

### 2.1 方式一：astro-icon（`.astro` 文件首选）

```astro
---
import { Icon } from "astro-icon/components";
---

<Icon name="material-symbols:arrow-back" class="text-base" />
<Icon name={dynamicIconName} class="text-xl" />
```

- **属性**: `name`
- **底层库**: [`astro-icon`](package.json) v^1.1.5
- **特点**: Astro 社区集成，构建时优化图标引用
- **适用场景**: 所有 `.astro` 页面和组件中的常规图标

### 2.2 方式二：@iconify/svelte（`.svelte` 文件唯一选择）

```svelte
<script lang="ts">
	import Icon from "@iconify/svelte";
</script>

<Icon icon="material-symbols:pause" class="text-xl" />
<Icon icon={dynamicIcon} class="text-lg" />
```

- **属性**: `icon`
- **底层库**: [`@iconify/svelte`](package.json) v^5.2.1
- **特点**: Iconify 官方 Svelte 组件，客户端动态渲染
- **适用场景**: 所有 `.svelte` 组件

### 2.3 方式三：自定义 Icon 组件（增强封装）

```astro
---
import Icon from "../../misc/Icon.astro";
---

<Icon icon="mdi:react" size="lg" color="#61DAFB" fallback="⚛" />
```

- **属性**: `icon`, `size`, `color`, `fallback`, `loading`
- **实现位置**: [`src/components/atoms/Icon/Icon.astro`](../../src/components/atoms/Icon/Icon.astro)
- **包装器**: [`src/components/misc/Icon.astro`](../../src/components/misc/Icon.astro)
- **特点**: 内置 loading 状态、fallback 占位、尺寸系统、颜色控制
- **适用场景**: 需要 loading 状态管理或 fallback 的场景

---

## 3. `name` vs `icon` 差异根因

这是两个不同库的 API 设计差异，**不是同一组件的两个属性选项**：

| 维度 | `astro-icon` (`name`) | `@iconify/svelte` / `iconify-icon` (`icon`) |
|------|---------------------|-------------------------------------------|
| **API 标准归属** | Astro 社区第三方集成 | Iconify 官方标准 API |
| **设计理念** | 模仿 Astro Image 组件命名约定 | 遵循 Iconify 全生态统一规范 |
| **运行阶段** | 构建时处理 (SSR) | 浏览器端渲染 (CSR) |
| **性能特征** | 可内联 SVG，减少网络请求 | 从 CDN 按需加载图标数据 |
| **跨框架支持** | 仅限 Astro | 支持 React/Vue/Svelte/Web Component |

---

## 4. 尺寸对照表

将原生的 `width`/`height` 属性转换为 CSS 类：

| 原生写法 | 替代 CSS 类 | Tailwind 等效 |
|---------|------------|-------------|
| `width="10" height="10"` | `w-2.5 h-2.5 text-[0.625rem]` | 最小图标（节点等） |
| `width="14" height="14"` | `w-3.5 h-3.5 text-xs` | 元信息图标（日期、位置） |
| `width="16" height="16"` | `w-4 h-4 text-base` | 行内小图标（标签、按钮内） |
| `width="20" height="20"` | `text-lg` | 卡片头部图标 |
| `width="48" height="48"` | `text-5xl` | 占位大图标 |
| `width="64" height="64"` | `text-6xl` | 空状态占位图标 |

> **推荐优先使用 Tailwind 的 `text-*` 或 `w-* h-*` 类来控制图标大小**，而非原生 `width`/`height` 属性。

---

## 5. 决策流程图

```
编写新代码需要添加图标？
        │
        ├── 文件是 .svelte？
        │     └── 是 → import Icon from "@iconify/svelte"
        │            → <Icon icon="..." />
        │
        └── 文件是 .astro？
              ├── 需要 loading/fallback 状态？
              │     └── 是 → import Icon from "@components/misc/Icon.astro"
              │            → <Icon icon="..." size="..." fallback="..." />
              │
              └── 否 → import { Icon } from "astro-icon/components"
                     → <Icon name="..." />
```

---

## 6. 常见错误与修正

### 错误 1：属性名混用（已修复）

```svelte
<!-- ❌ 错误：@iconify/svelte 不认识 name 属性 -->
import Icon from "@iconify/svelte";
<Icon name="material-symbols:xxx" />

<!-- ✅ 正确 -->
import Icon from "@iconify/svelte";
<Icon icon="material-symbols:xxx" />
```

### 错误 2：直接使用原生标签（已统一修复）

```astro
<!-- ❌ 已废弃：直接使用 iconify-icon Web Component -->
<iconify-icon icon="material-symbols:xxx" width="16" height="16" />

<!-- ✅ 正确：通过 astro-icon 封装 -->
import { Icon } from "astro-icon/components";
<Icon name="material-symbols:xxx" class="text-base w-4 h-4" />
```

### 错误 3：在同一文件中混合多种方式

```astro
<!-- ❌ 避免：同一文件中混用不同图标方案 -->
<Icon name="material-symbols:a" />       <!-- astro-icon -->
<iconify-icon icon="material-symbols:b" /> <!-- 原生 -->

<!-- ✅ 正确：保持一致 -->
<Icon name="material-symbols:a" />
<Icon name="material-symbols:b" />
```

---

## 7. 项目中使用的图标集

| 图标集前缀 | 说明 | 使用频率 |
|-----------|------|---------|
| `material-symbols:` | Google Material Symbols（主图标集） | ★★★★★ 最高 |
| `fa7-solid:` / `fa7-regular:` | Font Awesome 7 | ★★☆☆☆ 低 |
| `mdi:` | Material Design Icons | ★★☆☆☆ 低 |
| `eos-icons:` | EOS Icons（loading 等） | ★☆☆☆☆ 极少 |

> 新增图标时，**优先使用 `material-symbols:` 图标集**以保持视觉一致性。

---

## 8. 相关文件索引

| 文件 | 角色 |
|-----|------|
| [`src/components/atoms/Icon/Icon.astro`](../../src/components/atoms/Icon/Icon.astro) | 自定义 Icon 组件核心实现 |
| [`src/components/atoms/Icon/types.ts`](../../src/components/atoms/Icon/types.ts) | 自定义 Icon Props 类型定义 |
| [`src/components/misc/Icon.astro`](../../src/components/misc/Icon.astro) | 向后兼容包装器 |
| [`src/components/misc/IconifyLoader.astro`](../../src/components/misc/IconifyLoader.astro) | 全局 Iconify 加载器 |
| [`src/utils/icon-loader.ts`](../../src/utils/icon-loader.ts) | Iconify 加载工具类 |
| [`package.json`](../../package.json) | 依赖声明（astro-icon, @iconify/svelte） |
