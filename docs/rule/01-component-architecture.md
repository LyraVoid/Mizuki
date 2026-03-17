# 组件架构设计规范

## 概述

本文档定义了 Mizuki 项目的组件化架构设计原则和最佳实践，旨在提高代码的可维护性、可复用性和性能。

## 核心原则

### 1. 分层架构原则

采用**原子设计（Atomic Design）**理念，将组件分为四个层次：

```
atoms (原子) → molecules (分子) → organisms (有机体) → pages (页面)
```

#### 1.1 Atoms - 原子组件

**定义**：构成 UI 的最基础、不可再分的元素。

**特点**：
- 职责单一，功能简单
- 无业务逻辑
- 高度可复用
- 不依赖其他组件

**示例**：
```typescript
// Button.astro
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  icon?: string
}

const { variant = 'primary', size = 'md', disabled = false, icon } = Astro.props
---

<button class={`btn btn-${variant} btn-${size} ${disabled ? 'disabled' : ''}`}>
  {icon && <Icon name={icon} />}
  <slot />
</button>

<style>
  .btn {
    /* 基础按钮样式 */
  }
  .btn-primary {
    /* 主按钮样式 */
  }
  .btn-secondary {
    /* 次要按钮样式 */
  }
</style>
```

**原子组件清单**：
- `Button.astro` - 按钮
- `Card.astro` - 卡片容器
- `Input.astro` - 输入框
- `Badge.astro` - 标签/徽章
- `Chip.astro` - Chip 标签
- `Icon.astro` - 图标
- `Avatar.astro` - 头像

#### 1.2 Molecules - 分子组件

**定义**：由多个原子组件组合而成，具有单一职责的小型功能组件。

**特点**：
- 由 2-5 个原子组件组合
- 具有简单的交互逻辑
- 仍然保持高度可复用性
- 封装特定的 UI 模式

**示例**：
```astro
---
// SearchBar.astro
import Button from '../atoms/Button.astro'
import Input from '../atoms/Input.astro'

interface Props {
  placeholder?: string
  onSearch?: (query: string) => void
}

const { placeholder = '搜索...', onSearch } = Astro.props
---

<div class="search-bar">
  <Input {placeholder} id="search-input" />
  <Button variant="primary" size="md" icon="material-symbols:search">
    搜索
  </Button>
</div>

<script>
  const input = document.getElementById('search-input')
  const button = document.querySelector('.search-bar button')

  const handleSearch = () => {
    const query = input?.value || ''
    if (onSearch) {
      onSearch(query)
    }
  }

  button?.addEventListener('click', handleSearch)
  input?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch()
  })
</script>
```

**分子组件清单**：
- `SearchBar.astro` - 搜索栏
- `Pagination.astro` - 分页
- `DropdownMenu.astro` - 下拉菜单
- `FormItem.astro` - 表单项
- `ChipCloud.astro` - 标签云

#### 1.3 Organisms - 有机体组件

**定义**：复杂的业务组件，由多个分子组件和原子组件组合而成。

**特点**：
- 包含复杂的业务逻辑
- 可能有多个子组件
- 专门用于特定的页面或功能
- 可能需要拆分为子目录

**示例**：
```
Navbar.astro
├── NavbarSearch.svelte (分子)
├── NavbarMenu.svelte (分子)
├── LayoutSwitchButton.svelte (分子)
└── LightDarkSwitch.svelte (原子)
```

**有机体组件清单**：
- `Navbar.astro` - 导航栏
- `Sidebar.astro` - 侧边栏
- `MusicPlayer.svelte` - 音乐播放器
- `Footer.astro` - 页脚
- `TOC.astro` - 目录

#### 1.4 Widgets - 小部件组件

**定义**：侧边栏的小功能模块，介于分子和有机体之间。

**特点**：
- 相对独立的功能模块
- 可配置的显示位置
- 统一的 UI 风格
- 使用通用容器组件

**示例**：
```astro
---
// widget/Profile.astro
import WidgetLayout from './common/WidgetLayout.astro'
import Avatar from '../atoms/Avatar.astro'
---

<WidgetLayout name="个人资料">
  <Avatar src="/avatar.png" />
  <div class="profile-info">
    <h3>Mizuki</h3>
    <p>前端开发者</p>
  </div>
</WidgetLayout>
```

**小部件组件清单**：
- `Profile.astro` - 个人资料
- `Calendar.astro` - 日历
- `Categories.astro` - 分类
- `Tags.astro` - 标签
- `SiteStats.astro` - 站点统计
- `Announcement.astro` - 公告

## 组件目录结构

### 推荐的目录组织方式

```
src/components/
├── atoms/                    # 原子组件
│   ├── Button.astro
│   ├── Card.astro
│   ├── Input.astro
│   ├── Badge.astro
│   ├── Chip.astro
│   └── Icon.astro
│
├── molecules/                # 分子组件
│   ├── SearchBar.astro
│   ├── Pagination.astro
│   ├── DropdownMenu.astro
│   └── ChipCloud.astro
│
├── organisms/                # 有机体组件
│   ├── Navbar.astro
│   ├── Sidebar.astro
│   ├── MusicPlayer.svelte   # 复杂组件可包含子目录
│   │   ├── MusicPlayer.svelte
│   │   ├── MiniPlayer.svelte
│   │   ├── ExpandedPlayer.svelte
│   │   ├── controls/
│   │   │   ├── PlayControls.svelte
│   │   │   ├── ProgressBar.svelte
│   │   │   └── VolumeControl.svelte
│   │   ├── hooks/
│   │   │   ├── useAudio.ts
│   │   │   └── usePlaylist.ts
│   │   └── types.ts
│   ├── Footer.astro
│   └── TOC.astro
│
├── widgets/                   # 侧边栏小部件
│   ├── Profile.astro
│   ├── Calendar.astro
│   ├── Categories.astro
│   ├── Tags.astro
│   ├── SiteStats.astro
│   └── common/              # 通用小部件组件
│       ├── WidgetLayout.astro
│       └── WidgetHeader.astro
│
├── features/                  # 功能性组件
│   ├── comment/
│   ├── search/
│   └── protection/
│
├── layouts/                   # 页面布局
│   ├── MainLayout.astro
│   └── PostLayout.astro
│
└── utils/                     # 工具和 Hooks
    ├── widgetManager.ts
    └── useCalendar.ts
```

### 复杂组件的子目录组织

当组件需要拆分为多个子组件时，应按照以下结构组织：

```
ComponentName/
├── ComponentName.astro/svelte  # 主组件（组合层）
├── SubComponent1.astro/svelte  # 子组件
├── SubComponent2.astro/svelte  # 子组件
├── hooks/                      # 相关 Hooks
│   ├── useFeature1.ts
│   └── useFeature2.ts
├── types.ts                    # 类型定义
└── utils/                      # 工具函数
    └── helper.ts
```

## 命名规范

### 文件命名

#### Astro 组件
- 使用 PascalCase
- 示例：`Button.astro`, `SearchBar.astro`, `Navbar.astro`

#### Svelte 组件
- 使用 PascalCase
- 示例：`MusicPlayer.svelte`, `LayoutSwitchButton.svelte`

#### 功能模块组件
- 使用 功能名+Module 后缀
- 示例：`SearchModule.astro`, `QRCodeModule.astro`

#### 容器组件
- 使用 功能名+Container 后缀
- 示例：`SidebarContainer.astro`, `WidgetContainer.astro`

#### Hooks
- 使用 use 前缀
- 示例：`useCalendar.ts`, `useMusicPlayer.ts`, `useTOC.ts`

#### 工具函数
- 使用小驼峰
- 示例：`formatDate.ts`, `calculatePagination.ts`

### 组件内命名

#### Props 接口
```typescript
interface Props {
  title?: string
  description?: string
  items?: Array<Item>
  onAction?: (value: any) => void
}
```

#### 事件处理器
```typescript
const handleClick = () => {}
const handleSubmit = () => {}
const handleScroll = () => {}
```

#### 响应式变量
```typescript
let isOpen = false
let count = 0
let items = []
```

## 组件职责原则

### 单一职责原则（SRP）

每个组件应该只有一个明确的职责。

**✅ 正确示例**：
```astro
---
// Button.astro - 只负责按钮的渲染和基本交互
interface Props {
  variant: 'primary' | 'secondary'
  children: any
}
const { variant } = Astro.props
---

<button class={`btn-${variant}`}>
  <slot />
</button>
```

**❌ 错误示例**：
```astro
---
// ❌ 错误：一个组件同时负责搜索、导航、主题切换
// SearchNavbarTheme.astro (500+ 行)
const handleSearch = () => {}
const toggleNavbar = () => {}
const toggleTheme = () => {}
---
<div>
  <input id="search" />
  <nav>...</nav>
  <button id="theme-toggle">...</button>
</div>

<style>
  /* 搜索样式、导航样式、主题样式混在一起 */
</style>

<script>
  // 搜索逻辑、导航逻辑、主题逻辑混在一起
</script>
```

### 控制组件粒度

| 复杂度 | 行数 | 职责数 | 状态数 | 适用组件类型 |
|--------|------|--------|--------|-------------|
| ⭐ 简单 | < 100 | 1 | < 3 | 原子组件、简单分子组件 |
| ⭐⭐ 中等 | 100-200 | 1-2 | 3-5 | 分子组件、简单有机体组件 |
| ⭐⭐⭐ 较高 | 200-300 | 2-3 | 5-10 | 有机体组件 |
| ⭐⭐⭐⭐ 高 | 300-500 | 3-4 | 10-15 | 复杂有机体组件（需要拆分） |
| ⭐⭐⭐⭐⭐ 极高 | > 500 | > 4 | > 15 | **必须拆分** |

**拆分警告信号**：
- ❌ 组件超过 500 行
- ❌ 有 4 个或更多独立的功能模块
- ❌ 样式超过 200 行
- ❌ 脚本超过 150 行
- ❌ 难以理解和测试

## 组件复用模式

### 1. 组合模式

使用 Slot API 实现灵活的组合：

```astro
---
// ContainerComponent.astro
---

<div class="container">
  <slot name="header" />
  <div class="content">
    <slot />
  </div>
  <slot name="footer" />
</div>

<style>
  .container { /* 容器样式 */ }
</style>
```

**使用**：
```astro
---
import ContainerComponent from './ContainerComponent.astro'
---

<ContainerComponent>
  <div slot="header">自定义头部</div>
  <div>主要内容</div>
  <div slot="footer">自定义底部</div>
</ContainerComponent>
```

### 2. 容器组件模式

创建通用的容器组件，统一样式和行为：

```astro
---
// widgets/common/WidgetLayout.astro
interface Props {
  name?: string
  isCollapsed?: boolean
  collapsedHeight?: string
}

const { name, isCollapsed, collapsedHeight } = Astro.props
---

<div class="widget-layout" data-collapsed={isCollapsed}>
  {name && <div class="widget-header">{name}</div>}
  <div class="widget-content">
    <slot />
  </div>
</div>

<style define:vars={{ collapsedHeight }}>
  .widget-layout[data-collapsed="true"] .widget-content {
    max-height: var(--collapsed-height);
    overflow: hidden;
  }
</style>
```

### 3. 工具函数复用

将通用逻辑提取到工具函数：

```typescript
// utils/calendarUtils.ts
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

// 在组件中使用
import { getDaysInMonth, getFirstDayOfMonth } from '@/utils/calendarUtils'
```

### 4. Hooks 复用

将复杂的交互逻辑提取为 Hooks：

```typescript
// hooks/useMusicPlayer.ts
import { writable, derived } from 'svelte/store'

export function useMusicPlayer() {
  const isPlaying = writable(false)
  const currentSong = writable(null)
  const volume = writable(0.8)

  const togglePlay = () => isPlaying.update(n => !n)
  const setVolume = (val: number) => volume.set(val)

  return {
    isPlaying,
    currentSong,
    volume,
    togglePlay,
    setVolume
  }
}

// 在组件中使用
<script lang="ts">
  import { useMusicPlayer } from './hooks/useMusicPlayer'

  const player = useMusicPlayer()
  const { isPlaying, togglePlay } = player
</script>
```

## 组件间通信

### Props 传递（父 → 子）

```astro
---
// 父组件
import ChildComponent from './ChildComponent.astro'
---

<ChildComponent
  title="Hello"
  count={42}
  onAction={() => console.log('Action triggered')}
/>
```

```astro
---
// 子组件
interface Props {
  title: string
  count: number
  onAction?: () => void
}

const { title, count, onAction } = Astro.props
---

<div>
  <h1>{title}</h1>
  <p>Count: {count}</p>
  <button id="action-btn">Action</button>
</div>

<script>
  document.getElementById('action-btn')?.addEventListener('click', () => {
    if (onAction) onAction()
  })
</script>
```

### 事件派发（子 → 父）

```astro
---
// 子组件
interface Props {
  onValueChange?: (value: string) => void
}

const { onValueChange } = Astro.props
---

<input id="input" />

<script>
  const input = document.getElementById('input')
  input?.addEventListener('input', (e) => {
    if (onValueChange) {
      onValueChange((e.target as HTMLInputElement).value)
    }
  })
</script>
```

### 全局状态管理

对于跨组件的状态管理，使用全局变量或第三方库：

```typescript
// stores/themeStore.ts
import { writable } from 'svelte/store'

export const themeStore = writable({
  mode: 'light' as 'light' | 'dark',
  hue: 60
})
```

## 性能优化

### 1. 懒加载

使用 Astro 的 Hydration 指令按需加载：

```astro
<!-- 立即加载 - 必需组件 -->
<Navbar client:load />

<!-- 可见时加载 - 功能模块 -->
<Calendar client:visible />

<!-- 空闲时加载 - 非关键功能 -->
<MusicPlayer client:idle />

<!-- 永不加载 - 静态内容 -->
<Footer />
```

### 2. 动态导入

```javascript
// 延迟加载重型库
async function initQRCode() {
  const QRCode = await import('qrcode')
  QRCode.toCanvas(canvas, url, options)
}
```

### 3. 虚拟滚动

对于长列表，使用虚拟滚动：

```typescript
import { useVirtualList } from '@/hooks/useVirtualList'

const { list, containerProps, wrapperProps } = useVirtualList({
  items: largeList,
  itemHeight: 50
})
```

## TypeScript 使用规范

### Props 接口定义

```typescript
interface Props {
  // 必需属性
  id: string

  // 可选属性
  title?: string
  count?: number

  // 联合类型
  variant?: 'primary' | 'secondary' | 'ghost'

  // 数组类型
  items?: Array<{
    id: string
    name: string
    slug: string
  }>

  // 事件处理
  onAction?: (value: any) => void

  // 自定义类名和样式
  class?: string
  style?: string
}
```

### 默认值处理

```typescript
const {
  title = '默认标题',
  count = 0,
  variant = 'primary',
  items = [],
  class: className = '',
  style = ''
} = Astro.props
```

## 样式规范

### 使用 CSS 变量

```css
:root {
  --primary-color: #3b82f6;
  --text-color: #1f2937;
  --bg-color: #ffffff;
}

.dark {
  --primary-color: #60a5fa;
  --text-color: #f3f4f6;
  --bg-color: #111827;
}
```

### 作用域样式

```astro
<style>
  .my-component {
    color: var(--text-color);
    background-color: var(--bg-color);
  }

  /* 避免全局选择器 */
  /* :global(div) { ... } */
</style>
```

### Tailwind CSS 结合

```astro
---
const className = Astro.props.class
---

<div class={`card-base ${className} p-4 rounded-lg shadow-md`}>
  <slot />
</div>

<style>
  .card-base {
    /* 组件特定的样式 */
  }
</style>
```

## 组件文档

### 组件头部注释

```astro
---
/**
 * Button 组件
 *
 * @description 基础按钮组件，支持多种变体和尺寸
 *
 * @example
 * <Button variant="primary" size="md" icon="material-symbols:add">
 *   点击我
 * </Button>
 *
 * @props
 * - variant: 'primary' | 'secondary' | 'ghost' - 按钮变体，默认 'primary'
 * - size: 'sm' | 'md' | 'lg' - 按钮尺寸，默认 'md'
 * - disabled: boolean - 是否禁用，默认 false
 * - icon: string - 图标名称
 */

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  icon?: string
}
---
```

## 代码审查检查清单

在提交代码前，确保：

- [ ] 组件遵循分层架构（atoms/molecules/organisms）
- [ ] 文件名符合命名规范（PascalCase）
- [ ] 组件行数在合理范围内（< 500行）
- [ ] 使用 TypeScript 定义 Props 接口
- [ ] 组件职责单一明确
- [ ] 复杂逻辑提取到 Hooks 或工具函数
- [ ] 样式使用 CSS 变量
- [ ] 使用适当的 Hydration 指令
- [ ] 添加组件文档注释
- [ ] 代码格式化和 Lint 检查通过

## 迁移指南

### 从现有组件迁移到新架构

1. **识别组件类型**
   - 判断组件应该属于哪个层次（atoms/molecules/organisms）
   - 评估组件的复杂度和是否需要拆分

2. **移动组件文件**
   - 将组件移动到对应的目录
   - 更新导入路径

3. **提取通用逻辑**
   - 将重复的逻辑提取到 Hooks 或工具函数
   - 创建通用的容器组件

4. **优化和重构**
   - 减少组件行数
   - 提高复用性
   - 添加类型定义和文档

### 示例：重构 Widget 组件

**重构前**：
```astro
// widget/Categories.astro (150 行，包含样式和逻辑)
---
// 获取分类数据
const categories = await getCategories()
---

<div class="categories-widget">
  <div class="widget-header">
    <Icon name="material-symbols:category" />
    <h3>分类</h3>
  </div>
  <div class="widget-content">
    {categories.map(cat => (
      <a href={`/category/${cat.slug}`} class="category-link">
        {cat.name} ({cat.count})
      </a>
    ))}
  </div>
</div>

<style>
  .categories-widget { /* 样式 */ }
  .widget-header { /* 样式 */ }
  .widget-content { /* 样式 */ }
</style>
```

**重构后**：
```astro
// widget/Categories.astro (50 行)
---
import WidgetLayout from './common/WidgetLayout.astro'
import ChipCloud from '../molecules/ChipCloud.astro'

const categories = await getCategories()
---

<WidgetLayout name="分类">
  <ChipCloud
    items={categories}
    hrefPrefix="/category/"
  />
</WidgetLayout>
```

## 参考资源

- [Aruma 组件架构](../../demo/Aruma/docs/rule/05-component-architecture.md)
- [Astro 组件最佳实践](https://docs.astro.build/zh-cn/core-concepts/astro-components/)
- [Atomic Design](https://atomicdesign.bradfrost.com/)
- [组件驱动开发](https://componentdriven.org/)

---

**最后更新**: 2026-03-17
**维护者**: Mizuki 开发团队
