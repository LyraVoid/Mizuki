# 原子化组件使用规范

## 概述

本文档规定了在开发过程中必须优先使用现有原子化组件，以及在缺少合适组件时应当创建新的原子化组件。

## 核心原则

### 黄金法则

> **在编写新代码前，先检查是否存在可复用的原子化组件。如果没有，就创建一个。**

```
❌ 错误：在组件中直接编写重复的 UI 结构
✅ 正确：使用现有原子组件或创建新的原子组件
```

## 组件分层架构

项目采用原子化设计（Atomic Design），组件分为以下层级：

```
atoms/          → 原子组件（不可再分）
├── Badge/      → 徽章、序号
├── Button/     → 按钮
├── Chip/       → 标签、分类
├── Icon/       → 图标
├── Image/      → 图片
├── Link/       → 链接
├── Loader/     → 加载器
└── ...

features/      → 功能组件（组合 atoms）
├── posts/      → 文章相关
├── projects/   → 项目相关
└── ...

organisms/     → 有机体组件（组合 features）
├── navigation/ → 导航
└── footer/     → 页脚

widgets/       → 小组件（独立功能单元）
├── sidebar/    → 侧边栏
├── profile/    → 个人资料
└── ...

misc/          → 杂项组件（通用容器）
├── ListContainer/ → 列表容器
└── ListDivider/   → 列表分隔线
```

## 现有原子组件清单

### atoms/ - 原子组件

| 组件 | 路径 | 用途 |
|------|------|------|
| `Badge` | `atoms/Badge/` | 序号徽章、计数徽章 |
| `Button` | `atoms/Button/` | 按钮（支持多种变体） |
| `Chip` | `atoms/Chip/` | 标签、分类标签 |
| `Icon` | `atoms/Icon/` | 图标渲染 |
| `Image` | `atoms/Image/` | 图片（支持懒加载、loading） |
| `Link` | `atoms/Link/` | 链接（带图标等） |
| `Loader` | `atoms/Loader/` | 加载动画 |
| `tag-chip` | `atoms/tag-chip/` | 文章标签 |

### misc/ - 通用组件

| 组件 | 路径 | 用途 |
|------|------|------|
| `ListContainer` | `misc/ListContainer/` | 卡片容器（标题+图标+徽章） |
| `ListDivider` | `misc/ListDivider/` | 列表分隔线 |
| `CardBase` | 全局样式 | 卡片基础样式 |

## 使用决策流程

```
开始编写新 UI
       │
       ▼
┌──────────────────────┐
│ 存在可用的原子组件？  │
└──────────────────────┘
       │
   是  │  否
   ▼   ▼
使用   考虑创建新组件
现有   │
组件   ▼
   ┌──────────────────┐
   │ 多个场景可复用？ │
   └──────────────────┘
       │
   是  │  否
   ▼   ▼
创建   直接实现
原子   但标记待重构
组件   │
       ▼
   提交 Issue
```

## 实践指南

### 场景 1：需要显示序号

```astro
<!-- ❌ 错误：直接写死样式 -->
<div class="w-6 h-6 rounded-md bg-enter-btn text-primary flex items-center justify-center">
    {index + 1}
</div>

<!-- ✅ 正确：使用 Badge 组件 -->
<Badge variant="number">{index + 1}</Badge>
```

### 场景 2：需要分类标签

```astro
<!-- ❌ 错误：直接写死样式 -->
<span class="px-1.5 py-0.5 rounded bg-btn-regular-bg text-btn-content">
    {category}
</span>

<!-- ✅ 正确：使用 Chip 组件 -->
<Chip>{category}</Chip>
```

### 场景 3：需要卡片容器（标题+图标+内容）

```astro
<!-- ❌ 错误：重复编写卡片头部 -->
<div class="card-base p-5">
    <div class="flex items-center gap-2 pb-3 border-b border-dashed">
        <Icon name="material-symbols:article" class="text-xl text-primary" />
        <span class="font-bold">标题</span>
        <span class="ml-auto text-xs px-2 py-0.5 rounded-full bg-btn-bg">标签</span>
    </div>
    <!-- 内容 -->
</div>

<!-- ✅ 正确：使用 ListContainer 组件 -->
<ListContainer title="标题" icon="material-symbols:article" badge="标签">
    <!-- 内容 -->
</ListContainer>
```

### 场景 4：需要列表分隔线

```astro
<!-- ❌ 错误：重复编写分隔线 -->
<div class="border-b border-dashed border-line-divider"></div>

<!-- ✅ 正确：使用 ListDivider 组件 -->
<ListDivider />
```

### 场景 5：需要复用列表项布局

```astro
<!-- ❌ 错误：在多个组件中重复列表项代码 -->
<div class="flex items-center gap-3 px-3 py-3">
    <div class="w-6 h-6">...</div>
    <div class="flex-1 min-w-0">
        <div class="font-bold">{title}</div>
        <div class="text-xs text-black/30">{date}</div>
    </div>
    <Icon name="chevron-right" />
</div>

<!-- ✅ 正确：创建 PostListItem 组件 -->
<PostListItem post={post} index={index} />
```

## 创建新原子组件的判断标准

当出现以下情况时，应当创建新的原子组件：

| 标准 | 说明 |
|------|------|
| **重复出现 2+ 次** | 相同的 UI 结构在多个文件中出现 |
| **职责单一** | 组件只负责一件事（显示徽章、渲染图标等） |
| **可独立存在** | 不依赖特定业务逻辑 |
| **可配置化** | 通过 Props 控制外观和行为 |

### 创建示例：创建 Badge 组件

如果项目中没有 `Badge` 组件，但多处需要显示序号徽章：

```astro
// src/components/atoms/Badge/Badge.astro
---
interface Props {
    variant?: "number" | "dot" | "count";
    size?: "sm" | "md" | "lg";
    children: any;
}

const { variant = "number", size = "md" } = Astro.props;

const sizeClasses = {
    sm: "w-4 h-4 text-xs",
    md: "w-6 h-6 text-sm",
    lg: "w-8 h-8 text-base"
};
---

<span class:list={[
    "shrink-0 rounded-md bg-(--enter-btn-bg) text-(--primary)",
    "flex items-center justify-center font-bold",
    sizeClasses[size]
]}>
    {variant === "number" && <slot />}
    {variant === "dot" && <span class="w-2 h-2 rounded-full bg-(--primary)" />}
    {variant === "count" && <slot />}
</span>
```

## 常见问题

### Q1：原子组件 Props 太多怎么办？

**A**：使用合理的默认值，仅暴露必要的 Props。

```astro
<!-- ✅ 好的设计：合理的默认值 -->
<Badge>{count}</Badge>
<Badge variant="dot" />
<Badge variant="number" size="lg">{num}</Badge>
```

### Q2：现有组件样式不完全匹配怎么办？

**A**：
1. 检查是否可以通过新增 Props 变体解决
2. 使用 `class` prop 追加样式（如果有）
3. 讨论是否需要 fork 并修改原组件

### Q3：不确定是否需要创建新组件怎么办？

**A**：保守策略——先创建。如果后续发现不需要，可以合并或删除。

### Q4：原子组件和功能组件的区别？

**A**：
- **原子组件**：最小 UI 单元（Button、Icon、Badge）
- **功能组件**：组合原子组件实现特定功能（PostCard、UserProfile）

## 代码审查检查清单

在代码审查时，必须检查：

- [ ] 是否优先使用了现有原子组件？
- [ ] 是否有重复的 UI 代码可以抽取为原子组件？
- [ ] 新创建的组件是否遵循单一职责原则？
- [ ] 组件命名是否符合规范（PascalCase）？
- [ ] 组件是否添加到 `index.ts` 导出？

## 违规示例

### 示例 1：直接在组件中写死徽章样式

```astro
<!-- ❌ 违规代码 -->
---
const { index } = Astro.props;
---

<div class="w-6 h-6 rounded-md bg-(--enter-btn-bg) text-(--primary) flex items-center justify-center text-sm font-bold">
    {index + 1}
</div>

<!-- ✅ 修复后：使用 Badge 组件 -->
import Badge from "@/components/atoms/Badge/Badge.astro";
<Badge>{index + 1}</Badge>
```

### 示例 2：多个组件重复相同的卡片头部

```astro
<!-- ❌ 违规代码：WidgetA.astro -->
<div class="card-base p-5">
    <div class="flex items-center gap-2 pb-3 border-b border-dashed border-(--line-divider)">
        <Icon name="article" />
        <span class="font-bold">标题</span>
    </div>
    <!-- 内容 -->
</div>

<!-- ❌ 违规代码：WidgetB.astro（同样的头部代码） -->
<div class="card-base p-5">
    <div class="flex items-center gap-2 pb-3 border-b border-dashed border-(--line-divider)">
        <Icon name="category" />
        <span class="font-bold">分类</span>
    </div>
    <!-- 内容 -->
</div>

<!-- ✅ 修复后：使用 ListContainer 组件 -->
<ListContainer title="标题" icon="article">
    <!-- 内容 -->
</ListContainer>
```

## 相关文档

- [组件架构设计规范](./01-component-architecture.md) - 组件分层和架构
- [组件拆分指南](./02-component-split-guide.md) - 何时需要拆分组件
- [文件组织架构规范](./03-file-organization-architecture.md) - 文件组织方式

---

**最后更新**: 2026-03-21
**维护者**: Mizuki 开发团队
