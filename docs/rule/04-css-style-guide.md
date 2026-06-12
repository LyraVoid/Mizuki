# CSS 样式指南

## 概述

本文档定义了 Mizuki 项目的 CSS 样式规范，确保样式的一致性、可维护性和性能。

## 核心原则

### 禁止使用 `!important` 级别

项目中**应该尽量避免使用 `!important` 级别的 CSS**，原因如下：

1. **破坏样式优先级**：`!important` 会打破 CSS 的自然级联规则
2. **难以维护**：一旦使用 `!important`，后续修改将不得不使用更多的 `!important`
3. **与主题系统冲突**：`!important` 可能导致不可预期的样式冲突
4. **Tailwind CSS 不兼容**：Tailwind 的原子类设计基于正常的 CSS 优先级，`!important` 会破坏这种设计
5. **调试困难**：`!important` 使得样式调试变得非常困难

## 允许使用 `!important` 的例外情况

### Twikoo 评论区样式

在 `src/styles/twikoo.css` 文件中**允许使用 `!important`**。

**理由**：
1. **第三方库动态注入**：Twikoo 是第三方评论系统，其样式通过 JavaScript 动态注入到页面
2. **选择器优先级高**：Twikoo 内部样式使用了较高的选择器优先级，常规 CSS 无法覆盖
3. **隔离性好**：Twikoo 样式文件独立，`!important` 的影响范围仅限于评论区，不会影响其他组件
4. **无其他替代方案**：由于无法控制 Twikoo 的样式注入时机和方式，`!important` 是唯一可靠的覆盖方式
5. **CSS-in-JS 库**：Twikoo 使用组件库，其内联样式的优先级很难用常规 CSS 覆盖

**示例**：
```css
/* ✅ 允许：在 twikoo.css 中覆盖 Twikoo 默认样式 */
.tk-loading {
  display: flex !important;
  justify-content: center !important;
}

.tk-btn {
  color: var(--primary) !important;
  background-color: transparent !important;
}

.tk-submit-btn {
  background-color: var(--primary) !important;
  color: white !important;
}
```

### 其他特殊情况（需要审批）

如果遇到以下特殊情况，需要经过团队审批才能使用 `!important`：

1. **覆盖第三方库的必要样式**（如 Twikoo、Chart.js 等）
2. **修复框架级别的 bug**（仅作为临时解决方案，需要跟进）
3. **处理浏览器的已知 bug**（仅作为临时解决方案，需要添加注释）

**审批流程**：
1. 在 Pull Request 中说明为什么需要使用 `!important`
2. 提供替代方案的尝试记录
3. 获得至少 1 名核心开发者的批准

## 正确做法

### 1. 提高选择器优先级

通过更具体的选择器来覆盖样式，而不是使用 `!important`。

**❌ 错误示例**：
```css
.album-card {
  background-color: white !important;
  color: black !important;
}

.dark .album-card {
  background-color: black !important;
}
```

**✅ 正确示例**：
```css
/* 通过提高选择器优先级覆盖样式 */
.album-card.card-base {
  background-color: white;
  color: black;
}

.dark .album-card.card-base {
  background-color: black;
}

/* 或者使用更具体的选择器 */
.card-base.album-card {
  background-color: white;
}
```

### 2. 使用 CSS 变量

使用 CSS 变量而不是硬编码值，这样可以在全局统一修改。

**❌ 错误示例**：
```css
.button {
  background-color: #3b82f6 !important;
  color: #ffffff !important;
}
```

**✅ 正确示例**：
```css
:root {
  --primary: #3b82f6;
  --text-color: #ffffff;
}

.button {
  background-color: var(--primary);
  color: var(--text-color);
}
```

### 3. 利用 Tailwind 的优先级

Tailwind CSS 的原子类按顺序应用，后面的类会覆盖前面的类。

**❌ 错误示例**：
```css
<div class="!bg-white !text-black">
  内容
</div>
```

**✅ 正确示例**：
```astro
---
// Tailwind 类按顺序应用，不需要 !important
---

<div class="bg-white dark:bg-black text-black dark:text-white">
  内容
</div>
```

### 4. 使用作用域样式

Astro 的作用域样式自动提供选择器隔离。

**❌ 错误示例**：
```astro
---
---

<div class="card">
  内容
</div>

<style>
  /* 使用 :global 影响全局 */
  :global(.card) {
    background: white !important;
  }
</style>
```

**✅ 正确示例**：
```astro
---
---

<div class="card card-base">
  内容
</div>

<style>
  /* 作用域样式自动隔离，不需要 :global */
  .card {
    background: var(--card-bg);
    color: var(--text-color);
  }
</style>
```

### 5. 使用组合类

通过组合多个 Tailwind 类来实现复杂的样式。

**❌ 错误示例**：
```css
<style>
  .custom-button {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0.5rem 1rem !important;
    border-radius: 0.5rem !important;
    font-weight: 600 !important;
    transition: all 0.2s !important;
  }
</style>
```

**✅ 正确示例**：
```astro
---
---

<button class="inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200">
  按钮
</button>
```

## 特殊情况处理

### 需要覆盖第三方库样式时

#### Twikoo 评论区（允许 `!important`）✅

**文件位置**：`src/styles/twikoo.css`

```css
/* ✅ 允许：Twikoo 样式文件 */
.tk-btn {
  color: var(--primary) !important;
  background-color: transparent !important;
}

.tk-content {
  color: var(--text-color) !important;
  font-size: 1rem !important;
}

.tk-submit-btn {
  background-color: var(--primary) !important;
  color: white !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.tk-loading-spinner {
  border-color: var(--primary) transparent transparent transparent !important;
}

/* 其他 Twikoo 相关样式... */
```

#### 其他第三方库（需要审批）

**❌ 错误示例**：
```css
/* 未经审批直接使用 !important */
.external-library-element {
  color: red !important;
}
```

**✅ 正确示例**：
```css
/* 先尝试其他方法 */
.external-library-container .external-library-element {
  /* 方法 1：提高选择器优先级 */
  color: red;
}

/* 方法 2：使用更具体的选择器 */
.widget-container .external-library-element {
  color: red;
}

/* 方法 3：添加说明注释 */
/*
 * TODO: 临时解决方案，需要与库维护者协商
 * Issue: #123
 */
.external-library-element {
  color: red !important; /* 需要审批，PR #123 */
}
```

### 内联样式的优先级

内联样式的优先级高于外部样式表，应谨慎使用。

**❌ 错误示例**：
```astro
---
<div style="background-color: white !important; padding: 1rem !important;">
  内容
</div>
```

**✅ 正确示例**：
```astro
---
<!-- 使用 Tailwind 类或自定义 class -->
<div class="bg-white p-4 custom-card">
  内容
</div>

<style>
  .custom-card {
    background-color: var(--card-bg);
    padding: 1rem;
  }
</style>
```

### 动态样式

使用 CSS 变量或样式绑定，而不是在 JS 中直接操作 style。

**❌ 错误示例**：
```javascript
element.style.setProperty('background-color', 'white', 'important');
```

**✅ 正确示例**：
```typescript
// 使用 CSS 变量
document.documentElement.style.setProperty('--dynamic-color', dynamicValue);
```

```css
:root {
  --dynamic-color: #3b82f6;
}

.dynamic-element {
  background-color: var(--dynamic-color);
}
```

## Tailwind CSS 的 `!important` 使用

### Tailwind v4 的 `!` 前缀

Tailwind CSS v4 提供了 `!` 前缀来添加 `!important`：

**⚠️ 谨慎使用**：仅在绝对必要时使用 `!` 前缀。

**❌ 错误示例**：
```astro
---
<!-- 未经审批使用 ! 前缀 -->
<div class="!bg-white !text-black">
  内容
</div>
```

**✅ 正确示例**：
```astro
---
<!-- 使用正常的 Tailwind 类 -->
<div class="bg-white dark:bg-black text-black dark:text-white">
  内容
</div>
```

**使用场景**：仅在必须覆盖第三方库的内联样式时使用。

```astro
---
<!-- 只有在无法通过其他方式覆盖时才使用 -->
<div class="!bg-white" style="/* 需要覆盖第三方样式 */">
  内容
</div>
```

## CSS 优先级规则

### 选择器优先级（从高到低）

1. **内联样式（`style="..."`）**：最高优先级
2. **`!important`**：强制最高优先级
3. **ID 选择器（`#id`）**
4. **类选择器（`.class`）**
5. **属性选择器（`[attr]`）**
6. **伪类选择器（`:hover`、`:active` 等）**
7. **伪元素选择器（`::before`、`::after` 等）**
8. **元素选择器（`div`、`span` 等）**：最低优先级

### 特异性规则

```css
/* 优先级 1：ID 选择器 */
#unique-element {
  color: red;
}

/* 优先级 2：类选择器 + 伪类 */
.button:hover {
  color: blue;
}

/* 优先级 3：类选择器 */
.button {
  color: green;
}

/* 优先级 4：元素选择器 */
div {
  color: black;
}
```

### 选择器特异性计算

```css
/* 特异性：1 个 ID，0 个类，0 个属性 = 100 分 */
#header .nav-link {
  color: blue;
}

/* 特异性：0 个 ID，1 个类，1 个属性 = 11 分 */
.nav-link.active {
  color: green; /* 更高优先级 */
}

/* 特异性：0 个 ID，2 个类 = 20 分 */
.card .header .title {
  color: red; /* 最高优先级 */
}
```

## 暗色主题样式

### 使用 CSS 变量

使用 CSS 变量实现主题切换，避免使用 `!important`。

**❌ 错误示例**：
```css
/* 使用 !important 强制覆盖 */
.dark .card {
  background-color: black !important;
  color: white !important;
}
```

**✅ 正确示例**：
```css
:root {
  --card-bg: white;
  --text-color: black;
}

.dark {
  --card-bg: #1f2937;
  --text-color: #f3f4f6;
}

.card {
  background-color: var(--card-bg);
  color: var(--text-color);
}
```

### 暗色主题选择器

```css
/* ✅ 正确：使用暗色主题类名 */
.dark .card {
  background-color: var(--card-bg-dark);
}

/* 或者在 Astro 组件中使用 */
<style>
  :global(.dark) .card {
    background-color: var(--card-bg-dark);
  }
</style>
```

## 组件样式最佳实践

### 1. 作用域样式

Astro 组件默认使用作用域样式，不需要额外的包装器。

**✅ 正确示例**：
```astro
---
---

<div class="my-component">
  内容
</div>

<style>
  .my-component {
    /* 样式仅应用于当前组件 */
    padding: 1rem;
  }
</style>
```

### 2. 全局样式（谨慎使用）

只在真正需要全局影响时使用 `:global()`。

**❌ 错误示例**：
```astro
---
<style>
  /* 影响 .my-class 的所有实例 */
  :global(.my-class) {
    background: white !important;
  }
</style>
```

**✅ 正确示例**：
```css
/* 在全局样式文件中定义 */
.src/styles/global.css {
  .global-utility {
    /* 真正需要的全局样式 */
    display: flex;
  }
}
```

### 3. 使用 CSS 变量优先

优先使用 CSS 变量，而不是硬编码值。

**❌ 错误示例**：
```css
.button {
  background-color: #3b82f6;
  padding: 8px 16px;
  border-radius: 4px;
}
```

**✅ 正确示例**：
```css
:root {
  --primary: #3b82f6;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --radius-md: 4px;
}

.button {
  background-color: var(--primary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
}
```

### 4. Tailwind 与自定义样式混合

```astro
---
---

<!-- Tailwind 处理布局和间距 -->
<div class="flex flex-col gap-4 p-6">
  <!-- 自定义样式处理组件特定行为 -->
  <div class="custom-card">
    内容
  </div>
</div>

<style>
  .custom-card {
    /* 组件特定的样式 */
    background-color: var(--card-bg);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
</style>
```

## 检查清单

在提交代码前，确保：

### CSS 相关
- [ ] 普通业务 CSS 文件中没有 `!important`
- [ ] `<style>` 标签中没有 `!important`（Twikoo 组件除外）
- [ ] Tailwind 类中没有 `!` 前缀（除非有充分理由）
- [ ] 使用了 CSS 变量而不是硬编码值
- [ ] 使用了作用域样式而不是全局样式
- [ ] 样式优先级合理，易于理解和维护

### Twikoo 样式
- [ ] Twikoo 相关样式只在 `src/styles/twikoo.css` 中
- [ ] 使用了 `!important` 覆盖 Twikoo 默认样式
- [ ] 添加了必要的注释说明为什么需要覆盖

### 主题样式
- [ ] 使用 CSS 变量实现主题切换
- [ ] 暗色主题使用正确的类名或变量
- [ ] 没有 `!important` 强制覆盖主题样式

### 性能相关
- [ ] 避免了不必要的重复样式
- [ ] 使用了 Tailwind 的工具类而不是自定义 CSS
- [ ] 没有过度的选择器嵌套

## 替代方案优先级

在需要覆盖样式时，按以下优先级尝试：

### 1. 使用 Tailwind 原子类（首选）

```astro
---
<div class="bg-white p-4 rounded-lg shadow-md">
  内容
</div>
```

### 2. 提高选择器优先级（次选）

```css
.card-base.album-card {
  background-color: white;
}
```

### 3. 使用 CSS 变量（再次选）

```css
:root {
  --album-bg: white;
}

.album-card {
  background-color: var(--album-bg);
}
```

### 4. 使用作用域样式（备选）

```css
/* 在组件内部 */
.my-component .element {
  background-color: white;
}
```

### 5. 使用全局样式（特殊）

```css
/* 在全局样式文件中 */
.src/styles/global.css {
  .special-case {
    background-color: white;
  }
}
```

### 6. 使用 `!important`（最后手段）

**仅允许的情况**：
- Twikoo 评论区样式
- 经过团队审批的第三方库样式覆盖

## 常见问题和解决方案

### Q1: 样式不生效怎么办？

**A**: 按照以下步骤排查：

1. **检查选择器特异性**：优先使用更具体的选择器
2. **检查样式加载顺序**：后面的样式会覆盖前面的样式
3. **检查作用域**：确认样式是否在正确的作用域内
4. **检查 CSS 变量**：确认变量是否正确定义
5. **检查 Tailwind 配置**：确认 Tailwind 是否正确配置

### Q2: 如何覆盖 Tailwind 的默认样式？

**A**: 使用 Tailwind 的工具类或自定义样式，而不是 `!important`。

```astro
---
<!-- ✅ 正确：使用 Tailwind 类 -->
<div class="text-lg font-semibold text-gray-900">
  标题
</div>

<!-- ❌ 错误：使用 !important -->
<div class="!text-lg !font-semibold">
  标题
</div>
```

### Q3: 第三方库样式冲突怎么办？

**A**: 按照优先级处理：

1. **提高选择器优先级**
2. **使用更具体的选择器**
3. **包装组件以隔离样式**
4. **最后手段**：使用 `!important`（需要审批）

**示例**：
```css
/* 优先级 1：包装器隔离 */
.my-wrapper .external-library-element {
  color: var(--text-color);
}

/* 优先级 2：更具体的选择器 */
div.widget-container .external-library-element {
  color: var(--text-color);
}

/* 优先级 3：临时解决方案（需要审批） */
.external-library-element {
  color: var(--text-color) !important; /* 需要审批，Issue #123 */
}
```

### Q4: 主题切换时样式闪烁怎么办？

**A**: 使用 CSS 变量和过渡，而不是 `!important` 强制刷新。

```css
:root {
  --bg-color: white;
  --text-color: black;
}

.dark {
  --bg-color: #1f2937;
  --text-color: #f3f4f6;
}

.card {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

## Twikoo 样式文件规范

### 文件位置

```
src/styles/
├── global.css           # 全局样式
├── theme.css            # 主题样式
├── components.css       # 组件样式
└── twikoo.css          # Twikoo 样式（允许 !important）
```

### Twikoo 样式示例

```css
/* src/styles/twikoo.css */
/* Twikoo 评论区样式 - 允许使用 !important */

/* 容器样式 */
.tk-admin {
  background-color: var(--card-bg) !important;
  border-radius: 8px !important;
}

/* 按钮样式 */
.tk-btn {
  color: var(--primary) !important;
  background-color: transparent !important;
  transition: all 0.2s ease !important;
}

.tk-btn:hover {
  color: var(--primary-hover) !important;
  background-color: var(--primary-bg-light) !important;
}

/* 输入框样式 */
.tk-input {
  background-color: var(--input-bg) !important;
  border-color: var(--border-color) !important;
  color: var(--text-color) !important;
}

/* 提交按钮 */
.tk-submit-btn {
  background-color: var(--primary) !important;
  color: white !important;
  font-weight: 600 !important;
}

/* 加载状态 */
.tk-loading {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

.tk-loading-spinner {
  border-color: var(--primary) transparent transparent transparent !important;
}

/* 内容区域 */
.tk-content {
  color: var(--text-color) !important;
  font-size: 1rem !important;
  line-height: 1.6 !important;
}

/* 链接样式 */
.tk-content a {
  color: var(--primary) !important;
  text-decoration: none !important;
}

.tk-content a:hover {
  text-decoration: underline !important;
}

/* 其他 Twikoo 相关样式... */
```

### Twikoo 样式最佳实践

1. **集中管理**：所有 Twikoo 样式都在 `twikoo.css` 文件中
2. **添加注释**：为每个样式覆盖添加注释说明原因
3. **使用 CSS 变量**：优先使用项目定义的 CSS 变量
4. **保持一致性**：与其他组件使用相同的设计令牌
5. **定期更新**：Twikoo 更新时同步调整样式

## 性能优化

### 避免过度使用

**❌ 错误示例**：
```css
/* 过度使用 !important */
.button {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 8px 16px !important;
  border: none !important;
  border-radius: 4px !important;
  background-color: #3b82f6 !important;
  color: white !important;
  font-size: 1rem !important;
  font-weight: 600 !important;
  transition: all 0.2s !important;
  cursor: pointer !important;
}
```

**✅ 正确示例**：
```astro
---
<!-- 使用 Tailwind 工具类 -->
<button class="flex items-center justify-center px-4 py-2 border-0 rounded-lg bg-[var(--primary)] text-white font-medium transition-all duration-200 cursor-pointer">
  按钮
</button>
```

### 使用 CSS 变量提高性能

```css
:root {
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
}

/* 多次重用变量 */
.card {
  padding: var(--spacing-md);
}

.button {
  padding: var(--spacing-sm) var(--spacing-md);
}

.header {
  margin-bottom: var(--spacing-lg);
}
```

## 总结

### 核心原则

1. **禁止使用 `!important`**：除了 Twikoo 组件和经过审批的情况
2. **优先使用 Tailwind**：利用工具类而不是自定义 CSS
3. **使用 CSS 变量**：提高样式的可维护性
4. **提高选择器优先级**：而不是使用 `!important`
5. **使用作用域样式**：避免全局污染
6. **保持一致性**：使用统一的设计令牌

### 检查清单

- [ ] 没有 `!important`（Twikoo 除外）
- [ ] 使用了 Tailwind 工具类
- [ ] 使用了 CSS 变量
- [ ] 样式优先级合理
- [ ] 主题样式正确
- [ ] 没有过度嵌套

---

**最后更新**: 2026-03-17
**维护者**: Mizuki 开发团队

## 参考资源

- [组件架构设计规范](./01-component-architecture.md)
- [文件组织架构规范](./03-file-organization-architecture.md)
- [Aruma CSS 规范](../../demo/Aruma/docs/rule/02-no-important-css.md)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [CSS 优先级计算器](https://specificity.keegan.st/)
