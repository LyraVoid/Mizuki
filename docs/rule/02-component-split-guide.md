# 组件拆分指南

## 概述

本文档提供详细的组件拆分方法和最佳实践，帮助你识别需要拆分的组件，并进行有效的重构。

## 识别需要拆分的组件

### 拆分信号清单

当一个组件出现以下信号时，应该考虑拆分：

#### 1. 代码量过大

- ❌ 组件总行数 > 500 行
- ❌ 样式代码 > 200 行
- ❌ 脚本代码 > 150 行

**示例**：
```
MusicPlayer.svelte - 934 行 ❌ 必须拆分
Calendar.astro - 527 行 ❌ 需要拆分
Navbar.astro - 294 行 ⚠️ 可以考虑拆分
Footer.astro - 159 行 ✅ 良好
```

#### 2. 职责过多

组件承担了多个不相关的功能：

**❌ 错误示例**：
```astro
---
// ❌ 一个组件同时负责：
// 1. 搜索功能
// 2. 导航菜单
// 3. 主题切换
// 4. 侧边栏
// 5. 用户认证
---

<SearchAndNavAndThemeAndSidebarAndAuth.astro />
```

**✅ 正确示例**：
```astro
<SearchModule.astro />
<NavbarMenu.astro />
<ThemeToggle.astro />
<Sidebar.astro />
<AuthModule.astro />
```

#### 3. 状态复杂度高

- 状态变量数量 > 10 个
- 状态嵌套层级 > 3 层
- 状态更新逻辑分散

**❌ 错误示例**：
```typescript
// ❌ 15+ 个响应式变量，难以维护
let isPlaying = $state(false)
let currentSong = $state(null)
let playlist = $state([])
let volume = $state(0.8)
let isMuted = $state(false)
let isExpanded = $state(false)
let showPlaylist = $state(false)
let currentTime = $state(0)
let duration = $state(0)
let isRepeat = $state(false)
let isShuffle = $state(false)
let showMiniPlayer = $state(true)
let audioRef = $state(null)
// ...
```

#### 4. DOM 操作过多

- 大量 `document.getElementById` 或 `querySelector`
- 复杂的事件监听器绑定
- 动态创建/删除元素

**❌ 错误示例**：
```javascript
// ❌ 20+ 个 DOM 操作
const button1 = document.getElementById('btn1')
const button2 = document.getElementById('btn2')
// ... 20 个类似的操作
```

#### 5. 依赖过多

- 导入了 10+ 个外部依赖
- 导入了多个大型第三方库

**❌ 错误示例**：
```astro
---
// ❌ 导入 12 个依赖
import QRCode from 'qrcode'
import PDF from 'pdf-lib'
import XLSX from 'xlsx'
import Chart from 'chart.js'
// ...
```

### 拆分评估工具

使用以下评估矩阵判断是否需要拆分：

| 评估项 | 权重 | 评分 (1-5) | 加权得分 |
|--------|------|-----------|----------|
| 代码行数 | 25% | | |
| 职责数量 | 30% | | |
| 状态复杂度 | 20% | | |
| DOM 操作数量 | 15% | | |
| 依赖数量 | 10% | | |
| **总分** | **100%** | | |

**拆分决策**：
- 总分 > 3.5：必须拆分
- 总分 2.5-3.5：建议拆分
- 总分 < 2.5：暂不拆分

## 拆分原则

### 1. 单一职责原则（SRP）

拆分后的每个组件应该只有一个明确的职责。

**示例：MusicPlayer 拆分前**

```svelte
// ❌ MusicPlayer.svelte (934 行)
// 职责：
// 1. 音频播放控制
// 2. 播放列表管理
// 3. 进度条显示和控制
// 4. 音量控制
// 5. 迷你播放器UI
// 6. 展开播放器UI
// 7. 播放列表UI
```

**拆分后**

```
MusicPlayer/
├── MusicPlayer.svelte           # 职责：组合层，协调各子组件
├── MiniPlayer.svelte          # 职责：迷你播放器UI
├── ExpandedPlayer.svelte      # 职责：展开播放器UI
├── PlaylistPanel.svelte        # 职责：播放列表UI
├── controls/
│   ├── PlayControls.svelte    # 职责：播放控制按钮
│   ├── ProgressBar.svelte     # 职责：进度条
│   └── VolumeControl.svelte  # 职责：音量控制
└── hooks/
    ├── useAudio.ts           # 职责：音频播放逻辑
    ├── usePlaylist.ts        # 职责：播放列表管理
    └── useVolume.ts         # 职责：音量控制逻辑
```

### 2. 接口隔离原则（ISP）

组件应该只依赖于它需要的接口，而不是被迫依赖不相关的接口。

**示例：Calendar 组件**

```astro
---
// ❌ 错误：Calendar 组件直接依赖所有功能
import { getAllPosts } from '../utils/blog'
import { calculateDates } from '../utils/calendar'
import { formatTime } from '../utils/date'
import { handleNav } from '../utils/navigation'
import { handleDrag } from '../utils/drag'
// ... 10+ 个依赖
---

// ✅ 正确：提取 Hook
import { useCalendar } from '../hooks/useCalendar'

const { dates, currentMonth, handleMonthChange } = useCalendar()
```

### 3. 依赖倒置原则（DIP）

高层模块不应该依赖低层模块，两者都应该依赖抽象。

**示例：**

```typescript
// ❌ 错误：直接依赖具体实现
function renderPosts() {
  const posts = await getPostsFromDB()
  // ...
}

// ✅ 正确：依赖抽象
interface PostRepository {
  getAll(): Promise<Post[]>
}

function renderPosts(repository: PostRepository) {
  const posts = await repository.getAll()
  // ...
}
```

## 拆分方法

### 方法 1：按功能拆分

适用于职责明确的组件。

**步骤**：

1. **识别功能模块**
   ```
   MusicPlayer 功能模块：
   - 播放控制（play/pause/prev/next）
   - 进度管理（current time/duration/seek）
   - 音量管理（volume/mute）
   - 播放列表管理（add/remove/reorder）
   - UI状态管理（mini/expanded/playlist）
   ```

2. **为每个功能创建子组件**
   ```
   controls/PlayControls.svelte
   controls/ProgressBar.svelte
   controls/VolumeControl.svelte
   ```

3. **提取业务逻辑到 Hooks**
   ```
   hooks/useAudio.ts
   hooks/usePlaylist.ts
   hooks/useVolume.ts
   ```

4. **创建组合层组件**
   ```astro
   // MusicPlayer.astro（组合层）
   ---
   import PlayControls from './controls/PlayControls.svelte'
   import ProgressBar from './controls/ProgressBar.svelte'
   import VolumeControl from './controls/VolumeControl.svelte'
   ---

   <div class="music-player">
     <PlayControls />
     <ProgressBar />
     <VolumeControl />
   </div>
   ```

**实例：MusicPlayer 拆分**

**拆分前**：
```svelte
<script lang="ts">
// ❌ 934 行，所有逻辑混在一起
let isPlaying = $state(false)
let currentSong = $state(null)
let playlist = $state([])
let volume = $state(0.8)
// ... 更多状态和逻辑

function togglePlay() {
  isPlaying = !isPlaying
  if (isPlaying) {
    audioRef.src = currentSong.url
    audioRef.play()
  } else {
    audioRef.pause()
  }
}

function handleProgressChange(time: number) {
  currentTime = time
  audioRef.currentTime = time
}

function handleVolumeChange(vol: number) {
  volume = vol
  audioRef.volume = vol
}

// ... 更多函数
</script>

<div class="music-player">
  <button on:click={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
  <input type="range" bind:value={currentTime} />
  <input type="range" bind:value={volume} />
  <!-- 更多 UI -->
</div>

<style>
  /* 200+ 行样式 */
</style>
```

**拆分后**：

1. **hooks/useAudio.ts**
```typescript
export function useAudio() {
  const isPlaying = $state(false)
  const currentTime = $state(0)
  const duration = $state(0)
  const audioRef = $state<HTMLAudioElement | null>(null)

  const togglePlay = () => {
    isPlaying = !isPlaying
    if (isPlaying) audioRef?.play()
    else audioRef?.pause()
  }

  const seek = (time: number) => {
    if (audioRef) audioRef.currentTime = time
  }

  return {
    isPlaying,
    currentTime,
    duration,
    audioRef,
    togglePlay,
    seek
  }
}
```

2. **controls/PlayControls.svelte**
```svelte
<script lang="ts">
  export let isPlaying: boolean
  export let onTogglePlay: () => void
  export let onPrev: () => void
  export let onNext: () => void
</script>

<div class="play-controls">
  <button on:click={onPrev}>
    <Icon name="material-symbols:skip-previous" />
  </button>
  <button on:click={onTogglePlay}>
    <Icon name={isPlaying ? 'material-symbols:pause' : 'material-symbols:play-arrow'} />
  </button>
  <button on:click={onNext}>
    <Icon name="material-symbols:skip-next" />
  </button>
</div>

<style>
  .play-controls {
    display: flex;
    gap: 8px;
  }
</style>
```

3. **controls/ProgressBar.svelte**
```svelte
<script lang="ts">
  export let currentTime: number
  export let duration: number
  export let onSeek: (time: number) => void
</script>

<div class="progress-container">
  <input
    type="range"
    min="0"
    max={duration}
    value={currentTime}
    on:input={(e) => onSeek(Number((e.target as HTMLInputElement).value))}
    class="progress-bar"
  />
  <span class="time">
    {formatTime(currentTime)} / {formatTime(duration)}
  </span>
</div>

<style>
  .progress-container {
    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>
```

4. **MusicPlayer.astro（组合层）**
```astro
---
import PlayControls from './controls/PlayControls.svelte'
import ProgressBar from './controls/ProgressBar.svelte'
import { useAudio } from './hooks/useAudio'

const audio = useAudio()
---

<div class="music-player">
  <PlayControls
    isPlaying={audio.isPlaying}
    onTogglePlay={audio.togglePlay}
    onPrev={() => {}}
    onNext={() => {}}
  />
  <ProgressBar
    currentTime={audio.currentTime}
    duration={audio.duration}
    onSeek={audio.seek}
  />
</div>
```

### 方法 2：按 UI 层级拆分

适用于有清晰 UI 层级的组件。

**实例：Calendar 拆分**

**拆分前**：
```astro
---
// ❌ Calendar.astro (527 行)
// 包含：
// - 头部导航（月份/年份选择器）
// - 日历网格（日期渲染）
// - 文章列表（选中日期的文章）
---

<div class="calendar">
  <header>
    <button>←</button>
    <select>2025</select>
    <select>3月</select>
    <button>→</button>
  </header>

  <div class="grid">
    <!-- 日历网格 -->
  </div>

  <div class="posts">
    <!-- 文章列表 -->
  </div>
</div>
```

**拆分后**：

```
Calendar/
├── Calendar.astro              # 组合层（< 50 行）
├── CalendarHeader.svelte      # 头部导航
├── CalendarGrid.svelte       # 日历网格
├── PostList.astro           # 文章列表
├── utils/
│   └── calendarUtils.ts     # 日期计算逻辑
└── types.ts
```

1. **CalendarHeader.svelte**
```svelte
<script lang="ts">
  export let year: number
  export let month: number
  export let onPrevMonth: () => void
  export let onNextMonth: () => void
</script>

<header class="calendar-header">
  <button on:click={onPrevMonth}>
    <Icon name="material-symbols:chevron-left" />
  </button>
  <div class="title">{year}年{month + 1}月</div>
  <button on:click={onNextMonth}>
    <Icon name="material-symbols:chevron-right" />
  </button>
</header>
```

2. **CalendarGrid.svelte**
```svelte
<script lang="ts">
  export let dates: Date[]
  export let selectedDate: Date | null
  export let onSelectDate: (date: Date) => void
</script>

<div class="calendar-grid">
  {#each dates as date}
    <div
      class="date-cell"
      class:selected={isSameDay(date, selectedDate)}
      on:click={() => onSelectDate(date)}
    >
      {date.getDate()}
    </div>
  {/each}
</div>
```

3. **Calendar.astro（组合层）**
```astro
---
import CalendarHeader from './CalendarHeader.svelte'
import CalendarGrid from './CalendarGrid.svelte'
import PostList from './PostList.astro'
import { useCalendar } from './hooks/useCalendar'

const calendar = useCalendar()
---

<div class="calendar">
  <CalendarHeader
    year={calendar.year}
    month={calendar.month}
    onPrevMonth={calendar.prevMonth}
    onNextMonth={calendar.nextMonth}
  />
  <CalendarGrid
    dates={calendar.dates}
    selectedDate={calendar.selectedDate}
    onSelectDate={calendar.selectDate}
  />
  <PostList posts={calendar.posts} />
</div>
```

### 方法 3：按关注点拆分

适用于逻辑复杂的组件。

**关注点**：
- 数据获取
- 数据处理
- UI 渲染
- 事件处理
- 样式

**实例：PasswordProtection 拆分**

**拆分前**：
```astro
---
// ❌ PasswordProtection.astro (648 行)
// 关注点混杂：
// - 加密/解密逻辑
// - UI 表单
// - 脚本动态执行
// - 错误处理
---

<script>
  // 加密逻辑
  function encrypt(text: string, key: string): string {
    // 100+ 行加密代码
  }

  // 解密逻辑
  function decrypt(encrypted: string, key: string): string {
    // 100+ 行解密代码
  }

  // UI 逻辑
  let password = ''
  let error = ''
  // ... 更多 UI 状态
</script>

<form>
  <input type="password" bind:value={password} />
  <button on:click={handleSubmit}>解锁</button>
</form>

<style>
  /* 表单样式 */
</style>
```

**拆分后**：

```
features/protection/
├── PasswordProtection.astro  # UI层（< 200 行）
├── PasswordForm.astro       # 表单组件（< 100 行）
├── EncryptionService.ts      # 加密/解密服务（< 200 行）
└── types.ts                # 类型定义
```

1. **EncryptionService.ts**
```typescript
export class EncryptionService {
  private readonly algorithm = 'AES-GCM'
  private readonly saltLength = 16

  async encrypt(text: string, key: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(this.saltLength))
    const keyMaterial = await this.deriveKey(key, salt)
    const iv = crypto.getRandomValues(new Uint8Array(12))

    const encrypted = await crypto.subtle.encrypt(
      { name: this.algorithm, iv },
      keyMaterial,
      new TextEncoder().encode(text)
    )

    return this.combineResults(salt, iv, encrypted)
  }

  async decrypt(encrypted: string, key: string): Promise<string> {
    const { salt, iv, data } = this.splitResults(encrypted)
    const keyMaterial = await this.deriveKey(key, salt)

    const decrypted = await crypto.subtle.decrypt(
      { name: this.algorithm, iv },
      keyMaterial,
      data
    )

    return new TextDecoder().decode(decrypted)
  }

  private async deriveKey(key: string, salt: Uint8Array) {
    return await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(key),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    )
  }

  // ... 更多辅助方法
}
```

2. **PasswordForm.astro**
```astro
---
import Button from '../atoms/Button.astro'
import Input from '../atoms/Input.astro'

interface Props {
  error?: string
  loading?: boolean
  onSubmit?: (password: string) => void
}

const { error = '', loading = false, onSubmit } = Astro.props
---

<form id="password-form">
  <Input
    type="password"
    name="password"
    placeholder="请输入密码"
    disabled={loading}
  />
  {error && <p class="error">{error}</p>}
  <Button
    variant="primary"
    disabled={loading}
    type="submit"
  >
    {loading ? '解锁中...' : '解锁'}
  </Button>
</form>

<script>
  const form = document.getElementById('password-form')
  form?.addEventListener('submit', (e) => {
    e.preventDefault()
    const password = (form.querySelector('input[name="password"]') as HTMLInputElement).value
    if (onSubmit) onSubmit(password)
  })
</script>

<style>
  .error {
    color: var(--error-color);
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }
</style>
```

3. **PasswordProtection.astro（UI层）**
```astro
---
import PasswordForm from './PasswordForm.astro'
import { EncryptionService } from './EncryptionService'

const encryptionService = new EncryptionService()
let error = ''
let loading = false

async function handleSubmit(password: string) {
  loading = true
  try {
    const decrypted = await encryptionService.decrypt(encryptedContent, password)
    // 处理解密后的内容
  } catch (e) {
    error = '密码错误'
  } finally {
    loading = false
  }
}
---

<PasswordForm
  error={error}
  loading={loading}
  onSubmit={handleSubmit}
/>
```

### 方法 4：提取通用组件

适用于有相似模式的组件。

**实例：Widget 组件提取**

**拆分前**：
```astro
---
// widget/Profile.astro
---

<div class="widget card-base">
  <div class="widget-header">
    <Icon name="material-symbols:person" />
    <h3>个人资料</h3>
  </div>
  <div class="widget-content">
    <!-- 内容 -->
  </div>
</div>

---

// widget/Categories.astro
---

<div class="widget card-base">
  <div class="widget-header">
    <Icon name="material-symbols:category" />
    <h3>分类</h3>
  </div>
  <div class="widget-content">
    <!-- 内容 -->
  </div>
</div>
```

**拆分后**：

1. **widgets/common/WidgetLayout.astro**
```astro
---
import Icon from '../../atoms/Icon.astro'

interface Props {
  name?: string
  icon?: string
  isCollapsed?: boolean
  collapsedHeight?: string
  class?: string
}

const { name, icon, isCollapsed, collapsedHeight, class: className = '' } = Astro.props
---

<div class="widget-layout {className}" data-collapsed={isCollapsed}>
  {name && (
    <div class="widget-header">
      {icon && <Icon name={icon} />}
      <h3>{name}</h3>
    </div>
  )}
  <div class="widget-content">
    <slot />
  </div>
</div>

<style define:vars={{ collapsedHeight }}>
  .widget-layout[data-collapsed="true"] .widget-content {
    max-height: var(--collapsed-height);
    overflow: hidden;
  }

  .widget-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
  }

  .widget-content {
    padding: 1rem;
  }
</style>
```

2. **widget/Profile.astro**
```astro
---
import WidgetLayout from './common/WidgetLayout.astro'
import Avatar from '../../atoms/Avatar.astro'
---

<WidgetLayout name="个人资料" icon="material-symbols:person">
  <Avatar src="/avatar.png" size="lg" />
  <div class="profile-info">
    <h4>Mizuki</h4>
    <p>前端开发者</p>
  </div>
</WidgetLayout>
```

3. **widget/Categories.astro**
```astro
---
import WidgetLayout from './common/WidgetLayout.astro'
import ChipCloud from '../../molecules/ChipCloud.astro'

const categories = await getCategories()
---

<WidgetLayout name="分类" icon="material-symbols:category">
  <ChipCloud items={categories} hrefPrefix="/category/" />
</WidgetLayout>
```

## 拆分步骤

### 完整拆分流程

#### 步骤 1：分析和规划

1. **评估组件**
   ```bash
   # 查看组件行数
   wc -l src/components/ComplexComponent.astro

   # 查看组件依赖
   grep -r "import" src/components/ComplexComponent.astro
   ```

2. **识别功能模块**
   - 列出所有功能点
   - 识别重复模式
   - 标记独立的功能模块

3. **创建拆分计划**
   ```markdown
   ## 组件拆分计划：ComplexComponent

   ### 目标
   - 拆分为 5 个子组件
   - 减少主组件到 < 100 行
   - 提取 3 个 Hooks

   ### 子组件列表
   1. SubComponent1.astro - 功能描述（预计行数）
   2. SubComponent2.svelte - 功能描述（预计行数）
   3. ...

   ### Hooks 列表
   1. useFeature1.ts - 功能描述
   2. useFeature2.ts - 功能描述
   ```

#### 步骤 2：创建目录结构

```bash
# 创建子组件目录
mkdir -p src/components/ComplexComponent/controls
mkdir -p src/components/ComplexComponent/hooks
mkdir -p src/components/ComplexComponent/utils
```

#### 步骤 3：提取逻辑到 Hooks

```typescript
// 提取状态管理和业务逻辑
export function useFeature() {
  const state = $state(initialValue)

  const action = () => {
    // 逻辑
  }

  return { state, action }
}
```

#### 步骤 4：创建子组件

```astro
---
// 子组件专注于 UI 渲染
export let value: string
export let onChange: (value: string) => void
---

<input type="text" bind:value={value} on:input={(e) => onChange(e.target.value)} />
```

#### 步骤 5：更新主组件

```astro
---
import SubComponent1 from './SubComponent1.astro'
import SubComponent2 from './SubComponent2.svelte'
import { useFeature } from './hooks/useFeature'

const feature = useFeature()
---

<div class="main-component">
  <SubComponent1
    value={feature.value}
    onChange={feature.action}
  />
  <SubComponent2 />
</div>
```

#### 步骤 6：更新导入路径

```bash
# 查找所有使用原组件的文件
grep -r "ComplexComponent" src/pages src/layouts

# 批量更新导入路径
sed -i 's|import ComplexComponent from.*|import ComplexComponent from "@components/organisms/ComplexComponent/ComplexComponent.astro"|g' src/pages/*.astro
```

#### 步骤 7：测试和验证

```bash
# 运行构建检查错误
pnpm run build

# 运行开发服务器测试
pnpm run dev

# 检查 Lint
pnpm run lint

# 检查类型
pnpm run typecheck
```

#### 步骤 8：清理和优化

```bash
# 删除旧文件
rm src/components/ComplexComponent.astro.backup

# 更新文档
# 添加组件拆分说明到 CHANGELOG
```

## 避免拆分的陷阱

### 陷阱 1：过度拆分

**问题**：将组件拆分得太细，增加管理成本。

**示例**：
```astro
---
// ❌ 过度拆分：每个按钮都是一个独立组件
import PlayButton from './PlayButton.astro'
import PauseButton from './PauseButton.astro'
import PrevButton from './PrevButton.astro'
import NextButton from './NextButton.astro'
---

<div class="controls">
  <PrevButton />
  <PlayButton />
  <PauseButton />
  <NextButton />
</div>
```

**修正**：
```svelte
---
// ✅ 合理拆分：使用一个组件处理播放控制
interface Props {
  isPlaying: boolean
  onTogglePlay: () => void
  onPrev: () => void
  onNext: () => void
}
---

<div class="controls">
  <button on:click={onPrev}>Prev</button>
  <button on:click={onTogglePlay}>
    {isPlaying ? 'Pause' : 'Play'}
  </button>
  <button on:click={onNext}>Next</button>
</div>
```

### 陷阱 2：循环依赖

**问题**：组件 A 依赖 B，B 又依赖 A。

**示例**：
```typescript
// ❌ 组件 A 依赖 B
import ComponentB from './ComponentB.astro'

// 组件 B 又依赖 A
import ComponentA from './ComponentA.astro'
```

**解决方案**：
```typescript
// ✅ 提取共享状态到 Store
import { sharedStore } from '../stores/shared'

// 组件 A 使用 Store
const { value } = sharedStore

// 组件 B 也使用 Store
const { value } = sharedStore
```

### 陷阱 3：Props drilling

**问题**：Props 逐层传递，中间组件不需要使用这些 Props。

**示例**：
```astro
---
// ❌ 祖先组件
<ComponentA value={value} />

// 中间组件（不需要 value）
<ComponentB value={value} />

// 孙组件使用 value
<ComponentC value={value} />
```

**解决方案**：
```typescript
// ✅ 使用 Context 或 Store
import { createContext } from './context'

// 在祖先组件提供 Context
<Context.Provider value={{ value }}>
  <ComponentA />
</Context.Provider>

// 在孙组件消费 Context
const { value } = useContext(Context)
```

### 陷阱 4：过早优化

**问题**：在不确定需求的情况下提前拆分。

**解决方案**：遵循 YAGNI 原则（You Aren't Gonna Need It）

- 只在真正需要时才拆分
- 先实现功能，再重构
- 保持简单，避免过度设计

## 实战案例

### 案例 1：MusicPlayer 完整拆分

**背景**：
- MusicPlayer.svelte 934 行
- 职责过多：音频控制、UI 渲染、播放列表管理
- 状态复杂：15+ 个响应式变量

**拆分策略**：
1. 按 UI 层级拆分（MiniPlayer、ExpandedPlayer、PlaylistPanel）
2. 按功能拆分（播放控制、进度条、音量控制）
3. 提取业务逻辑到 Hooks（useAudio、usePlaylist、useVolume）

**拆分结果**：
```
MusicPlayer.svelte: 50 行（组合层）
├── MiniPlayer.svelte: 150 行
├── ExpandedPlayer.svelte: 200 行
├── PlaylistPanel.svelte: 120 行
├── controls/
│   ├── PlayControls.svelte: 80 行
│   ├── ProgressBar.svelte: 100 行
│   └── VolumeControl.svelte: 60 行
└── hooks/
    ├── useAudio.ts: 80 行
    ├── usePlaylist.ts: 90 行
    └── useVolume.ts: 50 行
```

**收益**：
- ✅ 主组件从 934 行减少到 50 行（-94%）
- ✅ 每个子组件职责单一，易于理解和测试
- ✅ Hooks 可复用
- ✅ 更容易维护和扩展

### 案例 2：Calendar 完整拆分

**背景**：
- Calendar.astro 527 行
- 日历算法复杂
- 多种视图模式

**拆分策略**：
1. 提取日期计算逻辑到 calendarUtils.ts
2. 按 UI 层级拆分（Header、Grid、PostList）
3. 创建 useCalendar Hook 管理状态

**拆分结果**：
```
Calendar.astro: 50 行（组合层）
├── CalendarHeader.svelte: 80 行
├── CalendarGrid.svelte: 150 行
├── PostList.astro: 100 行
├── hooks/
│   └── useCalendar.ts: 120 行
└── utils/
    └── calendarUtils.ts: 80 行
```

**收益**：
- ✅ 主组件从 527 行减少到 50 行（-90%）
- ✅ 日历算法独立，易于测试
- ✅ UI 和逻辑分离
- ✅ 可复用的 calendarUtils

### 案例 3：TOC 合并拆分

**背景**：
- FloatingTOC.astro 548 行
- MobileTOC.svelte 651 行
- widget/TOC.astro 379 行
- 三个组件功能重复

**拆分策略**：
1. 提取公共逻辑到 useTOC Hook
2. 创建统一的 TOC 组件
3. 按设备分离 UI（DesktopTOC、MobileTOC）

**拆分结果**：
```
organisms/TOC/
├── TOC.astro: 50 行（组合层）
├── DesktopTOC.svelte: 200 行
├── MobileTOC.svelte: 150 行
└── hooks/
    └── useTOC.ts: 180 行
```

**收益**：
- ✅ 消除重复代码
- ✅ 统一的 TOC 逻辑
- ✅ 更容易维护
- ✅ 总行数从 1578 行减少到 580 行（-63%）

## 拆分后验证

### 功能验证

```bash
# 运行开发服务器
pnpm run dev

# 手动测试所有功能
# - 播放器播放/暂停/切换
# - 日历导航和选择
# - TOC 导航和滚动
```

### 性能验证

```bash
# 运行 Lighthouse
npx lighthouse http://localhost:4321 --view

# 检查指标
# - Performance
# - First Contentful Paint
# - Time to Interactive
```

### 代码质量验证

```bash
# 运行 Lint
pnpm run lint

# 运行类型检查
pnpm run typecheck

# 运行测试
pnpm run test
```

### 对比验证

```bash
# 统计拆分前后行数
echo "拆分前：934 行"
echo "拆分后：$(wc -l MusicPlayer/*.svelte | tail -1)"

# 统计组件数量
find . -name "*.svelte" -o -name "*.astro" | wc -l
```

## 文档更新

### 拆分后需要更新的文档

1. **组件文档**
   ```markdown
   ## MusicPlayer 组件

   ### 架构
   - MusicPlayer.astro（组合层）
   - MiniPlayer.svelte（迷你播放器）
   - ExpandedPlayer.svelte（展开播放器）
   - PlaylistPanel.svelte（播放列表）

   ### 使用方法
   ```astro
   <MusicPlayer client:visible />
   ```

   ### Props
   - playlist: 播放列表
   - autoplay: 是否自动播放
   ```

2. **迁移指南**
   ```markdown
   ## 从旧版本迁移

   ### 变更
   - MusicPlayer 组件内部结构已重构
   - API 保持不变，无需修改使用代码

   ### 注意事项
   - 确保 client:visible 指令正确使用
   ```

3. **CHANGELOG**
   ```markdown
   ## [2.0.0] - 2026-03-17

   ### Changed
   - 重构 MusicPlayer 组件架构
   - 拆分 Calendar 组件
   - 合并 TOC 相关组件

   ### Performance
   - 减少初始加载包大小 30%
   - 提升组件渲染性能 40%
   ```

## 常见问题（FAQ）

### Q1: 拆分会影响性能吗？

**A**: 不会。实际上，拆分后：
- 可以使用 `client:visible` 等指令按需加载
- 更细的组件可以更好地缓存
- 减少不必要的重渲染

### Q2: 拆分后如何处理组件间通信？

**A**: 使用以下方法：
- Props 传递（父 → 子）
- 事件派发（子 → 父）
- 全局 Store（跨组件）
- Context API（深层组件）

### Q3: 什么时候需要拆分，什么时候不需要？

**A**:
**需要拆分**：
- 组件 > 500 行
- 职责 > 3 个
- 状态变量 > 10 个
- 难以理解和测试

**不需要拆分**：
- 组件 < 200 行
- 职责单一
- 逻辑简单
- 易于维护

### Q4: 拆分后如何保持向后兼容？

**A**:
1. 保持公共 API 不变
2. 使用默认值
3. 提供迁移指南
4. 逐步弃用旧 API

### Q5: 如何测试拆分后的组件？

**A**:
1. **单元测试**：测试单个组件
   ```typescript
   test('MiniPlayer renders correctly', () => {
     const { getByRole } = render(MiniPlayer, { isPlaying: true })
     expect(getByRole('button')).toBeInTheDocument()
   })
   ```

2. **集成测试**：测试组件组合
   ```typescript
   test('MusicPlayer integrates sub-components', () => {
     const { getByText } = render(MusicPlayer, { playlist })
     expect(getByText('Play')).toBeInTheDocument()
   })
   ```

3. **E2E 测试**：测试用户流程
   ```typescript
   test('User can play music', async ({ page }) => {
     await page.goto('/')
     await page.click('[data-testid="play-button"]')
     await expect(page.locator('[data-testid="playing-indicator"]')).toBeVisible()
   })
   ```

## 总结

组件拆分是提升代码质量的关键步骤。记住：

✅ **拆分原则**
- 单一职责（SRP）
- 接口隔离（ISP）
- 依赖倒置（DIP）
- 保持简单（KISS）

✅ **拆分方法**
- 按功能拆分
- 按 UI 层级拆分
- 按关注点拆分
- 提取通用组件

✅ **避免陷阱**
- 过度拆分
- 循环依赖
- Props drilling
- 过早优化

✅ **持续改进**
- 定期评估组件
- 重构大型组件
- 保持文档更新
- 分享最佳实践

---

**最后更新**: 2026-03-17
**维护者**: Mizuki 开发团队

## 参考资源

- [组件架构设计规范](./01-component-architecture.md)
- [Aruma 组件拆分示例](../../demo/Aruma/docs/rule/05-component-architecture.md)
- [React 组件拆分指南](https://react.dev/learn/thinking-in-react)
