---
title: Nuxt4的渲染模式
published: 2026-03-27
description: ''
image: ''
tags: ['Nuxt','render']
category: 'Nuxt4'
draft: false 
lang: ''
---

# 渲染模式(Rendering Modes)

Nuxt 支持不同的渲染模式，包括**通用渲染、客户端渲染**，同时也提供**混合渲染**以及**将应用程序渲染在 CDN 边缘服务器。**

浏览器和服务器都可以解释 JavaScript 代码，将 Vue.js 组件转换为 HTML 元素。这一步骤称为渲染。
 
Nuxt 支持通用渲染和客户端渲染

##  什么是Nuxt的通用渲染模式(universal rendering)?

Nuxt通用渲染模式与传统由 PHP 或 Ruby 应用程序执行的伺服器端渲染类似,渲染流程如下:

1.  当浏览器**请求启用了通用渲染的 URL** 时，**Nuxt** 会在(Nodejs)**伺服器环境中运行 JavaScript（Vue.js）代码**，并**将完全渲染的 HTML 页面返回给浏览器。**

2.  如果页面已预先生成，Nuxt 也可能从**缓存**中返回完全渲染的 HTML 页面。与客户端渲染(client-side rendering )不同，用户立即获得应用程序的初始全部内容。

3.一旦 HTML 文档被下载，**浏览器会解释该文档**，然后 Vue.js 接管该文档。先前在伺服器上运行的相同 JavaScript 代码现在在客户端（浏览器）中再次在后台运行，通过**将其监听器绑定到 HTML，实现交互性（因此称为通用渲染）**。这被称为**水合**。

4.当水合完成后，页面可以享受**动态界面**和**页面过渡**等好处。


## 通用渲染下的运行流程

通用模式中, 在服务器和客户端会运行同一个Vue文件内容中的不同部分:

    <script setup lang="ts">
    const counter = ref(0) // executes in server and client environments
    
    const handleClick = () => {
    counter.value++ // executes only in a client environment
    }
    </script>
    
    <template>
    <div>
        <p>Count: {{ counter }}</p>
        <button @click="handleClick">
        Increment
        </button>
    </div>
    </template>

在这个文件的初始请求中, 由于counter变量是在标签内渲染的,但countr ref又在**服务器nodejs环境**下被初始化的.

类似 handleClick 里的内容在服务端里永远不会执行,就像客户端常用的DOM, BOM概念一样.

在浏览器执行水合,也就是将事件监听器绑定到HTML页面的过程中,
counter ref 会被重新初始化, handleClick最终绑定到了按钮上面.
handleClick 的主体始终在**浏览器环境**中运行。



**根据不同渲染模式下,Nuxt目录文件内容的渲染规则就会不同:**

在 水合(hydration) 过程中，中间件(**Middlewares**)和页面(**pages**)在服务器和客户端上运行。

插件(**plugins**)可以在服务器上、客户端或两者上渲染。

组件(**Components**)也可以被强制仅在客户端上运行(使用`<clientOnly></clientOnly>`组件进行包裹)。

可组合项(**Composable**)和工具(**utilities**)会根据其使用上下文进行渲染。

##  通用渲染,SSR渲染模式下的优势:

性能:

用户可以立即访问页面的内容，因为浏览器显示静态内容比显示 JavaScript 生成的内容快得多。同时，**Nuxt 在 hydration 过程中保留了 Web 应用的交互性。**

搜索引擎优化：

通用渲染将页面的整个 HTML 内容作为经典的服务器应用程序发送到浏览器。**网络爬虫可以直接索引页面的内容**，这使得通用渲染成为任何希望快速索引的内容的理想选择。

## 通用渲染,SSR渲染模式下的缺点:

开发限制：

服务器和浏览器环境提供的 API 不同，编写可在两边无缝运行的代码可能很棘手。幸运的是，Nuxt 提供了指南和特定变量来帮助你确定代码的执行位置。

成本：

为了动态渲染页面，服务器需要持续运行。这像任何传统服务器一样增加了每月成本。然而，**由于使用浏览器进行客户端导航**，通用渲染大大减少了服务器调用。

通过利用边缘端(vercel,cloudflare)渲染，可以实现成本降低。

## 什么是客户端渲染(Client-Side Rendering)

**客户端渲染（CSR）是指在浏览器中使用 JavaScript 生成 HTML 内容的一种做法。**


## 关于Nuxt客户端渲染的流程:

1.传统的 Vue.js 应用程序在浏览器（或客户端）中进行渲染<br/>
2.Vue.js 在浏览器下载并解析包含创建当前界面指令的 JavaScript 代码后，生成 HTML 元素。


## 客户端渲染的优势:

开发速度：

当完全在客户端工作时，我们不必担心**代码的服务器兼容性问题**，例如，通过使用仅限浏览器的 API，如 window 对象。


更经济：

**运行服务器会增加基础设施成本**，因为您需要在一个支持 JavaScript 的平台运行。
我们可以将纯客户端应用程序托管在任何静态服务器上，只需 HTML、CSS 和 JavaScript 文件即可。

离线：

由于代码完全在浏览器中运行，因此即使互联网不可用，它也能很好地继续工作。


## 客户端渲染的缺点:

性能：

用户必须等待**浏览器下载、解析和运行所有需要的 JavaScript 文件**。根据下载部分的网络状况以及解析和执行部分的用户设备，这可能需要一些时间并影响用户体验。


搜索引擎优化(SEO)：

**通过客户端渲染交付的内容进行索引和更新比服务器渲染的 HTML 文档需要更多时间**。这与我们讨论的性能缺陷有关，因为搜索引擎爬虫不会等待界面在第一次尝试索引页面时完全渲染。使用纯客户端渲染，您的内容在搜索引擎结果页面中显示和更新的时间会更长。

**客户端渲染适用于不需要索引或用户频繁访问的高度交互式 Web 应用程序**

## 混合渲染模式(Hybrid Rendering)

混合渲染允许根据路由规则为不同路由设置不同的缓存规则，并决定服务
器如何响应给定 URL 上的新请求。

之前版本中的 Nuxt 应用程序的每个路由/页面和服务器都必须使用相同的渲染模式，即通用或客户端渲染。

例如，考虑一个带有管理区域的 内容网站。每个内容页面应该是主要静态的，并且只需生成一次，但管理区域需要注册，并且更像是一个动态应用程序。

Nuxt 包括路由规则和混合渲染支持。
使用路由规则，您可以为一组 nuxt 路由定义规则，更改渲染模式或根据路由分配缓存策略！

在 nuxt.config.ts中进行具体的配置:

    export default defineNuxtConfig({
      routeRules: {
        // Homepage pre-rendered at build time
        '/': { prerender: true },
        // Products page generated on demand, revalidates in background, cached until API response changes
        '/products': { swr: true },
        // Product pages generated on demand, revalidates in background, cached for 1 hour (3600 seconds)
        '/products/**': { swr: 3600 },
        // Blog posts page generated on demand, revalidates in background, cached on CDN for 1 hour (3600 seconds)
        '/blog': { isr: 3600 },
        // Blog post page generated on demand once until next deployment, cached on CDN
        '/blog/**': { isr: true },
        // Admin dashboard renders only on client-side
        '/admin/**': { ssr: false },
        // Add cors headers on API routes
        '/api/**': { cors: true },
        // Redirects legacy urls
        '/old-page': { redirect: '/new-page' },
      },
    })

## 对于不同路由规则的渲染:

**redirect: string** - 定义服务器端重定向。

**ssr: boolean** - 禁用应用程序部分的服务器端 HTML 渲染，并使其仅在浏览器中渲染，使用 ssr: false

**cors: boolean** - 自动添加 cors 头部，使用 cors: true - 你可以通过覆盖 headers 来自定义输出

**headers: object** - 为网站部分添加特定头部 - 例如，你的资源

**swr: number | boolean** - 为服务器响应添加缓存头部，并在服务器或反向代理上缓存，具有可配置的 TTL（生存时间）。Nitro 的 node-server 预设能够缓存完整响应。
当 TTL 过期时，将发送缓存的响应，同时页面将在后台重新生成。如果使用 true，将添加一个 stale-while-revalidate 头部，但没有 MaxAge。

**isr: number | boolean** - 行为与 swr 相同，但我们可以将响应添加到支持此功能的平台（目前为 Netlify 或 Vercel）的 CDN 缓存中。如果使用 true ，内容将在 CDN 中持续存在，直到下一次部署。

**prerender: boolean** - 在构建时预渲染路由，并将它们作为静态资源包含在您的构建中

**noScripts: boolean** - 禁用渲染 Nuxt 脚本和 JS 资源提示，适用于您网站的部分区域。

**appMiddleware: string | string[] | Record<string, boolean>** - 允许您定义中间件，用于控制 Vue 应用部分（即非 Nitro 路由）中的页面路径是否应该运行。


## 边缘渲染(Edge-Side Rendering (ESR) )

边缘渲染（ESR）是 Nuxt 引入的一项强大功能，它允许通过内容分发网络（CDN）的边缘服务器，将Nuxt 应用程序更靠近用户进行渲染。通过利用 ESR，确保性能提升和延迟减少，从而提供更优的用户体验。

使用 ESR，渲染过程被推到网络的"边缘"——CDN 的边缘服务器,ESR 更是一个部署目标，而非实际的渲染模式。

在ESR 模式中当请求页面时，数据不会直接发送到原始服务器，而是被最近的边缘服务器拦截。
该服务器生成页面的 HTML 并发送回用户。这个过程最小化了数据传输的物理距离，减少了延迟，使页面加载更快。

**其实通俗易懂的来说, ESR就是使用边缘节点服务器进行渲染的一种方式, 它会根据用户的请求通过最近的边缘服务器进行服务器渲染,然后返回给用户. 这方面得益于Nuxt后端h3的共用代码库设计以及nitro的服务器端引擎**
