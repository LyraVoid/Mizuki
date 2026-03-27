---
title: Nuxt4基本使用手册
published: 2026-03-18
description: ''
image: ''
tags: []
category: 'Nuxt4'
draft: false 
lang: ''
---
---

### **Nuxt 3/4 全栈开发终极指南：从前端到后端**

Nuxt 是一个基于 Vue 3 构建的全栈框架，它利用 Nitro 引擎将前端与后端无缝集成在一个项目中。其核心哲学是“**约定优于配置**”和“**类型安全**”，旨在提供极致的开发者体验。

整个应用结构清晰地分为两大支柱：**前端（The Frontend）** 和 **后端（The Backend）**。

---

## **一、前端应用结构 (The Frontend)**

前端负责用户界面和交互逻辑，Nuxt 通过特定的目录约定来组织这些内容。

### **1. `app.vue` - 应用的根组件**

这是整个 Nuxt 应用的入口点。所有页面和布局都包裹在这个根组件内。

```vue
<!-- app.vue -->
<template>
  <!-- 
    <NuxtLayout> 会根据页面元信息动态加载指定的布局。
    <NuxtPage> 会渲染当前路由对应的页面组件。
  -->
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// 可以在这里定义全局的响应式状态或逻辑
</script>

<style>
/* 全局样式 */
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
</style>
```

### **2. `layouts/` - 布局 (Layouts)**

布局用于定义页面的通用外壳，如导航栏、侧边栏或页脚，避免在每个页面重复编写相同代码。

- **文件**: `layouts/default.vue`
- **作用**: 定义默认布局。

```vue
<!-- layouts/default.vue -->
<template>
  <div class="layout">
    <header>
      <nav>
        <NuxtLink to="/">首页</NuxtLink> |
        <NuxtLink to="/dashboard">仪表盘</NuxtLink>
      </nav>
    </header>
    <!-- 页面内容将在此处渲染 -->
    <main>
      <slot />
    </main>
    <footer>
      &copy; 2026 My Nuxt App
    </footer>
  </div>
</template>
```

- **自定义布局**: 如果某个页面需要特殊布局，可以在页面组件中指定。

```vue
<!-- pages/dashboard.vue -->
<template>
  <div>
    <h1>仪表盘</h1>
    <!-- ... -->
  </div>
</template>

<script setup lang="ts">
// 指定此页面使用 'dashboard' 布局
definePageMeta({
  layout: 'dashboard', // 对应 layouts/dashboard.vue
})
</script>
```

### **3. `pages/` - 页面 (Pages)**

Nuxt 的核心特性之一是**文件系统路由**。你只需在 `pages/` 目录下创建 `.vue` 文件，Nuxt 就会自动为你生成对应的路由。

- **示例**: 创建一个用户详情页。

```vue
<!-- pages/users/[id].vue -->
<template>
  <div>
    <h1>用户: {{ user?.name }}</h1>
    <p>Email: {{ user?.email }}</p>
  </div>
</template>

<script setup lang="ts">
// 动态路由参数 `[id]` 可以通过 `useRoute()` 获取
const route = useRoute()
const userId = route.params.id as string

// 使用 `useFetch` 在服务端或客户端获取数据
const { data: user } = await useFetch(`/api/users/${userId}`)
</script>
```
*   **路由结果**: 访问 `/users/123` 将渲染此组件，并将 `123` 作为 `id` 参数。

### **4. `components/` - 组件 (Components)**

用于存放可复用的 UI 组件。Nuxt 支持**自动导入**，你无需手动 `import` 即可在任何地方使用它们。

```vue
<!-- components/UserCard.vue -->
<template>
  <div class="user-card">
    <img :src="user.avatar" :alt="user.name" />
    <h3>{{ user.name }}</h3>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  user: {
    name: string
    avatar: string
  }
}>()
</script>
```

```vue
<!-- pages/users.vue -->
<template>
  <div>
    <UserCard v-for="user in users" :key="user.id" :user="user" />
  </div>
</template>

<script setup lang="ts">
// 直接使用 UserCard，无需 import
const { data: users } = await useFetch('/api/users')
</script>
```

### **5. `composables/` - 组合函数 (Composables)**

这是封装和复用 Vue 响应式逻辑的地方。所有组合函数都应以 `use` 开头。

```ts
// composables/useAuth.ts
import { ref } from 'vue'

const user = ref<{ id: string; name: string } | null>(null)
const isAuthenticated = computed(() => !!user.value)

export function useAuth() {
  async function login(credentials: { email: string; password: string }) {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: credentials,
    })
    user.value = response.user
  }

  return {
    user,
    isAuthenticated,
    login,
  }
}
```

```vue
<!-- pages/login.vue -->
<template>
  <form @submit.prevent="handleLogin">
    <input v-model="email" placeholder="邮箱" />
    <input v-model="password" type="password" placeholder="密码" />
    <button type="submit">登录</button>
  </form>
</template>

<script setup lang="ts">
const { login, isAuthenticated } = useAuth()
const email = ref('')
const password = ref('')

async function handleLogin() {
  await login({ email: email.value, password: password.value })
  if (isAuthenticated.value) {
    navigateTo('/dashboard')
  }
}
</script>
```

---

## **二、后端服务设计 (The Backend)**

Nuxt 的强大之处在于其内置的 Nitro 引擎，允许你在 `server/` 目录下直接编写服务端逻辑。

### **1. API 路由 (API Routes)**

API 路由位于 `server/api/` 目录下，文件路径即为 API 路径。

#### **创建 (POST)**
```ts
// server/api/users.post.ts
import { createId } from '@paralleldrive/cuid2'
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  // 这里通常是数据库操作，例如：
  // const newUser = await db.user.create({ data: { ...body, id: createId() } })
  const newUser = { id: createId(), ...body }
  return newUser
})
```

#### **读取 (GET)**
```ts
// server/api/users/[id].get.ts
import { defineEventHandler, getRouterParam } from 'h3'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  // 数据库查询
  // const user = await db.user.findUnique({ where: { id } })
  const user = { id, name: 'John Doe', email: 'john@example.com' }
  return user
})
```

#### **更新 (PUT)**
```ts
// server/api/users/[id].put.ts
import { defineEventHandler, getRouterParam, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  // 数据库更新
  // const updatedUser = await db.user.update({ where: { id }, data: body })
  const updatedUser = { id, ...body }
  return updatedUser
})
```

#### **删除 (DELETE)**
```ts
// server/api/users/[id].delete.ts
import { defineEventHandler, getRouterParam } from 'h3'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  // 数据库删除
  // await db.user.delete({ where: { id } })
  return { success: true, message: `User ${id} deleted` }
})
```

### **2. 中间件 (Middleware)**

中间件用于在请求到达最终处理程序之前执行通用逻辑，如身份验证。

```ts
// server/middleware/auth.ts
import { defineEventHandler, createError } from 'h3'

// 此中间件会应用于所有 /dashboard/** 的请求
export default defineEventHandler((event) => {
  if (event.path.startsWith('/dashboard')) {
    // 1. 模拟从 Cookie 或 Header 中获取会话令牌
    const sessionToken = event.node.req.headers.authorization

    // 2. 验证令牌（此处为伪代码）
    const isValid = sessionToken === 'valid-token'

    // 3. 如果无效，抛出错误，Nitro 会自动返回 401
    if (!isValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: '请先登录'
      })
    }

    // 4. 如果有效，可以将用户信息注入上下文，供后续 API 使用
    // event.context.user = { id: '123', role: 'admin' }
  }
})
```

### **3. 请求上下文 (`event.context`)**

`event.context` 是一个在单个请求生命周期内共享的对象，是中间件向 API 路由传递数据的桥梁。

```ts
// server/middleware/user-context.ts
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  // 假设我们已经通过某种方式验证了用户
  event.context.currentUser = {
    id: 'user_123',
    name: 'Alice',
    permissions: ['read', 'write']
  }
})
```

```ts
// server/api/profile.get.ts
import { defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  // 从上下文中获取用户信息
  const user = event.context.currentUser
  return { profile: user }
})
```

---
