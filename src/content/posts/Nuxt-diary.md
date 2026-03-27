---
title: Nuxt4使用日记
published: 2026-03-18
description: ''
image: ''
tags: []
category: 'Nuxt4'
draft: false 
lang: ''
---

---

## 一、写项目时服务端提示出现“客户端重复请求”的错误

### ✅ 根本原因：**SSR + Hydration（激活）的双重执行模型**

在 Nuxt 的 SSR 模式下，一个页面的渲染分为两个阶段：

| 阶段 | 执行环境 | 目的 |
|------|--------|------|
| **1. 服务端渲染（SSR）** | Node.js 服务器 | 生成 HTML + 初始状态 |
| **2. 客户端激活（Hydration）** | 浏览器 | 将静态 HTML “激活”为交互式 Vue 应用 |

而像 `useFetch`、`useAsyncData` 这样的 **数据获取函数**，默认会在 **两个阶段都执行一次**，除非显式控制。

### 🔍 示例说明

```vue
<script setup>
const { data } = await useFetch('/api/user')
</script>
```

- **服务端**：Nuxt 在 Node.js 中调用 `/api/user`，把结果嵌入 HTML。
- **客户端**：Vue 启动时再次调用 `/api/user`，以“激活”组件状态。

> 📌 这就是你看到 **Network 面板出现两次相同请求** 的原因。

---

## 二、如何避免客户端重复请求？

### ✅ 方案 1：使用 `server: false`（仅客户端）

如果你的数据**只能在客户端获取**（如依赖 `localStorage`、浏览器 API），则：

```ts
const { data } = await useFetch('/api/user', { server: false })
```

→ 仅在客户端运行，服务端跳过。

### ✅ 方案 2：使用 `lazy: true` + 状态复用（推荐用于 SSR）

但更常见的是：**我们希望服务端获取数据，客户端直接复用，不重复请求**。

Nuxt 实际上 **已经自动做了这件事！**

> ✅ **关键点**：当 `useFetch` 或 `useAsyncData` 在服务端执行后，Nuxt 会：
> 1. 将数据序列化到 HTML 中的 `<script type="application/json">`
> 2. 客户端 hydration 时**直接读取该数据**，**不会重新发请求**！


# 出现客户端重复请求的原因
可能原因：

| 原因 | 说明 |
|------|------|
| **1. 开启了 `dev` 模式** | Nuxt Dev Server 有时会为了热更新重发请求（非生产行为） |
| **2. 使用了 `$fetch` 而不是 `useFetch`** | `$fetch` 不具备状态同步能力，每次都会请求 |
| **3. 请求 URL 动态变化（如含时间戳）** | Nuxt 无法匹配缓存键，视为新请求 |
| **4. 未正确使用 `useFetch`（如放在事件处理器中）** | 放在 `onClick` 里的 `useFetch` 永远只在客户端运行 |

✅ **正确写法（自动去重）**：

```vue
<script setup>
// 在 <script setup> 顶层使用 —— Nuxt 会自动处理 SSR + 复用
const { data } = await useFetch('/api/user')
</script>
```

此时：
- 服务端：发请求 → 生成 HTML
- 客户端：从 window.__NUXT__.data 读取 → **不发新请求**

> 🔗 官方说明：https://nuxt.com/docs/getting-started/data-fetching#avoid-duplicate-requests

---

## 三、为什么服务端也能发起请求？

### ✅ 因为 Nuxt 内置了 **Nitro 服务引擎**

Nuxt 3 使用 [Nitro](https://nitro.unjs.io/) 作为底层服务器框架。它允许你在 `server/` 目录中编写 **真正的后端代码**，运行在 Node.js（或 Serverless）环境中。

因此：

- `useFetch('/api/xxx')` 中的 `/api/xxx` 是 **相对路径**
- 在服务端执行时，Nuxt 会 **内部代理** 到 `server/api/xxx.ts`，**不经过网络**
- 在客户端执行时，才真正发起 HTTP 请求到当前域名

> 💡 这就是所谓的 **“同构 API 调用”** —— 同一段代码，在服务端走内部函数调用，在客户端走 fetch。

### 示例流程

```ts
await useFetch('/api/hello')
```

| 环境 | 实际行为 |
|------|--------|
| **服务端（SSR）** | 直接调用 `server/api/hello.get.ts` 的 handler 函数（零网络开销） |
| **客户端（Hydration）** | 发起 `fetch('http://yoursite.com/api/hello')` |

> 🔗 文档：https://nuxt.com/docs/guide/concepts/server-engine#internal-api-calls

---

## ✅ 总结

| 问题 | 答案 |
|------|------|
| **为什么有重复请求？** | Dev 模式、错误使用 `$fetch`、或未在顶层使用 `useFetch` |
| **如何避免重复？** | 在 `<script setup>` 顶层用 `useFetch`，Nuxt 自动复用 SSR 数据 |
| **服务端为何能发请求？** | Nitro 引擎支持内部 API 调用，`/api/xxx` 在服务端是函数调用 |
| **SSR 流程？** | 服务端获取数据 → 渲染 HTML → 客户端复用数据 → 激活交互 |

> 📚 官方权威参考：
> - Data Fetching: https://nuxt.com/docs/getting-started/data-fetching
> - Server Engine: https://nuxt.com/docs/guide/concepts/server-engine
> - Rendering Modes: https://nuxt.com/docs/guide/concepts/rendering

只要遵循 **在 `<script setup>` 顶层使用 `useFetch` / `useAsyncData`**，Nuxt 会自动为你处理 SSR 与客户端的数据同步，**不会产生不必要的重复请求**。
