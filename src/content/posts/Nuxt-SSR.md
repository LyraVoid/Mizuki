---
title: Nuxt原理
published: 2026-03-27
description: ''
image: ''
tags: []
category: 'Nuxt4'
draft: false 
lang: ''
---

## 四、Nuxt 服务端渲染（SSR）完整流程

以下是 **一次页面访问的完整 SSR 流程**（以 `/user` 为例）：

```mermaid
sequenceDiagram
    participant Browser
    participant NuxtServer as Nuxt (Node.js)
    participant YourAPI as server/api/*.ts

    Browser->>NuxtServer: GET /user
    activate NuxtServer

    NuxtServer->>YourAPI: 内部调用 useFetch('/api/user')
    activate YourAPI
    YourAPI-->>NuxtServer: 返回用户数据 { id: 1, name: 'Alice' }
    deactivate YourAPI

    NuxtServer->>NuxtServer: 渲染 Vue 组件（注入数据）
    NuxtServer->>Browser: 返回 HTML + <script>window.__NUXT__ = { data: ... }</script>
    deactivate NuxtServer

    Browser->>Browser: 解析 HTML，显示内容
    Browser->>Browser: 加载 client bundle
    Browser->>Browser: 执行 hydration，复用 __NUXT__.data，不发新请求
```

### 关键步骤说明：

1. **路由匹配**：Nuxt 根据 URL 匹配页面组件（如 `pages/user.vue`）
2. **服务端数据获取**：执行 `<script setup>` 中的 `useFetch` / `useAsyncData`
3. **内部 API 调用**：`/api/user` 被 Nitro 路由到 `server/api/user.get.ts`
4. **HTML 生成**：将数据注入 Vue 组件，生成完整 HTML
5. **客户端激活**：浏览器加载 JS，从 `window.__NUXT__` 读取数据，避免重复请求

---
