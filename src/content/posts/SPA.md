---
title: Single-page Apps (SPAs)&SEO
published: 2026-04-02
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: ''
---

# 一、什么是 SEO？
**SEO = Search Engine Optimization（搜索引擎优化）**

简单说：
**让你的网站在百度、Google 等搜索引擎里排名更高、更容易被搜到、被收录。**

核心目标：
- 让**爬虫**能爬到你的内容
- 让搜索引擎知道你页面是讲什么
- 关键词匹配、结构清晰、内容可索引

# 二、什么是爬虫？
**爬虫 = 搜索引擎派来抓取网页内容的程序。**

工作流程：
1. 爬取 URL
2. 下载 HTML
3. **解析 HTML 文本内容**
4. 建立索引（存入数据库）
5. 排序展示给用户

关键点：
**早期爬虫只爬 HTML 文本，不执行 JS！**

# 三、为什么爬虫很难抓取 JS 生成的 HTML？
因为传统爬虫：
1. 只下载 **原始 HTML**（空壳、只有 div#app）
2. **不执行 JavaScript**
3. 不会等待 AJAX / fetch 获取数据
4. 不会等待 Vue/React 渲染页面

结果：
爬虫看到的是：
```html
<div id="app"></div>
```
**完全没有内容 → 无法收录 → SEO 极差**

现代 Google 虽然能执行 JS，但**慢、不稳定、不保证内容抓取**，百度更弱。

# 四、什么是单页应用（SPA）？
**SPA = Single Page Application**

**整个网站只有 1 个 HTML 文件**，通过 JavaScript 动态切换视图、路由、内容，**不刷新页面**。

代表：
Vue、React、Angular 默认模式

# SPA（单页应用）完整生成过程

## 第 1 步：浏览器请求服务器
请求的是：`/index.html`

服务器返回**极其简单的空 HTML**：
```html
<!DOCTYPE html>
<html>
<head><title>SPA</title></head>
<body>
  <div id="app"></div>  <!-- 只有一个挂载点 -->
  <script src="/js/app.js"></script>
</body>
</html>
```
**此时页面：空白！没有任何内容。**

## 第 2 步：浏览器解析 HTML，构建初始 DOM 树
只有：
- html
- head
- body
- div#app

**没有正文内容！**

## 第 3 步：加载并执行 JS（Vue/React 核心代码）
JS 开始做这些事：
- 初始化路由（vue-router / react-router）
- 解析当前 URL：`/home`、`/about`
- 发起 AJAX/fetch 请求后端接口拿数据

## 第 4 步：JS 生成虚拟 DOM（Virtual DOM）
Vue/React 不会直接操作真实 DOM（太慢）
先用 JS 对象描述结构：
```js
// 伪代码：虚拟DOM
const vdom = {
  tag: 'div',
  children: [
    { tag: 'h1', text: '首页' },
    { tag: 'p', text: '内容...' }
  ]
}
```
**执行后：DOM 树多了一个节点，页面就显示了。**
Vue / React 底层也是做这件事，只是封装了虚拟 DOM。

## 第 5 步：虚拟 DOM → 生成真实 DOM 并插入页面
框架内部调用：
- `document.createElement`
- `appendChild`
- `textContent`

把**真实 DOM 节点插入到 `#app` 里**

## 第 6 步：浏览器重新渲染页面（Layout + Paint）
页面终于显示内容！


## SPA 优点
1. **用户体验好**：切换页面无刷新、流畅
2. **前后端分离**：前端独立部署
3. **交互强**：适合后台管理、APP类应用
4. **减少服务器压力**：只请求接口，不渲染页面

## SPA 缺点
1. **首屏加载慢**（要下载大包JS）
2. **SEO 极差**（内容JS渲染）
3. **初次白屏时间长**
4. 对低性能设备不友好
5. 内存泄漏风险更高

SPA 的页面 = 初始空壳 DOM + JS 动态构建出来的 DOM

# 总结一句话：SPA 是怎么生成的？
**SPA = 服务器返回空HTML壳 → 浏览器加载JS → JS请求数据 → JS生成虚拟DOM → 转为真实DOM → 插入页面 → 渲染完成**

整个过程**完全由 JS 驱动**，不是服务器返回完整页面。

## 为什么爬虫抓不到 SPA？
因为：
1. 爬虫只下载**原始 HTML**（空壳）
2. 传统爬虫**不执行 JS**
3. 不执行 JS → 不生成 DOM → 没有内容

所以爬虫看到永远是：
```html
<div id="app"></div>
```


# 五、如何让 SPA 对 SEO 友好？

## 1. SSR —— 服务端渲染（最主流）
**Server-Side Rendering**

- 在**服务器上执行 Vue/React**
- 直接返回**包含完整内容的 HTML**
- 浏览器拿到就是成品页面
- 爬虫直接看到全部内容

代表框架：
**Nuxt.js（Vue）、Next.js（React）**

优点：SEO 最好、首屏快
缺点：服务器压力大、开发复杂

## 2. SSG —— 静态站点生成（最适合博客/文档）
**Static Site Generation**

- 构建时**直接生成所有页面 HTML**
- 部署纯静态，无需服务器运行时
- 爬虫直接爬完整页面

代表：Nuxt SSG、Next SSG、VitePress

优点：极快、极稳、SEO完美、便宜
缺点：不适合频繁变化内容

## 3. ISR —— 增量静态再生（现代最佳）
**Incremental Static Regeneration**

- 大部分页面静态生成
- 内容变化后**自动重新生成**，不用全量构建
- Next.js 主推

## 4. Prerender —— 预渲染
构建时针对某些路由预先渲染出 HTML
适合小型项目，简单有效

## 5. 动态渲染（Dynamic Rendering）
- 识别是**爬虫** → 返回 SSR 页面
- 识别是**用户** → 返回正常 SPA
适合老项目改造

## 6. CSR + SEO 优化（最弱）
- 标题、描述、关键词使用 `react-helmet` / `vue-meta`
- 关键文本写在原始 HTML 中
但**内容仍然抓不到**，只能算补救

---

# 六、SEO 常见完整方案总结
1. **SSR 服务端渲染** —— 强 SEO、动态内容
2. **SSG 静态生成** —— 最强 SEO、最快、最稳
3. **ISR 增量更新** —— 现代最佳平衡
4. **Dynamic Render 动态渲染** —— 老项目兼容
5. **Prerender 预渲染** —— 轻量简单
6. **Meta 标签优化** —— 辅助SEO
---
